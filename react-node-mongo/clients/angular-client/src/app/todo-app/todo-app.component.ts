import { Component } from '@angular/core';

import { HeaderComponent } from '../header/header.component'; // Assuming you have a HeaderComponent to display the header
import { TaskListComponent } from '../task-list/task-list.component';
import { NewTaskFormComponent } from '../new-task-form/new-task-form.component';


@Component({
  selector: 'app-todo-app',
  standalone: true,
  imports: [HeaderComponent, TaskListComponent, NewTaskFormComponent],
  templateUrl: './todo-app.component.html',
  styleUrl: './todo-app.component.css'
})
export class TodoAppComponent {

}
