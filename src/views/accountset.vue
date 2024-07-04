<template>
    <div>
      <!-- 触发第一个对话框的按钮 -->
      <button @click="dialog1.showModal()">打开对话框 1</button>
      
      <!-- 第一个对话框 -->
      <dialog ref="dialog1">
        <h2>对话框 1 标题</h2>
        <p>这是第一个对话框的内容。</p>
        <button @click="dialog1.close()">关闭</button>
      </dialog>
  
      <!-- 触发第二个对话框的按钮 -->
      <button @click="dialog2.showModal()">打开对话框 2</button>
      
      <!-- 第二个对话框 -->
      <dialog ref="dialog2">
        <h2>对话框 2 标题</h2>
        <p>这是第二个对话框的内容。</p>
        <button @click="dialog2.close()">关闭</button>
      </dialog>
    </div>
  </template>
  
  <script setup>
  import { ref } from 'vue';
  
  const dialog1 = ref(null);
  const dialog2 = ref(null);
  
  const openDialog = (dialog) => {
    dialog.value.showModal();
  };
  
  const closeDialog = (dialog) => {
    dialog.value.close();
  };
  </script>
  
  <style scoped>
  /* .account_dialog {
    background: white;
    display: flex;
    padding: 15px;
    width: 800px;
    border: none;
    border-radius: 10px;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
    flex-direction: column;
  } */
  
  dialog {
    /* display: flex; */
    /* flex-direction: column; */
    width: 300px;
    padding: 20px;
    border: none;
    border-radius: 10px;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
  }
  
  dialog::backdrop {
    background: rgba(0, 0, 0, 0.5);
  }
  
  button {
    margin-top: 10px;
    padding: 10px 20px;
    background-color: #007bff;
    color: white;
    border: none;
    border-radius: 5px;
    cursor: pointer;
    transition: background-color 0.3s;
  }
  
  button:hover {
    background-color: #0056b3;
  }
  </style>
  
