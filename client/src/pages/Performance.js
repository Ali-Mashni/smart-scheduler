import React, { useEffect, useState } from 'react';
import TopBar from '../components/TopBar';
import TopBarButton from '../components/TopBarButton';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, BarChart, XAxis, YAxis, Bar, Legend } from 'recharts';

export default function PerformancePage() {
  const [activities, setActivities] = useState([]);
  const [today, setToday] = useState(new Date());

  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem('activities')) || [];
    setActivities(stored);
  }, []);

  const parseDate = (dateStr) => new Date(dateStr);
  const todayStr = today.toISOString().slice(0, 10);

  const upcomingTasks = activities
    .filter(a => a.selectedDate && new Date(a.selectedDate) >= today)
    .sort((a, b) => new Date(a.selectedDate) - new Date(b.selectedDate))
    .slice(0, 5);

  const completionRate = () => {
    const total = activities.length;
    const done = activities.filter(a => a.completed).length;
    return total === 0 ? 0 : Math.round((done / total) * 100);
  };

  const pieColors = ['#211C84', '#4D55CC', '#7A73D1', '#B5A8D5'];
  const activityTypes = ['academic', 'personal', 'exercise', 'other'];

  const typeHoursMap = activityTypes.reduce((acc, type) => ({ ...acc, [type]: 0 }), {});

  const fillHoursByType = () => {
    activities.forEach((a) => {
      const type = a.activityType;
      if (!type || !a.startTime || !a.endTime) return;

      const start = parseInt(a.startTime.split(':')[0]);
      const end = parseInt(a.endTime.split(':')[0]);
      const duration = end - start;

      if (typeHoursMap[type] !== undefined) {
        typeHoursMap[type] += duration;
      }
    });

    return Object.entries(typeHoursMap).map(([type, hours]) => ({
      name: type.charAt(0).toUpperCase() + type.slice(1),
      hours
    }));
  };

  return (
    <div className="min-h-screen bg-bgMain text-white font-sans">
      <TopBar>
        <TopBarButton to="/activityManagement">Activity Management</TopBarButton>
        <TopBarButton to="/schedule">Schedule</TopBarButton>
        <TopBarButton to="/performance" active>Performance</TopBarButton>
      </TopBar>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 p-6">
        {/* Task Completion Rate Pie */}
        <div className="bg-bgCard p-6 rounded-xl shadow-md">
          <h2 className="text-lg font-semibold mb-1">Task Completion Rate</h2>
          <p className="text-sm text-gray-400 mb-4">Based on all added tasks</p>
          <ResponsiveContainer width="100%" height={180}>
            <PieChart>
              <Pie data={[
                { name: 'Completed', value: completionRate() },
                { name: 'Remaining', value: 100 - completionRate() }
              ]} innerRadius={50} outerRadius={70} dataKey="value">
                <Cell fill="#7A73D1" />
                <Cell fill="#2a2a3c" />
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
          <p className="text-center mt-2 font-semibold text-lg">{completionRate()}%</p>
        </div>

        {/* Top Upcoming Tasks */}
        <div className="bg-bgCard p-6 rounded-xl shadow-md">
          <h2 className="text-lg font-semibold mb-4">Top Upcoming Exams & Tasks</h2>
          {upcomingTasks.length === 0 ? (
            <p className="text-gray-400 text-sm">No upcoming tasks.</p>
          ) : (
            <ul className="space-y-2 text-sm text-gray-300">
              {upcomingTasks.map((task, idx) => (
                <li key={idx} className="flex justify-between border-b border-gray-600 pb-1">
                  {task.activityName} <span>{task.selectedDate}</span>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Weekly Hours Breakdown */}
        <div className="bg-bgCard p-6 rounded-xl shadow-md col-span-2">
          <h2 className="text-lg font-semibold mb-4">Weekly Activity Type Breakdown</h2>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={fillHoursByType()}>
              <XAxis dataKey="name" stroke="#aaa" />
              <YAxis stroke="#aaa" />
              <Tooltip />
              <Legend />
              <Bar dataKey="hours" fill="#845af0">
                {activityTypes.map((_, index) => (
                  <Cell key={`cell-${index}`} fill={pieColors[index]} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
