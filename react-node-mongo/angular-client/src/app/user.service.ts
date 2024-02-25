// user.service.ts

import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import Cookies from 'universal-cookie';


@Injectable({
  providedIn: 'root'
})
export class UserService {
  private backendUrl = 'http://localhost:3001/api'; 
  private token = '';
  private login = '';


  constructor(private http: HttpClient) {}


  getLogin() {
    return this.login;
  }

  getJwtToken() {
  const cookies = new Cookies();

  if (this.token != '')
    return (this.token);
  else if (cookies.get('jwt-token') != undefined) {
    this.token = cookies.get('jwt-token');
    this.login = cookies.get('login');
    return (this.token);
  }
  return ('');
  }

  setUser(token: string, login: string) {
    this.token = token;
    this.login = login;
  }

  setCookie(token: string, login: string) {
    const cookies = new Cookies();
    cookies.set('jwt-token', token, { path: '/' });
    cookies.set('login', login, { path: '/' });
  }

  isAuthenticated(): boolean {
    if (this.token != '') {
      return true;
    }
    return(false);
  }

  logout() {
    const cookies = new Cookies();
    cookies.remove('jwt-token');
    cookies.remove('login');
    this.token = '';
    this.login = '';
  }

  
  // Register a new user
  registerUser(login: string, password: string): Observable<any> {
    const postData = { login, password };
    return this.http.post(`${this.backendUrl}/users`, postData);
  }

  // Log in and get user token
  loginUser(login: string, password: string): Observable<any> {
    const postData = { login, password };
    return this.http.post(`${this.backendUrl}/login`, postData);
  }

  // Get user data by token
  getUserData(token: string): Observable<any> {
    return this.http.get(`${this.backendUrl}/user`, { headers: { Authorization: `Bearer ${token}` } });
  }
}