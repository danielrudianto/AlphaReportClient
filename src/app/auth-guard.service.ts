import { Injectable } from '@angular/core';
import { Router, CanActivate } from '@angular/router';
import { AuthService } from './auth.service';
@Injectable({
  providedIn: 'root'
})
export class AuthGuardService implements CanActivate {
  constructor(
    public authService: AuthService,
    public router: Router) { }
  canActivate(): boolean {
    if (!this.authService.isLoggedIn) {
      this.router.navigate(['/Login']);
      return false;
    }
    return true;
  }

  canActivateAdmin(): boolean {
    if (this.authService.user.LastPosition.Position < 3) {
      this.router.navigate(["/Login"]);
      return false;
    }
    return true;
  }
}
