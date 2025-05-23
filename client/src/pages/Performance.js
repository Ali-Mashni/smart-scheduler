import React, { useEffect, useState } from 'react';
import TopBar from '../components/TopBar';
import TopBarButton from '../components/TopBarButton';
import ContactUsModel from '../components/ContactUsModel';

import {
  PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Legend,
} from 'recharts';

export default function PerformancePage() {
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [today, setToday] = useState(new Date());
  const [weekOffset, setWeekOffset] = useState(0);
  const [isContactUsOpen, setisContactUsOpen] = useState(false);

  useEffect(() => {
    const fetchActivities = async () => {
      try {
        const res = await fetch('/api/student/activities', {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
          },
        });
        const json = await res.json();
        setActivities(Array.isArray(json.data) ? json.data : []);
      } catch (err) {
        setActivities([]);
      } finally {
        setLoading(false);
      }
    };
    fetchActivities();
  }, []);

  const formatDate = (date) => {
    if (!(date instanceof Date) || isNaN(date)) {
      console.warn("Invalid date passed to formatDate:", date);
      return "";
    }
    return date.toISOString().split('T')[0];
  };
  const getWeekDates = () => {
    const now = new Date();
    now.setDate(now.getDate() + weekOffset * 7);
    const day = now.getDay();
    const sunday = new Date(now.setDate(now.getDate() - day));
    return Array.from({ length: 7 }, (_, i) => {
      const d = new Date(sunday);
      d.setDate(sunday.getDate() + i);
      return d;
    });
  };

  const weekDates = getWeekDates();
  const todayStr = formatDate(today);

  const upcomingTasks = activities
  .filter(a => {
    const d = new Date(a.selectedDate);
    return a.selectedDate && !isNaN(d) && d >= today;
  })    
    .sort((a, b) => new Date(a.selectedDate) - new Date(b.selectedDate))
    .slice(0, 5);

  const completionRate = () => {
    const total = activities.length;
    const done = activities.filter(a => a.completed).length;
    return total === 0 ? 0 : Math.round((done / total) * 100);
  };

  const COLORS = ['#7A73D1', '#2a2a3c'];
  const TYPE_COLORS = {
    academic: '#FDFBEE',
    exercise: '#57B4BA',
    personal: '#015551',
    other: '#FE4F2D',
  };

  const getDayWiseBreakdown = () => {
    return weekDates.map(date => {
      const dateStr = formatDate(date);
      const types = { academic: 0, personal: 0, exercise: 0, other: 0 };

      activities.forEach(a => {
        const isPerm = a.isPermanent && a.selectedDays?.includes(date.toLocaleDateString('en-US', { weekday: 'long' }));
        const isTemp = !a.isPermanent && formatDate(new Date(a.selectedDate)) === dateStr;

        if ((isPerm || isTemp) && a.startTime && a.endTime) {
          const start = parseInt(a.startTime.split(':')[0]);
          const end = parseInt(a.endTime.split(':')[0]);
          const dur = end - start;
          if (dur > 0) types[a.activityType] += dur;
        }
      });

      return {
        date: date.toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric' }),
        ...types,
      };
    });
  };

  // Helper to get duration in hours
  const getDurationInHours = (startTime, endTime) => {
    const [startH, startM] = startTime.split(':').map(Number);
    const [endH, endM] = endTime.split(':').map(Number);
    return (endH + endM / 60) - (startH + startM / 60);
  };

  // Helper to get study hours by subject
  const getStudyHoursBySubject = () => {
    const studyActivities = activities.filter(a =>
      a.activityType === 'academic' &&
      a.academicDetail === 'study' &&
      a.completed
    );
    const subjectMap = {};
    studyActivities.forEach(a => {
      const subject = a.subjectId || 'Unknown Subject';
      const hours = getDurationInHours(a.startTime, a.endTime);
      if (!subjectMap[subject]) subjectMap[subject] = 0;
      subjectMap[subject] += hours;
    });
    return Object.entries(subjectMap).map(([subject, hours]) => ({
      subject,
      hours: Number(hours.toFixed(2)),
    }));
  };

  //Handle creation of ticket
  // Handle opening settings modal
  const handleOpenContactUs = () => {
    setisContactUsOpen(true);
  };

  // Handle closing settings modal
  const handleCloseContactUs = () => {
    setisContactUsOpen(false);
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div className="min-h-screen lg:h-screen lg:overflow-hidden overflow-auto bg-bgMain text-white font-sans flex flex-col">
  {/* TopBar (fixed height) */}
  <TopBar>
    <TopBarButton to="/activityManagement">Activity Management</TopBarButton>
    <TopBarButton to="/schedule">Schedule</TopBarButton>
    <TopBarButton to="/performance" active>Performance</TopBarButton>
    <TopBarButton to="/support">Your Requests</TopBarButton>
    <TopBarButton to="/customer-service">Contact Us</TopBarButton>
    <TopBarButton to="/logout">
      <p className="text-red-500 hover:text-red-600">Logout</p>
    </TopBarButton>
  </TopBar>

  {/* Contact Us Modal */}
  {isContactUsOpen && (
    <ContactUsModel onClose={handleCloseContactUs} />
  )}

  {/* Scrollable content */}
  <div className="flex-1 overflow-y-auto px-4 sm:px-6 py-4 sm:py-6">
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
      
      {/* Task Completion Rate */}
      <div className="bg-bgCard p-6 rounded-xl shadow-md w-full">
        <h2 className="text-lg sm:text-xl font-semibold mb-1">Task Completion Rate</h2>
        <p className="text-sm text-gray-400 mb-4">Based on all added tasks</p>
        <ResponsiveContainer width="100%" height={180}>
          <PieChart>
            <Pie
              data={[
                { name: 'Completed', value: completionRate() },
                { name: 'Remaining', value: 100 - completionRate() }
              ]}
              innerRadius={60}
              outerRadius={80}
              dataKey="value"
              stroke="none"
            >
              <Cell fill="#7A73D1" />
              <Cell fill="#2a2a3c" />
            </Pie>
          </PieChart>
        </ResponsiveContainer>
        <p className="text-center text-2xl font-bold mt-2">{completionRate()}%</p>
        <div className="flex justify-center mt-3 gap-6 text-sm text-gray-400">
          <div className="flex items-center gap-2">
            <span className="inline-block w-4 h-4 rounded-full bg-[#7A73D1]"></span>
            Completed
          </div>
        </div>
      </div>

      {/* Top Upcoming Tasks */}
      <div className="bg-bgCard p-6 rounded-xl shadow-md w-full">
        <h2 className="text-lg sm:text-xl font-semibold mb-4">Top Upcoming Exams & Tasks</h2>
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

      {/* Weekly Breakdown */}
      <div className="bg-bgCard p-6 rounded-xl shadow-md col-span-full">
        <div className="flex justify-between items-center mb-4">
          <button onClick={() => setWeekOffset(weekOffset - 1)} className="bg-primaryHover px-3 py-1 rounded text-white">←</button>
          <h2 className="text-lg sm:text-xl font-semibold">
            Week of {weekDates[0].toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric' })}
          </h2>
          <button onClick={() => setWeekOffset(weekOffset + 1)} className="bg-primaryHover px-3 py-1 rounded text-white">→</button>
        </div>
        <ResponsiveContainer width="100%" height={320}>
          <BarChart data={getDayWiseBreakdown()}>
            <XAxis dataKey="date" stroke="#aaa" />
            <YAxis stroke="#aaa" />
            <Legend />
            {Object.keys(TYPE_COLORS).map(type => (
              <Bar key={type} dataKey={type} stackId="a" fill={TYPE_COLORS[type]} />
            ))}
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Study Hours by Subject */}
      <div className="bg-bgCard p-6 rounded-xl shadow-md col-span-full mt-6">
        <h2 className="text-lg sm:text-xl font-semibold mb-4">Study Hours by Subject</h2>
        <ResponsiveContainer width="100%" height={320}>
          <BarChart data={getStudyHoursBySubject()}>
            <XAxis dataKey="subject" stroke="#aaa" />
            <YAxis stroke="#aaa" label={{ value: 'Hours', angle: -90, position: 'insideLeft' }} />
            <Bar dataKey="hours" fill="#7A73D1" />
          </BarChart>
        </ResponsiveContainer>
      </div>

    </div>
  </div>
</div>

  );
}
