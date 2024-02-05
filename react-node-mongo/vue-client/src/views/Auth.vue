
<style src="@/assets/css/main.css"></style>

<script setup>
import AuthForm from '../components/AuthForm.vue'
import Header from '../components/Header.vue'

const props = defineProps(['user']);

</script>

<template>
  <Header />
  <main>
    <AuthForm :user="props.user" />
  </main>
</template>

