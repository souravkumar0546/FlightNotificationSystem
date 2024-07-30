
import React, { useState } from 'react';
import { useParams,useNavigate } from 'react-router-dom';
import { saveNotificationSettings } from '../services/ApiService'; // Import the API service function

const NotificationSettings = () => {
  const navigate=useNavigate();
  const { flight_number } = useParams();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [preference, setPreference] = useState('both');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await saveNotificationSettings(name, email, phone, flight_number, preference);
      alert('Notification settings saved!');
      navigate('/')

    } catch (error) {
      console.error('Error saving notification settings', error);
    }
  };

  return (
    <div className="container mt-5">
      <h2>Notification Settings for Flight {flight_number}</h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label className="form-label">Name</label>
          <input 
            type="text" 
            className="form-control" 
            value={name} 
            onChange={(e) => setName(e.target.value)} 
          />
        </div>
        <div className="mb-3">
          <label className="form-label">Email</label>
          <input 
            type="email" 
            className="form-control" 
            value={email} 
            onChange={(e) => setEmail(e.target.value)} 
          />
        </div>
        <div className="mb-3">
          <label className="form-label">Phone</label>
          <input 
            type="text" 
            className="form-control" 
            value={phone} 
            onChange={(e) => setPhone(e.target.value)} 
          />
        </div>
        <div className="mb-3">
          <label className="form-label">Notification Preference</label>
          <div className="form-check">
            <input 
              type="radio" 
              className="form-check-input" 
              name="preference" 
              value="both" 
              checked={preference === 'both'} 
              onChange={() => setPreference('both')} 
            />
            <label className="form-check-label">Both Email and Phone</label>
          </div>
          <div className="form-check">
            <input 
              type="radio" 
              className="form-check-input" 
              name="preference" 
              value="email" 
              checked={preference === 'email'} 
              onChange={() => setPreference('email')} 
            />
            <label className="form-check-label">Email Only</label>
          </div>
          <div className="form-check">
            <input 
              type="radio" 
              className="form-check-input" 
              name="preference" 
              value="phone" 
              checked={preference === 'phone'} 
              onChange={() => setPreference('phone')} 
            />
            <label className="form-check-label">Phone Only</label>
          </div>
        </div>
        <button type="submit" className="btn btn-primary">Save Settings</button>
      </form>
    </div>
  );
};

export default NotificationSettings;
