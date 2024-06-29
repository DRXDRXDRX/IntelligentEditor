<template>
    <div class="root">
        <common-form :info="registerInfo">
            <template #username>
                <el-form-item label="用户名" prop="username" :rules="[{
                    required: true,
                    message: '用户名不能为空',
                    trigger: 'blur',
                },
                { min: 3, message: '用户名至少3位', trigger: 'blur' }]">
                    <el-input v-model="registerInfo.username" clearable placeholder="3位以上汉字、英文、数字">
                        <template #suffix>
                            <i class="ri-account-circle-fill" style="font-size: 28px"></i>
                        </template>
                    </el-input>
                </el-form-item>
            </template>
            <template #email>
                <el-form-item prop="email" label="邮箱" :rules="[
                    {
                        required: true,
                        message: '邮箱不能为空',
                        trigger: 'blur',
                    },
                    {
                        type: 'email',
                        message: '邮箱格式不正确',
                        trigger: ['blur', 'change'],
                    },
                ]">
                    <el-input v-model="registerInfo.email" clearable>
                        <template #suffix>
                            <i class="ri-mail-check-line" style="font-size: 26px"></i>
                        </template>
                    </el-input>
                    <email-send>
                        <template #emailSend></template>
                    </email-send>
                </el-form-item>
            </template>
            <template #password>
                <el-form-item label="密码" prop="password" :rules="[{
                    validator: validatePass,
                    trigger: 'blur',
                },
                { min: 3, max: 10, message: '密码在3-10位之间', trigger: 'blur' }]">
                    <el-input clearable show-password v-model="registerInfo.password" placeholder="3-10位数字、英文" />
                </el-form-item>
            </template>
            <template #confirm>
                <el-form-item label="确认密码" prop="confirmPassword" :rules="[{
                    validator: validatePass2,
                    trigger: 'blur',
                },
                { min: 3, max: 10, message: '密码在3-10位之间', trigger: 'blur' }]">
                    <el-input  clearable show-password v-model="registerInfo.confirmPassword" placeholder="3-10位数字、英文" />
                </el-form-item>
            </template>
            <template #button>
                <div class="button">
                    <el-button type="success" @click="register">注册</el-button>
                </div>
            </template>
        </common-form>
    </div>
</template>

<script lang="ts" setup>
import CommonForm from '@/components/CommonForm.vue'
import EmailSend from '@/components/EmailSend.vue';
import { ref } from 'vue';
import { ElMessage } from 'element-plus';   
import { useRouter } from 'vue-router';
import type { FormInstance, FormRules } from 'element-plus'

const registerInfoRef = ref<FormInstance>()

const router = useRouter();
const registerInfo = ref({
  username:'',
  email:'',
  password: '',
  confirmPassword: '',
});

const validatePass = (rule: any, value: any, callback: any) => {
  if (value === '') {
    callback(new Error('密码不能为空'))
  } else {
    if (registerInfo.value.confirmPassword !== '') {
      if (!registerInfoRef.value) return
      registerInfoRef.value.validateField('confirmPassword')
    }
    callback()
  }
}

const validatePass2 = (rule: any, value: any, callback: any) => {
  if (value === '') {
    callback(new Error('请再次输入密码'))   
  } else if (value !== registerInfo.value.password) {
    callback(new Error("两次输入密码不一致"))
  } else {
    callback()
  }
}

const register = () => {
    console.log(registerInfo.value);
    
//   执行登录逻辑
  ElMessage({
    message: '注册成功!',
    type: 'success',
    plain: true,
  });
  router.push('/edit'); // 登录成功后跳转到编辑页面
};

</script>

<style lang="scss" scoped>
.root {
    width: 100vw;
    height: 100vh;
    overflow: hidden;
    background: url('https://img2.wallspic.com/previews/0/8/7/7/7/177780/177780-zhi_zhu_xia-se_jian-limo_la_lai_si-chao_ji_ying_xiong-man_hua_shu-x750.jpg') no-repeat center;
    background-size: cover;
    display:flex;
    justify-content: center;
    align-items:center;

    .button {
        display: flex;
        justify-content: center;
    }
}
</style>