from django.db import models

# Create your models here.
class Transactions(models.Model):    #Transactions is a table
    id = models.TextField(db_column="id", primary_key=True)
    amount = models.IntegerField(db_column="amount", blank=False, null=False)
    date = models.TextField(db_column="date_of_transaction", blank=False, null=False)
    transactionType = models.IntegerField(db_column="transaction_type", blank=False, null=False)
    user_id = models.TextField(db_column="user_id", blank=False, null=False)
    class Meta:
        db_table = "Transactions"