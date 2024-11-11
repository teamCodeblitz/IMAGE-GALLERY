// src/app/edit-profile/edit-profile.component.ts
import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { ActivatedRoute, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ProfileComponent } from '../profile/profile.component';

@Component({
  selector: 'app-edit-profile',
  standalone: true,
  imports: [CommonModule, FormsModule, ProfileComponent],
  templateUrl: './edit-profile.component.html',
  styleUrls: ['./edit-profile.component.css']
})
export class EditProfileComponent implements OnInit {
  @Input() firstname: string = '';
  @Input() email: string = '';
  @Input() avatar: string = '';
  @Output() profileUpdated = new EventEmitter<any>();
  @Output() popupClosed = new EventEmitter<void>();

  updatedFirstname: string = '';
  updatedEmail: string = '';
  updatedLastname: string = '';
  updatedMiddlename: string = '';
  updatedPassword: string = '';
  userId: string = '';

  constructor(private http: HttpClient, private route: ActivatedRoute) {}

  ngOnInit() {
    this.userId = localStorage.getItem('userId') || '';
    console.log('Current User ID:', this.userId);
    this.getUserData();
  }

  getUserData() {
    console.log('Current User ID:', this.userId);
    this.http.get(`http://localhost/IMAGE-GALLERY/backend/get_user.php?id=${this.userId}`)
      .subscribe((response: any) => {
        if (response.error) {
            console.error('Error fetching user data:', response.error);
        } else {
            this.updatedFirstname = response.firstName;
            this.updatedLastname = response.lastName;
            this.updatedMiddlename = response.middleName;
            this.updatedEmail = response.email;
            this.updatedPassword = response.password;

            console.log('User data received:', response);
        }
      }, error => {
        console.error('Error fetching user data:', error.message || error);
        console.error('Full error response:', error);
      });
  }

  submit() {
    const profileData = {
      id: this.userId,
      firstname: this.updatedFirstname,
      lastname: this.updatedLastname,
      middlename: this.updatedMiddlename,
      email: this.updatedEmail,
      password: this.updatedPassword,
    };

    this.http.post('http://localhost/IMAGE-GALLERY/backend/edit_profile.php', profileData)
      .subscribe((response: any) => {
        console.log(response);
        this.profileUpdated.emit(profileData);
        this.close();
      }, error => {
        console.error('Error updating profile:', error);
      });
  }

  close() {
    this.popupClosed.emit();
  }
}