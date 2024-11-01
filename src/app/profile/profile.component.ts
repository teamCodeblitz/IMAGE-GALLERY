import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { ActivatedRoute, Router } from '@angular/router';
import { PopupShowComponent } from '../popup-show/popup-show.component';
import { PopupComponent } from "../popup/popup.component"; // Import the PopupShowComponent


@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, PopupShowComponent, PopupComponent], // Include PopupComponent and PopupShowComponent
  providers: [PopupShowComponent], // Add this line to provide PopupShowComponent
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
    comments: string[] = []; // New property to store comments
    popupShowComponent: PopupShowComponent; // Declare the PopupShowComponent instance
    datePosted: string = ''; // Declare datePosted property
    postCount: number = 0; // Declare postCount property
    showUploadButton: boolean = false; // Declare showUploadButton property

    constructor(private http: HttpClient, private route: ActivatedRoute, private router: Router, popupShowComponent: PopupShowComponent) { // Inject PopupShowComponent
        this.popupShowComponent = popupShowComponent; // Initialize the instance
    }

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
                    console.log('Received avatar:', this.avatar); // Log
                    this.email = response.email; // Set email
                    this.getUserGallery(); // Fetch user gallery images
                } else {
                    console.error(response.error); // Corrected to use dot notation for error property
                }
            });
    }

    getUserGallery() {
        this.http.get<{ images: { id: number; image: string; description: string; date: string; }[]; postCount: number; }>(`http://localhost/IMAGE-GALLERY/backend/get_gallery.php?id=${this.currentUserId}&email=${this.email}`)
            .subscribe(response => {
                if (response.images.length === 0) {
                    console.log('No Uploaded Files');
                    this.cards = [];
                } else {
                    this.cards = response.images.map(image => {
                        const imagePath = `http://localhost/IMAGE-GALLERY/backend/uploads/${image.image}`;
                        return { imagePath, id: image.id, description: image.description, date: image.date }; // Ensure date is included
                    });
                }
                this.postCount = response.postCount; // Set post count
            });
    }

    openPopup(imagePath: string, imageId: number, description: string, date: string) {
        this.selectedImage = imagePath;
        this.selectedImageId = imageId;
        this.description = description;
        this.datePosted = date; // Set the datePosted here
        this.showPopup = true;
    }

    closePopup() {
        this.showPopup = false; // Hide the popup
    }

    updateUrl(cardId: string) {
        history.pushState(null, '', `/${cardId}`); // Update the URL to include the card ID
    }

    onFileSelected(event: Event) {
        const fileInput = event.target as HTMLInputElement;
        if (fileInput.files && fileInput.files.length > 0) {
            const file = fileInput.files[0];

            // Check if the selected file is an image
            const validImageTypes = ['image/jpeg', 'image/png', 'image/gif'];
            if (!validImageTypes.includes(file.type)) {
                console.error('Invalid file type. Please select an image file (JPEG, PNG, GIF).');
                alert('Invalid file type. Please select an image file (JPEG, PNG, GIF).');
                return; // Stop the upload process
            }

            // Check file size (in bytes)
            const maxSizeInMB = 10;
            if (file.size > maxSizeInMB * 1024 * 1024) {
                console.error(`File size exceeds the limit of ${maxSizeInMB}MB.`);
                alert(`File size exceeds the limit of ${maxSizeInMB}MB.`);
                return; // Stop the upload process
            }

            const reader = new FileReader();
            reader.onload = () => {
                const base64Image = reader.result as string; // Get base64 string
                const formData = new FormData();
                formData.append('imageData', base64Image); // Append base64 image data
                this.uploadAvatar(formData);
            };
            reader.readAsDataURL(file); // Read the file as a data URL
        }
    }

    uploadAvatar(formData: FormData) {
        // Append the current user ID to the form data
        if (this.currentUserId) {
            formData.append('userId', this.currentUserId.toString());
        }

        this.http.post('http://localhost/IMAGE-GALLERY/backend/update_profile.php', formData)
            .subscribe((response: any) => { // Use 'any' for more flexibility
                console.log('Response from server:', response); // Log the entire response
                if (response && response.avatar) {
                    this.avatar = response.avatar; // Update avatar with the new URL
                    console.log('Avatar updated successfully:', this.avatar); // Log success
                } else {
                    console.error('Avatar update failed:', response.error || 'No error message provided');
                }
            }, (error: HttpErrorResponse) => {
                console.error('Error uploading avatar:', error.message);
                console.error('Error details:', error);
            });
    }

}
