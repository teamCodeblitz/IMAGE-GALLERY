import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';
import { ReactiveFormsModule } from '@angular/forms';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatSidenav } from '@angular/material/sidenav';
import { MatButtonModule } from '@angular/material/button';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIcon } from '@angular/material/icon';
import { SidenavService } from './services/sidenav.service';
import { Router, NavigationEnd } from '@angular/router'; // Updated import

import { ConfirmationModalComponent } from './confirmation-modal/confirmation-modal.component';

//PAGES
import { BodyComponent } from './body/body.component';
import { RegisterComponent } from './register/register.component';
import { LoginComponent } from './login/login.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { SidebarComponent } from './sidebar/sidebar.component';
import { LoaderComponent } from './loader/loader.component';
import { ProfileComponent } from './profile/profile.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule,
    RouterOutlet,
    HttpClientModule,
    ReactiveFormsModule,
    ConfirmationModalComponent,
    MatSidenavModule,
    MatIcon,
    MatSidenav,
    MatButtonModule,
    MatToolbarModule,
    BodyComponent, 
    LoginComponent, 
    RegisterComponent,
    DashboardComponent,
    SidebarComponent,
    ProfileComponent,
    LoaderComponent,
  ],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  isOpened: boolean = true;

  title = 'KNG';

  constructor(private router: Router) {}

  ngOnInit() {
    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        // Hide sidebar on Login and Register routes
        this.isOpened = !['/login', '/register', '/loader'].includes(this.router.url);
      }
    });
  }
}
