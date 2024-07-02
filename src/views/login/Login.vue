<template>
  <div class="root">
      <common-form :info="loginInfo">
          <template #username>
              <el-form-item label="用户名" prop="username" :rules="[{
                  required: true,
                  message: '用户名不能为空',
                  trigger: 'blur',
              },
              { min: 5, max: 20, message: '用户名5到20位', trigger: 'blur' }]">
                  <el-input v-model="loginInfo.username" clearable placeholder="5-20位">
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
              { min: 8, max: 20, message: '密码在8-20位之间', trigger: 'blur' }]">
                  <el-input clearable show-password v-model="loginInfo.password" placeholder="8-20位">
                      <template #suffix>
                          <i class="ri-lock-password-fill" style="font-size: 26px"></i>
                      </template>
                  </el-input>
              </el-form-item>
          </template>
          <template #forget>
              <div class="forget"><span @click="forgetPassword"><router-link to="/reset">忘记密码</router-link></span>
              </div>
          </template>
          <template #button>
              <div class="button">
                  <el-button type="success" @click="login">登录</el-button>
                  <el-button type="primary" text><router-link to="/register">还没有账号？立即注册</router-link></el-button>
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
import http from '@/utils/request.ts';
const router = useRouter();
const loginInfo = ref({
  username: '',
  password: '',
});
const login = () => {
  console.log(loginInfo.value.username, loginInfo.value.password)
  // 执行登录逻辑
  
  http.request({
        url: 'user/login',
        method: 'POST',
        data: loginInfo.value,
  }).then((res) => {
    if(res.code == 0) {
        router.push('/edit'); // 登录成功后跳转到编辑页面
        ElMessage({
            message: '登陆成功!',
            type: 'success',
            plain: true,
        });
    } else {
        ElMessage.error(res.msg);
    }
  })
};
</script>

<style lang="scss" scoped>
.root {
  width: 100vw;
  height: 100vh;
  overflow: hidden;
  background: url('https://img1.wallspic.com/previews/8/3/1/8/7/178138/178138-ka_tong-shi_jue_yi_shu-lu_se_de-xing_zhi-zi_ran_huan_jing-x750.jpg') no-repeat center;
  background-size:cover;
  display:flex;
  justify-content: center;
  align-items:center;
  .forget {
      display: flex;
      justify-content: flex-end;
      margin: 0 0 5px 0;
  }
  span {
      color: #409EFF;
      cursor: pointer;
      font-size: 13px;
  }
  span:hover {
      text-decoration: underline;
  }
  .button {
      display: flex;
      flex-direction: column;
      align-items: center;
      .el-button:first-child {
        margin-bottom: 10px;
        width: 60px;
      }
      .el-button:last-child {
          font-size: 12px;
      }
  }
}
</style>