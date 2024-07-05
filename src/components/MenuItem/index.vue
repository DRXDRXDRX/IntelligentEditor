<template>
    <button class="menu-item" :class="{ 'is-active': props.isActive ? props.isActive() : null }" @click="props.action"
        :title="props.title">
        <input type="color" v-if="props.title === '字色'" v-model="textColor">
        <el-select v-model="size" v-if="props.title === '字号'">
            <el-option v-for="item in sizes" :key="item" :label="item" :value="item" />
        </el-select>
        <el-select v-model="font" v-if="props.title === '字体'">
            <el-option v-for="item in family" :key="item" :label="item" :value="item" />
        </el-select>
        <input type="file" v-if="props.title === '本地图片'" @change="getFiles">
        <svg class="remix">
            <use :xlink:href="`${remixiconUrl}#ri-${props.icon}`" />
        </svg>
    </button>
</template>

<script setup lang="ts">
import remixiconUrl from 'remixicon/fonts/remixicon.symbol.svg'
import { ref, watch, onMounted } from 'vue';
import { ElSelect } from 'element-plus';
import { filesStore } from '@/store';
import http from '@/utils/request';
import {imageStore} from '@/store'
const props = defineProps<{
    icon: string
    title: string
    action: Function
    isActive?: Function,
}>()
const textColor = ref('#000000')

defineExpose({ textColor })
const emits = defineEmits(['changeColor', 'changeFontSize', 'changeFontFamily']);
watch(textColor, (newVal) => {
    console.log(newVal)
    emits('changeColor', newVal)
})


const sizes = ['12px', '13px', '14px', '15px', '16px', '19px', '22px', '24px', '29px', '32px', '40px', '48px']
const size = ref('15px')
watch(size, (newVal) => {
    emits('changeFontSize', newVal)
})

const family = ['宋体', '黑体', '楷体', '微软雅黑', '等线', '行楷' ,'Arial', 'Arial Black', 'Comic Sans MS', 'Courier New', 'Georgia', 'Impact', 'Lucida Console', 'Lucida Sans Unicode', 'Palatino Linotype', 'Tahoma', 'Times New Roman', 'Trebuchet MS', 'Verdana']
const font = ref('Arial')
watch(font, (newVal:string) => {
    emits('changeFontFamily', newVal)
})

const fileStore = filesStore()
const getFiles = async (e) => {
    const files = e.target.files
    console.log(files)
    const formData = new FormData()
    formData.append('file', files[0])
    const res = await http.request({
        url: '/file/upload',
        method: 'POST',
        data: formData,
        headers: {
            'Content-Type': 'multipart/form-data', // 这行通常是可选的，浏览器会自动处理
        }
    })
    console.log(res.data.file_link)

    // fileStore.setFileList(files)
    // console.log(fileStore.fileList)
    // for(const file of files) {
    //     const reader = new FileReader()
    //     reader.readAsDataURL(file)
    //     reader.onload = (e) => {
    //         console.log(e.target?.result)
    //         fileStore.addSrc(e.target?.result)
    //     }
    // }
    // fileStore.changeInsert()
    
}

</script>

<style lang="scss">
.menu-item {
    position: relative;
    background: transparent;
    border: none;
    border-radius: 0.4rem;
    color: #333;
    cursor: pointer;
    height: 1.75rem;
    padding: 0.25rem;
    margin-right: 0.25rem;
    width: 1.75rem;
    transition: all .3s;

    input[type="color"] {
        opacity: 0;
        /* 使输入框透明 */
        position: absolute;
        /* 绝对定位 */
        top: 0;
        left: 0;
        width: 100%;
        /* 占满整个按钮宽度 */
        height: 100%;
        /* 占满整个按钮高度 */
        cursor: pointer;
        /* 当鼠标悬停时显示手型光标 */
    }
    input[type="file"] {
        opacity: 0;
        /* 使输入框透明 */
        position: absolute;
        /* 绝对定位 */
        top: 0;
        left: 0;
        width: 100%;
        /* 占满整个按钮宽度 */
        height: 100%;
        /* 占满整个按钮高度 */
        cursor: pointer;
        /* 当鼠标悬停时显示手型光标 */
    }

    .el-select {
        opacity: 0;
        /* 使输入框透明 */
        position: absolute;
        /* 绝对定位 */
        top: -40%;
        left: 0;
        width: 100%;
        /* 占满整个按钮宽度 */
        height: 60%;
        /* 占满整个按钮高度 */
        cursor: pointer;
        /* 当鼠标悬停时显示手型光标 */
    }

    svg {
        fill: currentColor;
        height: 100%;
        width: 100%;
        z-index: 10;
    }

    &.is-active,
    &:hover {
        background-color: #d6d6d6;
    }

}
</style>