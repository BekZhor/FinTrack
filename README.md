# FinTrack

Overview

Financial Tracker is a web application that helps users manage their personal finances, track income and expenses, plan budgets, and analyze spending habits with interactive charts.

Features

Frontend (Angular)

User Authentication (JWT): Register, login, logout.

Transaction Management: Create, edit, delete income and expenses.

Filtering & Sorting: Filter transactions by date, category, and amount.

Wallet Management: Support for multiple accounts (cash, bank card, cryptocurrency, etc.).

Recurring Payments: Set up reminders for upcoming expenses.

Routing & State Management: Configured Angular routing and state handling.

Backend (Django + DRF)

Models:

User: Authentication and profile management.

Transaction: Tracks income and expenses.

Category: Categorizes transactions (e.g., Food, Entertainment, Transport).

Wallet: Represents different financial accounts.

API Endpoints:

CRUD operations for transactions, categories, and wallets.

Authentication using JWT (login, logout, token refresh).

Relations:

Transaction -> ForeignKey to User.

Transaction -> ForeignKey to Category.

Transaction -> ForeignKey to Wallet.

Periodic Tasks (Optional):

Celery + Redis for scheduled payment reminders.


API Documentation

Available via Postman collection (TBD)

Endpoints include:

/api/auth/register/ - User registration

/api/auth/login/ - User login

/api/transactions/ - CRUD operations for transactions

/api/categories/ - CRUD operations for categories

/api/wallets/ - CRUD operations for wallets
