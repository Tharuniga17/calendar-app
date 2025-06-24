import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

const HomePage = () => {
  const [events, setEvents] = useState([]);
  const [todayEvents, setTodayEvents] = useState([]);
  const [upcomingEvents, setUpcomingEvents] = useState([]);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await fetch('http://localhost:5000/events');
        const data = await response.json();
        setEvents(data);

        const today = new Date().toISOString().split('T')[0];

        const todayList = data.filter(event =>
          new Date(event.start).toISOString().split('T')[0] === today
        );

        const upcomingList = data
          .filter(event =>
            new Date(event.start).toISOString().split('T')[0] > today
          )
          .sort((a, b) => new Date(a.start) - new Date(b.start))
          .slice(0, 3);

        setTodayEvents(todayList);
        setUpcomingEvents(upcomingList);
      } catch (err) {
        console.error('Error fetching events:', err);
      }
    };

    fetchEvents();
  }, []);

  const formatDateTime = (isoString) =>
    new Date(isoString).toLocaleString('en-GB', {
      dateStyle: 'medium',
      timeStyle: 'short',
    });

  const stats = [
    { title: "Today's Events", count: todayEvents.length, color: 'bg-yellow-200' },
    { title: 'Upcoming Events', count: upcomingEvents.length, color: 'bg-purple-200' },
    { title: 'Total Events', count: events.length, color: 'bg-pink-200' },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-100 to-white p-6">
      {/* Heading */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-center mb-8"
      >
        <h1 className="text-4xl font-bold text-purple-700 drop-shadow-md">
          Welcome to My Calendar 👋
        </h1>
        <p className="italic text-lg text-slate-600 mt-4">
  “Every day is a fresh page in your story, write something amazing”
</p>

      </motion.div>

      {/* Stats */}
      <div className="grid md:grid-cols-3 gap-6 max-w-6xl mx-auto mb-10">
        {stats.map((stat, i) => (
          <motion.div
            key={i}
            className={`rounded-2xl p-6 ${stat.color} shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-300 border-b-4 border-purple-400`}
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: i * 0.3 }}
          >
            <h2 className="text-xl font-semibold text-gray-700">{stat.title}</h2>
            <p className="text-4xl font-bold text-purple-600 mt-2">{stat.count}</p>
          </motion.div>
        ))}
      </div>

      {/* Upcoming Events */}
      <div className="max-w-5xl mx-auto">
        <h3 className="text-2xl font-bold text-purple-700 mb-4">Upcoming Events</h3>
        <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-6">
          {upcomingEvents.map((event, index) => (
            <motion.div
              key={event.id}
              className="bg-white p-4 rounded-xl shadow-md hover:shadow-xl transition-all border-l-4 border-purple-400"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.3 }}
              whileHover={{ scale: 1.03 }}
            >
              <h4 className="font-semibold text-lg text-gray-800">{event.title}</h4>
              <p className="text-sm text-gray-600">{formatDateTime(event.start)}</p>
              <span className="inline-block mt-2 px-3 py-1 text-sm bg-purple-100 text-purple-700 rounded-full">
                {event.category}
              </span>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default HomePage;

