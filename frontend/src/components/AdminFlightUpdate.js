import React, { useState } from 'react';
import { getFlightDetails, updateFlightDetails } from '../services/ApiService'; // Import the API service functions

const AdminFlightUpdate = () => {
  const [flightNumber, setFlightNumber] = useState('');
  const [flightDetails, setFlightDetails] = useState(null);
  const [status, setStatus] = useState('');

  const handleSearch = async () => {
    try {
      const data = await getFlightDetails(flightNumber);
      setFlightDetails(data);
      setStatus(data.status);
    } catch (error) {
      console.error('Error fetching flight details', error);
    }
  };

  const handleUpdate = async () => {
    try {
      await updateFlightDetails(flightNumber, status);
      alert('Flight status updated!');
    } catch (error) {
      console.error('Error updating flight status', error);
    }
  };

  return (
    <div className="container mt-5">
      <h2>Admin Flight Update</h2>
      <div className="mb-3">
        <input 
          type="text" 
          className="form-control" 
          placeholder="Enter Flight Number" 
          value={flightNumber} 
          onChange={(e) => setFlightNumber(e.target.value)} 
        />
        <button className="btn btn-primary mt-2" onClick={handleSearch}>
          Search
        </button>
      </div>

      {flightDetails && (
        <div className="card mt-4">
          <div className="card-body">
            <h5 className="card-title">Flight Details</h5>
            <p className="card-text"><strong>Flight Number:</strong> {flightDetails.flight_number}</p>
            <div className="mb-3">
              <label className="form-label">Status</label>
              <input 
                type="text" 
                className="form-control" 
                value={status} 
                onChange={(e) => setStatus(e.target.value)} 
              />
            </div>
            <button className="btn btn-primary" onClick={handleUpdate}>
              Update Flight
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminFlightUpdate;
