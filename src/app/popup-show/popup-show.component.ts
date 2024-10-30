import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { HttpClient } from '@angular/common/http';

// Define an interface for the response type
interface ReactionResponse {
    total_reacts: number; // Update the expected structure
    message: string; // Add this line to include the message property
    user_reacted: boolean; // Add this line to include the user_reacted property
}

// Define an interface for the user response type
interface UserResponse {
    firstName: string;
    avatar: string;
    email: string;
    description: string; // Add description to the response type
}

// Define an interface for the image response type
interface ImageResponse {
    id: number;
    image: string;
    description: string; // Add description to the image response type
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
    @Input() description!: string; // Add this line to receive the description
    
    // New property to control visibility
    isVisible: boolean = true;
    showEmojiPicker: boolean = false;
    selectedEmoji: string = '';
    isFavorite: boolean = false;
    showIcon: boolean = false;
    email: string = '';
    imageId!: number; // New property to store the image ID
    likeInfo: string = ''; // Add this line to declare the likeInfo property
    cards: { imagePath: string; id: number; description: string }[] = []; // Add this line to declare the cards property

    comments: string[] = [
        'Comment 1',
    ];

    constructor(private http: HttpClient) {}

    ngOnInit() {
        console.log('Description in PopupShowComponent:', this.description); // Log the description
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
        const userId = this.userId; // Get the userId
        console.log('Selected Image ID in toggleFavorite:', cardId); // Log the ID
        console.log('User ID being sent to PHP:', userId); // Log the user ID

        if (cardId) {
            const idToSend = Number(cardId); // Convert to number
            console.log('ID being sent to PHP:', idToSend); // Log the ID being sent

            this.http.post<ReactionResponse>('http://localhost/IMAGE-GALLERY/backend/toggle_reaction.php', {
                id: idToSend, // Send the ID as imageId
                userId: userId // Send the user ID
            }).subscribe(response => {
                console.log('Raw response:', response); // Log the raw response
                console.log('Reaction updated:', response);

                // Reverse the logic for updating the isFavorite state
                if (response.message === 'Reaction added') {
                    this.isFavorite = true; // Set to true if reaction was added
                } else if (response.message === 'Reaction removed') {
                    this.isFavorite = false; // Set to false if reaction was removed
                }

                // Call checkInitialReaction to update the UI instantly
                this.checkInitialReaction();
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
            const cardId = this.selectedImageId; // Store selected image ID
            const userId = this.userId; // Store user ID
            console.log('Card ID sent to PHP:', cardId); // Log the card ID
            console.log('User ID sent to PHP:', userId); // Log the user ID
            
            this.http.get<ReactionResponse>(`http://localhost/IMAGE-GALLERY/backend/get_reaction.php?id=${this.selectedImageId}&userId=${userId}`)
                .subscribe(response => {
                    console.log('Response from PHP:', response); // Log the response
                    this.isFavorite = response.user_reacted; // Set isFavorite based on user reaction
                    this.updateLikeInfo(response.total_reacts); // Update like info
                }, error => {
                    console.error('Error fetching reaction data:', error);
                });
        }
    }

    // New method to update like info
    updateLikeInfo(totalReacts: number) {
        const currentUserId = this.userId; // Assuming this.userId is the current user's ID

        if (totalReacts === 0) {
            this.likeInfo = 'Be the first to like this post'; // No likes
        } else if (totalReacts === 1) {
            if (this.isFavorite) {
                this.likeInfo = 'You like this post'; // You are the only one
            } else {
                this.likeInfo = `${totalReacts} like this post`; // Other user liked it
            }
        } else {
            if (this.isFavorite) {
                this.likeInfo = `You and ${totalReacts - 1} ${totalReacts - 1 === 1 ? 'other like' : 'others like'} this post`; // You and others
            } else {
                this.likeInfo = `${totalReacts} ${totalReacts === 1 ? 'like' : 'likes'} this post`; // Others only
            }
        }
    }

    getUserGallery() {
        const currentUserId = this.userId; // Add this line to use userId instead
        this.http.get<{ id: number; image: string; description: string; }[]>(`http://localhost/IMAGE-GALLERY/backend/get_gallery.php?id=${currentUserId}&email=${this.email}`)
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
                        return { imagePath, id: image.id, description: image.description };
                    });
                }
            });
    }

    // Add this method to handle image selection
    selectImage(image: { imagePath: string; id: number; description: string }) {
        this.imagePath = image.imagePath; // Set the image path
        this.selectedImageId = image.id.toString(); // Set the selected image ID
        this.description = image.description; // Set the description of the selected image
        console.log('Selected Image Description:', this.description); // Debugging line
    }

}
