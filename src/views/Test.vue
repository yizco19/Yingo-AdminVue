<template>
    <div>

      <el-input v-model="email" placeholder="Ingrese su correo electrónico" prefix-icon="el-icon-message" />
    </div>
  </template>
  
  <script setup>
  import { ref } from 'vue';
  
  const imageUrl = ref('src/assets/mail.png');
  const email = ref('');
  </script>
  