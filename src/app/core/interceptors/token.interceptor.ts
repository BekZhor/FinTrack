import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { AuthService } from '../services/auth.service';

export const tokenInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthService);
  const token = authService.getJwtToken();

  if (token) {
    console.log('Token Interceptor: Would add token if this were a real API call');
 
  }

  return next(req); 
};