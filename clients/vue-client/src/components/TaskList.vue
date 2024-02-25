<template>
    <div id="taskList">
      <p v-if="tasks.value && tasks.value.length === 0" class="emptyTaskList">No tasks yet</p>
      <Task v-for="task in tasks.value" :key="task.id" :task="task" @onDelete="handleDelete" @onCompleted="handleCompleted" />
      <img v-if="!tasks" class="loading fade-in" src="@/assets/loading.webp" />
    </div>
  </template>
  
  <script setup>
  import axios from 'axios';
  import { ref, onMounted } from 'vue';
  import Task from './Task.vue';
  import Cookies from 'universal-cookie';
  import config from '../config.js';
  
  const backendUrl = config.backendUrl;
  
  const props = defineProps(['user', 'tasks']);
  const tasks = props.tasks;
  const user = props.user;
  
  onMounted(() => {
    axios
      .get(`${backendUrl}/api/tasks`, {
        headers: { Authorization: `Bearer ${user.token}`, 'Cache-Control': 'no-cache' },
      })
      .then((response) => {
        let fetchedTasks = [];
        Object.keys(response.data).forEach(function (key) {
          fetchedTasks.push(response.data[key]);
        });
        tasks.value = fetchedTasks;
      })
      .catch((error) => {
        console.log(error);
        if (error.response && error.response.status === 401) {
          delete(user.login);
          delete(user.token);
          const cookies = new Cookies();
          cookies.remove('jwt-token');
          cookies.remove('login');
          this.$router.push('/');
        }
      });
  });
  
  const handleDelete = (id) => {
    axios
      .delete(`${backendUrl}/api/tasks/${id}`, { headers: { Authorization: `Bearer ${props.user.token}` } })
      .then(() => {
        props.tasks.value = tasks.value.filter((task) => task.id !== id);
      })
      .catch((error) => {
        console.log(error);
        if (error.response && error.response.status === 401) return;
      });
  };
  
  const handleCompleted = (id) => {
    axios
      .put(`${backendUrl}/api/tasks/${id}`, { id }, { headers: { Authorization: `Bearer ${props.user.token}` } })
      .then(() => {
        tasks.value = tasks.value.map((task) => (task.id === id ? { ...task, completed: !task.completed } : task));
      })
      .catch((error) => {
        console.log(error);
        if (error.response && error.response.status === 401) return;
      });
  };
  </script>