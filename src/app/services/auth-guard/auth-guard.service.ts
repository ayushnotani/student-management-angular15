import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AuthenticationService } from '../authentication/authentication.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuardService implements CanActivate{

  constructor(private readonly authService: AuthenticationService, private readonly router: Router) { }

  canActivate(): boolean {
    if (this.authService.getAccessToken()) {
      return true;
    }
    else {
      this.router.navigate(['login']);
      return false;
    }
  }
}
