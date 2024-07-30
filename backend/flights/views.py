import json
import logging

from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.views.decorators.http import require_http_methods
from mongoengine import DoesNotExist, ValidationError
from flights.models import Flight, User
from confluent_kafka import Producer

logger = logging.getLogger(__name__)

# Kafka producer configuration
producer_conf = {
    'bootstrap.servers': 'localhost:9092'  # Replace with your Kafka server
}
producer = Producer(producer_conf)

@require_http_methods(["GET"])
def get_flight_by_number(request, flight_number):
    try:
        flight = Flight.objects.get(flight_number=flight_number)
        data = {
            'flight_number': flight.flight_number,
            'status': flight.status,
            'gate': flight.gate,
        }
        
        return JsonResponse(data)
    except DoesNotExist:
        return JsonResponse({'error': 'Flight not found'}, status=404)

@csrf_exempt
@require_http_methods(["PUT"])
def update_flight_status(request):
    try:
        body = json.loads(request.body)
        flight_number = body.get('flight_number')
        status = body.get('status')

        if not flight_number or not status:
            return JsonResponse({'error': 'Invalid data'}, status=400)

        flight = Flight.objects.get(flight_number=flight_number)
        flight.status = status
        flight.save()

         # Produce a Kafka message
        notification_data = json.dumps({'flight_number': flight_number, 'status': status})
        producer.produce('flight_updates', notification_data.encode('utf-8'))
        producer.flush()
        logger.info(f"Produced message to Kafka: {notification_data}")

        return JsonResponse({'message': 'Flight status updated'})
    except DoesNotExist:
        logger.error(f"Flight not found: {flight_number}")
        return JsonResponse({'error': 'Flight not found'}, status=404)


@csrf_exempt
@require_http_methods(["POST"])
def post_user_details(request):
    try:
        body = json.loads(request.body)
        logger.info(f"Received data: {body}")
        name = body.get('name')
        email = body.get('email')
        phone = body.get('phone')
        flight_number = body.get('flight_number')
        preference = body.get('preference')

        if not name or not email or not phone or not flight_number or not preference:
            return JsonResponse({'error': 'Invalid data'}, status=400)

        flight = Flight.objects.get(flight_number=flight_number)
        
        # Check if user is already subscribed to this flight
        existing_user = User.objects.filter(email=email, flight=flight).first()
        if existing_user:
            return JsonResponse({'error': 'You are already subscribed to this flight notification'}, status=400)
        
        user = User(name=name, email=email, phone=phone, flight=flight, preference=preference)
        user.save()
        return JsonResponse({'message': 'User details added'})
    except DoesNotExist:
        logger.error(f"Flight not found: {flight_number}")
        return JsonResponse({'error': 'Flight not found'}, status=404)
    except ValidationError as e:
        logger.error(f"Validation error: {str(e)}")
        return JsonResponse({'error': str(e)}, status=400)
