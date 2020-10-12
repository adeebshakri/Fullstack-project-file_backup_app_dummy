from django.shortcuts import render
from rest_framework.response import Response
from rebbit_hub_app.serializers import UserSerializer, Files_backedupSerializer, DeviceSerializer, UserDetailsSerializer, VersionSerializer
from rebbit_hub_app.models import User, FilesBackedup,Device,UserDetails,Version
from rest_framework import generics
from django.db import connection, transaction
from django.http import JsonResponse



# Create your views here.

class getAllFiles(generics.RetrieveAPIView):
    def get(self,request, *args , **kwargs):
        try:
            cursor = connection.cursor()
            cursor.execute(
                "SELECT u.user_id , d.device_id, f.file_id,f.file_name, f.file_path,f.file_size,f.file_time ,f.is_backedup,f.is_deleted "
                "FROM rebbit_hub.user u , rebbit_hub.device d , rebbit_hub.files_backedup f "
                "WHERE u.user_id = d.user_id and d.device_id = f.device_id and f.is_deleted = 0 "
                "and u.user_id = {0} and d.device_id= {1};".format(request.userTokenPayload["user_id"],request.query_params["device_id"]))
            row = cursor.fetchall()
            if row == None:
                raise Exception("No files for this user_id:"+request.query_params["user_id"])
            print(row)
            cursor.close()
            return Response(row,status=200)
        except Exception as e:
            print("An exception occured: ",e)
            return Response(e.args, status=400)


class getAllDevices(generics.RetrieveAPIView):
    def get(self,request, *args , **kwargs):
        try:
            devices = Device.objects.filter(user_id=request.userTokenPayload["user_id"])
            devices_serialized = DeviceSerializer(devices, many=True)
            if devices_serialized.data == None:
                raise Exception("No device exist")
            return Response(devices_serialized.data,status=200)
        except Exception as e:
            print("An exception occured: ",e)
            return Response(e.args, status=400)

class getUserSubscriptionDetails(generics.RetrieveAPIView):
    def get(self,request, *args, **kwargs):
        try:
            subs = UserDetails.objects.filter(user_id=request.userTokenPayload["user_id"])
            subs_serialized = UserDetailsSerializer(subs, many=True)
            if subs_serialized.data.__len__() == 0:
                raise Exception("No Subscription by this user")
            return Response(subs_serialized.data,status=200)
        except Exception as e:
            print("An exception occured: ",e)
            return Response(e.args, status=400)

class getVersions(generics.RetrieveAPIView):
    def get(self, request , *args, **kwargs):
        try:
            version_obj = Version.objects.filter(file_id = request.query_params['file_id'])
            version_serialized = VersionSerializer(version_obj, many=True)
            if version_serialized.data.__len__() == 0:
                raise Exception("No version for this file")
            return  Response(version_serialized.data,status = 200)
        except Exception as e:
            print("An exception occured",e)
            return Response(e.args, status = 400)


class deleteFile(generics.RetrieveAPIView):
    def patch(self,request, *args , **kwargs):
        try:
            cursor = connection.cursor()
            cursor.execute(
                "UPDATE files_backedup SET is_deleted=1 WHERE file_id = {0};".format(request.query_params["file_id"]))
            row = cursor.fetchone()
            # if row.__len__() == 0:
            #     raise Exception("Cannot delete file id:"+request.query_params["file_id"])
            print(row)
            cursor.close()
            return Response(row,status=200)
        except Exception as e:
            print("An exception occured: ",e)
            return Response(e.args, status=400)

class restoreFile(generics.RetrieveAPIView):
    def patch(self,request, *args , **kwargs):
        try:
            cursor = connection.cursor()
            cursor.execute(
                "UPDATE files_backedup SET is_deleted=0 WHERE file_id = {0} AND is_deleted=1;".format(request.query_params["file_id"]))
            row = cursor.fetchone()
            print(row)
            cursor.close()
            return Response(row,status=200)
        except MySQLdb.Error as e:
            print("MySQL db error",e)
            return Response(e.args,status=400)
        except Exception as e:
            print("An exception occured: ",e)
            return Response(e.args, status=400)

class getAllDeletedFiles(generics.RetrieveAPIView):
    def get(self,request, *args , **kwargs):
        try:
            cursor = connection.cursor()
            cursor.execute(
                "SELECT f.file_id,f.file_name,f.file_path,f.file_size, f.device_id FROM rebbit_hub.device d , rebbit_hub.files_backedup f "
                "WHERE d.device_id = f.device_id and f.is_deleted = 1 and d.user_id = {0};".format(request.userTokenPayload["user_id"]))
            row = cursor.fetchall()
            if row == None:
                raise Exception("No files for this user_id:"+request.query_params["user_id"])
            print(row)
            cursor.close()
            return Response(row,status=200)
        except Exception as e:
            print("An exception occured: ",e)
            return Response(e.args, status=400)


class deleteFilePermanently(generics.RetrieveAPIView):
    def delete(self,request, *args , **kwargs):
        try:
            cursor = connection.cursor()
            cursor.execute(
                "DELETE FROM rebbit_hub.version WHERE file_id = {0};DELETE FROM rebbit_hub.files_backedup WHERE file_id = {0};".format(request.query_params["file_id"]))
            row = cursor.fetchall()
            # if row.__len__() == 0:
            #     raise Exception("Cannot delete file id:"+request.query_params["file_id"])
            print(row)
            cursor.close()
            return Response(row,status=200)
        except Exception as e:
            print("An exception occured: ",e)
            return Response(e.args, status=400)