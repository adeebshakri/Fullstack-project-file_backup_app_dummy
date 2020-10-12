
# Create your models here.
# This is an auto-generated Django model module.
# You'll have to do the following manually to clean this up:
#   * Rearrange models' order
#   * Make sure each model has one field with primary_key=True
#   * Make sure each ForeignKey has `on_delete` set to the desired behavior.
#   * Remove `managed = False` lines if you wish to allow Django to create, modify, and delete the table
# Feel free to rename the models, but don't rename db_table values or field names.
from django.db import models



class Device(models.Model):
    user = models.ForeignKey('User', models.DO_NOTHING, blank=True, null=True)
    device_id = models.AutoField(primary_key=True)
    device_name = models.CharField(max_length=50, blank=True, null=False)

    class Meta:
        managed = False
        db_table = 'device'



class FilesBackedup(models.Model):
    file_id = models.AutoField(primary_key=True)
    file_name = models.CharField(max_length=50, blank=True, null=True)
    file_path = models.CharField(max_length=150, blank=True, null=True)
    is_backedup = models.TextField(blank=True, null=True)  # This field type is a guess.
    file_size = models.FloatField(blank=True, null=True)
    file_time = models.DateTimeField(blank=True, null=True)
    device = models.ForeignKey(Device, models.DO_NOTHING, blank=True, null=True)
    is_deleted = models.IntegerField(blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'files_backedup'


class RecycleBin(models.Model):
    recyclebin_id = models.AutoField(primary_key=True)
    device = models.ForeignKey(Device, models.DO_NOTHING, blank=True, null=True)
    file = models.ForeignKey(FilesBackedup, models.DO_NOTHING, blank=True, null=True)
    file_size = models.FloatField(blank=True, null=True)
    file_time = models.DateTimeField(blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'recycle_bin'


class Report(models.Model):
    user = models.ForeignKey('User', models.DO_NOTHING, blank=True, null=True)
    space_used = models.DecimalField(max_digits=10, decimal_places=0, blank=True, null=True)
    space_left = models.DecimalField(max_digits=10, decimal_places=0, blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'report'


class User(models.Model):
    user_id = models.AutoField(primary_key=True)
    username = models.CharField(max_length=30, blank=True, null=True)
    password = models.CharField(max_length=30, blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'user'


class UserDetails(models.Model):
    user = models.ForeignKey(User, models.DO_NOTHING, blank=True, null=True)
    subscription_id = models.IntegerField(primary_key=True)
    subscription_name = models.CharField(max_length=50, blank=True, null=True)
    subscripton_size_capacity = models.FloatField(blank=True, null=True)
    subscription_size_used = models.FloatField(blank=True, null=True)
    subscription_size_left = models.FloatField(blank=True, null=True)
    subscription_start_date = models.DateTimeField(blank=True, null=True)
    subscription_end_date = models.DateTimeField(blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'user_details'


class Version(models.Model):
    version_id = models.AutoField(primary_key=True)
    file = models.ForeignKey(FilesBackedup, models.DO_NOTHING, blank=True, null=True)
    file_name = models.CharField(max_length=50, blank=True, null=True)
    file_path = models.CharField(max_length=150, blank=True, null=True)
    is_backedup = models.TextField(blank=True, null=True)  # This field type is a guess.
    version_size = models.FloatField(blank=True, null=True)
    version_time = models.DateTimeField(blank=True, null=True)
    device = models.ForeignKey(Device, models.DO_NOTHING, blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'version'
