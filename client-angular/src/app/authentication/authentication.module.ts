import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { AuthService } from '../core/authentication.service';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

@NgModule({
  declarations: [
    LoginComponent,
    RegisterComponent
  ],
  imports: [
    CommonModule,
    FormsModule ,
    ReactiveFormsModule,
    RouterModule.forChild([
      { path: 'authentication/register', component: RegisterComponent},
      { path: 'authentication/login', component: LoginComponent},
    ])
  ],
  exports: [
    LoginComponent,
    RegisterComponent
  ],
  providers: [
    AuthService
  ],
  bootstrap: [
    RegisterComponent
  ]
})
export class AuthenticationModule { }
