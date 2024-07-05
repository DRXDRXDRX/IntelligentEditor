<template>
    <div class="root">
        <common-form :info="resetInfo" ref="cmp">
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
                    }
                ]" class="emailInput">
                    <el-input v-model="resetInfo.email" clearable>
                        <template #suffix>
                            <i class="ri-mail-check-line" style="font-size: 26px"></i>
                        </template>
                    </el-input>
                    <email-send :email="resetInfo.email" :verifyEmailResult="verifyEmailResult">
                        <template #emailSend></template>
                    </email-send>
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
                { min: 8, max: 20, message: '密码在8-20位之间', trigger: 'blur' }]">
                    <el-input clearable show-password v-model="resetInfo.password" placeholder="8-20位" />
                </el-form-item>
            </template>
            <template #confirm>
                <el-form-item label="确认密码" prop="confirmPassword" :rules="[{
                    validator: validatePass2,
                    trigger: 'blur',
                },
                { min: 8, max: 20, message: '密码在8-10位之间', trigger: 'blur' }]">
                    <el-input clearable show-password v-model="resetInfo.confirmPassword" placeholder="8-20位" />
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
import { ref, computed, watch } from 'vue'
import { useRouter } from 'vue-router'
import type { FormInstance, FormRules } from 'element-plus'
import http from '@/utils/request.ts'

const resetInfoRef = ref<FormInstance>()

const router = useRouter()
const resetInfo = ref({
    email: '',
    verificationCode: '',
    password: '',
    confirmPassword: '',
})

const cmp = ref(null)

const verifyEmailResult = ref<boolean | string>('')
watch(
    () => resetInfo.value.email,
    (newVal) => {
        if(resetInfo.value){
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

const reset = async () => {
    // http.request({
    //     url: '/user/email',
    //     method: 'get',
    // }).then(res => {
    //     console.log(res);
    // })

    // const res = await http.request({
    //     url: '/user/email',
    //     method: 'GET',
    //     params: {
    //         email: resetInfo.value.email,
    //         code: resetInfo.value.verificationCode
    //     }
    // })
    // if(res.code !== 0) {
    //     ElMessage.error("邮箱或验证码输入错误")
    //     return
    // }
    const result = await http.request({
        url: '/user/reset',
        method: 'POST',
        data: {
            email: resetInfo.value.email,
            code:resetInfo.value.verificationCode,
            password: resetInfo.value.password,
        }
    })
    console.log(result)
    if(result.code === 0) {
        ElMessage.success("重置密码成功")
        router.push('/login')
    } else {
        ElMessage.error("重置密码失败，请再次尝试")
    }
}

</script>

<style lang="scss" scoped>
.root {
    width: 100vw;
    height: 100vh;
    overflow: hidden;
    background-color: #fff;
    // background: url('https://img3.wallspic.com/previews/6/6/9/7/7/177966/177966-fang_bao_you_xi-lian_sai_de_chuan_qi-2022-valorant-zi_se_de-x750.jpg') no-repeat center;
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