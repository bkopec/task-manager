<template>
    <div :class="{ 'task': true, 'invisible': isDeleted, 'fade-in': !isDeleted }">
      <input type="checkbox" @change="handleCheckboxChange" :checked="task.completed" />
      <p :class="{ 'checked': task.completed }">{{ task.content }}</p>
      <img class="deleteButton" src="@/assets/cross.png" @click="handleDelete" />
    </div>
  </template>
  
  <script setup>
  import { ref, watch, defineProps, defineEmits} from 'vue';
  const props = defineProps(['task', 'onDelete', 'onCompleted']);

  const emits = defineEmits();

  const isDeleted = ref(false);

  const handleCheckboxChange = () => {
        emits('onCompleted', props.task.id);
  };
  
  const handleDelete = () => {
    props.task.deleting = true;
    isDeleted.value = true;

    setTimeout(() => {
      emits('onDelete', props.task.id);
    }, 600);
  };
  
  </script>
  