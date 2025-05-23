import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginComponent } from './login/login.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import {HTTP_INTERCEPTORS,HttpClient,HttpClientModule} from "@angular/common/http";
import {FormsModule} from "@angular/forms";
import {AuthInterceptor} from "./auth.interceptor";
import { importProvidersFrom } from '@angular/core';


@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    DashboardComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    HttpClientModule,
  ],
  providers: [
    importProvidersFrom(HttpClientModule),
    [
      {
        provide: HTTP_INTERCEPTORS,
        useClass: AuthInterceptor,
        multi: true
      }
    ]],
  bootstrap: [AppComponent]
})
export class AppModule { }
