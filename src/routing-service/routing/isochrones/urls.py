from django.contrib import admin
from django.urls import path, include
from .views import IsochroneView

urlpatterns = [
    path("get/", IsochroneView.as_view(), name="Isochrone_view")
]
