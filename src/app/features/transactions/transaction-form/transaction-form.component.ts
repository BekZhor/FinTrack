import { Component, OnInit } from '@angular/core';
import { CommonModule, Location } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule, Router } from '@angular/router';
import { TransactionService } from '../../../core/services/transaction.service';
import { CategoryService } from '../../../core/services/category.service';
import { WalletService } from '../../../core/services/wallet.service';
import { Transaction } from '../../../core/models/transaction.model';
import { Category } from '../../../core/models/category.model';
import { Wallet } from '../../../core/models/wallet.model';

@Component({
  selector: 'app-transaction-form',
  standalone: true,
  imports: [ CommonModule, FormsModule, RouterModule ],
  templateUrl: './transaction-form.component.html',
  styleUrls: ['./transaction-form.component.css']
})
export class TransactionFormComponent implements OnInit {

  transaction: Partial<Transaction> = {
    type: 'expense',
    amount: undefined,
    date: new Date().toISOString().substring(0, 10),
    description: '',
    categoryId: undefined,
    walletId: undefined
  };

  categories: Category[] = [];
  wallets: Wallet[] = [];

  loadingCategories = true;
  loadingWallets = true;
  submitting = false;
  error: string | null = null;
  successMessage: string | null = null;

  constructor(
    private transactionService: TransactionService,
    private categoryService: CategoryService,
    private walletService: WalletService,
    private router: Router,
    private location: Location
  ) {}

  ngOnInit(): void {
    this.loadCategories();
    this.loadWallets();
  }

  loadCategories(): void {
    this.loadingCategories = true;
    this.categoryService.getCategories().subscribe({
      next: (data) => {
        this.categories = data;
        this.loadingCategories = false;
      },
      error: (err) => {
        console.error('Error loading categories for form:', err);
        this.error = "Could not load categories.";
        this.loadingCategories = false;
      }
    });
  }

  loadWallets(): void {
    this.loadingWallets = true;
    this.walletService.getWallets().subscribe({
      next: (data) => {
        this.wallets = data;
        if (data.length > 0 && !this.transaction.walletId) {
            this.transaction.walletId = data[0].id;
        }
        this.loadingWallets = false;
      },
      error: (err) => {
        console.error('Error loading wallets for form:', err);
        this.error = "Could not load wallets.";
        this.loadingWallets = false;
      }
    });
  }

  onSubmit(): void {
    this.error = null;
    this.successMessage = null;
    this.submitting = true;

    console.log('Submitting transaction:', this.transaction);

    const dataToSend: Partial<Transaction> = {
        type: this.transaction.type,
        amount: Number(this.transaction.amount),
        date: this.transaction.date ? new Date(this.transaction.date).toISOString() : new Date().toISOString(),
        description: this.transaction.description,
        categoryId: this.transaction.categoryId ? Number(this.transaction.categoryId) : undefined,
        walletId: Number(this.transaction.walletId)
    };

    this.transactionService.createTransaction(dataToSend).subscribe({
      next: (newTransaction) => {
        console.log('Transaction created successfully (mock):', newTransaction);
        this.submitting = false;
        this.successMessage = 'Transaction added successfully!';
        setTimeout(() => {
          this.router.navigate(['/transactions']);
        }, 1500);
      },
      error: (err) => {
        console.error('Error creating transaction:', err);
        this.error = err.message || "Error occurred while adding transaction (mock).";
        this.submitting = false;
      }
    });
  }

  goBack(): void {
    this.location.back();
  }
}
