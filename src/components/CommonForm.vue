<template>
    <el-card>
        <h2>无界智能编辑器</h2>
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
.el-card {
    width: 450px;
    height: fit-content;
    padding: 20px;
    border-radius: 25px;
    box-shadow: 0 0 35px 10px rgba(153, 151, 151, 0.8);
    background-color: rgba(255, 255, 255, .8);

    h2 {
        margin-top: 0;
        font-size: 34px;
        text-align: center;
    }

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
        justify-content: center;

        .el-button:nth-child(2) {
            font-size: 12px;
        }
    }
}
</style>