<!-- App.vue -->
<template>
  <div id="app">
    <button @click="addItem">Add Item</button>
    <button @click="removeItem">Remove Item</button>
    
    <transition-group name="list" tag="ul">
      <li v-for="(item, index) in items" :key="item.id">
        <button>{{ item.text }}</button>
      </li>
    </transition-group>
  </div>
</template>

<script setup>
import { ref } from 'vue';

const items = ref([]);
let nextItemId = 1;

const addItem = () => {
  items.value.push({ id: nextItemId++, text: `Item ${nextItemId}` });
};

const removeItem = () => {
  if (items.value.length > 0) {
    items.value.pop();
  }
};
</script>

<style>
.list-enter-active, .list-leave-active {
  transition: all 1s;
}
.list-enter-from, .list-leave-to {
  opacity: 0;
  transform: translateY(30px);
}
ul{
      list-style: none;
      padding: 0;

    }
li{
  display: flex;
  align-items: center;
  margin-bottom: 8px;
  background-color: #fff;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.3s;
}
</style>