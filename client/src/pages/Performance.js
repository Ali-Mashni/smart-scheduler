import React from 'react';
import { Link } from 'react-router-dom';
import TopBar from '../components/TopBar';
import TopBarButton from '../components/TopBarButton';

export default function PerformancePage() {
  return (
    <div className="min-h-screen bg-bgMain text-white font-sans">
      {/* Header */}
        <TopBar>  
            <TopBarButton to="/activityManagement">Activity Management</TopBarButton>
            <TopBarButton to="/schedule" >Schedule</TopBarButton>
            <TopBarButton to="/performance" active>Performance</TopBarButton>
        </TopBar>   

      {/* Dashboard Content */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Grades Chart */}
        <div className="bg-bgCard p-6 rounded-xl shadow-md">
          <h2 className="text-lg font-semibold mb-1">Short tasks grades</h2>
          <p className="text-green-400 text-sm mb-2">↑ 2% vs last week</p>
          <div className="h-40 bg-[#1e1e2f] rounded flex items-center justify-center text-gray-400">
            Grades Bar Chart (placeholder)
          </div>
        </div>

        {/* Time per Subject Pie */}
        <div className="bg-bgCard p-6 rounded-xl shadow-md">
          <h2 className="text-lg font-semibold mb-1">Percentage of time per subject</h2>
          <p className="text-sm text-gray-400 mb-4">From 1-14 Dec, 2020</p>
          <div className="h-40 bg-[#1e1e2f] rounded flex items-center justify-center text-gray-400">
            Pie Chart (placeholder)
          </div>
        </div>

        {/* Subject Percentages + Important Events */}
        <div className="bg-bgCard p-6 rounded-xl shadow-md flex flex-col lg:flex-row gap-6">
          <div className="flex-1">
            <h2 className="text-lg font-semibold mb-4">Your Total % in each subject</h2>
            <div className="flex justify-around">
              <div className="w-20 h-20 rounded-full bg-purple-700 flex items-center justify-center text-white text-sm">92%<br />SWE</div>
              <div className="w-24 h-24 rounded-full bg-cyan-500 flex items-center justify-center text-white text-sm">95%<br />ICS</div>
              <div className="w-20 h-20 rounded-full bg-indigo-500 flex items-center justify-center text-white text-sm">85%<br />Math</div>
            </div>
          </div>

          <div className="flex-1">
            <h2 className="text-lg font-semibold mb-4">Most important events</h2>
            <ul className="space-y-2 text-sm text-gray-300">
              <li className="flex justify-between border-b border-gray-600 pb-1">Math major B <span>25 Feb</span></li>
              <li className="flex justify-between border-b border-gray-600 pb-1">SWE exam <span>12 Mar</span></li>
              <li className="flex justify-between border-b border-gray-600 pb-1">ICS project phase I <span>15 Apr</span></li>
            </ul>
          </div>
        </div>

        {/* Weekly Study Hours */}
        <div className="bg-bgCard p-6 rounded-xl shadow-md">
          <h2 className="text-lg font-semibold mb-1">Weekly Study Hours</h2>
          <p className="text-red-400 text-sm mb-2">↓ 2% vs last week</p>
          <p className="text-xl font-bold text-white mb-2">12 hours</p>
          <div className="h-40 bg-[#1e1e2f] rounded flex items-center justify-center text-gray-400">
            Line Chart (placeholder)
          </div>
        </div>
      </div>
    </div>
  );
}
