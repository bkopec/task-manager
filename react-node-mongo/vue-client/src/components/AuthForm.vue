<template>
    <div class="authFormComponent">
      <h2>Log in and register</h2>
      <form class="signupForm" @submit.prevent="handleSubmit">
        <input
          :class="{ inError: errors.passwordInvalid }"
          placeholder="Username"
          v-model="login"
          name="login"
        />
        <input
          :class="{ inError: errors.passwordInvalid || errors.passwordTooShort }"
          placeholder="Password"
          v-model="password"
          type="password"
          name="password"
        />
        <button type="submit">Submit</button>
      </form>
      <p v-if="errors.passwordTooShort" class="error">Password needs at least four characters</p>
      <p v-if="errors.passwordInvalid" class="error">
        This username is already in use, or you input the wrong password.
      </p>
    </div>
  </template>
  
  <script>

  import axios from 'axios';
  import config from '../config.js';
  import Cookies from 'universal-cookie';
  
  const backendUrl = config.backendUrl;
  
  export default {
    props: {
    user: Object,
    tasks: Array
    },

    data() {
      return {
        login: '',
        password: '',
        errors: {
          passwordTooShort: false,
          passwordInvalid: false,
        },
      };
    },
    methods: {
      handleInputChange(event, setter) {
        setter(event.target.value);
        this.errors = { passwordInvalid: false, passwordTooShort: false };
      },
      handleSubmit() {
        if (this.password.length < 4) {
          this.errors = { ...this.errors, passwordTooShort: true };
          return;
        }
  
        const postData = {
          login: this.login,
          password: this.password,
        };
  
        axios
          .post(`${backendUrl}/api/users`, postData)
          .then((response) => {
            this.$props.user.login = response.data.login;
            this.$props.user.token = response.data.token;

            const cookies = new Cookies();
            cookies.set('jwt-token', response.data.token);
            cookies.set('login', response.data.login);

            this.$router.push('/');
          })
          .catch((error) => {
            if (error.response && error.response.status === 401) {
              const data = error.response.data;
              if (data.error === 'INVALID_PASSWORD') {
                this.errors = { ...this.errors, passwordInvalid: true };
              } else {
                console.log(error);
              }
            }
          });
      },
    },
  };
  </script>
