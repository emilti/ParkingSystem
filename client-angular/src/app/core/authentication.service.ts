import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable()
export class AuthService {
  private readonly loginUrl = 'http://localhost:57740/Authenticate/login';
  private readonly registerUrl = 'http://localhost:57740/Authenticate/register';

  constructor(
    private http : HttpClient
  ) {  }

  register(body: any) {
    return this.http.post(this.registerUrl, body);
  }

  login(body: any) {
    return this.http.post(this.loginUrl, body);
  }

  logout() {
    localStorage.clear();
  }

  isAuthenticated() {
    return localStorage.getItem('token') !== null;
  }

  getToken(){
    let token = localStorage.getItem('token')
    return token;
  }
}