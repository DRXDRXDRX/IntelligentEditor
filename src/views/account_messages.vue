<template>
    <div>
      <button @click="openDialog">打开设置</button>
      <dialog ref="dialog" class="settings-dialog">
        <div class="dialog-header">
          <h2>设置</h2>
          <button @click="closeDialog" class="close-button">×</button>
        </div>
        <div class="dialog-content">
          <div class="sidebar">
            <ul>
              <li v-for="item in menuItems" :key="item.id" :class="{ active: activeItem === item.id }" @click="activeItem = item.id">
                <i :class="item.icon"></i>
                {{ item.label }}
              </li>
            </ul>
          </div>
          <div class="main-content">
            <component :is="getComponent(activeItem)"></component>
          </div>
        </div>
      </dialog>
    </div>
  </template>
  
  <script setup>
  import { ref } from 'vue';
  
  const dialog = ref(null);
  const activeItem = ref(1);
  
  const menuItems = ref([
    { id: 1, label: '通用设置', icon: 'el-icon-setting' },
    { id: 2, label: '个性化', icon: 'el-icon-user' },
    { id: 3, label: '语言', icon: 'el-icon-message' },
    { id: 4, label: '数据管理', icon: 'el-icon-s-management' },
    { id: 5, label: '构建者个人资料', icon: 'el-icon-document' },
    { id: 6, label: '关联的应用', icon: 'el-icon-link' },
    { id: 7, label: '安全', icon: 'el-icon-lock' }
  ]);
  
  const openDialog = () => {
    dialog.value.showModal();
  };
  
  const closeDialog = () => {
    dialog.value.close();
  };
  
  const getComponent = (id) => {
    switch (id) {
      case 1:
        return GeneralSettings;
      case 2:
        return Personalization;
      case 3:
        return LanguageSettings;
      case 4:
        return DataManagement;
      case 5:
        return ProfileSettings;
      case 6:
        return LinkedApps;
      case 7:
        return SecuritySettings;
      default:
        return GeneralSettings;
    }
  };
  
  // Define the individual component contents here or import them if they are in separate files
  const GeneralSettings = {
    template: `<div><h3>通用设置</h3><p>主题: 系统</p><p>使用数据分析功能时始终显示代码: <input type="checkbox" checked /></p></div>`
  };
  
  const Personalization = {
    template: `<div><h3>个性化</h3><p>相关设置...</p></div>`
  };
  
  const LanguageSettings = {
    template: `<div><h3>语言</h3><p>语言: 自动检测</p></div>`
  };
  
  const DataManagement = {
    template: `<div><h3>数据管理</h3><p>相关设置...</p></div>`
  };
  
  const ProfileSettings = {
    template: `<div><h3>构建者个人资料</h3><p>相关设置...</p></div>`
  };
  
  const LinkedApps = {
    template: `<div><h3>关联的应用</h3><p>相关设置...</p></div>`
  };
  
  const SecuritySettings = {
    template: `<div><h3>安全</h3><p>相关设置...</p></div>`
  };
  </script>
  
  <style scoped>
  .settings-dialog {
    width: 600px;
    border: none;
    border-radius: 8px;
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
    overflow: hidden;
    display: flex;
    flex-direction: column;
  }
  
  .dialog-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 16px;
    background-color: #f5f5f5;
    border-bottom: 1px solid #ddd;
  }
  
  .dialog-content {
    display: flex;
  }
  
  .sidebar {
    width: 200px;
    background-color: #f9f9f9;
    border-right: 1px solid #ddd;
    padding: 16px 0;
  }
  
  .sidebar ul {
    list-style: none;
    padding: 0;
    margin: 0;
  }
  
  .sidebar li {
    padding: 10px 16px;
    cursor: pointer;
  }
  
  .sidebar li.active,
  .sidebar li:hover {
    background-color: #e0e0e0;
  }
  
  .main-content {
    flex: 1;
    padding: 16px;
  }
  
  .close-button {
    background: none;
    border: none;
    font-size: 24px;
    cursor: pointer;
  }
  </style>
  