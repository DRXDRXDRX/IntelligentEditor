<template>
    <h3>请选择满意的润色结果</h3>
    <div class="root" >
        <div class="option" v-for="(option, index) in options" :key="option" @click="chooseOption(index)"><strong>Result{{ index + 1 }}：</strong><br/>{{ option }}</div>
    </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
const options = ref<string[]>(['如果参数个数足够，使用 apply 方法将参数数组 args 应用到 fn 函数上，并执行', '当新的函数被调用时，将之前保存的参数 args 和新传入的参数 args2 合并2222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222', '这里使用 concat 方法将两个参数数组合并，形成一个新的参数数组333333333333333333333333333333333333333333333333333333333333333333333333'])
const chooseOption = (index) => {
    console.log(index);
    
}
</script>

<style lang="scss" scoped>
h3 {
    margin:5px;
    text-align: center;
}
.root {
    width: 98%;
    height: 98%;
    display: flex;
    flex-direction:column;
    align-items: center;
    gap: 0.5rem;

    .option {
        box-sizing: border-box;
        padding: 0.5rem;
        width: 100%;
        border: 1px solid #ccc;
        border-radius: 0.25rem;
        box-shadow: 0 0 0.5rem rgba(black, 0.1);
        transition: all 0.4s;
        word-break: break-all;
        /* 允许在任意字符间断行 */
        hyphens: auto;
        /* 允许自动连字符 */

        &:hover {
            cursor: pointer;
            transform: scale(1.02);
            color: skyblue;
            box-shadow: 0 0 0.5rem rgba(black, 0.2);
        }
    }
}

</style>