import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatIcon } from '@angular/material/icon';
import { Router, ActivatedRoute } from '@angular/router';
import { MatDialog } from '@angular/material/dialog'; // Import MatDialog
import { PopupComponent } from '../popup/popup.component';
import { DashboardComponent } from '../dashboard/dashboard.component';
import { DashboardService } from '../services/dashboard.service';


@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule, MatSidenavModule, MatIcon, DashboardComponent],
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css']
})
export class SidebarComponent implements OnInit {
  activePage: string = ''; // Declare a property to track the active page
  isExpanded = false; // Track the expanded state

  constructor(private router: Router, private dialog: MatDialog, private dashboardService: DashboardService) {} // Inject MatDialog

  ngOnInit() {
    this.router.events.subscribe(() => {
      this.activePage = this.router.url; // Set the active page based on the current URL
      console.log('Active Page:', this.activePage);
    });
  }

  isActive(page: string): boolean {
    return this.activePage === page; // Check if the given page is active
  }


  logout() {
    // Clear user session or token
    localStorage.removeItem('userToken'); // Example for removing a token
    // Redirect to login page
    this.router.navigate(['/login']); // Assuming you have Router injected
  }

  navigateTo(page: string) {
    this.dashboardService.setLoading(true); // Set loading state to true immediately
    this.router.navigate([page]).then(() => {
        // Reload the page after navigation
        window.location.reload(); // Force a reload of the page
    });
  }

  openPopup() {
    const dialogRef = this.dialog.open(PopupComponent, {
        width: '60%',
        height: '70%', // Set the width of the dialog
        data: { /* pass any data if needed */ }
    });

    dialogRef.afterClosed().subscribe(result => {
        console.log('The dialog was closed');
        // Handle any actions after the dialog is closed
    });
  }

}
