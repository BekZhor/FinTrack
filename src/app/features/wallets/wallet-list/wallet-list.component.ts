import { Component, OnInit } from '@angular/core';
import { CommonModule, DecimalPipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Wallet } from '../../../core/models/wallet.model';
import { WalletService } from '../../../core/services/wallet.service';

@Component({
  selector: 'app-wallet-list',
  standalone: true,
  imports: [CommonModule, FormsModule, DecimalPipe],
  templateUrl: './wallet-list.component.html',
  styleUrls: ['./wallet-list.component.css']
})
export class WalletListComponent implements OnInit {
  wallets: Wallet[] = [];
  newWalletName: string = '';
  newWalletBalance: number | null = null;
  error: string | null = null;
  loading = false;
  addLoading = false;
  deleteLoading: { [key: number]: boolean } = {};

  constructor(private walletService: WalletService) { }

  ngOnInit(): void { 
    this.loadWallets(); 
  }

  loadWallets(): void {
    this.error = null; 
    this.loading = true;
    this.walletService.getWallets().subscribe({
      next: (data: Wallet[]) => { 
        this.wallets = data; 
        this.loading = false; 
      },
      error: (err: any) => { 
        this.error = 'Error loading wallets (mock).'; 
        this.loading = false; 
        console.error(err); 
      }
    });
  }

  addWallet(): void {
    if (!this.newWalletName.trim()) return;
    this.error = null; 
    this.addLoading = true;
    this.walletService.createWallet({ name: this.newWalletName, balance: this.newWalletBalance ?? 0 })
      .subscribe({
        next: (newWallet: Wallet) => {
          this.loadWallets();
          this.newWalletName = ''; 
          this.newWalletBalance = null;
          this.addLoading = false;
        },
        error: (err: any) => { 
          this.error = err.message || 'Error adding wallet (mock).'; 
          this.addLoading = false; 
          console.error(err); 
        }
      });
  }

  deleteWallet(id: number): void {
    if (confirm('Are you sure you want to delete this wallet (mock)?')) {
      this.error = null; 
      this.deleteLoading[id] = true;
      this.walletService.deleteWallet(id).subscribe({
        next: () => { 
          this.loadWallets(); 
        },
        error: (err: any) => { 
          this.error = err.message || 'Error deleting wallet (mock).'; 
          this.deleteLoading[id] = false; 
          console.error(err);
        }
      });
    }
  }
}
