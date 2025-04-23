import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import { Category, Wallet,Budget,Transaction,User,Token } from '../models';
import {Observable} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  
  parseJwt(token: string): any {
    try {
      const payload = token.split('.')[1];
    return JSON.parse(atob(payload));
    } catch (e) {
      return null;
    }
}


  constructor(private http:HttpClient) { }

  login(authModel: User): Observable<Token> {
    return this.http.post<Token>("http://localhost:8000/api/token/", authModel)
  }

  refresh(Token : Token):Observable<Token>{
    return this.http.post<Token>("http://localhost:8000/api/token/refresh/", Token.refresh)
  }

  private baseUrl = 'http://localhost:8000/api';

  // ======= Wallets =======
  getWallets(): Observable<Wallet[]> {
    return this.http.get<Wallet[]>(`${this.baseUrl}/wallets/`);
  }

  createWallet(data: Wallet): Observable<Wallet> {
    return this.http.post<Wallet>(`${this.baseUrl}/wallets/`, data);
  }

  getWallet(id: number): Observable<Wallet> {
    return this.http.get<Wallet>(`${this.baseUrl}/wallets/${id}/`);
  }

  updateWallet(id: number, data: Wallet): Observable<Wallet> {
    return this.http.put<Wallet>(`${this.baseUrl}/wallets/${id}/`, data);
  }

  deleteWallet(id: number): Observable<Wallet> {
    return this.http.delete<Wallet>(`${this.baseUrl}/wallets/${id}/`);
  }

  // ======= Transactions =======
  getTransactions(): Observable<Transaction[]> {
    return this.http.get<Transaction[]>(`${this.baseUrl}/transactions/`);
  }

  createTransaction(data: Transaction): Observable<Transaction > {
    return this.http.post<Transaction>(`${this.baseUrl}/transactions/`, data);
  }

  getTransaction(id: number): Observable<Transaction> {
    return this.http.get<Transaction>(`${this.baseUrl}/transactions/${id}/`);
  }

  updateTransaction(id: number, data: Transaction): Observable<Transaction> {
    return this.http.put<Transaction>(`${this.baseUrl}/transactions/${id}/`, data);
  }

  deleteTransaction(id: number): Observable<Transaction> {
    return this.http.delete<Transaction>(`${this.baseUrl}/transactions/${id}/`);
  }

  // ======= Categories =======
  getCategories(): Observable<Category[]> {
    return this.http.get<Category[]>(`${this.baseUrl}/categories/`);
  }

  createCategory(data: Category): Observable<Category> {
    return this.http.post<Category>(`${this.baseUrl}/categories/`, data);
  }

  getCategory(id: number): Observable<Category> {
    return this.http.get<Category>(`${this.baseUrl}/categories/${id}/`);
  }

  updateCategory(id: number, data: Category): Observable<Category> {
    return this.http.put<Category>(`${this.baseUrl}/categories/${id}/`, data);
  }

  deleteCategory(id: number): Observable<Category> {
    return this.http.delete<Category>(`${this.baseUrl}/categories/${id}/`);
  }

  // ======= Budgets =======
  getBudgets(): Observable<Budget[]> {
    return this.http.get<Budget[]>(`${this.baseUrl}/budgets/`);
  }

  createBudget(data: Budget): Observable<Budget> {
    return this.http.post<Budget>(`${this.baseUrl}/budgets/`, data);
  }

  getBudget(id: number): Observable<Budget> {
    return this.http.get<Budget>(`${this.baseUrl}/budgets/${id}/`);
  }

  updateBudget(id: number, data: Budget): Observable<Budget> {
    return this.http.put<Budget>(`${this.baseUrl}/budgets/${id}/`, data);
  }

  deleteBudget(id: number): Observable<Budget> {
    return this.http.delete<Budget>(`${this.baseUrl}/budgets/${id}/`);
  }
}
