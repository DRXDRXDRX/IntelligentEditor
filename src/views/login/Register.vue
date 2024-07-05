<template>
    <div class="root">
        <common-form :info="registerInfo" ref="cmp">
            <template #username>
                <el-form-item label="用户名" prop="username" :rules="[{
                    required: true,
                    message: '用户名不能为空',
                    trigger: 'blur',
                },
                { min: 5, max: 20, message: '用户名5-20位', trigger: 'blur' }]">
                    <el-input v-model="registerInfo.username" clearable placeholder="5-20位">
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
                    <email-send :email="registerInfo.email" :verifyEmailResult="verifyEmailResult">
                        <template #emailSend ></template>
                    </email-send>
                </el-form-item>
            </template>
            <template #verificationCode>
                <el-form-item label="验证码" prop="verificationCode" :rules="[{
                    required: true,
                    message: '验证码不能为空',
                    trigger: 'blur',
                }]">
                    <el-input clearable v-model="registerInfo.verificationCode">
                        <template #suffix>
                            <i class="ri-verified-badge-fill" style="font-size: 26px"></i>
                        </template>
                    </el-input>
                </el-form-item>
            </template>
            <template #password>
                <el-form-item label="密码" prop="password" :rules="[{
                    validator: validatePass,
                    trigger: 'blur',
                },
                { min: 8, max: 20, message: '密码在8-20位之间', trigger: 'blur' }]">
                    <el-input clearable show-password v-model="registerInfo.password" placeholder="8-20位" />
                </el-form-item>
            </template>
            <template #confirm>
                <el-form-item label="确认密码" prop="confirmPassword" :rules="[{
                    validator: validatePass2,
                    trigger: 'blur',
                },
                { min: 8, max: 20, message: '密码在8-10位之间', trigger: 'blur' }]">
                    <el-input  clearable show-password v-model="registerInfo.confirmPassword" placeholder="8-20位" />
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
import { ref, watch } from 'vue';
import { ElMessage } from 'element-plus';   
import { useRouter } from 'vue-router';
import type { FormInstance, FormRules } from 'element-plus'
import http from '@/utils/request.ts'

const router = useRouter();
const registerInfo = ref({
  username:'',
  email:'',
  verificationCode:'',
  password: '',
  confirmPassword: '',
});
const registerInfoRef = ref<FormInstance>()

const cmp = ref(null)
const verifyEmailResult = ref<boolean | string>('')
watch(
    () => registerInfo.value.email,
    (newVal) => {
        if(registerInfo.value){
            cmp.value.formRef.validateField('email').then((res) => {
                verifyEmailResult.value = res
            }).catch((err) => {
                verifyEmailResult.value = err.email[0].message
            })
        }
    },
)

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

const register = async () => {
    const res = await http.request({
        url: '/user/email',
        method: 'GET',
        params: {
            email: registerInfo.value.email,
            code: registerInfo.value.verificationCode
        }
    })
    console.log(res)
    if(res.code !== 0 || res.data.verified === false) {
        ElMessage.error("邮箱或验证码输入错误")
        return
    }
    const result = await http.request({
        url: '/user/register',
        method: 'POST',
        data: {
            user_name: registerInfo.value.username,
            email: registerInfo.value.email,
            verificationCode:registerInfo.value.verificationCode,
            password: registerInfo.value.password,
        }
    })
    if(result.code === 0) {
        ElMessage.success("注册成功")
        router.push('/login')
    } else {
        ElMessage.error("注册失败")
    }
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