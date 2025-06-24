// Calendar.jsx
import React from 'react';
import { Calendar, momentLocalizer, Views } from 'react-big-calendar';
import moment from 'moment';
import 'react-big-calendar/lib/css/react-big-calendar.css';

const localizer = momentLocalizer(moment);

// ✅ Custom Toolbar for Month Navigation
const CustomToolbar = (toolbar) => {
  const goToBack = () => toolbar.onNavigate('PREV');
  const goToNext = () => toolbar.onNavigate('NEXT');
  const goToToday = () => toolbar.onNavigate('TODAY');

  const label = moment(toolbar.date).format('MMMM YYYY');

  return (
    <div className="flex justify-between items-center px-4 py-2 bg-white rounded shadow mb-2">
      <div className="flex items-center gap-2">
        <button onClick={goToBack} className="px-3 py-1 bg-purple-200 hover:bg-purple-300 rounded">←</button>
        <button onClick={goToToday} className="px-3 py-1 bg-purple-500 hover:bg-purple-600 text-white rounded">Today</button>
        <button onClick={goToNext} className="px-3 py-1 bg-purple-200 hover:bg-purple-300 rounded">→</button>
      </div>
      <div className="text-xl font-semibold text-purple-800">{label}</div>
    </div>
  );
};

const CalendarComponent = ({ events }) => {
  return (
    <div className="p-4 bg-gray-100 rounded shadow" style={{ height: 600 }}>
      <Calendar
        localizer={localizer}
        events={events}
        startAccessor="start"
        endAccessor="end"
        views={[Views.MONTH, Views.WEEK, Views.DAY]}
        defaultView={Views.MONTH}
        components={{ toolbar: CustomToolbar }}
        style={{ height: '100%' }}
        popup
      />
    </div>
  );
};

export default CalendarComponent;
