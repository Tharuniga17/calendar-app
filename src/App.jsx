import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './Layout';
import HomePage from './HomePage';
import EventsPage from './EventsPage';
import EventsBooked from './EventsBooked';

const App = () => {
  return (
    <Router>
      <Routes>
        {/* Redirect root to /home */}
        <Route path="/" element={<Navigate to="/home" />} />

        {/* Main layout and nested routes */}
        <Route path="/home" element={<Layout />}>
          <Route index element={<HomePage />} />
          <Route path="events" element={<EventsPage />} />
          <Route path="booked" element={<EventsBooked />} />
        </Route>
      </Routes>
    </Router>
  );
};

export default App;
