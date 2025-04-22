from datetime import date
from django.db import models
from django.contrib.auth.models import User

class Wallet(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='wallets')
    name = models.CharField(max_length=100,unique=True)
    balance = models.DecimalField(max_digits=12, decimal_places=2)
    currency = models.CharField(max_length=10, default='KZT')  

    def __str__(self):
        return f"{self.name} ({self.currency})"


class Category(models.Model):
    name = models.CharField(max_length=100,unique=True)
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='categories')  
    is_income = models.BooleanField(default=False)

    def __str__(self):
        return f"{self.name} ({'Доход' if self.is_income else 'Расход'})"
    
class Budget(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='budgets')
    wallet = models.ForeignKey(Wallet, on_delete=models.CASCADE, related_name='budgets',to_field='name')  
    amount = models.DecimalField(max_digits=12, decimal_places=2)
    month = models.DateField(default=date.today) 

    class Meta:
        unique_together = ('user', 'wallet', 'month') 

    def __str__(self):
        wallet_name = self.wallet.name if self.wallet else 'Все кошельки'
        return f"{self.user.username} —{wallet_name} — {self.month.strftime('%B %Y')} — {self.amount}"


class Transaction(models.Model):
    user = models.ForeignKey(User,on_delete=models.CASCADE, related_name='transactions')
    wallet = models.ForeignKey(Wallet, on_delete=models.CASCADE, related_name='transactions',to_field='name')
    category = models.ForeignKey(Category, on_delete=models.CASCADE , related_name='transactions',to_field='name')
    amount = models.DecimalField(max_digits=12, decimal_places=2)
    description = models.TextField(blank=True)
    date = models.DateTimeField(auto_now_add=True)
    is_income = models.BooleanField(default=False)  

    def __str__(self):
        return f"{'Доход' if self.is_income else 'Расход'} {self.amount} - {self.category.name if self.category else 'Без категории'}"

