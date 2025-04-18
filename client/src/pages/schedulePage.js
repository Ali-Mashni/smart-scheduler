import React from 'react';
import { Link } from 'react-router-dom';

import TopBar from '../components/TopBar';
import TopBarButton from '../components/TopBarButton';

export default function StudentSchedulePage() {
  return (
    <div className="min-h-screen bg-bgMain text-white font-sans">
      {/* Navbar */}
        <TopBar>
            <TopBarButton to="/activityManagement">Activity Management</TopBarButton>
            <TopBarButton to="/schedule" active>Schedule</TopBarButton>
            <TopBarButton to="/performance" >Performance</TopBarButton>
        </TopBar>

      {/* Main Content */}
      <main className="grid grid-cols-1 md:grid-cols-2 gap-6 p-8">
        {/* Schedule Section */}
        <section className="bg-bgCard p-6 rounded-xl shadow-md">
          <h2 className="text-2xl font-bold mb-4">Schedule</h2>
          {/* Weekly Schedule Grid */}
          <div className="grid grid-cols-5 gap-2 text-sm text-gray-200">
            {/* Replace with dynamic content later */}
            <div className="col-span-5 grid grid-rows-10 gap-px">
              <div className="bg-purple-600 rounded p-2">ICS101 - Mon 10:00</div>
              <div className="bg-teal-600 rounded p-2">MATH241 - Tue 12:00</div>
              <div className="bg-pink-600 rounded p-2">SWE363 - Wed 08:00</div>
              <div className="bg-indigo-600 rounded p-2">PHYS101 - Thu 14:00</div>
            </div>
          </div>
        </section>

        {/* Today's Tasks Section */}
        <section className="bg-bgCard p-6 rounded-xl shadow-md">
          <h2 className="text-2xl font-bold mb-4">Today's Tasks</h2>
          <ul className="space-y-3">
            <li className="bg-[#303043] p-3 rounded-md border-l-4 border-purple-500">Finish SWE Homework</li>
            <li className="bg-[#303043] p-3 rounded-md border-l-4 border-teal-400">Attend ICS Lecture</li>
            <li className="bg-[#303043] p-3 rounded-md border-l-4 border-green-500">Go to the Gym</li>
            <li className="bg-[#303043] p-3 rounded-md border-l-4 border-blue-400">Read a Book</li>
          </ul>
        </section>
      </main>
    </div>
  );
}
