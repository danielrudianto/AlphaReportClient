import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { User, Position } from './interface/user.interface';
import { CookieService } from 'ngx-cookie-service'

@Injectable({
  providedIn: "root"
})
export class AuthService {
  isLoggedIn: boolean;
  user: User = null;

  constructor(
    private http: HttpClient,
    private cookieService: CookieService
  ) {
    if (this.user == null) {
      this.isLoggedIn = false;
    } else {
      this.user = JSON.parse(this.cookieService.get("user"));
      this.login(this.user.Email, this.user.Password).subscribe((responseData: User) => {
        if (responseData != null) {
          this.cookieService.set("user", JSON.stringify(responseData));
          this.isLoggedIn = true;
        } else {
          this.cookieService.set("user", null);
          this.isLoggedIn = false;
        }
      });
    }
    
  }

  login(email: string, password: string) {
    return this.http.post("https://localhost:44331/Api/UserLogin", JSON.stringify({ email: email, password: password }), {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        "Access-Control-Allow-Origin": "*"
      })
    })
  }

  logout() {
    this.cookieService.set("user", null);
    this.isLoggedIn = false;
  }

}
