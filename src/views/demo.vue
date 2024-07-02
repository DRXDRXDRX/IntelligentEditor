<template>

  
    <div id="components-dropdown-demo-placement">
      <a-dropdown>
        <template #default>
          <a-button>Dropdown</a-button>
        </template>
        <template #overlay>
          <a-menu>
            <a-menu-item>
                <i class="ri-flashlight-fill" style="color:green;font-size:medium"></i>
                <p>erine-3.5</p>
            </a-menu-item>
            <a-menu-item>
                <i class="ri-flashlight-fill" style="color:purple;font-size:medium"></i>
                <p>erine-4.0</p>
            </a-menu-item>
            <a-menu-item>
                <i class="ri-flashlight-fill" style="color:purple;font-size:medium"></i>
                <p>erine-4.0-turbo</p>
            </a-menu-item>
          </a-menu>
        </template>
      </a-dropdown>
    </div>





  </template>
  
  <script setup>
  import { ref } from 'vue';
  </script>
  
  <style>
 
  </style>
  