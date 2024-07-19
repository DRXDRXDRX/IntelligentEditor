<template>
    <div class="help_document">
      <h2>{{ title }}</h2>
      <div v-html="content"></div>
    </div>
  </template>
  
  <script setup>
  import { defineProps } from 'vue';
  
  const props = defineProps({
    title: {
      type: String,
      required: true
    },
    content: {
      type: String,
      required: true
    }
  });
  </script>
  
  <style scoped lang="scss">
  .help_document {
    padding: 16px;
    border: 1px solid #ccc;
    border-radius: 8px;
    background-color: #f9f9f9;
    margin: 16px 0;
  
    h2 {
      margin-top: 0;
    }
  
    div {
      margin-top: 8px;
    }
  }
  </style>
  