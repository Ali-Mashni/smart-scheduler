import React, { useState } from 'react';
import TopBar from '../components/TopBar';
import TopBarButton from '../components/TopBarButton';

export default function ActivityManagementPage() {
  const [action, setAction] = useState('add');

  return (
    <div className="min-h-screen bg-bgMain text-white font-sans">
      {/* Header */}
        <TopBar>  
            <TopBarButton to="/activityManagement"active>Activity Management</TopBarButton>
            <TopBarButton to="/schedule" >Schedule</TopBarButton>
            <TopBarButton to="/performance" >Performance</TopBarButton>
       </TopBar>   

      {/* Page Content */}
      <div className="flex gap-6">
        {/* Sidebar */}
        <aside className="w-1/4 bg-bgCard p-4 rounded-xl shadow-md space-y-4">
          <button onClick={() => setAction('add')} className={`w-full text-left py-2 px-3 rounded ${action === 'add' ? 'bg-purple-600' : 'hover:bg-purple-600'}`}>Add Activity</button>
          <button onClick={() => setAction('delete')} className={`w-full text-left py-2 px-3 rounded ${action === 'delete' ? 'bg-purple-600' : 'hover:bg-purple-600'}`}>Delete Activity</button>
          <button onClick={() => setAction('edit')} className={`w-full text-left py-2 px-3 rounded ${action === 'edit' ? 'bg-purple-600' : 'hover:bg-purple-600'}`}>Edit Activity</button>
        </aside>

        {/* Form Area */}
        <section className="flex-1 bg-bgCard p-6 rounded-xl shadow-md">
          <h2 className="text-2xl font-bold mb-6 capitalize">{action} Activity</h2>

          <form className="space-y-4 max-w-xl">
            <div>
              <label className="block mb-1 text-sm">Activity Name</label>
              <input type="text" className="w-full bg-[#303043] text-white border border-gray-600 rounded-md px-4 py-2 placeholder-gray-400" placeholder="e.g., Gym Session" />
            </div>

            <div>
              <label className="block mb-1 text-sm">Day</label>
              <select className="w-full bg-[#303043] text-white border border-gray-600 rounded-md px-4 py-2">
                <option>Sunday</option>
                <option>Monday</option>
                <option>Tuesday</option>
                <option>Wednesday</option>
                <option>Thursday</option>
              </select>
            </div>

            <div>
              <label className="block mb-1 text-sm">Start Time</label>
              <input type="time" className="w-full bg-[#303043] text-white border border-gray-600 rounded-md px-4 py-2" />
            </div>

            <div>
              <label className="block mb-1 text-sm">End Time</label>
              <input type="time" className="w-full bg-[#303043] text-white border border-gray-600 rounded-md px-4 py-2" />
            </div>

            <div className="pt-4">
              <button type="submit" className="bg-purple-600 hover:bg-purple-700 px-6 py-2 rounded text-white font-semibold">Save</button>
            </div>
          </form>
        </section>
      </div>
    </div>
  );
}
