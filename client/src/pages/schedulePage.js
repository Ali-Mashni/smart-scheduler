import React, { useEffect, useRef, useState, useContext } from 'react';
import TopBar from '../components/TopBar';
import TopBarButton from '../components/TopBarButton';
import ContactUsModel from '../components/ContactUsModel';
import UserContext from '../context/UserContext';

export default function StudentSchedulePage() {
  const [activities, setActivities] = useState([]);
  const [todaysTasks, setTodaysTasks] = useState([]);
  const [weekOffset, setWeekOffset] = useState(0);
  const [dayOffset, setDayOffset] = useState(0);
  const [showSuggested, setShowSuggested] = useState(false);
  const [originalActivities, setOriginalActivities] = useState([]);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const hourRefs = useRef([]);
  hourRefs.current = [];
  const [isContactUsOpen, setisContactUsOpen] = useState(false);
  const user = useContext(UserContext);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    if (!isMobile) setDayOffset(0);
  }, [isMobile]);

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
    if (!(date instanceof Date) || isNaN(date)) return "";
    const offset = date.getTimezoneOffset();
    return new Date(date.getTime() - offset * 60000).toISOString().slice(0, 10);
  };

  const displayDate = (date) =>
    date.toLocaleDateString(undefined, {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
    });

  const getActivityForSlot = (dateStr, hour) => {
    return Array.isArray(activities) && activities.find((a) => {
      if (!a.startTime || !a.endTime) return false;
      const isPermanent =
        a.isPermanent &&
        a.selectedDays?.includes(
          new Date(dateStr).toLocaleDateString('en-US', { weekday: 'long' })
        );
      const isTemporary = !a.isPermanent && a.selectedDate && formatDate(new Date(a.selectedDate)) === dateStr;
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
    if (!user?.id) return;

    const fetchActivities = async () => {
      try {
        const res = await fetch('/api/student/activities', {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
          },
        });

        if (!res.ok) throw new Error('Failed to fetch');
        const json = await res.json();
        const data = Array.isArray(json.data) ? json.data : [];

        setActivities(data);
        setOriginalActivities(data);
        const todayDate = formatDate(new Date());
        const weekday = new Date(todayDate).toLocaleDateString('en-US', { weekday: 'long' });

        const todayTasks = data.filter((a) =>
          a.isPermanent ? a.selectedDays.includes(weekday) : formatDate(new Date(a.selectedDate)) === todayDate
        );
        setTodaysTasks(todayTasks);
      } catch (err) {
        console.error('Failed to fetch activities:', err);
        setActivities([]);
        setTodaysTasks([]);
      }
    };

    fetchActivities();
  }, [user?.id]);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token && !user?.id) {
      try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        if (payload.id) {
          fetch('/api/student/activities', {
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${token}`,
            },
          })
          .then(res => res.json())
          .then(json => {
            const data = Array.isArray(json.data) ? json.data : [];
            setActivities(data);
            setOriginalActivities(data);
            const todayDate = formatDate(new Date());
            const weekday = new Date(todayDate).toLocaleDateString('en-US', { weekday: 'long' });
            const todayTasks = data.filter((a) =>
              a.isPermanent ? a.selectedDays.includes(weekday) : formatDate(new Date(a.selectedDate)) === todayDate
            );
            setTodaysTasks(todayTasks);
          })
          .catch(err => {
            console.error('Failed to fetch activities:', err);
            setActivities([]);
            setTodaysTasks([]);
          });
        }
      } catch (err) {
        console.error('Error parsing token:', err);
      }
    }
  }, []);

  const toggleTaskComplete = async (index) => {
    const updated = [...todaysTasks];
    updated[index].completed = !updated[index].completed;
    const updatedAll = activities.map((a) => {
      const match = updated.find(
        (t) => t.activityName === a.activityName && t.startTime === a.startTime && t.endTime === a.endTime
      );
      return match ? { ...a, completed: match.completed } : a;
    });
    setTodaysTasks(updated);
    setActivities(updatedAll);

    // Save to database
    try {
      const activityToUpdate = updated[index];
      const response = await fetch(`/api/student/activities/${activityToUpdate._id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify({ completed: activityToUpdate.completed }),
      });

      if (!response.ok) {
        throw new Error('Failed to update activity status');
      }
    } catch (error) {
      console.error('Error updating activity status:', error);
      // Revert the state if the update fails
      const reverted = [...todaysTasks];
      reverted[index].completed = !reverted[index].completed;
      setTodaysTasks(reverted);
      setActivities(activities);
    }
  };

  // Suggested schedule logic (can be customized as needed)
  const toggleSuggestedSchedule = () => {
    if (showSuggested) {
      setActivities(originalActivities);
      setShowSuggested(false);
      return;
    }
    const suggested = [...originalActivities];
    const exams = suggested.filter((a) =>
      a.activityType === 'academic' && ['midterm', 'final', 'quiz'].includes(a.academicDetail)
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

  const weekDates = getStartOfWeek();
  const mobileDay = (() => {
    const today = new Date();
    today.setDate(today.getDate() + dayOffset);
    return [today];
  })();
  const dateRange = isMobile ? mobileDay : weekDates;
  const hours = Array.from({ length: 24 }, (_, i) => `${i.toString().padStart(2, '0')}:00`);

  const getDurationInHours = (startTime, endTime) => {
    const [startH, startM] = startTime.split(':').map(Number);
    const [endH, endM] = endTime.split(':').map(Number);
    return (endH + endM / 60) - (startH + startM / 60);
  };

  return (
    <div className="min-h-screen lg:h-screen lg:overflow-hidden overflow-auto bg-bgMain text-white font-sans">
      <TopBar>
        <TopBarButton to="/activityManagement">Activity Management</TopBarButton>
        <TopBarButton to="/schedule" active>Schedule</TopBarButton>
        <TopBarButton to="/performance">Performance</TopBarButton>
        <TopBarButton to="/support">Your Requests</TopBarButton>
        <TopBarButton to="/customer-service">Contact Us</TopBarButton>
        <TopBarButton to="/logout"><p className="text-red-500 hover:text-red-600">Logout</p></TopBarButton>
      </TopBar>

      {isContactUsOpen && <ContactUsModel onClose={() => setisContactUsOpen(false)} />}

      <main className="flex flex-col lg:flex-row gap-6 p-6">
        {/* Schedule Section */}
        <section className="flex-1 bg-bgCard rounded-xl shadow-md max-h-[80vh] overflow-auto relative">
          <div className="sticky top-0 z-20 bg-bgCard pb-2">
            <div className="flex justify-between items-center mb-2">
              <button onClick={() => isMobile ? setDayOffset(dayOffset - 1) : setWeekOffset(weekOffset - 1)} className="bg-primaryHover px-3 py-1 rounded">←</button>
              <span className="font-bold text-lg">Week of {displayDate(dateRange[0])}</span>
              <button onClick={() => isMobile ? setDayOffset(dayOffset + 1) : setWeekOffset(weekOffset + 1)} className="bg-primaryHover px-3 py-1 rounded">→</button>
            </div>
            <div className={`p-2 grid ${isMobile ? 'grid-cols-2' : 'grid-cols-8'} border-b border-gray-600`}>
              <div className="p-2 font-bold border-r border-gray-600">Time</div>
              {dateRange.map((date, index) => (
                <div key={formatDate(date)} className={`text-sm p-2 text-center font-bold ${index !== dateRange.length - 1 ? 'border-r border-gray-600' : ''} ${formatDate(date) === formatDate(new Date()) ? 'text-accent' : ''}`}>
                  {displayDate(date)}
                </div>
              ))}
            </div>
          </div>

          {/* Hour grid */}
          <div className={`p-2 grid  ${isMobile ? 'grid-cols-2' : 'grid-cols-8'} `}>
            {hours.map((hour, hourIndex) => (
              <React.Fragment key={hour}>
                <div ref={(el) => hourRefs.current[hourIndex] = el} className="p-2 font-mono text-sm border-t border-r border-gray-600">{hour}</div>
                {dateRange.map((date, index) => {
                  const dateStr = formatDate(date);
                  const activity = getActivityForSlot(dateStr, hour);
                  return (
                    <div key={dateStr + hour} className={` border-t border-gray-600 ${index !== dateRange.length - 1 ? 'border-r border-gray-600' : ''}`}
                    style={{
                      top: 0,
                      height: '60px',
                    }}>
                      {activity && (
                        
                        <div className={`w-full rounded-md px-2 py-1 text-xs ${getColorByType(activity.activityType)}` }
                        style={{
                          height:`${getDurationInHours(activity.startTime, activity.endTime) * 60}px`,
                        }}>
                          {activity.activityName}
                        </div>
                      )}
                    </div>
                  );
                })}
              </React.Fragment>
            ))}
          </div>
        </section>

        {/* Tasks */}
        <section className={`bg-bgCard p-6 rounded-xl shadow-md w-full ${isMobile ? '' : 'lg:w-[320px]'}`}>
          <h2 className="text-2xl font-bold mb-4">Today's Tasks</h2>
          {todaysTasks.length === 0 ? (
            <p className="text-sm text-gray-400">No tasks for today.</p>
          ) : (
            <ul className="space-y-3">
              {todaysTasks.map((task, i) => (
                <li key={i} className={`bg-[#303043] p-3 rounded-md border-l-4 flex justify-between items-center ${getColorByType(task.activityType)} ${task.completed ? 'opacity-50 line-through' : ''}`}>
                  <span>{task.activityName} ({task.startTime} - {task.endTime})</span>
                  <input type="checkbox" checked={task.completed || false} onChange={() => toggleTaskComplete(i)} className="accent-primary cursor-pointer" />
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