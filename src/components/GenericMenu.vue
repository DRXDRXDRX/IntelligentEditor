<template>
    <div class="root">
        <button><i class="ri-fullscreen-line"></i></button>
        <button><i class="ri-save-3-line"></i></button>
    </div>
</template>

<script setup lang="ts">

</script>

<style lang="scss" scoped>
.root {
    height: 40px;
    width: 99%;
    background-color: #fff;
    border-radius:10px;
    box-shadow: 0px 0px 8px 2px rgba(0, 0, 0, 0.1);
    display: flex;
    justify-content: space-between;

    button {
        background-color: #fff;
        border-radius: 10px;
        padding: 10px;
        cursor: pointer;
        border: none;
        font-size: 15px;
        transition: all 0.3s;
    }

    button:hover {
        background-color: rgb(138, 219, 251);
        transform: scale(1.1);
    }
}
</style>