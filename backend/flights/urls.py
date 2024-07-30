
from django.urls import path
from . import views

urlpatterns = [
    path('flight/<str:flight_number>/', views.get_flight_by_number, name='get_flight_by_number'),
    path('flight/status/update/', views.update_flight_status, name='update_flight_status'),
    path('user/', views.post_user_details, name='post_user_details'),
]
