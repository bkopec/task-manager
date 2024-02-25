<template>
    <form id="newTask">
      <div
        ref="elementRef"
        class="textarea"
        contenteditable="true"
        @input="handleInputChange"
      ></div>
      <button @click.prevent="handleSubmit" type="submit">ADD</button>
    </form>
  </template>
  
  <script>
  import axios from 'axios';
  import config from '../config.js';
  
  const backendUrl = config.backendUrl;
  
  export default {
    props: {
    user: Object,
    tasks: Array,
    },

    data() {
      return {
        newTask: '',
      };
    },
    methods: {
      handleInputChange(event) {
        this.newTask = event.target.innerText;
      },
      handleSubmit() {
        if (this.newTask.length === 0) return;
  
        const postData = { content: this.newTask };

        axios
          .post(`${backendUrl}/api/tasks`, postData, {
            headers: { Authorization: `Bearer ${this.$props.user.token}` },
          })
          .then((response) => {
            console.log(this.$props.tasks.value);
            this.$props.tasks.value.push({id: response.data.id, login: this.$props.user.login, content: postData.content});
            this.$refs.elementRef.innerHTML = '';
            this.newTask = '';
          })
          .catch((error) => {
            if (error.response && error.response.status === 500) {
              const data = error.response.data;
            }
          });
      },
    },
  };
  </script>