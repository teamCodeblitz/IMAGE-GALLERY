import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';

declare var $: any;  // Import jQuery to use Bootstrap's JS features

@Component({
  selector: 'app-kanban-board',
  standalone: true,
  imports: [CommonModule,],
  templateUrl: './kanban-board.component.html',
  styleUrls: ['./kanban-board.component.css']
})
export class KanbanBoardComponent {
}