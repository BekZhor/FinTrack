from django.urls import path
from . import views
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView,TokenVerifyView

urlpatterns = [
    # Wallet
    path('wallets/', views.wallet_list_create),
    path('wallets/<int:pk>/', views.wallet_detail),

    # Transaction
    path('transactions/', views.transaction_list_create),
    path('transactions/<int:pk>/', views.transaction_detail),

    # Category
    path('categories/', views.CategoryListCreate.as_view()),
    path('categories/<int:pk>/', views.CategoryDetail.as_view()),

    # Budget
    path('budgets/', views.BudgetListCreate.as_view()),
    path('budgets/<int:pk>/', views.BudgetDetail.as_view()),

    # Auth
    path('token/', TokenObtainPairView.as_view()),
    path('token/refresh/', TokenRefreshView.as_view()),
    path('token/verify/', TokenVerifyView.as_view(), name='token_verify'),
]

