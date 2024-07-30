
import mongoengine as me

class Flight(me.Document):
    flight_number = me.StringField(max_length=10, unique=True, required=True)
    status = me.StringField(max_length=20, required=True)
    gate = me.StringField(max_length=10, required=True)

    def __str__(self):
        return self.flight_number

class User(me.Document):
    name = me.StringField(max_length=100, required=True)
    email = me.EmailField(required=True)
    phone = me.StringField(max_length=15, required=True)
    flight = me.ReferenceField(Flight, required=True)
    preference = me.StringField(
        max_length=10,
        choices=['email', 'phone', 'both'],
        required=True
    )

    def __str__(self):
        return f"{self.name} - {self.flight.flight_number}"
