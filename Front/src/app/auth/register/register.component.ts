import { Component } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './register.component.html',
  styleUrls: ['../login/login.component.css'] 
})
export class RegisterComponent {
  userData = { username: '', email: '', password: '', password2: '' }; 
  errorMessage: string | null = null;
  successMessage: string | null = null;
  loading = false;

  constructor(private authService: AuthService, private router: Router) { }

  passwordsMatch(): boolean {
    return this.userData.password === this.userData.password2;
  }

  onSubmit(): void { 
    this.errorMessage = null;
    this.successMessage = null;
    if (!this.passwordsMatch()) {
      this.errorMessage = "The passwords do not match.";
      return;
    }
    this.loading = true;
    const { password2, ...registerData } = this.userData;

    this.authService.register(registerData).subscribe({
      next: (user) => {
        this.loading = false;
        this.successMessage = `"${user.username}" successfully registered (mock)! Redirecting to the login page...`;
        setTimeout(() => this.router.navigate(['/login']), 2500); 
      },
      error: (err) => {
        this.loading = false;
        this.errorMessage = err.message || 'An error occurred while logging in (mock).';
        console.error('Registration failed:', err);
      }
    });
  }
}