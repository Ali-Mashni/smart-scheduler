// ✅ StudentSchedulePage.js – With Suggested Schedule Toggle
import React, { useEffect, useRef, useState } from 'react';
import TopBar from '../components/TopBar';
import TopBarButton from '../components/TopBarButton';
import ContactUsModel from '../components/ContactUsModel';


export default function StudentSchedulePage() {
  const [activities, setActivities] = useState([]);
  const [todaysTasks, setTodaysTasks] = useState([]);
  const [weekOffset, setWeekOffset] = useState(0);
  const [showSuggested, setShowSuggested] = useState(false);
  const [originalActivities, setOriginalActivities] = useState([]);
  
  const [isContactUsOpen, setisContactUsOpen] = useState(false);
  const hourRefs = useRef([]);
  hourRefs.current = [];

  const getStartOfWeek = () => {
    const now = new Date();
    now.setDate(now.getDate() + weekOffset * 7);
    const day = now.getDay();
    const diff = now.getDate() - day;
    const sunday = new Date(now.setDate(diff));
    return Array.from({ length: 7 }, (_, i) => {
      const d = new Date(sunday);
      d.setDate(d.getDate() + i);
      return d;
    });
  };

  const formatDate = (date) => {
    const offset = date.getTimezoneOffset();
    const corrected = new Date(date.getTime() - offset * 60 * 1000);
    return corrected.toISOString().slice(0, 10);
  };

  const displayDate = (date) =>
    date.toLocaleDateString(undefined, {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
    });

  const weekDates = getStartOfWeek();
  const hours = Array.from({ length: 24 }, (_, i) => `${i.toString().padStart(2, '0')}:00`);

  const getActivityForSlot = (dateStr, hour) => {
    return activities.find((a) => {
      if (!a.startTime || !a.endTime) return false;

      const isPermanent =
        a.isPermanent &&
        a.selectedDays?.includes(
          new Date(dateStr).toLocaleDateString('en-US', { weekday: 'long' })
        );

      const isTemporary =
        !a.isPermanent && formatDate(new Date(a.selectedDate)) === dateStr;

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
    const todayDate = formatDate(new Date());
    const stored = JSON.parse(localStorage.getItem("activities")) || [];
    setActivities(stored);
    setOriginalActivities(stored);

    const weekday = new Date(todayDate).toLocaleDateString('en-US', { weekday: 'long' });
    const todayTasks = stored.filter((a) => {
      if (a.isPermanent) return a.selectedDays.includes(weekday);
      return formatDate(new Date(a.selectedDate)) === todayDate;
    });
    setTodaysTasks(todayTasks);

    const hourCount = Array(24).fill(0);
    stored.forEach((a) => {
      if (!a.startTime) return;
      const h = parseInt(a.startTime.split(':')[0], 10);
      if (!isNaN(h)) hourCount[h]++;
    });
    const maxIndex = hourCount.indexOf(Math.max(...hourCount));
    const target = hourRefs.current[maxIndex];
    if (target) target.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }, [weekOffset]);

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

  const toggleSuggestedSchedule = () => {
    if (showSuggested) {
      setActivities(originalActivities);
      setShowSuggested(false);
      return;
    }

    const now = new Date();
    const suggested = [...originalActivities];

    const exams = suggested.filter(
      (a) => a.activityType === 'academic' && ['midterm', 'final', 'quiz'].includes(a.academicDetail)
    );

    exams.forEach((exam) => {
      const examDate = new Date(exam.selectedDate);
      for (let i = 1; i <= 5; i++) {
        const date = new Date(examDate);
        date.setDate(date.getDate() - i);
        const formatted = formatDate(date);
        const hours = i === 1 ? 6 : 3;
        for (let h = 0; h < hours; h++) {
          suggested.push({
            activityName: `Study: ${exam.activityName}`,
            activityType: 'academic',
            academicDetail: 'study',
            subjectId: exam.subjectId,
            isPermanent: false,
            selectedDate: formatted,
            startTime: `${(14 + h).toString().padStart(2, '0')}:00`,
            endTime: `${(15 + h).toString().padStart(2, '0')}:00`,
          });
        }
      }
    });

    setActivities(suggested);
    setShowSuggested(true);
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

  return (
    <div className="min-h-screen bg-bgMain text-white font-sans">
      <TopBar>
        <TopBarButton to="/activityManagement">Activity Management</TopBarButton>
        <TopBarButton to="/schedule" active>Schedule</TopBarButton>
        <TopBarButton to="/performance">Performance</TopBarButton>
        <TopBarButton to="/login"><p className="text-red-500 hover:text-red-600">Logout</p></TopBarButton>
      </TopBar>
            {/* Check */}

      {/* Contact Us Settings Modal */}
      {isContactUsOpen && (
        <ContactUsModel onClose={handleCloseContactUs} />
      )}

      <main className="flex flex-col md:flex-row gap-6 p-8">
        <section className="flex-1 bg-bgCard p-4 rounded-xl shadow-md overflow-auto max-h-[80vh]">
          <div className="flex justify-between items-center mb-4">
            <button onClick={() => setWeekOffset(weekOffset - 1)} className="bg-primaryHover px-3 py-1 rounded">← Previous Week</button>
            <span className="font-bold text-lg">Week of {displayDate(weekDates[0])}</span>
            <button onClick={() => setWeekOffset(weekOffset + 1)} className="bg-primaryHover px-3 py-1 rounded">Next Week →</button>
          </div>

          <div className="grid grid-cols-8">
            <div className="p-2 font-bold border-b border-gray-600">Time</div>
            {weekDates.map((date, index) => (
              <div
                key={formatDate(date)}
                className={`p-2 text-center font-bold border-b border-gray-600 ${index !== 6 ? 'border-r border-gray-600' : ''} ${formatDate(date) === formatDate(new Date()) ? 'text-accent' : ''}`}
              >
                {displayDate(date)}
              </div>
            ))}
            {hours.map((hour, hourIndex) => (
              <React.Fragment key={hour}>
                <div ref={(el) => hourRefs.current[hourIndex] = el} className="p-2 font-mono text-sm border-t border-gray-600">{hour}</div>
                {weekDates.map((date, index) => {
                  const dateStr = formatDate(date);
                  const activity = getActivityForSlot(dateStr, hour);
                  return (
                    <div
                      key={dateStr + hour}
                      className={`h-16 p-1 border-t border-gray-600 ${index !== 6 ? 'border-r border-gray-600' : ''}`}
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

          <button onClick={toggleSuggestedSchedule} className="mt-6 bg-primaryHover hover:bg-[#5e32cc] px-4 py-2 w-full rounded text-white font-semibold">
            {showSuggested ? 'Back to Original Schedule' : 'Suggested Schedule'}
          </button>
        </section>
      </main>
      
    </div>

    
  );
}