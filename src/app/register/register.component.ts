import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent {
  registerForm: FormGroup;

  constructor(private fb: FormBuilder, private http: HttpClient, private router: Router) {
    this.registerForm = this.fb.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      middleName: [''],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  register() {
    if (this.registerForm.valid) {
      this.http.post('http://localhost/IMAGE-GALLERY/backend/register.php', this.registerForm.value, { responseType: 'text' })
      .subscribe((response: any) => {
         console.log(response);
         try {
            const jsonResponse = JSON.parse(response);
            if (jsonResponse.success) {
               this.router.navigate(['/login']);
            } else {
               alert(jsonResponse.error);
            }
         } catch (e) {
            console.error("Invalid JSON response:", response);
            alert("Server returned an invalid response. Please check server logs.");
         }
      }, error => {
         console.error('Error:', error);
         alert(error.error ? error.error : 'Registration failed. Please try again later.');
      });
   
    }
  }

  goToLogin() {
    this.router.navigate(['/login']);
  }
}
