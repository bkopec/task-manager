import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { UserService } from '../user.service'; 
import { TaskListService } from '../task-list.service';

const backendUrl = 'http://localhost:3001';

@Component({
  selector: 'app-new-task-form',
  standalone: true,
  templateUrl: './new-task-form.component.html',
  styleUrls: ['./new-task-form.component.css'],
  providers: [UserService]
})
export class NewTaskFormComponent implements OnInit {
  newTask: string = '';
  @ViewChild('elementRef') elementRef!: ElementRef;

  constructor(private http: HttpClient, private userService: UserService, private taskListService: TaskListService) {}

  ngOnInit(): void {
    console.log('Component rendered');
  }

  handleInputChange(event: Event): void {
    const targetElement = event.target as HTMLElement;
    this.newTask = targetElement.innerText;
  }

  handleSubmit(event: Event): void {
    event.preventDefault();

    if (this.newTask.length === 0) {
      return;
    }

    const postData: any = {
      content: this.newTask
    };

    this.taskListService.addTask(postData);

    this.elementRef.nativeElement.innerHTML = '';
    this.newTask = '';
  }
}