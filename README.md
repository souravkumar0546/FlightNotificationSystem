# Flight Status Notification System

This project provides a flight status notification system with a React frontend and a Django backend. It uses Kafka for messaging and MongoDB for storing flight data.

## Table of Contents

- [Installation](#installation)
- [Frontend Setup](#frontend-setup)
- [Backend Setup](#backend-setup)
- [Database Setup](#database-setup)
- [Kafka Setup](#kafka-setup)
- [Running the Application](#running-the-application)
- [Adding Mock Data](#adding-mock-data)
- [Usage](#usage)

## Installation

Follow these steps to set up the project locally:

### Prerequisites

- Node.js and npm
- Python 3.8+
- MongoDB
- Kafka
- Kafka Python client library
- Django
- Confluent Kafka Python library
- Twilio account for SMS notifications

### Frontend Setup

1. **Navigate to the frontend directory**:
   ```bash
   cd frontend
   ```
2. **Install dependencies**:
   ```bash
   npm install
   ```
3. **Start the development server**:
   ```bash
   npm start
   ```
  The frontend will be available at http://localhost:3000.
  
### Backend Setup

1. **Navigate to the backend directory**:
   ```bash
   cd backend
   ```
2. **Install dependencies**:
   ```bash
   pip install -r requirements.txt
   ```
3. **Set up environment variables**:
   Create a .env file in the backend directory with the following content:
   ```env
   DJANGO_SECRET_KEY=your_secret_key_here
   ALLOWED_HOSTS=localhost
  
   DATABASE_URL=mongodb://localhost:27017/yourdatabase
  
   KAFKA_BOOTSTRAP_SERVERS=localhost:9092
   KAFKA_TOPIC=flight_status_updates
  
   EMAIL_HOST=smtp.example.com
   EMAIL_PORT=587
   EMAIL_HOST_USER=your_email@example.com
   EMAIL_HOST_PASSWORD=your_email_password
  
   TWILIO_ACCOUNT_SID=your_twilio_account_sid
   TWILIO_AUTH_TOKEN=your_twilio_auth_token
   TWILIO_PHONE_NUMBER=your_twilio_phone_number
   ```
   
### Database Setup

1. **Install MongoDB**:
   Follow the [MongoDB installation guide](https://docs.mongodb.com/manual/installation/) for your operating system.

2. **Start the MongoDB server**:
   ```bash
   mongosh
   ```
   Ensure MongoDB is running on mongodb://localhost:27017.

### Kafka Setup

1. **Install Kafka**:
   Follow the [Kafka installation guide](https://kafka.apache.org/quickstart) for your operating system.

2. **Start Zookeeper**:
   ```bash
   .\bin\windows\zookeeper-server-start.bat .\config\zookeeper.properties
   ```
3. **Start Kafka**:
   ```bash
   .\bin\windows\kafka-server-start.bat .\config\server.properties
   ```
4. **Create a Kafka topic**:
   ```bash
   kafka-topics.sh --create --topic flight_updates --bootstrap-server localhost:9092 --partitions 1 --replication-factor 1
   ```
   
### Running the Application

1. **Start the backend server**:
   ```bash
   python manage.py runserver
   ```
   The backend will be available at http://localhost:8000.
   
2. **Start the frontend server** (if not already running):
   ```bash
   npm start
   ```
   The frontend will be available at http://localhost:3000.
   
4. **Start the Kafka consumer**:
   Run your Kafka consumer script
   ```bash
   pyhton consumer.py
   ```
   
### Adding Mock Data

To manually add mock data to the flight document:

1. **Open MongoDB Shell**: Connect to your MongoDB instance using the MongoDB shell or a GUI tool like MongoDB Compass.

2. **Select the Database**:
   ```bash
   use yourdatabase
   ```
3. **Insert Mock Data**:
   ```bash
   db.flights.insertMany([
   { flight_number: '6E123', status: 'On Time', gate: 'A1' },
   { flight_number: '6E456', status: 'Delayed', gate: 'B2' },
   { flight_number: '6E789', status: 'Cancelled', gate: 'C3' }
   ]) 
   ```
   
## Usage

### Search Flights and Set Notifications

1. **Search for a Flight**:
   - Go to the local site and use the search feature to find a flight by its ID.

2. **Set Notification Preferences**:
   - Once you have found the flight, set your notification preferences for that flight. You can choose to receive notifications via email, SMS, or both, based on your preference.
   - Submit your subscription preferences to register for notifications related to the selected flight.

3. **Receive Notifications**:
   - If the admin updates the status of the flight, you will receive notifications based on your selected preferences (email, SMS, or both).
   - Ensure that the Kafka consumer is running to process and send these notifications.

4. **Verify Notification Settings**:
   - Check your email or SMS to verify that notifications are being received as expected when the flight status changes.










