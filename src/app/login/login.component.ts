import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule, MatProgressSpinnerModule, CommonModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  loginForm: FormGroup;
  errorMessage: string | null = null;

  constructor(private fb: FormBuilder, private http: HttpClient, private router: Router) {
    // Initialize the loginForm with the required controls
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]], // Add email control
      password: ['', [Validators.required, Validators.minLength(6)]] // Add password control
    });
  }

  goToRegister() {
    this.router.navigate(['/register']);
  }

  login() {
    this.errorMessage = null;
    this.http.post('http://localhost/IMAGE-GALLERY/backend/login.php', this.loginForm.value, { responseType: 'text' })
    .subscribe((response: any) => {
       console.log(response);
       try {
          const jsonResponse = JSON.parse(response);
          if (jsonResponse.success) {
             localStorage.setItem('userId', jsonResponse.userId); // Store user ID in local storage
             localStorage.setItem('email', this.loginForm.value.email); // Store email in local storage
             this.router.navigate(['/dashboard']);
          } else {
             this.errorMessage = jsonResponse.error;
          }
       } catch (e) {
          console.error("Invalid JSON response:", response);
          this.errorMessage = "Server returned an invalid response. Please check server logs.";
       }
    }, error => {
       console.error('Error:', error);
       this.errorMessage = error.error ? error.error : 'Login failed. Please try again later.';
    });
  }
}
