import { HttpInterceptorFn } from '@angular/common/http';
import {Injectable} from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor
} from '@angular/common/http';
import {Observable} from 'rxjs';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {

  constructor() {
  }

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    const access = localStorage.getItem("access");
    if (access) {
      const newReq = request.clone({
        headers: request.headers.set('Authorization', `Bearer ${access}`)
      });
      return next.handle(newReq);
    }

    return next.handle(request);
  }
}
