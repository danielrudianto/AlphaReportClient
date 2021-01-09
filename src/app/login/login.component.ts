import { Component, OnInit } from '@angular/core';
import { UserService } from '../user.service';
import { User } from '../interface/user.interface';
import { Router } from '@angular/router';
import { MatSnackBar } from "@angular/material/snack-bar";
import { AuthService } from '../auth.service';
import { CookieService } from 'ngx-cookie-service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  email: string;
  password: string;
  isLoading: boolean;

  constructor(
    private userService: UserService,
    private router: Router,
    private _snackBar: MatSnackBar,
    private authService: AuthService,
    private cookieService: CookieService
  ) {
    this.authService.logout();
  }

  ngOnInit(): void {
    this.isLoading = false;
    this.email = "";
    this.password = "";
  }

  login() {
    this.isLoading = true;
    this.authService.login(this.email, this.password).subscribe((responseData: User) => {
      if (responseData != null) {
        this.cookieService.set("user", JSON.stringify(responseData));
        this.authService.user = responseData;
        this.authService.isLoggedIn = true;
        this.router.navigate(['/']);
      } else {
        this._snackBar.open("Failed to login", "Close", {
          duration: 2000
        })
      }

      this.isLoading = false;
    })
  }
}
