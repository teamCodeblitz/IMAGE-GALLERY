import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { isPlatformBrowser } from '@angular/common';
import { Router } from '@angular/router';

@Injectable({
    providedIn: 'root'
})
export class AuthService {
    apiUrl = 'http://localhost/IMAGE-GALLERY/image-gallery-api/';
    private token: string = '';
    private userId: number | undefined;
    private firstName: string | undefined;
    private lastName: string | undefined;
    private avatar: string | undefined;
  
    constructor(
      private http: HttpClient,
      @Inject(PLATFORM_ID) private platformId: Object,
      private router: Router
    ) {
      if (isPlatformBrowser(this.platformId)) {
        this.token = localStorage.getItem('token') || '';
        this.userId = parseInt(localStorage.getItem('userId') || '', 10);
        this.firstName = localStorage.getItem('firstName') || ''; 
        this.lastName = localStorage.getItem('lastName') || ''; 
        this.avatar = localStorage.getItem('avatar') || '';
        console.log(
          'Constructor - Token:',
          this.token,
          'UserId:',
          this.userId,
          'FirstName:',
          this.firstName,
          'LastName:',
          this.lastName,
          'avatar:',
          this.avatar,
        );
      }
    }


  }