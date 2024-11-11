import { Component, Inject, AfterViewInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { CommonModule } from '@angular/common';
import { MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { FormsModule } from '@angular/forms';
import { fromEvent } from 'rxjs';
    
@Component({
  selector: 'app-popup',
  standalone: true,
  imports: [CommonModule, MatDialogModule, MatIconModule, FormsModule],
  templateUrl: './popup.component.html',
  styleUrls: ['./popup.component.css']
})
export class PopupComponent implements AfterViewInit {
    currentPage: number = 1; // Initialize current page
    hovered: boolean = false; // Declare the hovered property
    imageUrl: string | null = null; // Declare imageUrl property
    showEmojiPicker: boolean = false; // {{ edit_1 }}
    selectedEmoji: string = ''; // {{ edit_1 }}
    showIcon: boolean = true; // {{ edit_1 }}
    description: string = '';
    currentUserId: string = ''; // Declare currentUserId property with initializer
    email: string = ''; // Declare email property with initializer
    avatar: string | null = null; // Declare avatar property with initializer
    scale: number = 100; // Initial scale
    top: number = 0; // Initial top position
    left: number = 0; // Initial left position
    imageWidth: number = 0; // Width of the image
    imageHeight: number = 0; // Height of the image

    constructor(private dialogRef: MatDialogRef<PopupComponent>) { // {{ edit_1 }}
        this.currentUserId = ''; // Initialize in constructor
        this.email = ''; // Initialize in constructor
    }

    ngAfterViewInit(): void {
        fromEvent(window, "wheel").subscribe((ev: Event) => {
            const wheelEvent = ev as WheelEvent;
            const newScale = this.scale - wheelEvent.deltaY * 0.2;  
            this.scale = Math.max(newScale, 100);
            
            // Calculate the new top and left positions based on the mouse pointer
            this.top = wheelEvent.clientY - (this.scale / 2);
            this.left = wheelEvent.clientX - (this.scale / 2);
        });
      }
      
    goToPage(page: number): void {
        if (page >= 1 && page <= 4) {
            if (page === 1) {
                this.imageUrl = null; // Reset imageUrl when going back to page 1
            }
            this.currentPage = page; // Update current page
        }
    }

    getPageTitle(page: number): string {
        switch (page) {
            case 1: return 'Create New Post';
            case 2: return 'View Image';
            case 3: return 'Edit Image';
            case 4: return 'Upload';
            default: return '';
        }
    }

    onDone(): void {
        const userId = localStorage.getItem('userId'); // Retrieve user ID from local storage
        const email = localStorage.getItem('email'); // Retrieve email from local storage
        if (!userId) {
            console.error('User ID not found. Please log in again.');
            return; // Prevent upload if no user ID
        }

        const uploadData = {
            user_id: userId, // Use the retrieved user ID
            email: email, // Use the retrieved email
            image: this.imageUrl,
            description: this.description,
            date: new Date().toISOString()
        };

        console.log('Upload Data:', uploadData); // Log the data being sent

        // Check if imageUrl is valid
        if (!this.imageUrl) {
            console.error('No image URL available for upload.');
            return; // Prevent upload if no image
        }

        fetch('http://localhost/IMAGE-GALLERY/backend/upload.php', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(uploadData)
        })
        .then(response => {
            if (!response.ok) {
                return response.text().then(text => {
                    throw new Error(`HTTP error! Status: ${response.status}, Response: ${text}`);
                });
            }
            return response.json();
        })
        .then(data => {
            if (data.success) {
                console.log(data.success);
                this.dialogRef.close(); // Close the popup on successful upload
                location.reload(); // Reload the page after closing the popup
            } else {
                console.error(data.error);
            }
        })
        .catch(error => {
            console.error('Error:', error);
        });
    }

    onFileSelect(event: Event): void {
        const input = event.target as HTMLInputElement;
        if (input.files && input.files.length > 0) {
            const file = input.files[0];
            const img = new Image();
            img.onload = () => {
                this.imageWidth = img.width; // Set the original image width
                this.imageHeight = img.height; // Set the original image height
                const canvas = document.createElement('canvas');
                canvas.width = img.width; // Set canvas width to the original image width
                canvas.height = img.height; // Set canvas height to the original image height
                const ctx = canvas.getContext('2d');
                ctx?.drawImage(img, 0, 0, canvas.width, canvas.height); // Draw the image on the canvas
                this.imageUrl = canvas.toDataURL(); // Set the imageUrl to the resized image
                this.goToPage(2); // Automatically go to the second page
            };
            img.src = URL.createObjectURL(file); // Load the image
        }
    }

    addEmoji(emoji: string): void { // {{ edit_2 }}
        this.description += emoji; // Append the emoji to the description
    }

    limitDescription(event: KeyboardEvent) {
        // Allow backspace and delete keys
        if (event.key === 'Backspace' || event.key === 'Delete') {
            return; // Allow deletion
        }

        // Prevent further input if the length is 15 or more
        if (this.description.length >= 15) {
            event.preventDefault(); // Prevent further input
        }
    }

    // New method to handle user login
    login(email: string, password: string): void {
        const loginData = { email, password };

        fetch('http://localhost/IMAGE-GALLERY/backend/login.php', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(loginData)
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                this.currentUserId = data.userId; // Store user ID
                this.email = email; // Store email
                console.log('Login successful, User ID:', this.currentUserId);
                this.fetchUserProfile(this.currentUserId); // After successful login, fetch user profile
            } else {
                console.error(data.error);
            }
        })
        .catch(error => {
            console.error('Error:', error);
        });
    }

    fetchUserProfile(userId: string): void { // {{ edit_2 }}
        fetch(`http://localhost/IMAGE-GALLERY/backend/get_user.php?id=${userId}`) // Fetch user data
            .then(response => response.json())
            .then(data => {
                if (data.error) {
                    console.error(data.error);
                } else {
                    this.email = data.firstName; // Store user's first name
                    this.avatar = data.avatar; // Store user's avatar
                }
            })
            .catch(error => {
                console.error('Error fetching user profile:', error);
            });
    }

    onDragOver(event: DragEvent): void { // {{ edit_1 }}
        event.preventDefault(); // Prevent default to allow drop
    }

    onDrop(event: DragEvent): void { // {{ edit_1 }}
        event.preventDefault(); // Prevent default behavior
        const files = event.dataTransfer?.files; // Get the dropped files
        if (files && files.length > 0) {
            this.onFileSelect({ target: { files } } as unknown as Event); // Call onFileSelect with the dropped files
        }
    }
}
