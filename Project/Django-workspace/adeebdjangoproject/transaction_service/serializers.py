from rest_framework import serializers
from transaction_service.models import Transactions

class TransactionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Transactions
        fields = ('id', 'amount', 'date', 'transactionType', 'user_id')
