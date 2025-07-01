import React, { useState, useEffect, Fragment } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { Calendar as BigCalendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
import axios from 'axios';
import Confetti from 'react-confetti';
import { useWindowSize } from '@react-hook/window-size';
import 'react-big-calendar/lib/css/react-big-calendar.css';

const localizer = momentLocalizer(moment);

// Category colors
const categoryColorVariants = {
  'Birthday Party': ['#ff6b6b', '#ff922b', '#f783ac'],
  'Important Event': ['#ffd43b', '#94d82d', '#ffa94d'],
  'Regular Class': ['#5c7cfa', '#15aabf', '#4dabf7'],
  'Workshop': ['#63e6be', '#ffe066', '#f06595'],
  'Others': ['#9775fa', '#d0bfff', '#ff8787'],
};

// ✅ Default Static Events
const defaultEvents = [
  {
  id: 1001,
  title: '📘 Weekly Coding Class',
  start: new Date(2025, 6, 28, 9, 30),
  end: new Date(2025, 6, 28, 11, 0),
  category: 'Regular Class',
},
{
  id: 1002,
  title: '🎂 Riya\'s Birthday',
  start: new Date(2025, 6, 29, 0, 0),
  end: new Date(2025, 6, 29, 23, 59),
  category: 'Birthday Party',
},
{
  id: 1003,
  title: '🛠️ AI Workshop',
  start: new Date(2025, 6, 8, 13, 0),
  end: new Date(2025, 6, 8, 16, 30),
  category: 'Workshop',
},
{
  id: 1004,
  title: '⭐ Team Review Meeting',
  start: new Date(2025, 6, 18, 15, 0),
  end: new Date(2025, 6, 18, 16, 0),
  category: 'Important Event',
},
{
  id: 1005,
  title: '📁 Budget Planning',
  start: new Date(2025, 6, 3, 10, 0),
  end: new Date(2025, 6, 3, 11, 0),
  category: 'Others',
},

  {
    id: 1006,
    title: '🎉 Welcome Party',
    start: new Date(2025, 6, 1, 18, 0),
    end: new Date(2025, 6,1, 20, 0),
    category: 'Birthday Party',
  },
  {
    id: 1007,
    title: '🚀 Project Kickoff',
    start: new Date(2025, 5, 5, 10, 30),
    end: new Date(2025, 5, 5, 12, 0),
    category: 'Important Event',
  },
  {
    id: 1008,
    title: '📚 React Workshop',
    start: new Date(2025, 5, 7, 14, 0),
    end: new Date(2025, 5, 7, 16, 0),
    category: 'Workshop',
  },
  {
    id: 1009,
    title: '📚 React Workshop',
    start: new Date(2025, 6, 7, 14, 0),
    end: new Date(2025, 6, 7, 16, 0),
    category: 'Workshop',
  },
];
const getColorForEvent = (event, allEvents) => {
  const sameCategoryEvents = allEvents.filter(e => e.category === event.category);
  const index = sameCategoryEvents.findIndex(e => e.id === event.id);
  const colorList = categoryColorVariants[event.category] || ['#9ca3af'];
  return colorList[index % colorList.length];
};

const EventsPage = () => {
  const [events, setEvents] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    date: '',
    startTime: '',
    endTime: '',
    category: '',
  });

  const [showConfetti, setShowConfetti] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [width, height] = useWindowSize();

  const [currentDate, setCurrentDate] = useState(() => {
    const saved = sessionStorage.getItem('calendarDate');
    return saved ? new Date(saved) : new Date();
  });

  const [currentView, setCurrentView] = useState(() => {
    return sessionStorage.getItem('calendarView') || 'month';
  });

  const fetchEvents = async () => {
    try {
      const res = await axios.get('https://calendar-app-3-im0n.onrender.com/events');
      const formatted = res.data.map(event => ({
        ...event,
        start: new Date(event.start),
        end: new Date(event.end),
      }));
      console.log("Fetched Events:", formatted);
      setEvents([...defaultEvents, ...formatted]); // ✅ Merge with static defaults
    } catch (err) {
      console.error('Error fetching events:', err);
      setEvents(defaultEvents); // ✅ Fallback to static only
    }
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  const openModal = () => setIsOpen(true);
  const closeModal = () => {
    setIsOpen(false);
    setFormData({
      title: '',
      date: '',
      startTime: '',
      endTime: '',
      category: '',
    });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { title, date, startTime, endTime, category } = formData;

    const start = new Date(`${date}T${startTime || '09:00'}:00`);
    const end = new Date(`${date}T${endTime || '10:00'}:00`);

    const newEvent = {
      id: Date.now(),
      title,
      start,
      end,
      category,
    };

    try {
      await axios.post('https://calendar-app-3-im0n.onrender.com/events', newEvent);
      await fetchEvents();
      closeModal();
      setShowSuccess(true);
      setShowConfetti(true);
      setTimeout(() => {
        setShowSuccess(false);
        setShowConfetti(false);
      }, 4500);
    } catch (error) {
      console.error('Error saving event:', error);
    }
  };

  return (
    <div className="p-4 bg-gradient-to-br from-purple-50 to-white min-h-screen relative">
      <h2 className="text-4xl font-bold mb-6 text-purple-700 drop-shadow-md">📅 Calendy</h2>

      {showConfetti && <Confetti width={width} height={height} />}

      {showSuccess && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-30">
          <div className="bg-white rounded-lg shadow-xl p-6 text-center border-2 border-green-500 max-w-md">
            <h2 className="text-2xl font-bold text-green-600">🎉 Event Saved!</h2>
            <p className="mt-2 text-gray-700">Your event has been successfully added.</p>
            <button
              onClick={() => setShowSuccess(false)}
              className="mt-4 px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
            >
              Close
            </button>
          </div>
        </div>
      )}

      <div className="bg-white rounded-xl shadow-2xl p-4 transition-all duration-300 hover:scale-[1.01] hover:shadow-purple-300" style={{ height: '80vh' }}>
        <BigCalendar
          localizer={localizer}
          events={events}
          startAccessor="start"
          endAccessor="end"
          views={['month', 'week', 'day']}
          view={currentView}
          date={currentDate}
          onView={(view) => {
            sessionStorage.setItem('calendarView', view);
            setCurrentView(view);
          }}
          onNavigate={(date) => {
            sessionStorage.setItem('calendarDate', date.toISOString());
            setCurrentDate(date);
          }}
          toolbar={true}
          style={{ height: '100%' }}
          eventPropGetter={(event) => ({
            style: {
              backgroundColor: getColorForEvent(event, events),
              color: 'white',
              borderRadius: '8px',
              padding: '4px',
              boxShadow: '2px 2px 10px rgba(0,0,0,0.15)',
            },
          })}
        />
      </div>

      <button
        onClick={openModal}
        className="fixed bottom-6 right-6 bg-gradient-to-r from-purple-500 to-indigo-500 hover:from-purple-600 hover:to-indigo-600 text-white px-6 py-3 rounded-full shadow-lg text-lg transform hover:scale-105 transition-all"
      >
        + Add Event
      </button>

      {/* Modal */}
      <Transition appear show={isOpen} as={Fragment}>
        <Dialog as="div" className="relative z-10" onClose={closeModal}>
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-black bg-opacity-30" />
          </Transition.Child>

          <div className="fixed inset-0 overflow-y-auto">
            <div className="flex min-h-full items-center justify-center p-4">
              <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 shadow-xl transition-all">
                <Dialog.Title className="text-xl font-semibold text-purple-700 mb-4">Add New Event</Dialog.Title>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <input
                    type="text"
                    name="title"
                    placeholder="Event Title"
                    value={formData.title}
                    onChange={handleInputChange}
                    className="w-full p-2 border border-purple-300 rounded focus:outline-none focus:ring-2 focus:ring-purple-400"
                    required
                  />
                  <input
                    type="date"
                    name="date"
                    value={formData.date}
                    onChange={handleInputChange}
                    className="w-full p-2 border border-purple-300 rounded"
                    required
                  />
                  <div className="flex gap-2">
                    <input
                      type="time"
                      name="startTime"
                      value={formData.startTime}
                      onChange={handleInputChange}
                      className="w-full p-2 border border-purple-300 rounded"
                    />
                    <input
                      type="time"
                      name="endTime"
                      value={formData.endTime}
                      onChange={handleInputChange}
                      className="w-full p-2 border border-purple-300 rounded"
                    />
                  </div>
                  <select
                    name="category"
                    value={formData.category}
                    onChange={handleInputChange}
                    className="w-full p-2 border border-purple-300 rounded"
                    required
                  >
                    <option value="">Select Category</option>
                    <option value="Birthday Party">🎂 Birthday Party</option>
                    <option value="Important Event">⭐ Important Event</option>
                    <option value="Regular Class">📘 Regular Class</option>
                    <option value="Workshop">🛠️ Workshop</option>
                    <option value="Others">📁 Others</option>
                  </select>
                  <button
                    type="submit"
                    className="w-full bg-purple-600 text-white p-2 rounded hover:bg-purple-700"
                  >
                    Save Event
                  </button>
                </form>
              </Dialog.Panel>
            </div>
          </div>
        </Dialog>
      </Transition>
    </div>
  );
};

export default EventsPage;
