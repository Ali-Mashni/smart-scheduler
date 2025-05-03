import React, { useEffect, useState } from 'react';
import TopBar from '../components/TopBar';
import TopBarButton from '../components/TopBarButton';
import ContactUsModel from '../components/ContactUsModel';


export default function ActivityManagementPage() {
  const [action, setAction] = useState('add');
  const [activities, setActivities] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [newCourseName, setNewCourseName] = useState('');

  const [activityName, setActivityName] = useState('');
  const [activityType, setActivityType] = useState('');
  const [academicDetail, setAcademicDetail] = useState('');
  const [selectedSubjectId, setSelectedSubjectId] = useState('');
  const [isPermanent, setIsPermanent] = useState(true);
  const [selectedDays, setSelectedDays] = useState([]);
  const [selectedDate, setSelectedDate] = useState('');
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');
  const [showDropdown, setShowDropdown] = useState(false);
  const [selectedIndexToDelete, setSelectedIndexToDelete] = useState(null);
  const [selectedEditIndex, setSelectedEditIndex] = useState(null);
  const [isContactUsOpen, setisContactUsOpen] = useState(false);
  const [studyDaysBeforeExam, setStudyDaysBeforeExam] = useState(5);
  const [preferredTime, setPreferredTime] = useState('morning');
  const [conflictMsg, setConflictMsg] = useState('');


  const daysOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

  const fetchActivities = async () => {
    try {
      const res = await fetch('/api/student/activities', {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
      });
      if (!res.ok) throw new Error('Failed to fetch activities');
      const json = await res.json();
      const data = Array.isArray(json.data) ? json.data : [];
      setActivities(data);
    } catch (err) {
      console.error('Failed to fetch activities:', err);
      setActivities([]);
    }
  };

  useEffect(() => {
    fetchActivities();
    const savedSubjects = JSON.parse(localStorage.getItem('subjects')) || [];
    setSubjects(savedSubjects);
  }, []);

  const toggleDay = (day) => {
    setSelectedDays((prev) =>
      prev.includes(day) ? prev.filter((d) => d !== day) : [...prev, day]
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    const isExam = activityType === 'academic' && ['midterm', 'final', 'quiz'].includes(academicDetail);

    const newActivity = {
      activityName,
      activityType,
      academicDetail: activityType === 'academic' ? academicDetail : '',
      subjectId: activityType === 'academic' ? selectedSubjectId : '',
      isPermanent,
      selectedDays: isPermanent ? selectedDays : [],
      selectedDate: isPermanent ? null : selectedDate,
      startTime,
      endTime,
      studyDaysBeforeExam: isExam ? studyDaysBeforeExam : undefined,
      preferredTime: isExam ? preferredTime : undefined,
    };

    if(newActivity.endTime<newActivity.startTime){
    setConflictMsg('End time must be more than start time.');
    return;
    }
  
    if (hasTimeConflict(newActivity, activities)) {
      setConflictMsg('This task conflicts with another task at the same time.');
      return;
    }
    
    setConflictMsg('');
  
    try {
      const res = await fetch('/api/student/activities', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify(newActivity),
      });
  
      if (!res.ok) {
        throw new Error('Failed to save activity');
      }
  
      await fetchActivities(); // Refresh list with updated data
  
      // Reset form
      setActivityName('');
      setActivityType('');
      setAcademicDetail('');
      setSelectedSubjectId('');
      setSelectedDays([]);
      setSelectedDate('');
      setStartTime('');
      setEndTime('');
      setAction('add'); // Reset to add mode after successful submission
      setStudyDaysBeforeExam(5);
      setPreferredTime('morning');
    } catch (error) {
      console.error('Error saving activity:', error);
    }
  };

  const handleDelete = async () => {
    try {
      const activityToDelete = activities[selectedIndexToDelete];
      const res = await fetch(`/api/student/activities/${activityToDelete._id}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
      });

      if (!res.ok) {
        throw new Error('Failed to delete activity');
      }

      await fetchActivities(); // Refresh the activities list
      setSelectedIndexToDelete(null);
    } catch (error) {
      console.error('Error deleting activity:', error);
    }
  };

  const handleSelectEdit = (index) => {
    const act = activities[index];
    setSelectedEditIndex(index);
    setActivityName(act.activityName);
    setActivityType(act.activityType);
    setAcademicDetail(act.academicDetail || '');
    setSelectedSubjectId(act.subjectId || '');
    setIsPermanent(act.isPermanent);
    setSelectedDays(act.selectedDays || []);
    setSelectedDate(act.selectedDate || '');
    setStartTime(act.startTime);
    setEndTime(act.endTime);
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    if (selectedEditIndex === null) return;

    const isExam = activityType === 'academic' && ['midterm', 'final', 'quiz'].includes(academicDetail);

    const updatedActivity = {
      activityName,
      activityType,
      academicDetail: activityType === 'academic' ? academicDetail : '',
      subjectId: activityType === 'academic' ? selectedSubjectId : '',
      isPermanent,
      selectedDays: isPermanent ? selectedDays : [],
      selectedDate: isPermanent ? null : selectedDate,
      startTime,
      endTime,
      studyDaysBeforeExam: isExam ? studyDaysBeforeExam : undefined,
      preferredTime: isExam ? preferredTime : undefined,
    };

    if (hasTimeConflict(updatedActivity, activities, selectedEditIndex)) {
      setConflictMsg('This task conflicts with another task at the same time.');
      return;
    }
    // if(updatedActivity.endTime<updatedActivity.startTime){
    //   setConflictMsg('End time must be more than start time.');
    //   return;
    // }
    setConflictMsg('');

    try {
      const res = await fetch(`/api/student/activities/${activities[selectedEditIndex]._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify(updatedActivity),
      });

      if (!res.ok) {
        throw new Error('Failed to update activity');
      }

      await fetchActivities();
      setSelectedEditIndex(null);
      setAction('add');
      setStudyDaysBeforeExam(5);
      setPreferredTime('morning');
    } catch (error) {
      console.error('Error updating activity:', error);
    }
  };

  const handleAddSubject = () => {
    if (!newCourseName.trim()) return;
    const newSubj = { id: Date.now().toString(), name: newCourseName };
    const updated = [...subjects, newSubj];
    localStorage.setItem('subjects', JSON.stringify(updated));
    setSubjects(updated);
    setNewCourseName('');
  };

  const handleDeleteSubject = (id) => {
    const updated = subjects.filter((s) => s.id !== id);
    localStorage.setItem('subjects', JSON.stringify(updated));
    setSubjects(updated);
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

  function hasTimeConflict(newActivity, activities, ignoreIndex = null) {
    // Only check for the same date (for temporary) or same day (for permanent)
    return activities.some((a, idx) => {
      if (ignoreIndex !== null && idx === ignoreIndex) return false; // skip self when editing

      // Check if on the same day/date
      let sameDay = false;
      if (newActivity.isPermanent && a.isPermanent) {
        sameDay = newActivity.selectedDays.some(day => a.selectedDays.includes(day));
      } else if (!newActivity.isPermanent && !a.isPermanent) {
        sameDay = newActivity.selectedDate === a.selectedDate;
      } else {
        return false; // don't compare permanent with temporary
      }

      if (!sameDay) return false;

      // Check for time overlap
      const startA = parseInt(a.startTime.replace(':', ''), 10);
      const endA = parseInt(a.endTime.replace(':', ''), 10);
      const startB = parseInt(newActivity.startTime.replace(':', ''), 10);
      const endB = parseInt(newActivity.endTime.replace(':', ''), 10);

      return (startA < endB && startB < endA);
    });
  }

  return (
    <div className="min-h-screen lg:h-screen lg:overflow-hidden overflow-auto bg-bgMain text-white font-sans">
      <TopBar>
        <TopBarButton to="/activityManagement" active>Activity Management</TopBarButton>
        <TopBarButton to="/schedule">Schedule</TopBarButton>
        <TopBarButton to="/performance">Performance</TopBarButton>
        <TopBarButton to ="/support" >Your Requests</TopBarButton>
        <TopBarButton to ="/customer-service" >Contact Us</TopBarButton>
        <TopBarButton to="/login"><p className="text-red-500 hover:text-red-600">Logout</p></TopBarButton>
      </TopBar>
      {/* Contact Us Settings Modal */}
      {isContactUsOpen && (
        <ContactUsModel onClose={handleCloseContactUs} />
      )}

<div className="h-screen flex overflow-hidden p-4 gap-6 ">
  {/* Left Sidebar - scrollable */}
  <aside className="w-full lg:w-1/4 bg-gray-800 p-6 rounded-lg shadow-md overflow-y-auto max-h-[calc(100vh-100px)]">
    {['add', 'edit', 'delete', 'courses'].map((a) => (
      <button
        key={a}
        onClick={() => setAction(a)}
        className={`w-full text-left py-2.5 px-4 rounded-lg capitalize ${action === a ? 'bg-purple-700 text-white' : 'hover:bg-purple-900/50 text-gray-300'}`}
      >
        {a} {a === 'courses' ? '' : 'Activity'}
      </button>
    ))}
  </aside>

  {/* Right Content - scrollable */}
  <section className="flex-1 bg-gray-800 p-8 rounded-lg shadow-md max-h-[calc(100vh-100px)]">
    <div>
    <h2 className="text-3xl font-semibold mb-8 capitalize">{action} Activity</h2>
    </div>

    <div className='flex-1 bg-gray-800 p-8 rounded-lg shadow-md overflow-y-auto max-h-[calc(100vh-200px)]'>
    {/* All your dynamic action content here */}
    {action === 'courses' && (
      <div className="flex flex-col gap-4">
        <h3 className="text-2xl font-medium mb-2">Courses</h3>
        <ul className="space-y-2">
          {subjects.map((subj) => (
            <li key={subj.id} className="flex justify-between bg-gray-700/60 p-4 rounded-lg">
              {subj.name}
              <button onClick={() => handleDeleteSubject(subj.id)} className="text-red-400 hover:text-red-500">Delete</button>
            </li>
          ))}
        </ul>
        <div className="flex gap-2 flex-col sm:flex-row mt-auto">
          <input
            value={newCourseName}
            onChange={(e) => setNewCourseName(e.target.value)}
            placeholder="New Course Name"
            className="flex-1 bg-gray-700/60 text-white border border-gray-600 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
          />
          <button onClick={handleAddSubject} className="bg-purple-600 hover:bg-purple-700 text-white font-medium py-2 px-4 rounded-lg">Add</button>
        </div>
      </div>
    )}


          {(action === 'add' || action === 'edit') && (
            <div>
              {action === 'edit' && (
                <ul className="space-y-3 mb-6">
                  {activities.map((act, idx) => (
                    <li
                      key={idx}
                      onClick={() => handleSelectEdit(idx)}
                      className={`p-4 rounded-lg cursor-pointer ${selectedEditIndex === idx ? 'bg-purple-700' : 'bg-gray-700/60'} hover:bg-purple-900/50`}
                    >
                      {act.activityName} ({act.activityType})
                    </li>
                  ))}
                </ul>
              )}

              <form className="space-y-6 max-w-2xl" onSubmit={action === 'edit' ? handleUpdate : handleSubmit}>
                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block mb-2 text-sm">Activity Name</label>
                    <input
                      value={activityName}
                      onChange={(e) => setActivityName(e.target.value)}
                      type="text"
                      className="w-full bg-gray-700/60 text-white border border-gray-600 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      placeholder="e.g., Gym Session"
                    />
                  </div>

                  <div>
                    <label className="block mb-2 text-sm">Activity Type</label>
                    <select
                      value={activityType}
                      onChange={(e) => setActivityType(e.target.value)}
                      className="w-full bg-gray-700/60 text-white border border-gray-600 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    >
                      <option value="">Select type</option>
                      <option value="academic">Academic</option>
                      <option value="exercise">Exercise</option>
                      <option value="personal">Personal</option>
                      <option value="other">Other</option>
                    </select>
                  </div>
                </div>

                {activityType === 'academic' && (
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block mb-2 text-sm">Select Course</label>
                      <select
                        value={selectedSubjectId}
                        onChange={(e) => setSelectedSubjectId(e.target.value)}
                        className="w-full bg-gray-700/60 text-white border border-gray-600 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      >
                        <option value="">Select Course</option>
                        {subjects.map((s) => (
                          <option key={s.id} value={s.id}>{s.name}</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block mb-2 text-sm">Academic Detail</label>
                      <select
                        value={academicDetail}
                        onChange={(e) => setAcademicDetail(e.target.value)}
                        className="w-full bg-gray-700/60 text-white border border-gray-600 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      >
                        <option value="">Select</option>
                        <option value="class">Class</option>
                        <option value="major">Major</option>
                        <option value="homework">Homework</option>
                        <option value="midterm">Midterm</option>
                        <option value="final">Final</option>
                        <option value="quiz">Quiz</option>
                        <option value="study">Study</option>
                      </select>
                    </div>
                  </div>
                )}

                {activityType === 'academic' && ['midterm', 'final', 'quiz'].includes(academicDetail) && (
                  <div className="flex flex-col sm:flex-row gap-4 mb-4">
                    <div>
                      <label className="block text-sm mb-1">Days before exam to start studying:</label>
                      <input
                        type="number"
                        min={1}
                        max={14}
                        value={studyDaysBeforeExam}
                        onChange={e => setStudyDaysBeforeExam(Number(e.target.value))}
                        className="bg-[#303043] text-white border border-gray-600 rounded-md px-2 py-1 w-20"
                      />
                    </div>
                    <div>
                      <label className="block text-sm mb-1">Preferred study time:</label>
                      <select
                        value={preferredTime}
                        onChange={e => setPreferredTime(e.target.value)}
                        className="bg-[#303043] text-white border border-gray-600 rounded-md px-2 py-1"
                      >
                        <option value="morning">Morning</option>
                        <option value="night">Night</option>
                      </select>
                    </div>
                  </div>
                )}

                <div className="mb-4">
                  <label className="block mb-2 text-sm">Task Type</label>
                  <div className="flex gap-4">
                    <button type="button" onClick={() => setIsPermanent(true)} className={`px-4 py-2.5 border border-gray-600 rounded-l-lg ${isPermanent ? 'bg-purple-700 text-white' : 'bg-gray-700/60 text-gray-300 hover:bg-gray-700/80'}`}>Permanent</button>
                    <button type="button" onClick={() => setIsPermanent(false)} className={`px-4 py-2.5 border border-gray-600 rounded-r-lg ${!isPermanent ? 'bg-purple-700 text-white' : 'bg-gray-700/60 text-gray-300 hover:bg-gray-700/80'}`}>Temporary</button>
                  </div>
                </div>

                {isPermanent ? (
                  <div className="relative">
                    <label className="block mb-2 text-sm">Days</label>
                    <div onClick={() => setShowDropdown(!showDropdown)} className="cursor-pointer bg-gray-700/60 text-white border border-gray-600 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-purple-500 focus:border-transparent">
                      {selectedDays.length > 0 ? selectedDays.join(', ') : 'Select days'}
                    </div>
                    {showDropdown && (
                      <div className="absolute z-10 w-full mt-1 bg-gray-800 border border-gray-600 rounded-lg shadow-lg max-h-60 overflow-auto">
                        {daysOfWeek.map((day) => (
                          <label key={day} className="flex items-center px-4 py-2 hover:bg-purple-900/50 cursor-pointer text-sm">
                            <input type="checkbox" checked={selectedDays.includes(day)} onChange={() => toggleDay(day)} className="mr-2 accent-purple-500" />
                            {day}
                          </label>
                        ))}
                      </div>
                    )}
                  </div>
                ) : (
                  <div>
                    <label className="block mb-2 text-sm">Date</label>
                    <input type="date" value={selectedDate} onChange={(e) => setSelectedDate(e.target.value)} className="w-full bg-gray-700/60 text-white border border-gray-600 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-purple-500 focus:border-transparent" />
                  </div>
                )}

                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block mb-2 text-sm">Start Time</label>
                    <input type="time" value={startTime} onChange={(e) => setStartTime(e.target.value)} className="w-full bg-gray-700/60 text-white border border-gray-600 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-purple-500 focus:border-transparent" />
                  </div>
                  <div>
                    <label className="block mb-2 text-sm">End Time</label>
                    <input type="time" value={endTime} onChange={(e) => setEndTime(e.target.value)} className="w-full bg-gray-700/60 text-white border border-gray-600 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-purple-500 focus:border-transparent" />
                  </div>
                </div>

                {conflictMsg && (
                  <div className="text-red-400 text-sm mt-2">{conflictMsg}</div>
                )}

                <div className="pt-4">
                  <button type="submit" className="bg-purple-600 hover:bg-purple-700 text-white font-medium py-2.5 px-6 rounded-lg">
                    {action === 'edit' && selectedEditIndex !== null ? 'Update' : 'Save'}
                  </button>
                </div>
              </form>
            </div>
          )}

          {action === 'delete' && (
            <div>
              <ul className="space-y-3">
                {activities.map((activity, idx) => (
                  <li
                    key={idx}
                    onClick={() => setSelectedIndexToDelete(idx)}
                    className={`p-4 rounded-lg cursor-pointer ${selectedIndexToDelete === idx ? 'bg-purple-700' : 'bg-gray-700/60'} hover:bg-purple-900/50`}
                  >
                    {activity.activityName} ({activity.activityType})
                  </li>
                ))}
              </ul>
              {selectedIndexToDelete !== null && (
                <div className="pt-6">
                  <button onClick={handleDelete} className="bg-red-600 hover:bg-red-700 text-white font-medium py-2.5 px-6 rounded-lg">Delete Selected</button>
                </div>
              )}
            </div>
          )}
          </div>
        
        </section>
      </div>
    </div>
  );
}
