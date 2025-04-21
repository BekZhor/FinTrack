import { Injectable } from '@angular/core';
import { Observable, BehaviorSubject, of, throwError } from 'rxjs';
import { delay } from 'rxjs/operators';
import { Router } from '@angular/router';
import { AuthResponse } from '../models/auth.model'; 
import { User } from '../models/user.model';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly JWT_TOKEN = 'FAKE_JWT_TOKEN';
  private readonly USER_INFO = 'FAKE_USER_INFO';

  private loggedIn = new BehaviorSubject<boolean>(this.hasToken());
  isLoggedIn$ = this.loggedIn.asObservable();

  private currentUser = new BehaviorSubject<User | null>(this.getUserFromStorage());
  currentUser$ = this.currentUser.asObservable();

  constructor(private router: Router) {}

  register(user: any): Observable<User> {
    console.log('Mock Register:', user);
    const newUser: User = { id: Date.now(), username: user.username, email: user.email };
  
    return of(newUser).pipe(delay(500));
  }

  login(credentials: any): Observable<AuthResponse> {
    console.log('Mock Login:', credentials);
    if (credentials.username === 'test' && credentials.password === 'password') {
      const fakeToken = 'this-is-a-fake-jwt-token-' + Date.now();
      const fakeUser: User = { id: 1, username: 'test', email: 'test@example.com' };
      const response: AuthResponse = { access: fakeToken, refresh: 'fake-refresh-token' };

      this.storeToken(fakeToken);
      this.storeUser(fakeUser);
      this.loggedIn.next(true);
      this.currentUser.next(fakeUser);

      return of(response).pipe(delay(500));
    } else {
      return throwError(() => new Error('Invalid mock credentials')).pipe(delay(500));
    }
  }

  logout(): void {
    console.log('Mock Logout');
    this.removeToken();
    this.removeUser();
    this.loggedIn.next(false);
    this.currentUser.next(null);
    this.router.navigate(['/login']);
  }

  private storeToken(token: string): void { localStorage.setItem(this.JWT_TOKEN, token); }
  private removeToken(): void { localStorage.removeItem(this.JWT_TOKEN); }
  getJwtToken(): string | null { return localStorage.getItem(this.JWT_TOKEN); }
  private hasToken(): boolean { return !!this.getJwtToken(); }

  private storeUser(user: User): void { localStorage.setItem(this.USER_INFO, JSON.stringify(user)); }
  private removeUser(): void { localStorage.removeItem(this.USER_INFO); }
  private getUserFromStorage(): User | null {
    const userJson = localStorage.getItem(this.USER_INFO);
    return userJson ? JSON.parse(userJson) : null;
  }
}