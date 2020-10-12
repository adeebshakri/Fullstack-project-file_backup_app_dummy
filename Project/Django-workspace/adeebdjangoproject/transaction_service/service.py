class TransactionService:
    @staticmethod
    def calculate_amount(transactions, user_id):
        amount= 0
        for transaction in transactions:
            amount +=transaction.amount
        response = {"user_id":user_id, "Total amount": amount}
        return response

    @staticmethod
    def get_report(trans, minCredit,maxDebit):
        d = {}
        for t in trans:
            d[t["user_id"]] = {"credit":0,"debit":0}

        for t in trans:
            if t["transactionType"] == 0:
                d[t["user_id"]]["credit"] = d[t["user_id"]]["credit"] + t["amount"]
            if t["transactionType"] == 1:
                d[t["user_id"]]["debit"] = d[t["user_id"]]["debit"] + t["amount"]

        d2 = d.copy()
        for key in d2.keys():
            if not((d2[key]["credit"]>= minCredit) and (d2[key]["debit"]<=maxDebit)):
                del d[key]
        return d
