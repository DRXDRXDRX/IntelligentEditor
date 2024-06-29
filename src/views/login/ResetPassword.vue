<template>
    <div class="root">
        <common-form :info="resetInfo">
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
                ]" class="emailInput">
                    <el-input v-model="resetInfo.email" clearable>
                        <template #suffix>
                            <i class="ri-mail-check-line" style="font-size: 26px"></i>
                        </template>
                    </el-input>
                    <email-send>
                        <template #emailSend></template>
                    </email-send>
                    <!-- <template #append> -->
                        <!-- </template> -->
                </el-form-item>
            </template>
            <template #verificationCode>
                <el-form-item label="验证码" prop="verificationCode" :rules="[{
                    required: true,
                    message: '验证码不能为空',
                    trigger: 'blur',
                }]">
                    <el-input clearable v-model="resetInfo.verificationCode">
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
                { min: 3, max: 10, message: '密码在3-10位之间', trigger: 'blur' }]">
                    <el-input clearable show-password v-model="resetInfo.password" placeholder="3-10位数字、英文" />
                </el-form-item>
            </template>
            <template #confirm>
                <el-form-item label="确认密码" prop="confirmPassword" :rules="[{
                    validator: validatePass2,
                    trigger: 'blur',
                },
                { min: 3, max: 10, message: '密码在3-10位之间', trigger: 'blur' }]">
                    <el-input clearable show-password v-model="resetInfo.confirmPassword" placeholder="3-10位数字、英文" />
                </el-form-item>
            </template>
            <template #button>
                <div class="button">
                    <el-button type="success" @click="reset">重置密码</el-button>
                </div>
            </template>
        </common-form>
    </div>
</template>

<script lang="ts" setup>
import CommonForm from '@/components/CommonForm.vue'
import EmailSend from '@/components/EmailSend.vue'
import { ElMessage } from 'element-plus'
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import type { FormInstance, FormRules } from 'element-plus'

const resetInfoRef = ref<FormInstance>()

const router = useRouter()
const resetInfo = ref({
    email: '',
    verificationCode: '',
    password: '',
    confirmPassword: '',
})

const validatePass = (rule: any, value: any, callback: any) => {
    if (value === '') {
        callback(new Error('密码不能为空'))
    } else {
        if (resetInfo.value.confirmPassword !== '') {
            if (!resetInfoRef.value) return
            resetInfoRef.value.validateField('confirmPassword')
        }
        callback()
    }
}

const validatePass2 = (rule: any, value: any, callback: any) => {
    if (value === '') {
        callback(new Error('请再次输入密码'))
    } else if (value !== resetInfo.value.password) {
        callback(new Error("两次输入密码不一致"))
    } else {
        callback()
    }
}

const reset = () => {
    console.log(resetInfo.value);
    ElMessage({
        message: '重置密码成功！',
        type: 'success',
        plain: true,
    })
    // console.log(route.path)
    router.push('/login') // 重设密码成功后跳转到登录页面
}

</script>

<style lang="scss" scoped>
.root {
    width: 100vw;
    height: 100vh;
    overflow: hidden;
    background: url('https://img3.wallspic.com/previews/6/6/9/7/7/177966/177966-fang_bao_you_xi-lian_sai_de_chuan_qi-2022-valorant-zi_se_de-x750.jpg') no-repeat center;
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