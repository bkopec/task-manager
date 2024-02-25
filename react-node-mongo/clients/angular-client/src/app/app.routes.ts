import { Routes } from '@angular/router';
import { AuthFormComponent } from './auth-form/auth-form.component';
import { TodoAppComponent } from './todo-app/todo-app.component';

export const routes: Routes = [
    {
        path: 'auth',
        component: AuthFormComponent,
        title: 'Authentication Form',
    },
    {
      path: '',
      component: TodoAppComponent,
      title: 'Todo App',
  },
];
