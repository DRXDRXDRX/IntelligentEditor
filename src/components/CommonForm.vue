
<template>
    
    <el-card>
        <div class="title-container">
            <h2 class="main-title span_headline" >无界智能编辑器</h2>
            <h3 class="sub-title span_headline">Unbounded Intelligence</h3>
        </div>
        <el-form label-width="auto" :model="props.info" style="max-width: 600px">
            <slot name="username"></slot>
            <slot name="email"></slot>
            <slot name="verificationCode"></slot>
            <slot name="password"></slot>
            <slot name="confirm"></slot>
            <slot name="forget"></slot>
            <slot name="button"></slot>
        </el-form>
    </el-card>
</template>
<script setup lang="ts">

const props = defineProps({
    info: Object
})

</script>


<style lang="scss" scoped>
.title-container {
    text-align: center;
    margin-bottom: 22px;

    .main-title {
        font-size: 34px;
        font-weight: bold;
        color: #333;
        margin-bottom: 0px;
        // line-height: 0.3; /* 添加此行以调整行距 */
    }

    .sub-title {
        font-family: 'Roboto', sans-serif;
        font-size: 18px;
        color: #666;
        font-weight: bold;
        margin-top: 5px;
        line-height: 1.2; /* 添加此行以调整行距 */
    }
}


.el-card {
    width: 450px;
    height: fit-content;
    padding: 20px;
    border-radius: 25px;
    box-shadow: 0 0 35px 10px rgba(153, 151, 151, 0.8);
    background-color: rgba(255, 255, 255, .8);

    ::v-deep(.el-form-item__content) {
        flex-wrap: nowrap;
        display: flex;
        justify-content: flex-end !important;
    }

    .forget {
        display: flex;
        justify-content: flex-end;
        margin: 0 0 5px 0;
    }

    span:not(.span_headline) {
        color: #409EFF;
        cursor: pointer;
        // 这是一个新的样式，用于设置渐变背景色
        font-size: 13px;
    }

    span:not(.span_headline):hover {
        text-decoration: underline;
    }

  
    .span_headline {
     display: inline-block; /* 确保效果仅应用于文字部分 */
     background:linear-gradient(to right,#ffffff,#3a3b3a) no-repeat right bottom;
     background-size:0 2px;
     transition:  background-size 0.5s;
    }   
    .span_headline:hover{
        background-position: left bottom;
        background-size:  100% 2px;
    }


    .button {
        display: flex;
        justify-content: center;

        .el-button:nth-child(2) {
            font-size: 12px;
        }
    }
}
</style>