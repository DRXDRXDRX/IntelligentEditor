<template>
    <div class="root">
        <!-- 添加顶部导航栏 -->
    <div class="top-nav">
      <img src="/logo-frame-black.png" alt="Logo" class="logo">
        <el-dropdown @command="handleCommand">
            <span class="el-dropdown-link">
              {{ currentLanguage }}
              <i class="el-icon-arrow-down el-icon--right"></i>
            </span>
            <template #dropdown>
                <el-dropdown-menu>
                  <el-dropdown-item v-for="(name, key) in languageMap" :key="key" :command="key">
                    {{ name }}
                  </el-dropdown-item>
                </el-dropdown-menu>
            </template> 
        </el-dropdown>
    </div>
  




      <common-form :info="loginInfo">


        <template #username>
          <el-form-item label="用户名" prop="username" :rules="[{
            required: true,
            message: '用户名不能为空',
            trigger: 'blur',
          },
          { min: 3, message: '用户名至少3位', trigger: 'blur' }]">
            <el-input v-model="loginInfo.username" clearable placeholder="3位以上汉字、英文、数字">
              <template #suffix>
                <i class="ri-account-circle-fill" style="font-size: 28px"></i>
              </template>
            </el-input>
          </el-form-item>
        </template>


        <template #password>
          <el-form-item label="密码" prop="password" :rules="[{
            required: true,
            message: '密码不能为空',
            trigger: 'blur',
          },
          { min: 3, max: 10, message: '密码在3-10位之间', trigger: 'blur' }]">
            <el-input clearable show-password v-model="loginInfo.password" placeholder="3-10位数字、英文">
              <template #suffix>
                <i class="ri-lock-password-fill" style="font-size: 26px"></i>
              </template>
            </el-input>
          </el-form-item>
        </template>




        <template #forget>
          <div class="forget">
            <span @click="forgetPassword">
              <router-link to="/reset">忘记密码</router-link>
            </span>
          </div>
        </template>




        <template #button>
          <div class="button">
            <el-button type="success" @click="login">登录</el-button>
            <el-button type="primary" text>
              <router-link to="/register">还没有账号？立即注册</router-link>
            </el-button>
          </div>
        </template>
      </common-form>
    </div>
  </template>
  
 
<script setup lang="ts">
import CommonForm from '@/components/CommonForm.vue'
import { ref } from 'vue';
import { ElMessage } from 'element-plus';
import { useRouter } from 'vue-router';

const router = useRouter();
const loginInfo = ref({
    username: '',
    password: '',
});

const login = () => {
    console.log(loginInfo.value.username, loginInfo.value.password)
    // 执行登录逻辑
    ElMessage({
        message: '登陆成功!',
        type: 'success',
        plain: true,
    });
    router.push('/edit'); // 登录成功后跳转到编辑页面
};


// 多语言切换逻辑
import { useI18n } from 'vue-i18n'

const { locale } = useI18n()
const currentLanguage = ref('简体中文')

const languageMap = {
  en: 'English',
  ko: '한국어',
  ja: '日本語',
  fr: 'Français',
  de: 'Deutsch',
  es: 'Español',
  pt: 'Português',
  'zh-CN': '简体中文',
  'zh-TW': '繁體中文'
}

const handleCommand = (command) => {
  if (languageMap[command]) {
    currentLanguage.value = languageMap[command];
    locale.value = command;
    console.log('Language selected:', languageMap[command]);
  } else {
    console.warn('Unsupported language command:', command);
  }
}
</script>

<style lang="scss" scoped>
  .root {
    width: 100vw;
    height: 100vh;
    overflow: hidden;
    background-color: #f9f9f9; // 浅灰色背景，类似 Grammarly
    display: flex;
    justify-content: center;
    align-items: center;
    .top-nav {
    position: fixed; /* 固定定位 */
    top: 0; /* 置顶 */
    left: 0; /* 左对齐 */
    width: 100%; /* 占满宽度 */
    display: flex;
    justify-content: flex-start; /* 从左到右排列 */
    align-items: center;
    padding: 10px 20px;
    background-color: #fff; /* 顶部导航背景颜色 */
    z-index: 1000; /* 确保导航栏在其他元素之上 */

    .logo {
      height: 40px;
      margin-left: 50px; /* 距离左边50px */
    }

    .el-dropdown {
      margin-left: 20px; /* 调整与 logo 的间距 */
    }

    .el-dropdown-link {
      cursor: pointer;
      font-size: 16px;
      color: #666;
      display: flex;
      align-items: center;

      i {
        margin-left: 5px;
      }

      &:hover {
        color: #409EFF;
      }
    }
  }
    :deep(.el-form) {
      background-color: #ffffff; // 白色表单背景
      padding: 30px;
      border-radius: 8px;
      box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1); // 轻微的阴影效果
      width: 400px; // 固定宽度，可以根据需要调整
    }
  
    .forget {
      display: flex;
      justify-content: flex-end;
      margin: 0 0 5px 0;
    }
  
    span {
      color: #409EFF;
      cursor: pointer;
      font-size: 13px;
  
      &:hover {
        text-decoration: underline;
      }
    }
  
    .button {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-top: 20px;
  
      .el-button:first-child {
        background-color: #027E6F; // 修改登录按钮的背景颜色
        color: #fff; // 修改登录按钮的文字颜色
        border-color: #027E6F; // 修改登录按钮的边框颜色
  
        &:hover {
          background-color: #014C43; // 鼠标悬停时修改背景颜色
          border-color: #014C43; // 鼠标悬停时修改边框颜色
        }
      }
  
      .el-button:last-child {
        font-size: 12px;
      }
    }
    // 多语言切换
    .el-dropdown-link {
    cursor: pointer;
    display: flex;
    align-items: center;
    outline: none; // 去除点击时的虚线框

    }

    .el-icon--right {
      margin-left: 5px;
    }
    .el-dropdown:hover{
        color: #409EFF;
        
    }
  }
  </style>
  