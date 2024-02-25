import { Component, Input, Output, EventEmitter } from '@angular/core';


@Component({
  selector: 'app-task',
  standalone: true,
  templateUrl: './task.component.html',
  styleUrls: ['./task.component.css']
})
export class TaskComponent {
  @Input() task: any;
  @Output() completed = new EventEmitter<number>();
  @Output() deleted = new EventEmitter<number>();

  isDeleted: boolean = false;

  constructor() {}

  handleCheckboxChange(): void {
    this.completed.emit(this.task.id);
  }

  handleDelete(): void {
    // Mutating state directly to handle rapid deletion
    this.task.deleting = true;
    this.isDeleted = true;

    setTimeout(() => {
      this.deleted.emit(this.task.id);
      console.log(this.task.id);
    }, 600);
  }
}