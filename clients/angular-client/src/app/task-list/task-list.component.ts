// task-list.component.ts

import { Component, Input, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { TaskListService } from '../task-list.service'; // Adjust the path accordingly
import { UserService } from '../user.service'; // Assuming you have a UserService
import { CommonModule } from '@angular/common';
import { TaskComponent } from '../task/task.component';
import { Observable } from 'rxjs';

const backendUrl = 'http://localhost:3001';

@Component({
  selector: 'app-task-list',
  standalone: true,
  templateUrl: './task-list.component.html',
  styleUrls: ['./task-list.component.css'],
  imports: [CommonModule, TaskComponent],
  providers: [UserService],
  
})
export class TaskListComponent implements OnInit {
  tasks$: Observable<any[]> | undefined;
  loading: boolean = true;

  constructor(private http: HttpClient, private taskListService: TaskListService, private userService: UserService) {}

  ngOnInit(): void {
    this.tasks$ = this.taskListService.getTasks();
  }

  handleDelete(id: number): void {
    this.taskListService.deleteTask(id);
  }

  handleCompleted(id: number): void {
    this.taskListService.completeTask(id);
  }
}