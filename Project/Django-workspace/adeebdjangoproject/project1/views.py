from django.shortcuts import render
from rest_framework.response import Response
from project1.serializers import UserSerializer
from models import User
from rest_framework import generics

# Create your views here.
class getAllUsers(generics.RetrieveAPIView):
    def get(self, request, *args, **kwargs):
        try:
            users = User.objects.filter(user_id=request.query_params["user_id"])
            user_serialized = UserSerializer(users, many=True)
            if user_serialized.data.__len__() == 0:
                raise Exception("No Users exists for user_id: "+request.query_params["user_id"])
            return Response(user_serialized.data, status=200)
        except Exception as e:
            print("An exception occured")
            return Response(e.args, status=400)
