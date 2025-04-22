import { Category } from './category.model'; 
import { Wallet } from './wallet.model';     

export interface Transaction {
    id: number;
    type: 'income' | 'expense';
    amount: number;
    date: string | Date;
    description?: string;
    category?: Category; 
    wallet: Wallet;    
    categoryId?: number;
    walletId?: number;
}