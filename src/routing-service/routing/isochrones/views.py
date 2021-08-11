import openrouteservice
from django.shortcuts import render
from openrouteservice.directions import deprecation
from django.conf import settings
from django.views import View
from django.http import HttpResponse, JsonResponse

# Create your views here.

class IsochroneView(View):
    def get(self, request, *args, **kwargs):
        print("request ", request)
        print("args ", *args)
        print("kwargs ", **kwargs)
        return HttpResponse("<h2>BOOz</h2>")
