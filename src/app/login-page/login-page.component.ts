import { Component, OnDestroy, OnInit } from '@angular/core';
import { AuthenticationService } from '../services/authentication/authentication.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { MatSnackBar, MatSnackBarRef, TextOnlySnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-login-page',
  templateUrl: './login-page.component.html',
  styleUrls: ['./login-page.component.scss']
})
export class LoginPageComponent implements OnInit, OnDestroy {
  public loginForm: FormGroup;
  private openedSnackBar: MatSnackBarRef<TextOnlySnackBar>;

  constructor( private readonly authService: AuthenticationService, private readonly formBuilder: FormBuilder, private matSnackBar: MatSnackBar, private readonly router: Router) { }

  ngOnInit(): void {
    this.loginForm = this.formBuilder.group({
      username: ['', [Validators.required]],
      password: ['', [Validators.required]]
    })
  }

  ngOnDestroy(): void {
      if (this.openedSnackBar) {
        this.openedSnackBar.dismiss();
      }
  }

  loginUser() {
    this.authService.userLogin(this.loginForm.get('username').value,this.loginForm.get('password').value).subscribe({
      next: () => {
        this.router.navigateByUrl('home-page');
      },
      error: (message) => {
        this.openedSnackBar = this.matSnackBar.open(message, 'ok', {
          duration: 5000,
        })
      }
    });
  }
}
