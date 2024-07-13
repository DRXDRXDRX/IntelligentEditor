<template>
  <div class="carousel_outbox">
    <div class="carousel" @mouseover="stopCarousel" @mouseleave="startCarousel">
      <div class="slides" :style="{ transform: `translateX(-${currentIndex * 100}%)` }">
        <div class="slide" v-for="(slide, index) in slides" :key="index" :style="{ backgroundImage: `url(${slide.image})` }" @mouseover="applyShadow(index)" @mouseleave="removeShadow(index)">
          <div class="content">
            <h1>{{ slide.title }}</h1>
            <p>{{ slide.description }}</p>
            <button @click="learnMore">了解更多</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue';

const currentIndex = ref(0);
const slides = ref([
  {
    image: '/homepage_pics/10001.webp',
    title: 'Intelligent polishing',
    description: '智能润色'
  },
  {
    image: '/homepage_pics/10002.webp',
    title: 'Intelligent write continuation',
    description: '智能续写'
  },
  {
    image: '/homepage_pics/10003.webp',
    title: 'Intelligent typesetting',
    description: '智能排版'
  }
]);

let intervalId: number | null = null;

const startCarousel = () => {
  intervalId = setInterval(() => {
    currentIndex.value = (currentIndex.value + 1) % slides.value.length;
  }, 3000);
};

const stopCarousel = () => {
  if (intervalId) {
    clearInterval(intervalId);
    intervalId = null;
  }
};

const learnMore = () => {
  alert('了解更多内容');
};

const applyShadow = (index: number) => {
  if (index === currentIndex.value) {
    // 增加阴影效果
  }
};

const removeShadow = (index: number) => {
  if (index === currentIndex.value) {
    // 移除阴影效果
  }
};

onMounted(() => {
  startCarousel();
});

onUnmounted(() => {
  stopCarousel();
});
</script>

<style lang="scss" scoped>
.carousel_outbox {
  position: relative;
  overflow: hidden;
  display: flex;
  align-items: center;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.9);
  background: transparent;
  .carousel {
    width: 100%;
    height: 40vh;
    overflow: hidden;
    .slides {
      display: flex;
      //.slides 设置为 display: flex;：
      // 这意味着 .slide 元素将被作为子元素以横向（行方向）排列。
      //当使用 display: flex 时，默认情况下，Flexbox 布局的主轴是水平的，因此其子元素会沿水平方向排列。要实现垂直排列，需要显式地将主轴方向设置为垂直方向。具体来说，使用 flex-direction: column 来将子元素垂直排列。
      height: 100%;
      transition: transform 0.5s ease-in-out;
      .slide {
        min-width: 100%;
        display: flex;
        align-items: center;
        justify-content: center;
        transition: all 0.5s ease, box-shadow 0.3s ease;
        background-size: cover;
        background-position: center;
        .content {
          text-align: center;
          color: #fff;
          h1 {
            font-size: 3em;
            font-family: 'Gill Sans', 'Gill Sans MT', Calibri, 'Trebuchet MS', sans-serif;
            margin: 0.5em 0;
          }
          p {
            font-size: 1.5em;
            margin: 0.5em 0;
            font-family: Impact, Haettenschweiler, 'Arial Narrow Bold', sans-serif;
          }
          button {
            margin-top: 20px;
            padding: 0.5em 1em;
            font-size: 1.1em;
            font-family: Impact, Haettenschweiler, 'Arial Narrow Bold', sans-serif;
            border: none;
            border-radius: 30px;
            background: #fff;
            color: #333;
            cursor: pointer;
          }
          button:hover {
            background: #f0f0f0;
          }
        }
        &:hover {
          transform: scale(1.1);
          box-shadow: 0 10px 10px rgba(0, 0, 0, 0.4);
        }
      }
    }
  }
}
</style>
