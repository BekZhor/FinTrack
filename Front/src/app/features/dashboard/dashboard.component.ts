import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule, DecimalPipe, DatePipe } from '@angular/common';
import { Observable, Subscription, map, of, finalize, catchError } from 'rxjs';
import { WalletService } from '../../core/services/wallet.service';
import { TransactionService } from '../../core/services/transaction.service';
import { Wallet } from '../../core/models/wallet.model';
import { Transaction } from '../../core/models/transaction.model';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [ CommonModule, DecimalPipe, DatePipe, RouterModule ],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit, OnDestroy {

  totalBalance: number = 0;
  recentTransactions: Transaction[] = [];
  loadingBalance = true;
  loadingTransactions = true;
  error: string | null = null;

  private balanceSubscription: Subscription | null = null;
  private transactionsSubscription: Subscription | null = null;

  constructor(
    private walletService: WalletService,
    private transactionService: TransactionService
  ) {}

  ngOnInit(): void {
    console.log("Dashboard ngOnInit: Starting data loading...");
    this.loadTotalBalance();
    this.loadRecentTransactions();
  }

  ngOnDestroy(): void {
    console.log("Dashboard ngOnDestroy: Unsubscribing...");
    this.balanceSubscription?.unsubscribe();
    this.transactionsSubscription?.unsubscribe();
  }

  loadTotalBalance(): void {
    this.loadingBalance = true;
    this.error = null;
    this.balanceSubscription?.unsubscribe();
    console.log("Dashboard: Subscribing to walletService.wallets$...");

    this.balanceSubscription = this.walletService.wallets$.pipe(
      map(wallets => {
         console.log("Dashboard: Received wallets for balance calc:", wallets);
         if (!wallets || wallets.length === 0) {
             this.loadingBalance = false;
             console.log('Balance loading FINISHED (inside map - empty wallets).');
             return 0;
         }
         this.loadingBalance = false;
         console.log('Balance loading FINISHED (inside map).');
         return wallets.reduce((sum, wallet) => sum + Number(wallet.balance), 0);
      }),
      catchError(err => {
        console.error('Error loading total balance:', err);
        this.error = "Error loading balance.";
        this.loadingBalance = false;
        return of(0);
      })
    ).subscribe(balance => {
         console.log("Dashboard: Calculated totalBalance:", balance);
         this.totalBalance = balance;
    });
  }

  loadRecentTransactions(): void {
    this.loadingTransactions = true;
    this.error = null;
    this.transactionsSubscription?.unsubscribe();
    console.log("Dashboard: Calling transactionService.getTransactions...");

    this.transactionsSubscription = this.transactionService.getTransactions().pipe(
        map(transactions => {
            console.log("Dashboard: Received transactions:", transactions);
            return transactions.slice(0, 5);
        }),
        catchError(err => {
           console.error('Error loading recent transactions:', err);
           if (!this.error) { this.error = "Error loading transactions."; }
           return of([]);
       }),
        finalize(() => {
             this.loadingTransactions = false;
             console.log('Transactions loading finished.');
        })
    ).subscribe(transactions => {
         console.log("Dashboard: Setting recentTransactions:", transactions);
        this.recentTransactions = transactions;
    });
  }

  getTransactionClass(type: 'income' | 'expense'): string {
    return type === 'income' ? 'transaction-income' : 'transaction-expense';
  }
}
