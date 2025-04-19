import React, { useEffect, useState } from 'react';
import TopBar from '../components/TopBar';
import TopBarButton from '../components/TopBarButton';

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

  const daysOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem('activities')) || [];
    const savedSubjects = JSON.parse(localStorage.getItem('subjects')) || [];
    setActivities(saved);
    setSubjects(savedSubjects);
  }, []);

  const toggleDay = (day) => {
    setSelectedDays((prev) =>
      prev.includes(day) ? prev.filter((d) => d !== day) : [...prev, day]
    );
  };

  const handleSubmit = (e) => {
    e.preventDefault();
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
    };

    let updated;
    if (action === 'edit' && selectedEditIndex !== null) {
      updated = [...activities];
      updated[selectedEditIndex] = newActivity;
      setSelectedEditIndex(null);
    } else {
      updated = [...activities, newActivity];
    }

    localStorage.setItem('activities', JSON.stringify(updated));
    setActivities(updated);
    setActivityName('');
    setActivityType('');
    setAcademicDetail('');
    setSelectedSubjectId('');
    setSelectedDays([]);
    setSelectedDate('');
    setStartTime('');
    setEndTime('');
  };

  const handleDelete = () => {
    const updated = [...activities];
    updated.splice(selectedIndexToDelete, 1);
    localStorage.setItem('activities', JSON.stringify(updated));
    setActivities(updated);
    setSelectedIndexToDelete(null);
  };

  const handleSelectEdit = (index) => {
    const act = activities[index];
    setSelectedEditIndex(index);
    setActivityName(act.activityName);
    setActivityType(act.activityType);
    setAcademicDetail(act.academicDetail || '');
    setSelectedSubjectId(act.subjectId || '');
    setIsPermanent(act.isPermanent);
    setSelectedDays(act.selectedDays);
    setSelectedDate(act.selectedDate || '');
    setStartTime(act.startTime);
    setEndTime(act.endTime);
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

  const getSubjectName = (id) => {
    const subj = subjects.find((s) => s.id === id);
    return subj ? subj.name : '';
  };

  return (
    <div className="min-h-screen bg-bgMain text-white font-sans">
      <TopBar>
        <TopBarButton to="/activityManagement" active>Activity Management</TopBarButton>
        <TopBarButton to="/schedule">Schedule</TopBarButton>
        <TopBarButton to="/performance">Performance</TopBarButton>
      </TopBar>

      <div className="flex gap-6 p-6">
        <aside className="w-1/4 bg-bgCard p-4 rounded-xl shadow-md space-y-4">
          <button onClick={() => setAction('add')} className={`w-full text-left py-2 px-3 rounded ${action === 'add' ? 'bg-primaryHover' : 'hover:bg-primaryHover'}`}>Add Activity</button>
          <button onClick={() => setAction('delete')} className={`w-full text-left py-2 px-3 rounded ${action === 'delete' ? 'bg-primaryHover' : 'hover:bg-primaryHover'}`}>Delete Activity</button>
          <button onClick={() => setAction('edit')} className={`w-full text-left py-2 px-3 rounded ${action === 'edit' ? 'bg-primaryHover' : 'hover:bg-primaryHover'}`}>Edit Activity</button>
          <button onClick={() => setAction('courses')} className={`w-full text-left py-2 px-3 rounded ${action === 'courses' ? 'bg-primaryHover' : 'hover:bg-primaryHover'}`}>Courses</button>
        </aside>

        <section className="flex-1 bg-bgCard p-6 rounded-xl shadow-md">
          <h2 className="text-2xl font-bold mb-6 capitalize">{action} Activity</h2>

          {action === 'courses' && (
            <div>
              <h3 className="text-xl font-semibold mb-4">Courses</h3>
              <ul className="space-y-2 mb-4">
                {subjects.map((subj) => (
                  <li key={subj.id} className="flex justify-between bg-[#303043] p-3 rounded-md">
                    {subj.name}
                    <button onClick={() => handleDeleteSubject(subj.id)} className="text-red-400 hover:text-red-600">Delete</button>
                  </li>
                ))}
              </ul>
              <div className="flex gap-2">
                <input value={newCourseName} onChange={(e) => setNewCourseName(e.target.value)} placeholder="New Course Name" className="flex-1 bg-[#303043] text-white border border-gray-600 rounded-md px-4 py-2" />
                <button onClick={handleAddSubject} className="bg-primaryHover px-4 py-2 rounded text-white">Add</button>
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
                      className={`p-3 rounded-md cursor-pointer ${selectedEditIndex === idx ? 'bg-[#7345df]' : 'bg-[#303043]'} hover:bg-primaryHover`}
                    >
                      {act.activityName} ({act.activityType})
                    </li>
                  ))}
                </ul>
              )}

              <form className="space-y-4 max-w-xl" onSubmit={handleSubmit}>
                <div>
                  <label className="block mb-1 text-sm">Activity Name</label>
                  <input value={activityName} onChange={(e) => setActivityName(e.target.value)} type="text" className="w-full bg-[#303043] text-white border border-gray-600 rounded-md px-4 py-2 placeholder-gray-400" placeholder="e.g., Gym Session" />
                </div>

                <div>
                  <label className="block mb-1 text-sm">Activity Type</label>
                  <select value={activityType} onChange={(e) => setActivityType(e.target.value)} className="w-full bg-[#303043] text-white border border-gray-600 rounded-md px-4 py-2">
                    <option value="">Select type</option>
                    <option value="academic">Academic</option>
                    <option value="exercise">Exercise</option>
                    <option value="personal">Personal</option>
                    <option value="other">Other</option>
                  </select>
                </div>

                {activityType === 'academic' && (
                  <>
                    <div>
                      <label className="block mb-1 text-sm">Select Course</label>
                      <select value={selectedSubjectId} onChange={(e) => setSelectedSubjectId(e.target.value)} className="w-full bg-[#303043] text-white border border-gray-600 rounded-md px-4 py-2">
                        <option value="">Select Course</option>
                        {subjects.map((s) => (
                          <option key={s.id} value={s.id}>{s.name}</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block mb-1 text-sm">Academic Detail</label>
                      <select value={academicDetail} onChange={(e) => setAcademicDetail(e.target.value)} className="w-full bg-[#303043] text-white border border-gray-600 rounded-md px-4 py-2">
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
                  </>
                )}

                <div className="mb-4">
                  <label className="block mb-1 text-sm">Task Type</label>
                  <div className="flex gap-4">
                    <button type="button" onClick={() => setIsPermanent(true)} className={`px-4 py-2 rounded-md border ${isPermanent ? 'bg-primaryHover text-white' : 'bg-[#303043] text-gray-300'} transition`}>Permanent</button>
                    <button type="button" onClick={() => setIsPermanent(false)} className={`px-4 py-2 rounded-md border ${!isPermanent ? 'bg-primaryHover text-white' : 'bg-[#303043] text-gray-300'} transition`}>Temporary</button>
                  </div>
                </div>

                {isPermanent ? (
                  <div className="relative">
                    <label className="block mb-1 text-sm">Days</label>
                    <div onClick={() => setShowDropdown(!showDropdown)} className="cursor-pointer bg-[#303043] text-white border border-gray-600 rounded-md px-4 py-2">
                      {selectedDays.length > 0 ? selectedDays.join(', ') : 'Select days'}
                    </div>
                    {showDropdown && (
                      <div className="absolute z-10 mt-1 w-full bg-[#2a2a3c] border border-gray-600 rounded-md shadow-lg max-h-48 overflow-auto">
                        {daysOfWeek.map((day) => (
                          <label key={day} className="flex items-center px-4 py-2 hover:bg-[#393953] cursor-pointer text-sm">
                            <input type="checkbox" checked={selectedDays.includes(day)} onChange={() => toggleDay(day)} className="mr-2 accent-primaryHover" />
                            {day}
                          </label>
                        ))}
                      </div>
                    )}
                  </div>
                ) : (
                  <div>
                    <label className="block mb-1 text-sm">Date</label>
                    <input type="date" value={selectedDate} onChange={(e) => setSelectedDate(e.target.value)} className="w-full bg-[#303043] text-white border border-gray-600 rounded-md px-4 py-2" />
                  </div>
                )}

                <div>
                  <label className="block mb-1 text-sm">Start Time</label>
                  <input type="time" value={startTime} onChange={(e) => setStartTime(e.target.value)} className="w-full bg-[#303043] text-white border border-gray-600 rounded-md px-4 py-2" />
                </div>

                <div>
                  <label className="block mb-1 text-sm">End Time</label>
                  <input type="time" value={endTime} onChange={(e) => setEndTime(e.target.value)} className="w-full bg-[#303043] text-white border border-gray-600 rounded-md px-4 py-2" />
                </div>

                <div className="pt-4">
                  <button type="submit" className="bg-primaryHover hover:bg-[#5e32cc] px-6 py-2 rounded text-white font-semibold">
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
                  <li key={idx} onClick={() => setSelectedIndexToDelete(idx)} className={`p-3 rounded-md cursor-pointer ${selectedIndexToDelete === idx ? 'bg-[#7345df]' : 'bg-[#303043]'} hover:bg-primaryHover`}>
                    {activity.activityName} ({activity.activityType})
                  </li>
                ))}
              </ul>
              {selectedIndexToDelete !== null && (
                <div className="pt-6">
                  <button onClick={handleDelete} className="bg-red-600 hover:bg-red-700 px-6 py-2 rounded text-white font-semibold">Delete Selected</button>
                </div>
              )}
            </div>
          )}
        </section>
      </div>
    </div>
  );  
}