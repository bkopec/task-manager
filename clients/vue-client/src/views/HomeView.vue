<style src="@/assets/css/main.css"></style>

<script setup>
import { ref, defineProps } from 'vue';

import TaskList from '../components/TaskList.vue'
import Header from '../components/Header.vue'
import NewTaskForm from '../components/NewTaskForm.vue'
const props = defineProps(['user']);

const tasks = ref([]);
</script>

 
<template>
  <Header />
  <main>
    <NewTaskForm :user="props.user" :tasks="tasks" />
    <TaskList :user="props.user" :tasks="tasks" />
  </main>
</template>

