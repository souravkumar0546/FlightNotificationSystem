// App.js
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import FlightSearch from './components/FlightSearch';
import NotificationSettings from './components/NotificationSettings';
import AdminFlightUpdate from './components/AdminFlightUpdate';
import 'bootstrap/dist/css/bootstrap.min.css';

const App = () => {
  return (
    <Router>
      <div>
        <Routes>
          <Route path="/" element={<FlightSearch />} />
          <Route path="/notifications/:flight_number" element={<NotificationSettings />} />
          <Route path="/admin" element={<AdminFlightUpdate />} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;
 