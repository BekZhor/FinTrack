from django.shortcuts import render

from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
from rest_framework.views import APIView

from .models import Wallet, Transaction, Category, Budget
from .serializer import WalletSerializer, TransactionSerializer, CategorySerializer, BudgetSerializer


@api_view(['GET', 'POST'])
def wallet_list_create(request):
    if request.method == 'GET':
        wallets = Wallet.objects.filter(user=request.user)
        serializer = WalletSerializer(wallets, many=True)
        return Response(serializer.data)
    
    elif request.method == 'POST':
        serializer = WalletSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save(user=request.user)
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(['GET', 'PUT', 'DELETE'])
def wallet_detail(request, pk):
    try:
        wallet = Wallet.objects.get(pk=pk)
    except Wallet.DoesNotExist:
        return Response(status=status.HTTP_404_NOT_FOUND)
    
    if wallet.user != request.user:
        return Response(status=status.HTTP_403_FORBIDDEN) 


    if request.method == 'GET':
        serializer = WalletSerializer(wallet)
        return Response(serializer.data)

    elif request.method == 'PUT':
        serializer = WalletSerializer(wallet, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    elif request.method == 'DELETE':
        wallet.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)



@api_view(['GET', 'POST'])
def transaction_list_create(request):
    if request.method == 'GET':
        transactions = Transaction.objects.filter(user=request.user)
        serializer = TransactionSerializer(transactions, many=True)
        return Response(serializer.data)
    
    elif request.method == 'POST':
        serializer = TransactionSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save(user=request.user)
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(['GET', 'PUT', 'DELETE'])
def transaction_detail(request, pk):
    try:
        transaction = Transaction.objects.get(pk=pk)
    except Transaction.DoesNotExist:
        return Response(status=status.HTTP_404_NOT_FOUND)
    
    if transaction.user != request.user:
        return Response(status=status.HTTP_403_FORBIDDEN) 

    if request.method == 'GET':
        serializer = TransactionSerializer(transaction)
        return Response(serializer.data)

    elif request.method == 'PUT':
        serializer = TransactionSerializer(transaction, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    elif request.method == 'DELETE':
        transaction.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)



class CategoryListCreate(APIView):
    def get(self, request):
        categories = Category.objects.filter(user=request.user)
        serializer = CategorySerializer(categories, many=True)
        return Response(serializer.data)

    def post(self, request):
        serializer = CategorySerializer(data=request.data)
        if serializer.is_valid():
            serializer.save(user=request.user)  
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class CategoryDetail(APIView):
    def get_object(self, pk):
        try:
            category = Category.objects.get(pk=pk)
            return category
        except Category.DoesNotExist:
            return None
        

    def get(self, request, pk):
        category = self.get_object(pk)
        if not category:
            return Response(status=status.HTTP_404_NOT_FOUND)
        if category.user != request.user:
            return Response(status=status.HTTP_403_FORBIDDEN)
        serializer = CategorySerializer(category)
        return Response(serializer.data)

    def put(self, request, pk):
        category = self.get_object(pk)
        if not category:
            return Response(status=status.HTTP_404_NOT_FOUND)
        if category.user != request.user:
            return Response(status=status.HTTP_403_FORBIDDEN)
        serializer = CategorySerializer(category, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request, pk):
        category = self.get_object(pk)
        if not category:
            return Response(status=status.HTTP_404_NOT_FOUND)
        if category.user != request.user:
            return Response(status=status.HTTP_403_FORBIDDEN)
        category.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)



class BudgetListCreate(APIView):
    def get(self, request):
        budgets = Budget.objects.filter(user=request.user)
        serializer = BudgetSerializer(budgets, many=True)
        return Response(serializer.data)

    def post(self, request):
        serializer = BudgetSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save(user=request.user) 
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class BudgetDetail(APIView):
    def get_object(self, pk):
        try:
            return Budget.objects.get(pk=pk)
        except Budget.DoesNotExist:
            return None

    def get(self, request, pk):
        budget = self.get_object(pk)
        if not budget:
            return Response(status=status.HTTP_404_NOT_FOUND)
        if budget.user != request.user:
            return Response(status=status.HTTP_403_FORBIDDEN)
        serializer = BudgetSerializer(budget)
        return Response(serializer.data)

    def put(self, request, pk):
        budget = self.get_object(pk)
        if not budget:
            return Response(status=status.HTTP_404_NOT_FOUND)
        if budget.user != request.user:
            return Response(status=status.HTTP_403_FORBIDDEN)
        serializer = BudgetSerializer(budget, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request, pk):
        budget = self.get_object(pk)
        if not budget:
            return Response(status=status.HTTP_404_NOT_FOUND)
        if budget.user != request.user:
            return Response(status=status.HTTP_403_FORBIDDEN)
        budget.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)


