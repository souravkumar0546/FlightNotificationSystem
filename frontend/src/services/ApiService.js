
import axios from 'axios';
const apiurl="http://localhost:8000"

export const getFlightDetails = async (flightNumber) => {
  try {
    const response = await axios.get(apiurl+`/api/flight/${flightNumber}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const updateFlightDetails = async (flight_number, status) => {
  try {
    await axios.put(apiurl+`/api/flight/status/update/`, {flight_number, status },
      {
        headers: {
          'Content-Type': 'application/json'
        }
      }
    );
  } catch (error) {
    throw error;
  }
};

export const saveNotificationSettings = async (name, email, phone, flight_number, preference) => {
  try {
    await axios.post(apiurl+'/api/user/', {
      name,
      email,
      phone,
      flight_number,
      preference,
    },
      {
      headers: {
        'Content-Type': 'application/json'
      }
    });
  } catch (error) {
    throw error;
  }
};