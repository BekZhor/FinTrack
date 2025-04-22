import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule, DatePipe, DecimalPipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { Subscription, combineLatest, map, startWith, catchError, of, finalize } from 'rxjs';
import { TransactionService } from '../../../core/services/transaction.service';
import { CategoryService } from '../../../core/services/category.service';
import { WalletService } from '../../../core/services/wallet.service';
import { Transaction } from '../../../core/models/transaction.model';
import { Category } from '../../../core/models/category.model';
import { Wallet } from '../../../core/models/wallet.model';
import { BehaviorSubject } from 'rxjs';

@Component({
  selector: 'app-transaction-list',
  standalone: true,
  imports: [ CommonModule, FormsModule, RouterModule, DatePipe, DecimalPipe ],
  templateUrl: './transaction-list.component.html',
  styleUrls: ['./transaction-list.component.css']
})
export class TransactionListComponent implements OnInit, OnDestroy {

  private filterTypeSubject = new BehaviorSubject<string>('all');
  private filterCategorySubject = new BehaviorSubject<string>('all');
  private filterWalletSubject = new BehaviorSubject<string>('all');

  filterType$ = this.filterTypeSubject.asObservable();
  filterCategory$ = this.filterCategorySubject.asObservable();
  filterWallet$ = this.filterWalletSubject.asObservable();

  allTransactions: Transaction[] = [];
  filteredTransactions: Transaction[] = [];

  categories: Category[] = [];
  wallets: Wallet[] = [];

  loading = true;
  error: string | null = null;

  private dataSubscription: Subscription | null = null;

  constructor(
    private transactionService: TransactionService,
    private categoryService: CategoryService,
    private walletService: WalletService
  ) {}

  ngOnInit(): void {
    this.loadInitialData();
  }

  ngOnDestroy(): void {
    this.dataSubscription?.unsubscribe();
  }

  loadInitialData(): void {
    this.loading = true;
    this.error = null;

    this.dataSubscription = combineLatest({
      transactions: this.transactionService.getTransactions(),
      categories: this.categoryService.getCategories(),
      wallets: this.walletService.getWallets()
    }).pipe(
      map(data => {
        this.allTransactions = data.transactions;
        this.categories = data.categories;
        this.wallets = data.wallets;
        this.applyFilters();
        return true;
      }),
      catchError(err => {
        this.error = "Error loading data.";
        return of(false);
      }),
      finalize(() => {
        this.loading = false;
      })
    ).subscribe();
  }

  onFilterChange(): void {
    this.applyFilters();
  }

  applyFilters(): void {
    const type = this.filterTypeSubject.getValue();
    const categoryId = this.filterCategorySubject.getValue();
    const walletId = this.filterWalletSubject.getValue();

    this.filteredTransactions = this.allTransactions.filter(tx => {
      const typeMatch = (type === 'all' || tx.type === type);
      const categoryMatch = (categoryId === 'all' || tx.category?.id === Number(categoryId));
      const walletMatch = (walletId === 'all' || tx.wallet.id === Number(walletId));
      return typeMatch && categoryMatch && walletMatch;
    });
  }

  setFilterType(value: string): void {
      this.filterTypeSubject.next(value);
      this.onFilterChange();
  }
  setFilterCategory(value: string): void {
      this.filterCategorySubject.next(value);
      this.onFilterChange();
  }
  setFilterWallet(value: string): void {
      this.filterWalletSubject.next(value);
      this.onFilterChange();
  }

  getTransactionClass(type: 'income' | 'expense'): string {
    return type === 'income' ? 'transaction-income' : 'transaction-expense';
  }

  deleteTransaction(id: number): void {
    if (confirm('Are you sure you want to delete this transaction?')) {
      this.error = null;
      this.transactionService.deleteTransaction(id).subscribe({
          next: () => {
              this.loadInitialData();
          },
          error: (err) => {
              this.error = err.message || 'Error deleting transaction.';
          }
      });
    }
  }
}
