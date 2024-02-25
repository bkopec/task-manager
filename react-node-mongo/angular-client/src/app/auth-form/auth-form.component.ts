import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';

import { UserService } from '../user.service'; 
import { HeaderComponent } from '../header/header.component'; // Assuming you have a HeaderComponent to display the header

const backendUrl = 'http://localhost:3001';

@Component({
  selector: 'app-auth-form',
  templateUrl: './auth-form.component.html',
  styleUrls: ['./auth-form.component.css'],
  standalone: true,
  imports: [CommonModule, HeaderComponent],
  providers: [UserService]
})
export class AuthFormComponent {
  login: string = '';
  password: string = '';
  errors = { passwordTooShort: false, passwordInvalid: false };

  constructor(private http: HttpClient, private userService: UserService) {}

  handleInputChange(event: any): void {
    const target = event.target;
    const value = target.value;
    const name = target.name;
  
    (this as any)[name] = value;
    this.errors = { passwordInvalid: false, passwordTooShort: false };
  }

  handleSubmit(event: any): void {
    event.preventDefault();

    const postData: any = {
      login: this.login,
      password: this.password
    };

    if (this.password.length < 4) {
      this.errors = { ...this.errors, passwordTooShort: true };
      return;
    }

    this.http.post<any>(`${backendUrl}/api/users`, postData)
      .subscribe(
        response => {
          this.userService.setUser(response.token, response.login);
          this.userService.setCookie(response.token, response.login);
        },
        error => {
          if (error.status === 401) {
            const data = error.error;
            if (data.error === 'INVALID_PASSWORD') {
              this.errors = { ...this.errors, passwordInvalid: true };
            } else {
              console.error(error);
            }
          }
        }
      );
  }
}