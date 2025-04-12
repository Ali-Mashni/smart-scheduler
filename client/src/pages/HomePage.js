import React from 'react';
import { Link } from 'react-router-dom';
import TopBar from '../components/TopBar';
import TopBarButton from '../components/TopBarButton';

export default function HomePage() {
  return (
    <div className="min-h-screen bg-bgMain text-white flex flex-col">
      <TopBar>
        <TopBarButton to="/" active>Home</TopBarButton>
        <TopBarButton to="/login">Login</TopBarButton>
        <TopBarButton to="/signup">Signup</TopBarButton>
      </TopBar>

      <div className="flex-grow flex flex-col items-center justify-center px-6 py-20 text-center">
        <h1 className="text-4xl md:text-5xl font-bold mb-4">
          Welcome to <span className="text-accent">Smart Scheduler</span>
        </h1>
        <p className="text-lg text-gray-300 max-w-2xl mb-10">
          Plan smarter, track your academic progress, and achieve better work-life balance with intelligent scheduling and personalized tools.
        </p>

        {/* Feature Cards */}
        <div className="flex flex-wrap justify-center gap-6 mb-16">
          <FeatureCard
            title="📅 Timetable Builder"
            description="Easily create your weekly schedule with drag-and-drop simplicity."
          />
          <FeatureCard
            title="🧠 Adaptive Prioritization"
            description="Let the system guide your focus based on urgency, deadlines, and workload."
          />
          <FeatureCard
            title="📊 Progress Tracking"
            description="Visualize how you're doing with intuitive analytics and goal tracking."
          />
        </div>

        {/* How It Works */}
        <section className="max-w-4xl mx-auto mt-20 mb-20 px-6">
          <h2 className="text-2xl font-bold mb-6 text-white">How does Smart Scheduler work?</h2>
          <p className="text-gray-300 leading-relaxed space-y-4">
            Smart Scheduler helps you stay organized by allowing you to plan your weekly academic tasks in just a few steps. Start by creating your profile and defining when you're available. Add your subjects, assignments, deadlines, and study goals to build a clear picture of your workload.
            <br />
            The system intelligently generates a personalized schedule that adapts to your priorities, helping you focus on what matters most. As you complete tasks, the platform tracks your progress, giving you insights into your habits and performance so you can continuously improve.
            <br />
            Whether you're looking to beat procrastination, balance your study time, or simply stay on top of everything, Smart Scheduler makes academic planning easier and smarter.
          </p>
        </section>


        {/* Why Choose Us */}
        <section className="max-w-4xl mb-16 text-left">
          <h2 className="text-2xl font-bold mb-4">Why Choose Smart Scheduler?</h2>
          <p className="text-gray-300">
            Unlike generic calendar apps, Smart Scheduler is designed with students in mind. 
            From adaptive algorithms to focused learning metrics, we give you tools to study better—not just harder.
          </p>
        </section>

        {/* Call to Action */}
        <Link to="/signup">
          <button className="bg-primary hover:bg-primaryHover px-8 py-3 rounded-md text-white font-semibold text-lg transition">
            Create Your Schedule
          </button>
        </Link>
      </div>

      {/* Footer */}
      <footer className="text-center text-gray-500 text-sm py-6 border-t border-gray-700">
        © {new Date().getFullYear()} Smart Scheduler. All rights reserved.
      </footer>
    </div>
  );
}

// 🔹 Feature Card Component
function FeatureCard({ title, description }) {
  return (
    <div className="bg-bgCard p-6 rounded-xl w-72 text-left shadow-md">
      <h3 className="text-xl font-semibold mb-2">{title}</h3>
      <p className="text-sm text-gray-400">{description}</p>
    </div>
  );
}
