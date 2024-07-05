<template>
    <div class="root">
        <div class="container">
            <h1>404</h1>
            <p>Oops! The page you are looking for does not exist.</p>
            <router-link to="/" class="home-link">Go back to home</router-link>
        </div>
    </div>
</template>

<script lang="ts" setup>

</script>

<style lang="scss" scoped>
.root {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100vh;
    background-color: #f0f0f0;
}

.container {
    text-align: center;
    padding: 20px;
    background-color: #fff;
    border-radius: 8px;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);

    h1 {
        font-size: 6rem;
        color: #ff6f61;
    }

    p {
        font-size: 1.2rem;
        color: #333;
    }

    .home-link {
        display: inline-block;
        margin-top: 20px;
        padding: 10px 20px;
        background-color: #ff6f61;
        color: #fff;
        text-decoration: none;
        border-radius: 4px;
        transition: background-color 0.3s;

        &:hover {
            background-color: #e05f53;
        }
    }
}
</style>