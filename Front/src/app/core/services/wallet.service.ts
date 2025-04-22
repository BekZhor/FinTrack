import { Injectable } from '@angular/core';
import { Observable, of, throwError, BehaviorSubject } from 'rxjs';
import { delay, tap } from 'rxjs/operators';
import { Wallet } from '../models/wallet.model';

@Injectable({ providedIn: 'root' })
export class WalletService {
  private mockWallets: Wallet[] = [
    { id: 1, name: 'Main bank card', balance: 150000.50 },
    { id: 2, name: 'Cash', balance: 25000.00 },
    { id: 3, name: 'Crypto Wallet', balance: 0.5 }, 
  ];
  private nextId = 4;

  private walletsSubject = new BehaviorSubject<Wallet[]>([...this.mockWallets]);
  wallets$ = this.walletsSubject.asObservable();

  getWallets(): Observable<Wallet[]> {
    console.log('Mock Get Wallets');
    return of([...this.mockWallets]).pipe(delay(200)); 
  }
  private refreshWallets() {
    this.walletsSubject.next([...this.mockWallets]);
  }

  createWallet(walletData: { name: string, balance?: number }): Observable<Wallet> {
    console.log('Mock Create Wallet:', walletData);
    const nameExists = this.mockWallets.some(w => w.name.toLowerCase() === walletData.name.toLowerCase());
    if (nameExists) { return throwError(() => new Error('Mock: Wallet name must not be repeated')).pipe(delay(100)); }

    const newWallet: Wallet = {
      id: this.nextId++,
      name: walletData.name,
      balance: walletData.balance ?? 0
    };
    this.mockWallets.push(newWallet);
    this.refreshWallets(); 
    return of({...newWallet}).pipe(delay(300));
  }

  deleteWallet(id: number): Observable<void> {
    console.log('Mock Delete Wallet:', id);
    const index = this.mockWallets.findIndex(w => w.id === id);
    if (index !== -1) {
      this.mockWallets.splice(index, 1);
      this.refreshWallets();
      return of(undefined).pipe(delay(400));
    } else {
      return throwError(() => new Error('Mock: Wallet not found')).pipe(delay(100));
    }
  }

  updateBalance(walletId: number, amount: number, type: 'income' | 'expense'): Observable<Wallet | undefined> {
    console.log(`Mock Update Balance for Wallet ${walletId}: ${type} ${amount}`);
    const index = this.mockWallets.findIndex(w => w.id === walletId);
    if (index !== -1) {
        const wallet = this.mockWallets[index];
        if (type === 'income') {
            wallet.balance += amount;
        } else {
            if (wallet.balance < amount) {
                 return throwError(() => new Error(`Mock: ${wallet.name} There are not enough funds in the wallet.`)).pipe(delay(100));
            }
            wallet.balance -= amount;
        }
        this.refreshWallets(); 
         return of({...wallet}).pipe(delay(50)); 
    }
     return throwError(() => new Error('Mock: Wallet not found for balance update')).pipe(delay(100));
  }
}