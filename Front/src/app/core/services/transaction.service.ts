import { Injectable } from '@angular/core';
import { Observable, of, throwError, forkJoin } from 'rxjs'; 
import { delay, switchMap, map, catchError } from 'rxjs/operators';
import { Transaction } from '../models/transaction.model';
import { Category } from '../models/category.model';
import { Wallet } from '../models/wallet.model';
import { CategoryService } from './category.service';
import { WalletService } from './wallet.service';

@Injectable({ providedIn: 'root' })
export class TransactionService {
  private mockTransactions: Transaction[] = [];
  private nextId = 1;
  private initialDataGenerated = false;

  constructor(
    private categoryService: CategoryService,
    private walletService: WalletService
  ) {
    this.ensureInitialData();
  }

  private ensureInitialData(): void {
    if (this.initialDataGenerated) return;
    console.log("Generating initial mock transactions...");
    const tempCats: Category[] = [ { id: 1, name: 'Food'}, { id: 2, name: 'Transport'}, { id: 3, name: 'Entertainment'}, { id: 4, name: 'Communal'} ];
    const tempWallets: Wallet[] = [ { id: 1, name: 'Card', balance: 150000 }, { id: 2, name: 'Cash', balance: 25000 } ];

    if (tempCats.length > 0 && tempWallets.length > 0) {
         this.mockTransactions = [
            { id: this.nextId++, type: 'expense', amount: 5500, date: new Date(2023, 10, 15, 10, 30).toISOString(), category: tempCats[0], wallet: tempWallets[0], description: 'Magnum Supermarket' },
            { id: this.nextId++, type: 'expense', amount: 500, date: new Date(2023, 10, 16, 8, 0).toISOString(), category: tempCats[1], wallet: tempWallets[1], description: 'Bus' },
            { id: this.nextId++, type: 'income', amount: 250000, date: new Date(2023, 10, 10, 18, 0).toISOString(), wallet: tempWallets[0], description: 'Salary' },
            { id: this.nextId++, type: 'expense', amount: 12000, date: new Date(2023, 10, 17, 20, 0).toISOString(), category: tempCats[2], wallet: tempWallets[0], description: 'Movie' },
            { id: this.nextId++, type: 'expense', amount: 15500, date: new Date(2023, 10, 18, 13, 15).toISOString(), category: tempCats[3], wallet: tempWallets[0], description: 'Communal' },
         ];
         this.initialDataGenerated = true;
         console.log("Initial mock transactions GENERATED:", this.mockTransactions);
    } else {
         console.error("Could not generate initial transactions - temp data missing?");
    }
  }

  getTransactions(filters?: any): Observable<Transaction[]> {
    console.log('Mock Get Transactions called. Current mockTransactions:', this.mockTransactions);
    if (!this.initialDataGenerated) {
         console.warn("Initial data not generated yet when getTransactions was called.");
        return of([]).pipe(delay(450));
    }
    let filtered = [...this.mockTransactions];
    filtered.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    console.log('Mock Get Transactions returning:', filtered);
    return of(filtered).pipe(delay(300));
  }

  createTransaction(data: Partial<Transaction>): Observable<Transaction> {
    console.log('Mock Create Transaction:', data);
    if (!data.walletId || !data.amount || !data.type) {
         return throwError(() => new Error('Mock: Wallet, amount and type are required.')).pipe(delay(100));
    }

    return forkJoin({
        cat: data.categoryId ? this.categoryService.getCategories().pipe(map(cats => cats.find(c => c.id === data.categoryId))) : of(undefined),
        wallet: this.walletService.getWallets().pipe(map(w => w.find(wl => wl.id === data.walletId)))
    }).pipe(
        switchMap(({ cat, wallet }) => {
            if (!wallet) {
                return throwError(() => new Error('Mock: No wallet found for transaction')).pipe(delay(100));
            }
            if (data.type === 'expense' && data.categoryId && !cat) {
                 return throwError(() => new Error('Mock: Selected category not found')).pipe(delay(100));
            }
             return this.walletService.updateBalance(wallet.id, data.amount!, data.type!).pipe(
                map(updatedWallet => {
                     if (!updatedWallet) throw new Error('Mock: Wallet not returned after balance update');

                     const newTransaction: Transaction = {
                        id: this.nextId++,
                        type: data.type!,
                        amount: data.amount!,
                        date: data.date || new Date().toISOString(),
                        description: data.description,
                        category: cat, 
                        wallet: updatedWallet 
                    };
                    this.mockTransactions.push(newTransaction);
                    console.log('Mock Transaction CREATED and pushed:', newTransaction);
                    console.log('Current mockTransactions:', this.mockTransactions);
                    return {...newTransaction}; 
                }),
                 catchError(err => throwError(() => err)) 
             );
        }),
        delay(500) 
    );
  }

  deleteTransaction(id: number): Observable<void> {
    console.log('Mock Delete Transaction:', id);
    const index = this.mockTransactions.findIndex(t => t.id === id);
    if (index !== -1) {
      const transactionToDelete = this.mockTransactions[index];
      const revertType = transactionToDelete.type === 'income' ? 'expense' : 'income';
      return this.walletService.updateBalance(transactionToDelete.wallet.id, transactionToDelete.amount, revertType).pipe(
          map(() => {
              this.mockTransactions.splice(index, 1);
              console.log(`Mock Transaction ${id} DELETED, Balance Reverted`);
              console.log('Current mockTransactions:', this.mockTransactions);
              return undefined; 
          }),
          catchError(err => {
               console.error("Mock: Balance reversal error, transaction not cleared.", err);
              return throwError(() => new Error('Mock: Balance reversal error. Transaction could not be deleted.'));
          }),
          delay(600) 
      );

    } else {
      return throwError(() => new Error('Mock: No transaction found for deletion')).pipe(delay(100));
    }
  }
}