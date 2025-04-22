from rest_framework import serializers
from .models import Wallet, Transaction, Category, Budget

class WalletSerializer(serializers.ModelSerializer):
    class Meta:
        model = Wallet
        fields = ['id', 'name', 'balance', 'currency']


class TransactionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Transaction
        fields = ['id','wallet', 'category', 'amount', 'description', 'date', 'is_income']


class CategorySerializer(serializers.Serializer):
    id = serializers.IntegerField(read_only=True)
    name = serializers.CharField(max_length=100)
    user = serializers.PrimaryKeyRelatedField(read_only=True)
    is_income = serializers.BooleanField()

    def create(self, validated_data):
        return Category.objects.create(**validated_data)

    def update(self, instance, validated_data):
        instance.name = validated_data.get('name', instance.name)
        instance.is_income = validated_data.get('is_income', instance.is_income)
        instance.save()
        return instance


class BudgetSerializer(serializers.Serializer):
    id = serializers.IntegerField(read_only=True)
    user = serializers.PrimaryKeyRelatedField(read_only=True)
    wallet = serializers.PrimaryKeyRelatedField(read_only=True)
    amount = serializers.DecimalField(max_digits=12, decimal_places=2)
    month = serializers.DateField()

    def create(self, validated_data):
        return Budget.objects.create(**validated_data)

    def update(self, instance, validated_data):
        instance.amount = validated_data.get('amount', instance.amount)
        instance.month = validated_data.get('month', instance.month)
        instance.save()
        return instance
