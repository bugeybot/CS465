import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthenticationService } from '../services/authentication.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  public formError: string = '';
  public credentials = {
    email: '',
    password: ''
  };

  constructor(
    private router: Router,
    private authenticationService: AuthenticationService
  ) {}

  public onLoginSubmit(): void {
    this.formError = '';
    if (!this.credentials.email || !this.credentials.password) {
      this.formError = 'All fields are required, please try again';
    } else {
      this.doLogin();
    }
  }

  private doLogin(): void {
    const loginData = {
      email: this.credentials.email,
      password: this.credentials.password
    };

    this.authenticationService.login(loginData)
      .subscribe({
        next: () => {
          this.router.navigate(['/list-trips']);
        },
        error: (error: any) => {
          console.error('Login error:', error);
          this.formError = error.status === 401
            ? 'Invalid email or password.'
            : 'An unexpected error occurred. Please try again.';
        }
      });
  }
}
