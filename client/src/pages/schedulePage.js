// ✅ StudentSchedulePage.js – With Type-Based Colors, Completion Check, and Vertical Lines (No Outer Border)
import React, { useEffect, useState } from 'react';
import TopBar from '../components/TopBar';
import TopBarButton from '../components/TopBarButton';

export default function StudentSchedulePage() {
  const [activities, setActivities] = useState([]);
  const [todaysTasks, setTodaysTasks] = useState([]);

  const getStartOfWeek = () => {
    const now = new Date();
    const day = now.getDay();
    const diff = now.getDate() - day + (day === 0 ? -6 : 1); // Monday start
    const monday = new Date(now.setDate(diff));
    return Array.from({ length: 5 }, (_, i) => {
      const d = new Date(monday);
      d.setDate(d.getDate() + i);
      return d;
    });
  };

  const formatDate = (date) => date.toISOString().slice(0, 10);
  const displayDate = (date) =>
    date.toLocaleDateString(undefined, {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
    });

  const weekDates = getStartOfWeek();
  const hours = Array.from({ length: 11 }, (_, i) => `${(7 + i).toString().padStart(2, '0')}:00`);

  const getActivityForSlot = (dateStr, hour) => {
    return activities.find((a) => {
      if (!a.startTime || !a.endTime) return false;

      const isPermanent =
        a.isPermanent &&
        a.selectedDays?.includes(
          new Date(dateStr).toLocaleDateString('en-US', { weekday: 'long' })
        );
      const isTemporary = !a.isPermanent && a.selectedDate === dateStr;

      const [startH] = a.startTime.split(':').map(Number);
      const [endH] = a.endTime.split(':').map(Number);
      const currentH = parseInt(hour.split(':')[0]);

      return (isPermanent || isTemporary) && currentH >= startH && currentH < endH;
    });
  };

  const getColorByType = (type) => {
    switch (type) {
      case 'academic': return 'bg-purple-600';
      case 'exercise': return 'bg-green-600';
      case 'personal': return 'bg-pink-500';
      case 'other': return 'bg-blue-500';
      default: return 'bg-gray-600';
    }
  };

  useEffect(() => {
    const todayDate = new Date().toISOString().slice(0, 10);
    const stored = JSON.parse(localStorage.getItem("activities")) || [];
    setActivities(stored);

    const weekday = new Date(todayDate).toLocaleDateString('en-US', { weekday: 'long' });
    const todayTasks = stored.filter((a) => {
      if (a.isPermanent) return a.selectedDays.includes(weekday);
      return a.selectedDate === todayDate;
    });
    setTodaysTasks(todayTasks);
  }, []);

  const toggleTaskComplete = (index) => {
    const updated = [...todaysTasks];
    updated[index].completed = !updated[index].completed;

    const updatedAll = activities.map((a) => {
      const match = updated.find(
        (t) =>
          t.activityName === a.activityName &&
          t.startTime === a.startTime &&
          t.endTime === a.endTime
      );
      return match ? { ...a, completed: match.completed } : a;
    });

    setTodaysTasks(updated);
    setActivities(updatedAll);
    localStorage.setItem("activities", JSON.stringify(updatedAll));
  };

  return (
    <div className="min-h-screen bg-bgMain text-white font-sans">
      <TopBar>
        <TopBarButton to="/activityManagement">Activity Management</TopBarButton>
        <TopBarButton to="/schedule" active>Schedule</TopBarButton>
        <TopBarButton to="/performance">Performance</TopBarButton>
      </TopBar>

      <main className="flex flex-col md:flex-row gap-6 p-8">
        <section className="flex-1 bg-bgCard p-4 rounded-xl shadow-md overflow-auto">
          <div className="grid grid-cols-6">
            <div className="p-2 font-bold border-b border-gray-600">Time</div>
            {weekDates.map((date, index) => (
              <div
                key={formatDate(date)}
                className={`p-2 text-center font-bold border-b border-gray-600 ${index !== 4 ? 'border-r border-gray-600' : ''} ${formatDate(date) === new Date().toISOString().slice(0, 10) ? 'text-accent' : ''}`}
              >
                {displayDate(date)}
              </div>
            ))}

            {hours.map((hour) => (
              <React.Fragment key={hour}>
                <div className="p-2 font-mono text-sm border-t border-gray-600">{hour}</div>
                {weekDates.map((date, index) => {
                  const dateStr = formatDate(date);
                  const activity = getActivityForSlot(dateStr, hour);
                  return (
                    <div
                      key={dateStr + hour}
                      className={`h-16 p-1 border-t border-gray-600 ${index !== 4 ? 'border-r border-gray-600' : ''}`}
                    >
                      {activity ? (
                        <div
                          className={`w-full h-full rounded-md px-2 py-1 text-xs ${getColorByType(activity.activityType)}`}
                        >
                          {activity.activityName}
                        </div>
                      ) : null}
                    </div>
                  );
                })}
              </React.Fragment>
            ))}
          </div>
        </section>

        <section className="w-full md:w-[320px] bg-bgCard p-6 rounded-xl shadow-md self-start">
          <h2 className="text-2xl font-bold mb-4">Today's Tasks</h2>
          {todaysTasks.length === 0 ? (
            <p className="text-sm text-gray-400">No tasks for today.</p>
          ) : (
            <ul className="space-y-3">
              {todaysTasks.map((task, i) => (
                <li
                  key={i}
                  className={`bg-[#303043] p-3 rounded-md border-l-4 flex justify-between items-center ${getColorByType(task.activityType)} ${task.completed ? 'opacity-50 line-through' : ''}`}
                >
                  <span>{task.activityName} ({task.startTime} - {task.endTime})</span>
                  <input
                    type="checkbox"
                    checked={task.completed || false}
                    onChange={() => toggleTaskComplete(i)}
                    className="accent-primary cursor-pointer"
                  />
                </li>
              ))}
            </ul>
          )}
        </section>
      </main>
    </div>
  );
}