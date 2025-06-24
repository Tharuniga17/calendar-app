
import React, { useState } from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import Footer from './Footer';
import ReactCalendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import './cal.css'; // Custom calendar styles

const Layout = () => {
  const location = useLocation().pathname;
  const [date, setDate] = useState(new Date());

  // Set default or hardcoded email if login is removed
  const userEmail = 'tharunigam.22ece@kongu.edu      ';

  const avatarUrl = `https://api.dicebear.com/7.x/bottts/svg?seed=${encodeURIComponent(userEmail)}`;

  return (
    <div className="flex h-screen bg-gradient-to-br from-purple-100 via-white to-indigo-100">
      {/* Sidebar */}
      <aside className="w-80 bg-white/60 backdrop-blur-md border-r border-purple-100 p-6 rounded-r-3xl m-2 flex flex-col justify-between overflow-auto">
        <div>
          <h1 className="text-2xl font-extrabold text-purple-700 mb-8 drop-shadow-md tracking-wide">
            📅 Calendy
          </h1>

          {/* Navigation */}
          <ul className="space-y-4">
            {[
              { to: '/home', label: '🏠 Home' },
              { to: '/home/events', label: '⏰ Calendar' },
              { to: '/home/booked', label: '📦 Booked Events' },
            ].map((item) => (
              <li key={item.to}>
                <Link
                  to={item.to}
                  className={`block px-4 py-2 rounded-xl font-medium shadow-inner transition-all duration-200 ${
                    location === item.to
                      ? 'bg-purple-600 text-white shadow-lg scale-105'
                      : 'text-purple-700 hover:bg-purple-200/50 hover:shadow-md hover:scale-[1.03]'
                  }`}
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>

          {/* Calendar */}
          <div className="mt-10 p-4 bg-white rounded-2xl">
            <ReactCalendar
              value={date}
              onChange={setDate}
              className="cute-calendar"
              tileClassName={({ date, view }) => {
                if (view === 'month' && date.getDate() === 24) {
                  return 'highlight-date';
                }
                return null;
              }}
            />
          </div>
        </div>

        {/* Bottom: Avatar */}
        <div className="space-y-4 mt-10">
          <div className="flex items-center space-x-3 p-3 rounded-xl bg-purple-50">
            <img
              src={avatarUrl}
              alt="User Avatar"
              className="w-10 h-10 rounded-full object-cover bg-white"
            />
            <div className="text-sm">
              <div className="font-semibold text-gray-800">User</div>
              <div className="text-gray-500 text-xs">{userEmail}</div>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex flex-col flex-1 m-4 rounded-3xl bg-white shadow-2xl overflow-auto">
        <main className="flex-1 p-6">
          <Outlet />
        </main>
        <div className="border-t border-gray-200 p-4 bg-white rounded-b-3xl">
          <Footer />
        </div>
      </div>
    </div>
  );
};

export default Layout;
