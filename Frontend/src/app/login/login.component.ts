import { Component } from '@angular/core';
import { ApiService } from '../api.service';
import {User} from "../../models";
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  standalone: false,
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {

  authModel: User;

  constructor(private ApiService: ApiService, private router:Router) {
    this.authModel = {} as User
  }

  login() {
    this.ApiService.login(this.authModel).subscribe((token) => {
      localStorage.setItem('access', token.access);
      localStorage.setItem('refresh', token.refresh)
      this.router.navigate(['board'])
    })
  }

}
