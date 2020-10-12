from rest_framework import generics
from django.shortcuts import render
from rest_framework.response import Response
from transaction_service.serializers import TransactionSerializer
from transaction_service.models import Transactions
# Create your views here.
from transaction_service.service import TransactionService


class AddTransaction(generics.CreateAPIView):
    def post(self, request, *args, **kwargs):
        print(request.data)
        new_transaction = TransactionSerializer(data=request.data)
        print(new_transaction)
        if new_transaction.is_valid():
            new_transaction.save()
            return Response(new_transaction.data, status=200)
        print(new_transaction.errors)
        return Response(status=400)


class getAllTransactions(generics.RetrieveAPIView):
    def get(self, request, *args, **kwargs):
        try:
            transactions = Transactions.objects.filter(user_id=request.query_params["user_id"])
            transactions_serialized = TransactionSerializer(transactions, many=True)
            if transactions_serialized.data.__len__() == 0:
                raise Exception("No Transactions exists for user_id: "+request.query_params["user_id"])
            return Response(transactions_serialized.data, status=200)
        except Exception as e:
            print("An exception occured")
            return Response(e.args, status=400)


class CalculateAmountForUser(generics.RetrieveAPIView):
    def get(self, request, *args,**kwargs):
        user_id = request.query_params["user_id"]
        try:
            transactions = Transactions.objects.filter(user_id=user_id, transactionType = request.query_params["transactionType"])
            transactions_serialized = TransactionSerializer(transactions,many=True)
            if transactions_serialized.data.__len__() == 0:
                raise Exception("No Transactions exists for user_id: " + request.query_params["user_id"])
            response = TransactionService.calculate_amount(transactions, user_id)
            return Response(response, status=200)
        except Exception as e:
            print("Couldnt find any transaction",e )
            return Response(e.args, status=400)

class generateReport(generics.RetrieveAPIView):
    def get(self, request, *args, **kwargs):
        try:
            transactions = Transactions.objects.all()
            transactions_serialized = TransactionSerializer(transactions, many=True)
            report  = TransactionService.get_report(transactions_serialized.data,20000,21000)
            return Response(report, status=200)
        except Exception as e:
            print(e)
            return Response(e.args, status=404)
