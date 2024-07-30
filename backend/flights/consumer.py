import os
import sys
import django
from confluent_kafka import Consumer, KafkaError
from twilio.rest import Client
import smtplib
import json
from dotenv import load_dotenv

# Load environment variables from .env file
load_dotenv()

# Add the project directory to the system path
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

# Set up Django environment
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'backend.settings')
django.setup()

# Now you can import your models
from flights.models import User, Flight

# Kafka consumer configuration
consumer_conf = {
    'bootstrap.servers': os.getenv('KAFKA_BOOTSTRAP_SERVERS'),
    'group.id': 'notification_group',
    'auto.offset.reset': 'earliest'
}
consumer = Consumer(consumer_conf)
consumer.subscribe(['flight_updates'])

# Twilio configuration
TWILIO_ACCOUNT_SID = os.getenv('TWILIO_ACCOUNT_SID')
TWILIO_AUTH_TOKEN = os.getenv('TWILIO_AUTH_TOKEN')
TWILIO_PHONE_NUMBER = os.getenv('TWILIO_PHONE_NUMBER')
client = Client(TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN)

# Email configuration
SMTP_SERVER = os.getenv('SMTP_SERVER')
SMTP_PORT = int(os.getenv('SMTP_PORT'))
SMTP_USERNAME = os.getenv('SMTP_USERNAME')
SMTP_PASSWORD = os.getenv('SMTP_PASSWORD')
FROM_EMAIL = os.getenv('FROM_EMAIL')

def send_sms(to, body):
    client.messages.create(
        body=body,
        from_=TWILIO_PHONE_NUMBER,
        to=to
    )

def send_email(to, subject, body):
    with smtplib.SMTP(SMTP_SERVER, SMTP_PORT) as server:
        server.starttls()
        server.login(SMTP_USERNAME, SMTP_PASSWORD)
        message = f'Subject: {subject}\n\n{body}'
        server.sendmail(FROM_EMAIL, to, message)

def process_message(message):
    data = json.loads(message)
    flight_number = data['flight_number']
    status = data['status']

    try:
        flight = Flight.objects.get(flight_number=flight_number)
    except Flight.DoesNotExist:
        print(f"Flight {flight_number} does not exist.")
        return

    users = User.objects.filter(flight=flight.id)
    for user in users:
        if user.preference == 'email':
            send_email(user.email, f'Flight {flight_number} Status Update', f'The status of flight {flight_number} is now {status}.')
        elif user.preference == 'sms':
            send_sms(user.phone, f'The status of flight {flight_number} is now {status}.')
        elif user.preference == 'both':
            send_email(user.email, f'Flight {flight_number} Status Update', f'The status of flight {flight_number} is now {status}.')
            send_sms(user.phone, f'The status of flight {flight_number} is now {status}.')

while True:
    msg = consumer.poll(1.0)
    if msg is None:
        continue
    if msg.error():
        if msg.error().code() == KafkaError._PARTITION_EOF:
            continue
        else:
            print(msg.error())
            break
    process_message(msg.value().decode('utf-8'))

consumer.close()
