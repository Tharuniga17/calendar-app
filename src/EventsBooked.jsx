import React, { useEffect, useState, Fragment } from 'react';
import axios from 'axios';
import { Dialog, Transition } from '@headlessui/react';

const OrderBooked = () => {
  const [events, setEvents] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const [formData, setFormData] = useState({
    id: null,
    title: '',
    date: '',
    startTime: '',
    endTime: '',
    category: ''
  });
  const [deleteSuccess, setDeleteSuccess] = useState(false);

  // ✅ Fetch events from JSON server and merge with static defaults
  const fetchEvents = async () => {
    const defaultEvents = [
  {
  id: 1001,
  title: '📘 Weekly Coding Class',
  start: new Date(2025, 7, 28, 9, 30),
  end: new Date(2025, 7, 28, 11, 0),
  category: 'Regular Class',
},
{
  id: 1002,
  title: '🎂 Riya\'s Birthday',
  start: new Date(2025, 7, 29, 0, 0),
  end: new Date(2025, 7, 29, 23, 59),
  category: 'Birthday Party',
},
{
  id: 1003,
  title: '🛠️ AI Workshop',
  start: new Date(2025, 7, 8, 13, 0),
  end: new Date(2025, 7, 8, 16, 30),
  category: 'Workshop',
},
{
  id: 1004,
  title: '⭐ Team Review Meeting',
  start: new Date(2025, 7, 18, 15, 0),
  end: new Date(2025, 7, 18, 16, 0),
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
    id: 1001,
    title: '🎉 Welcome Party',
    start: new Date(2025, 6, 1, 18, 0),
    end: new Date(2025, 6,1, 20, 0),
    category: 'Birthday Party',
  },
  {
    id: 1006,
    title: '🚀 Project Kickoff',
    start: new Date(2025, 5, 5, 10, 30),
    end: new Date(2025, 5, 5, 12, 0),
    category: 'Important Event',
  },
  {
    id: 1007,
    title: '📚 React Workshop',
    start: new Date(2025, 5, 7, 14, 0),
    end: new Date(2025, 5, 7, 16, 0),
    category: 'Workshop',
  },
  {
    id: 1008,
    title: '📚 React Workshop',
    start: new Date(2025, 6, 7, 14, 0),
    end: new Date(2025, 6, 7, 16, 0),
    category: 'Workshop',
  },
];

    try {
      const res = await axios.get('https://calendar-app-3-im0n.onrender.com/events');
      setEvents([...staticEvents, ...res.data]);
    } catch (err) {
      console.error("Failed to fetch events", err);
      setEvents(staticEvents);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  const openModal = (event) => {
    const startDate = new Date(event.start);
    const endDate = new Date(event.end);
    setFormData({
      id: event.id,
      title: event.title,
      date: startDate.toISOString().slice(0, 10),
      startTime: startDate.toTimeString().slice(0, 5),
      endTime: endDate.toTimeString().slice(0, 5),
      category: event.category
    });
    setIsOpen(true);
  };

  const closeModal = () => {
    setFormData({ id: null, title: '', date: '', startTime: '', endTime: '', category: '' });
    setIsOpen(false);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    const { id, title, date, startTime, endTime, category } = formData;
    const updatedEvent = {
      id,
      title,
      start: new Date(`${date}T${startTime}`),
      end: new Date(`${date}T${endTime}`),
      category
    };

    try {
      await axios.put(`http://localhost:5000/events/${id}`, updatedEvent);
      fetchEvents();
      closeModal();
    } catch (err) {
      console.error("Failed to update event", err);
    }
  };

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this event?");
    if (!confirmDelete) return;

    try {
      await axios.delete(`http://localhost:5000/events/${id}`);
      setEvents(events.filter(e => e.id !== id));
      setDeleteSuccess(true);
      setTimeout(() => setDeleteSuccess(false), 3000);
    } catch (error) {
      console.error("Failed to delete event", error);
    }
  };

  const categoryBadge = (category) => {
    const colors = {
      'Birthday Party': 'bg-pink-200 text-pink-700',
      'Important Event': 'bg-yellow-200 text-yellow-700',
      'Regular Class': 'bg-blue-200 text-blue-700',
      'Workshop': 'bg-green-200 text-green-700',
      'Others': 'bg-purple-200 text-purple-700'
    };
    return (
      <span className={`inline-block text-xs px-2 py-1 rounded-full font-semibold ${colors[category] || 'bg-gray-200 text-gray-700'}`}>
        {category}
      </span>
    );
  };

  return (
    <div className="p-6 min-h-screen bg-gradient-to-br from-purple-50 to-white">
      <h2 className="text-3xl font-bold text-purple-800 mb-8 flex items-center gap-2">📅 Booked Events</h2>

      {deleteSuccess && (
        <div className="bg-green-100 text-green-700 border border-green-400 p-3 rounded mb-4">
          ✅ Event deleted successfully.
        </div>
      )}

      {events.length === 0 ? (
        <p className="text-gray-500">No events booked yet.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 animate-fadeIn">
          {events.map((event) => (
            <div
              key={event.id}
              className="bg-white rounded-xl shadow hover:shadow-xl transition-all border border-gray-100 p-5"
            >
              <h3 className="text-xl font-semibold text-gray-800">{event.title}</h3>
              <div className="mt-2">{categoryBadge(event.category)}</div>
              <p className="text-sm text-gray-500 mt-2">
                {new Date(event.start).toLocaleString()} →<br />
                {new Date(event.end).toLocaleString()}
              </p>

              <div className="flex justify-end gap-4 mt-4">
                <button
                  onClick={() => openModal(event)}
                  className="text-blue-600 font-medium hover:underline"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(event.id)}
                  className="text-red-600 font-medium hover:underline"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Edit Modal */}
      <Transition appear show={isOpen} as={Fragment}>
        <Dialog as="div" className="relative z-10" onClose={closeModal}>
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0 scale-95"
            enterTo="opacity-100 scale-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100 scale-100"
            leaveTo="opacity-0 scale-95"
          >
            <div className="fixed inset-0 bg-black bg-opacity-25" />
          </Transition.Child>

          <div className="fixed inset-0 overflow-y-auto">
            <div className="flex min-h-full items-center justify-center p-4">
              <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 shadow-xl transition-all">
                <Dialog.Title className="text-xl font-semibold text-purple-700">
                  ✏️ Edit Event
                </Dialog.Title>
                <form onSubmit={handleUpdate} className="space-y-4 mt-4">
                  <input
                    type="text"
                    name="title"
                    placeholder="Event Title"
                    value={formData.title}
                    onChange={handleInputChange}
                    className="w-full p-2 border rounded"
                    required
                  />
                  <input
                    type="date"
                    name="date"
                    value={formData.date}
                    onChange={handleInputChange}
                    className="w-full p-2 border rounded"
                    required
                  />
                  <input
                    type="time"
                    name="startTime"
                    value={formData.startTime}
                    onChange={handleInputChange}
                    className="w-full p-2 border rounded"
                    required
                  />
                  <input
                    type="time"
                    name="endTime"
                    value={formData.endTime}
                    onChange={handleInputChange}
                    className="w-full p-2 border rounded"
                    required
                  />
                  <select
                    name="category"
                    value={formData.category}
                    onChange={handleInputChange}
                    className="w-full p-2 border rounded"
                    required
                  >
                    <option value="">Select Category</option>
                    <option value="Birthday Party">🎂 Birthday Party</option>
                    <option value="Important Event">⭐ Important Event</option>
                    <option value="Regular Class">📚 Regular Class</option>
                    <option value="Workshop">🛠️ Workshop</option>
                    <option value="Others">📁 Others</option>
                  </select>
                  <button
                    type="submit"
                    className="w-full bg-purple-600 text-white p-2 rounded hover:bg-purple-700"
                  >
                    Update Event
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

export default OrderBooked;
