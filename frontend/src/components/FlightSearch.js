import React, { useState } from 'react';
import { getFlightDetails } from '../services/ApiService';

const FlightSearch = () => {
  const [flightNumber, setFlightNumber] = useState('');
  const [flightDetails, setFlightDetails] = useState(null);
  const [error, setError] = useState(null);

  const handleSearch = async () => {
    try {
      const data = await getFlightDetails(flightNumber);
      setFlightDetails(data);
      setError(null);
    } catch (error) {
      console.error('Error fetching flight details', error);
      setError('Failed to fetch flight details. Please try again.');
    }
  };

  return (
    <div className="container mt-5">
      <h2>Check Flight Status</h2>
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

      {error && (
        <div className="alert alert-danger">
          {error}
        </div>
      )}

      {flightDetails && (
        <div className="card mt-4">
          <div className="card-body">
            <h5 className="card-title">Flight Details</h5>
            <p className="card-text"><strong>Flight Number:</strong> {flightDetails.flight_number}</p>
            <p className="card-text"><strong>Gate:</strong> {flightDetails.gate}</p>
            <p className="card-text"><strong>Status:</strong> {flightDetails.status}</p>
            <a href={`/notifications/${flightDetails.flight_number}`} className="btn btn-success">Get Notifications for this Flight</a>
          </div>
        </div>
      )}
    </div>
  );
};

export default FlightSearch;
