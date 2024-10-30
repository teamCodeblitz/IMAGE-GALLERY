import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { ActivatedRoute, Router } from '@angular/router';
import { PopupShowComponent } from '../popup-show/popup-show.component';
import { PopupComponent } from "../popup/popup.component"; // Import the PopupShowComponent

interface ReactionResponse {
    total_reacts: number; // Update the expected structure
    message: string; // Add this line to include the message property
    user_reacted: boolean; // Add this line to include the user_reacted property
}

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, PopupShowComponent, PopupComponent], // Include PopupComponent and PopupShowComponent
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {
    cards: any[] = Array().fill({}); // Example for 9 cards
    firstname: string = '';
    avatar: string = ''; // New property for avatar
    currentUserId: number | undefined; // Declare currentUserId without initializing
    email: string = ''; // New property for emails
    selectedImage: string = ''; // New property for selected image
    showPopup: boolean = false; // Control popup visibility
    selectedImageId: number | undefined; // New property for selected image ID
    totalReacts: { [key: number]: number } = {}; // New property to store total reacts for each card
    description: string = ''; // Add this line to declare the description property

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
        this.http.get<{ id: number; image: string; description: string; }[]>(`http://localhost/IMAGE-GALLERY/backend/get_gallery.php?id=${this.currentUserId}&email=${this.email}`)
            .subscribe(images => {
                console.log(images); // Log the images array to check the response
                if (images.length === 0) {
                    console.log('No Uploaded Files');
                    this.cards = [];
                } else {
                    this.cards = images.map(image => {
                        const imagePath = `http://localhost/IMAGE-GALLERY/backend/uploads/${image.image}`;
                        console.log('Image Path:', imagePath);
                        console.log('Image Description:', image.description); // Log the description
                        return { imagePath, id: image.id, description: image.description }; // Ensure description is included
                    });
                    console.log('Cards Array:', this.cards); // Log the cards array
                }
            });
    }

    openPopup(imagePath: string, imageId: number, description: string) {
        console.log('Opening Popup with Description:', description); // Log the description being passed
        this.selectedImage = imagePath; // Set the selected image path
        this.selectedImageId = imageId; // Set the selected image ID
        this.description = description; // Add this line to set the description
        this.showPopup = true; // Show the popup
        // Fetch the total reacts for the hovered card
        this.fetchTotalReacts(imageId);
    }

    fetchTotalReacts(imageId: number) {
        const userIdFromStorage = localStorage.getItem('userId'); // Retrieve user ID from local storage
        const userId = userIdFromStorage ? +userIdFromStorage : undefined; // Set userId

        if (userId) {
            this.http.get<ReactionResponse>(`http://localhost/IMAGE-GALLERY/backend/get_reaction.php?id=${imageId}&userId=${userId}`)
                .subscribe(response => {
                    console.log('Total reacts for hovered card:', response.total_reacts); // Log the total reacts
                    this.totalReacts[imageId] = response.total_reacts; // Store the total reacts for the specific imageId
                }, error => {
                    console.error('Error fetching reaction data:', error);
                });
        }
    }

    closePopup() {
        this.showPopup = false; // Hide the popup
    }

    updateUrl(cardId: string) {
        history.pushState(null, '', `/${cardId}`); // Update the URL to include the card ID
    }

}
