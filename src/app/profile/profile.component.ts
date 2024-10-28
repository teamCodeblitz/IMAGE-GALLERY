import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {
    cards: any[] = Array(9).fill({}); // Example for 9 cards
    firstname: string = '';
    avatar: string = ''; // New property for avatar
    currentUserId: number | undefined; // Declare currentUserId without initializing
    email: string = ''; // New property for email

    constructor(private http: HttpClient, private route: ActivatedRoute, private router: Router) {} // Inject Router

    ngOnInit() {
        const userIdFromStorage = localStorage.getItem('userId'); // Retrieve user ID from local storage
        this.currentUserId = userIdFromStorage ? +userIdFromStorage : undefined; // Set currentUserId
        if (this.currentUserId) {
            this.getUserFirstname();
        } else {
            console.error("User ID not found.");
        }
    }

    getUserFirstname() {
        this.http.get<{
          error(error: any): unknown;
          firstName: string; avatar: string; email: string // Include email in type
        }>(`http://localhost/IMAGE-GALLERY/backend/get_user.php?id=${this.currentUserId}`)
            .subscribe(response => {
                if (response.firstName) {
                    this.firstname = response.firstName;
                    this.avatar = response.avatar; // Set avatar
                    this.email = response.email; // Set email
                    this.getUserGallery(); // Fetch user gallery images
                } else {
                    console.error(response.error); // Corrected to use dot notation for error property
                }
            });
    }

    getUserGallery() {
        this.http.get<string[]>(`http://localhost/IMAGE-GALLERY/backend/get_gallery.php?id=${this.currentUserId}&email=${this.email}`)
            .subscribe(images => {
                console.log(images); // Log the images array to check the response
                if (images.length === 0) { // Check if there are no images
                    console.log('No Uploaded Files'); // Log the message
                    this.cards = []; // Clear the cards array
                } else {
                    this.cards = images.map(image => {
                        const imagePath = `http://localhost/IMAGE-GALLERY/backend/uploads/${image}`; // Updated to include full URL
                        console.log('Image Path:', imagePath); // Log the image path for debugging
                        return { imagePath }; // Return the object with the image path
                    });
                }
            });
    }
}
