# Generated by Django 2.2 on 2020-09-14 06:21

from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = [
    ]

    operations = [
        migrations.CreateModel(
            name='Transactions',
            fields=[
                ('id', models.TextField(db_column='id', primary_key=True, serialize=False)),
                ('amount', models.IntegerField(db_column='amount')),
                ('date', models.TextField(db_column='date_of_transaction')),
                ('transactionType', models.IntegerField(db_column='transaction_type')),
                ('user_id', models.TextField(db_column='user_id')),
            ],
            options={
                'db_table': 'Transactions',
            },
        ),
    ]
