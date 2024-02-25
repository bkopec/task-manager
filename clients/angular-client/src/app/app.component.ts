// app.component.ts
import { Component, OnInit } from '@angular/core';
import { Router, RouterOutlet, RouterLink, RouterLinkActive } from '@angular/router';
import { UserService } from './user.service'; // Create UserService to manage user state
import { HttpClientModule } from '@angular/common/http'; // Import HttpClientModule



@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  standalone: true,
  imports: [HttpClientModule, RouterOutlet, RouterLink, RouterLinkActive],
  providers: [UserService]
})
export class AppComponent implements OnInit {
  user: any = {};

  constructor(private userService: UserService, private router: Router) {}

  ngOnInit() {
    // Initialize user state from cookies or other storage
    console.log("hihi");
    const storedToken = this.userService.getJwtToken();
    if (storedToken) {
      console.log(storedToken);
      this.user = { token: storedToken, login: this.userService.getLogin() };
    }
    else
      this.router.navigate(['/auth']);
  }

  // Add a method to check if the user is authenticated
  isAuthenticated(): boolean {
    return this.userService.isAuthenticated();
  }

  // Add a method to logout the user
  logout(): void {
    this.userService.logout();
    this.router.navigate(['/auth']);
  }
}