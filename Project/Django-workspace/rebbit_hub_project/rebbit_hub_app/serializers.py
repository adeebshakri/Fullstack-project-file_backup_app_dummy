from rest_framework import serializers
from rebbit_hub_app.models import User, FilesBackedup, Device, UserDetails, Version


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ('user_id','username','password')

class Files_backedupSerializer(serializers.ModelSerializer):
    class Meta:
        model = FilesBackedup
        fields = ('file_id','file_name','file_path','is_backedup','file_size','file_time','device','is_deleted')

class DeviceSerializer(serializers.ModelSerializer):
    class Meta:
        model = Device
        fields = ('user','device_id','device_name')

class UserDetailsSerializer(serializers.ModelSerializer):
    class Meta:
        model = UserDetails
        fields = ('user','subscription_id','subscription_name','subscripton_size_capacity','subscription_size_used','subscription_size_left','subscription_start_date','subscription_end_date')

class VersionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Version
        fields = ('version_id','file','file_name','file_path','is_backedup','version_size','version_time','device')