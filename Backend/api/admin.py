from django.contrib import admin
from .models import Wallet, Category, Transaction, Budget


@admin.register(Wallet)
class WalletAdmin(admin.ModelAdmin):
    list_display = ('name', 'user', 'balance', 'currency')
    search_fields = ('name',)


@admin.register(Category)
class CategoryAdmin(admin.ModelAdmin):
    list_display = ('name', 'user', 'is_income')
    search_fields = ('name',)


@admin.register(Transaction)
class TransactionAdmin(admin.ModelAdmin):
    list_display = ('user','wallet', 'category', 'amount', 'is_income', 'date')
    list_filter = ('is_income', 'category', 'wallet')
    search_fields = ('description',)
    date_hierarchy = 'date'


@admin.register(Budget)
class BudgetAdmin(admin.ModelAdmin):
    list_display = ('user', 'wallet', 'amount', 'month')
