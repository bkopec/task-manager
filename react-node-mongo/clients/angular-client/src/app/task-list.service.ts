import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { UserService } from './user.service';

const backendUrl = 'http://localhost:3001';

interface Task {
  id: number;
}

@Injectable({
  providedIn: 'root'
})
export class TaskListService {

  private tasksSubject = new BehaviorSubject<any[]>([]);

  constructor(private http: HttpClient, private userService: UserService) {}

  private get httpOptions(): any {
    return {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${this.userService.getJwtToken()}`
      })
    };
  }

  getTasks(): Observable<any[]> {
    this.loadTasks();
    return this.tasksSubject.asObservable();
  }

  loadTasks(): void {
    console.log("loadTasks");
    this.http
      .get<any[]>(`${backendUrl}/api/tasks`, this.httpOptions)
      .subscribe( (tasks) => {this.tasksSubject.next(Object.values(tasks))});
  }

  deleteTask(id: number): void {
    this.http
      .delete<void>(`${backendUrl}/api/tasks/${id}`, this.httpOptions)
      .subscribe(() => {
        this.updateLocalTasks(tasks => tasks.filter(task => task.id !== id));
      });
  }

  completeTask(id: number): void {
    this.http
      .put<any>(`${backendUrl}/api/tasks/${id}`, { id }, this.httpOptions)
      .subscribe(() => {
        this.updateLocalTasks(tasks =>
         tasks.map(task => (task.id === id ? {...task, completed : !task.completed} : task))
        );
      });
  }

  addTask(task: any): void {
    console.log("addTasks");
    this.http
      .post<any>(`${backendUrl}/api/tasks`, task, this.httpOptions)
      .subscribe((response) => {
        console.log(response);
        console.log(response.id);
        console.log("zz");
        this.updateLocalTasks(tasks => [...tasks, response]);
      });
  }

  private updateLocalTasks(updateFn: (tasks: any[]) => any[]): void {
    this.tasksSubject.next(updateFn(this.tasksSubject.value));
  }
}