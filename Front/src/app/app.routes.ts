import { Routes } from '@angular/router';
import { LoginComponent } from './auth/login/login.component';
import { RegisterComponent } from './auth/register/register.component';
import { DashboardComponent } from './features/dashboard/dashboard.component';
import { TransactionListComponent } from './features/transactions/transaction-list/transaction-list.component';
import { CategoryListComponent } from './features/categories/category-list/category-list.component';
import { WalletListComponent } from './features/wallets/wallet-list/wallet-list.component';
import { AnalyticsViewComponent } from './features/analytics/analytics-view/analytics-view.component';
import { authGuard } from './core/guards/auth.guard'; // Functional guard import
import { TransactionFormComponent } from './features/transactions/transaction-form/transaction-form.component'; // Form component

export const routes: Routes = [
  // Auth
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },

  // Features (Protected by AuthGuard)
  { path: 'dashboard', component: DashboardComponent, canActivate: [authGuard] },
  { path: 'transactions', component: TransactionListComponent, canActivate: [authGuard] },
  { path: 'transactions/new', component: TransactionFormComponent, canActivate: [authGuard] }, // Жаңа транзакция
  // { path: 'transactions/edit/:id', component: TransactionFormComponent, canActivate: [authGuard] }, // Өңдеу (кейінірек қосуға болады)
  { path: 'categories', component: CategoryListComponent, canActivate: [authGuard] },
  { path: 'wallets', component: WalletListComponent, canActivate: [authGuard] },
  { path: 'analytics', component: AnalyticsViewComponent, canActivate: [authGuard] },

  // Default and Wildcard
  { path: '', redirectTo: '/dashboard', pathMatch: 'full' },
  { path: '**', redirectTo: '/dashboard' } // Or a NotFoundComponent
];