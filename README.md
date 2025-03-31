# FinTrack

Overview

Financial Tracker is a web application that helps users manage their personal finances, track income and expenses, plan budgets, and analyze spending habits with interactive charts.

Features

Frontend (Angular)

User Authentication (JWT): Register, login, logout.

Transaction Management: Create, edit, delete income and expenses.

Filtering & Sorting: Filter transactions by date, category, and amount.

Charts & Analytics: Visualize spending trends with dynamic charts.

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

Installation

Prerequisites

Node.js & Angular CLI

Python 3 & Django

PostgreSQL (or SQLite for development)

Redis (for scheduled tasks)

Backend Setup

# Clone the repository
git clone https://github.com/yourusername/financial-tracker.git
cd financial-tracker/backend

# Create a virtual environment
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Apply migrations
python manage.py migrate

# Create a superuser
python manage.py createsuperuser

# Run the server
python manage.py runserver

Frontend Setup

cd ../frontend

# Install dependencies
npm install

# Run the development server
ng serve

API Documentation

Available via Postman collection (TBD)

Endpoints include:

/api/auth/register/ - User registration

/api/auth/login/ - User login

/api/transactions/ - CRUD operations for transactions

/api/categories/ - CRUD operations for categories

/api/wallets/ - CRUD operations for wallets
