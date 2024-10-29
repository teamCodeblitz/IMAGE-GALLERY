import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { HttpClient } from '@angular/common/http';

// Define an interface for the response type
interface ReactionResponse {
    message: string; // Define the expected structure
}

@Component({
  selector: 'app-popup-show',
  standalone: true,
  imports: [CommonModule, FormsModule, MatIconModule],
  templateUrl: './popup-show.component.html',
  styleUrls: ['./popup-show.component.css']
})
export class PopupShowComponent implements OnInit {
    @Input() userId!: number | undefined;
    @Input() galleryId!: number;
    @Input() imagePath!: string;
    @Input() avatar!: string;
    @Input() firstName!: string;
    @Output() popupClosed = new EventEmitter<void>();
    @Output() imageSelected = new EventEmitter<number>();
    @Input() selectedImageId!: string;
    
    // New property to control visibility
    isVisible: boolean = true;
    showEmojiPicker: boolean = false;
    selectedEmoji: string = '';
    description: string = '';
    isFavorite: boolean = false;
    showIcon: boolean = false;
    email: string = '';
    imageId!: number; // New property to store the image ID

    comments: string[] = [
        'Comment 1',
    ];

    constructor(private http: HttpClient) {}

    ngOnInit() {
        const userIdFromStorage = localStorage.getItem('userId'); // Retrieve user ID from local storage
        this.userId = userIdFromStorage ? +userIdFromStorage : undefined; // Set userId
        if (this.userId) {
            this.fetchUserData(); // Fetch user data if userId is available
        } else {
            console.error("User ID not found."); // Log error if userId is not found
        }
        this.checkInitialReaction(); // Check initial reaction state
    }

    fetchUserData() {
        if (!this.userId) {
            console.error('User ID is not provided');
            return; // Exit if userId is not available
        }

        this.http.get<{ firstName: string; avatar: string; email: string }>(`http://localhost/IMAGE-GALLERY/backend/get_user.php?id=${this.userId}`)
            .subscribe(response => {
                if (response.firstName) {
                    this.firstName = response.firstName;
                    this.avatar = response.avatar; // Set avatar
                    this.email = response.email; // Set email
                } else {
                    console.error('User not found or error in response');
                }
            }, error => {
                console.error('Error fetching user data:', error);
            });
    }

    addEmoji(emoji: string): void {
      this.description += emoji;
  }

  limitDescription(event: KeyboardEvent) {
      if (event.key === 'Backspace' || event.key === 'Delete') {
          return;
      }

      if (this.description.length >= 15) {
          event.preventDefault();
      }
  }

    closePopup() {
        this.isVisible = false;
        this.popupClosed.emit();
    }

 

    toggleFavorite() {
        const cardId = this.selectedImageId; // Ensure this is set correctly
        console.log('Selected Image ID in toggleFavorite:', cardId); // Log the ID

        if (cardId) {
            const idToSend = Number(cardId); // Convert to number
            console.log('ID being sent to PHP:', idToSend); // Log the ID being sent

            this.http.post<ReactionResponse>('http://localhost/IMAGE-GALLERY/backend/toggle_reaction.php', {
                id: idToSend // Send the ID
            }).subscribe(response => {
                console.log('Raw response:', response); // Log the raw response
                console.log('Reaction updated:', response);

                // Reverse the logic for updating the isFavorite state
                if (response.message === 'Reaction added') {
                    this.isFavorite = true; // Set to true if reaction was added
                } else if (response.message === 'Reaction removed') {
                    this.isFavorite = false; // Set to false if reaction was removed
                }
            }, error => {
                console.error('Error updating reaction:', error);
                console.error('Response body:', error.error); // Log the response body for more details
            });
        } else {
            console.error('No card ID found for reaction.'); // Ensure cardId is used correctly
        }
    }

    // New method to check the initial reaction state
    checkInitialReaction() {
        if (this.selectedImageId) {
            this.http.get<{ reacts: number }>(`http://localhost/IMAGE-GALLERY/backend/get_reaction.php?id=${this.selectedImageId}`)
                .subscribe(response => {
                    this.isFavorite = response.reacts > 0; // Set isFavorite based on reacts count
                }, error => {
                    console.error('Error fetching reaction data:', error);
                });
        }
    }

}
