import { Component } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';
import { CommonModule } from '@angular/common'; 
import { FormsModule } from '@angular/forms'; 

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule], 
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  credentials = { username: 'test', password: 'password' };
  errorMessage: string | null = null;
  loading = false;

  constructor(private authService: AuthService, private router: Router) { }

  onSubmit(): void { 
    this.errorMessage = null;
    this.loading = true; 
    this.authService.login(this.credentials).subscribe({
      next: () => {
        this.loading = false;
        this.router.navigate(['/dashboard']); 
      },
      error: (err) => {
        this.loading = false;
        this.errorMessage = 'Incorrect login or password (mock). Please use "test"/"password".';
        console.error('Login failed:', err);
      }
    });
  }
}