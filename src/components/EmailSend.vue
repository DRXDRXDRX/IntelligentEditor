<template>
    <slot name="emailSend">
        <el-button :type="buttonType" :disabled="computedButtonDisabled" @click="handleSendCode"
            style="font-size: 12px; margin-left: 5px; width: 70px; font-weight: 700;">
            {{ buttonText }}
        </el-button>
    </slot>
</template>

<script lang="ts" setup>
import { ref, watch } from 'vue'
import { ElMessage } from 'element-plus';

interface CodeButtonProps {
    countdown: number;
    sending: boolean;
}
const codeButtonProps = ref<CodeButtonProps>({
    countdown: 60, // 验证码倒计时时长，单位秒
    sending: false,
});

const buttonType = ref<'primary' | 'danger'>('primary');
const buttonText = ref('发送验证码');
const computedButtonDisabled = ref(false);

const handleSendCode = () => {
  if (codeButtonProps.value.sending) return;

  // 发送验证码的逻辑
  console.log('Sending verification code...');
  ElMessage.success('验证码发送成功');

  // 启动倒计时
  codeButtonProps.value.sending = true;
  let interval = setInterval(() => {
    if (codeButtonProps.value.countdown === 1) {
      clearInterval(interval);
      codeButtonProps.value.countdown = 60;
      codeButtonProps.value.sending = false;
    } else {
      codeButtonProps.value.countdown -= 1;
    }
  }, 1000);
};

watch(codeButtonProps, (newVal) => {
  if (newVal.sending) {
    buttonText.value = `${newVal.countdown}秒后重发`;
    buttonType.value = 'danger';
    computedButtonDisabled.value = true;
  } else {
    buttonText.value = '发送验证码';
    buttonType.value = 'primary';
    computedButtonDisabled.value = false;
  }
}, { deep: true });

</script>

<style lang="scss" scoped></style>