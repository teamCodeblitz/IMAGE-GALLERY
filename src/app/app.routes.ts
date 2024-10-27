import { Routes } from '@angular/router';
import { KanbanBoardComponent } from './kanban-board/kanban-board.component';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';

export const routes: Routes = [
    { path: '', redirectTo: 'login', pathMatch: 'full' },
    { path: 'kanban-board', component: KanbanBoardComponent},
    { path: 'login', component: LoginComponent },
    { path: 'register', component: RegisterComponent },
];
