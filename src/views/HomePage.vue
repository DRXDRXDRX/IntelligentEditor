<template>
  <div class="confluence-page">
    <header>
      <div class="top_nav">
        <img src="/logo-favicon.png" alt="Unbounded intelligence" class="logo">
        <div class="text-container">
          <span class="chinesename">无界智能</span>
          <span class="englishname">Unbounded intelligence</span>
        </div>
        <el-dropdown @command="handleCommand">
          <span class="el-dropdown-link">
            {{ currentLanguage }}
            <i class="el-icon-arrow-down el-icon--right"></i>
          </span>
          <template #dropdown>
            <el-dropdown-menu>
              <el-dropdown-item v-for="(name, key) in languageMap" :key="key" :command="key">
                {{ name }}
              </el-dropdown-item>
            </el-dropdown-menu>
          </template>
        </el-dropdown>
        <div class="github">
          <a href="https://github.com/DRXDRXDRX/IntelligentEditor">github</a>
        </div>
        <div class="register">
          <a href="/register">注册</a>
        </div>
        <div class="login">
          <a href="/login">登录</a>
        </div>
        <div class="help">
          <a href="/help">帮助</a>
        </div>
      </div>

    </header>

    <preface>
      <div class="video_background">
        <video autoplay muted loop  class="video">
          <source src="/video/Sora_OpenAI.mp4" type="video/mp4">
          您的浏览器不支持 HTML5 视频。
        </video>
        <div class="video_text_content">
          <h1>Introducing Boundless IntelligentEditor</h1>
          <p>Creating realistic text by AI </p>
          <button @click="learnMore">Learn more</button>
        </div>
      </div>
      
    </preface>

    <main>
      <div class="parent_container">
        <div class="top_section">
          <div class="title_container">
            <h1>无界智能编辑器 </h1>
            <img src="/stars.png" alt="stars" class="starslogo">
          </div>
          <p class="subtext">轻松创建更好的文档，改善您的工作管理流程。随时随地让AI激发您的创作。无论是在办公室还是在家中，AI都能为您的工作提供源源不断的支持和灵感。</p>
          <h2>免费计划包含:</h2>
          <ul>
            <li>支持AI续写 AI智能排版 AI文档检索问答</li>
            <li>包含2 GB存储空间</li>
            <li>提供社区支持</li>
            <li>永久免费</li>
          </ul>
         
        </div>
        <div class="placeholder"></div>
        <div class="bottom_section">
          <div class="title_container">
            <h1>功能介绍 </h1>
          </div>
          <p class="subtext"></p>
          <h2></h2>
          <ul>
            <li>智能文本建议与纠错</li>
            <li>多语言支持</li>
            <li>自动格式化</li>
            <li>语义分析与内容生成</li>
            <li>集成云存储</li>
            <li>多文件内容AI检索</li>
          </ul>
        </div>
            
        
      </div>
    </main>

    <end>
      <div class="carousel_outbox">
        <div class="carousel">
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
    </end>
  </div>
</template>

<script setup lang="ts">

import { ref } from 'vue'

const workEmail = ref('')
const agreeTerms = ref(false)

// 多语言切换逻辑
import { useI18n } from 'vue-i18n'

const { locale } = useI18n()
const currentLanguage = ref('简体中文')

const languageMap = {
  'zh-CN': '简体中文',
  en: 'English',
  'zh-TW': '繁體中文',
  ko: '한국어',
  ja: '日本語',
  fr: 'Français',
  de: 'Deutsch',
  es: 'Español',
  pt: 'Português',
}

const handleCommand = (command) => {
  if (languageMap[command]) {
    currentLanguage.value = languageMap[command];
    locale.value = command;
    console.log('Language selected:', languageMap[command]);
  } else {
    console.warn('Unsupported language command:', command);
  }
}

// 轮播图
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
 
 let intervalId = null;
 
 const startCarousel = () => {
   intervalId = setInterval(() => {
     currentIndex.value = (currentIndex.value + 1) % slides.value.length;
   }, 3000);
 };
 
 const stopCarousel = () => {
   clearInterval(intervalId);
 };
 
 const learnMore = () => {
   alert('了解更多内容');
 };
 
 onMounted(() => {
   startCarousel();
 });
 
 onUnmounted(() => {
   stopCarousel();
 });


 const getAverageColor = (imageUrl, callback) => {
            const img = new Image();
            img.src = imageUrl;
            img.crossOrigin = "Anonymous";
            img.onload = () => {
                const canvas = document.createElement('canvas');
                const context = canvas.getContext('2d');
                canvas.width = img.width;
                canvas.height = img.height;
                context.drawImage(img, 0, 0);
                const imageData = context.getImageData(0, 0, img.width, img.height).data;
                let r = 0, g = 0, b = 0;
                for (let i = 0; i < imageData.length; i += 4) {
                    r += imageData[i];
                    g += imageData[i + 1];
                    b += imageData[i + 2];
                }
                r = Math.floor(r / (imageData.length / 4));
                g = Math.floor(g / (imageData.length / 4));
                b = Math.floor(b / (imageData.length / 4));
                const color = `rgba(${r},${g},${b},0.5)`;
                callback(color);
            };
        };
        const applyShadow = (index) => {
            const slide = document.querySelectorAll('.slides')[index];
            getAverageColor(slides.value[index].image, (color) => {
                slide.style.boxShadow = `0 10px 20px ${color}`;
            });
        };

        const removeShadow = (index) => {
            const slide = document.querySelectorAll('.slides')[index];
            slide.style.boxShadow = 'none';
        };

        onMounted(() => {
            slides.value.forEach((slide, index) => {
                getAverageColor(slide.image, (color) => {
                    document.querySelectorAll('.slide')[index].style.boxShadow = `0 10px 20px ${color}`;
                });
            });
        });



</script>

<style lang="scss" scoped>

.confluence-page {
  font-family: Arial, sans-serif;
  background-color: #deebff;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  overflow-x: hidden; /* 防止水平滚动条 */
}

/* 顶部导航栏 */
.top_nav {
  position: fixed; /* 固定定位 */
  // position: fixed;元素相对于视口进行定位，不会随着页面滚动而改变位置。
  // 例如，如果你设置 top: 0; left: 0;，元素会固定在视口的左上角，即使页面滚动，它仍然保持在视口的左上角
  top: 0; /* 置顶 */
  left: 0; /* 左对齐 */
  height: 60px; /* 占满高度 */
  width: 100%; /* 占满宽度 */
  display: flex;
  justify-content: flex-start; /* 从左到右排列 */
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1); /* 添加阴影 */
  align-items: center;
  padding: 10px 0px;
  background-color: #fff; /* 顶部导航背景颜色 */
  z-index: 1000; /* 确保导航栏在其他元素之上 */

  .logo {
    height: 43px;
    margin-left: 10px; /* 距离左边50px */
  }

   .el-dropdown {
    margin-left: 900px; /* 调整与 logo 的间距 */
  }

  .el-dropdown-link {
    cursor: pointer;
    font-size: 18px;
    // font-weight: 700;
    color: #1D2C49;
    display: flex;
    align-items: center;
    margin-left: 20px;
    outline: none; // 去除点击时的虚线框

    &.clicked {
      color: #409EFF; // 点击后的文本颜色
      // font-weight: 700; // 点击后字体粗细
    }
  }

   .el-dropdown-link i {
    margin-left: 5px;
  }

   .el-dropdown-link:hover {
    color: #409EFF;
  }

  .github{
    margin-left: 20px;
    a{
      color: #1D2C49;
      font-size: 18px;
      // font-weight: 700;
      text-decoration: none;
      &:hover {
        color: #409EFF;
      }
    }
    
  }
  .register{
    margin-left: 20px;
    a{
      color: #1D2C49;
      font-size: 18px;
      // font-weight: 700;
      text-decoration: none;
      &:hover {
        color: #409EFF;
      } 
    }
  }
  .login{
    margin-left: 20px;
    a{
      color: #1D2C49;
      font-size: 18px;
      // font-weight: 700;
      text-decoration: none;
      &:hover {
        color: #409EFF;
      }
    }
  }
  .help{
    margin-left: 20px;
    a{
      color: #1D2C49;
      font-size: 18px;
      // font-weight: 700;
      text-decoration: none;
      &:hover {
        color: #409EFF;
      } 
    }
  }

}

a{
  transition: all .5s;
}

/* 主体内容 */
main {
  width: 100%;
  margin: 0 auto;
  background: url('/home_background.svg') no-repeat center center / cover;
  display: flex;
  flex: 1;
  // padding: 2rem;
  margin-top: 100px; /* 确保主内容在导航栏下方，值等于导航栏的高度 */
  // margin-bottom:50px;
}

// 无界智能编辑器名字
.text-container {
  display: flex;
  flex-direction: column;
  margin-left: 15px;
}

.chinesename {
  font-family: 'ZCOOL QingKe HuangYou', sans-serif;
  font-size: 25px;
  color: #0e0d0d;
}

.englishname {
  font-family: 'Poppins', sans-serif;
  font-size: 13px;
  font-weight: 150;
  color: #1D2C49;
}



.parent_container{
  width: 100%;
  padding: 50px 90px;
  // top:-10vh;  
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);

  .top_section{
    position: relative;
    
    padding: 20px;
    background: rgba(255, 255, 255, 0.3);
    border-radius: 10px;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
    backdrop-filter: blur(10px);
    -webkit-backdrop-filter: blur(1px);
    border: 1px solid rgba(255, 255, 255, 0.18);
    transition: transform 0.3s ease-in-out;

    .subtext{
      font-size: 1.1em;
      // margin: 0.5em 0;
      margin-top: 0;
      margin-left: 2vw;
      color: #333;
      font-family: 'Gill Sans', 'Gill Sans MT', Calibri, 'Trebuchet MS', sans-serif;
    
    }
    
    .title_container {
      display: flex;
      align-items: center;
      .starslogo {
      margin-top: 0.6%;
      height: 2.5rem * 0.8; /* 图片高度为标题高度的80% */
      width: auto; /* 宽度自动调整以保持比例 */
      margin-left: 10px; /* 与标题之间的间距 */
      h1 {
      font-size: 2.5rem; /* 适当的字体大小 */
      font-weight: 500; /* 适当的字体粗细 */
      color: #0047AB; /* 深蓝色字体 */
      margin-bottom: 0.5rem; /* 底部边距 */
      font-family: 'Noto Sans SC', sans-serif;
      line-height: 1.2; /* 行间距 */
      }
    }
    }
    li{
      list-style: none; // 去掉默认的列表样式
      position: relative;
      margin-bottom:1.5vh;
  
      // 使用伪元素插入对勾
      &::before {
        content: "✓"; // 对勾符号
        color: #800080; // 紫色
        position: absolute; // 绝对定位
        top: -1vh;
        left: -2vw;
        
        font-size: 1.5em; // 适当调整大小
        margin-right: 0.5em; // 距离文字的间距
      }
        }
  }
  .bottom_section{
    padding: 20px;
    background: rgba(255, 255, 255, 0.3);
    border-radius: 10px;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
    backdrop-filter: blur(10px);
    -webkit-backdrop-filter: blur(5px);
    border: 1px solid rgba(255, 255, 255, 0.18);
    position: relative;
    transition: transform 0.3s ease-in-out;
    padding: 20px;

    .title_container {
      display: flex;
      align-items: center;
      
    }
    li{
      list-style: none; // 去掉默认的列表样式
      position: relative;
      margin-bottom:1.5vh;
  
      // 使用伪元素插入对勾
      &::before {
        content: "✓"; // 对勾符号
        color: #800080; // 紫色
        position: absolute; // 绝对定位
        top: -1vh;
        left: -2vw;
        
        font-size: 1.5em; // 适当调整大小
        margin-right: 0.5em; // 距离文字的间距
      }
      }
  }
  

}
.placeholder{
    margin: 1px;
    position: relative;
    height:10vh;
  }


.bottom_section:hover {
  transform: scale(1.05);
  box-shadow: 10 10px 20px rgba(0, 0, 0, 0.4);

}
.top_section:hover{
  transform: scale(1.05);
  box-shadow: 10 10px 20px rgba(0, 0, 0, 0.4);

}
// 轮播图：
.carousel_outbox{
   bottom:0vw;
   
  //  当一个元素使用 position: relative; 并且设置 top: 50%; 时，这里的 50% 是相对于元素自身的高度来说的。
  // 由于 top: 50%; 是相对于元素自身的高度的 50%，因此这个元素会从其原始位置向下偏移自身高度的 50%（即 200px 的 50%，也就是 100px）
  ;
   position:relative;
   overflow: hidden;
   background:transparent;
    /* 浅灰色背景，类似 Grammarly */
   display: flex;
   align-items: center;
   box-shadow: 0 2px 10px rgba(0, 0, 0, 0.9);




   .carousel {
   top:-30%;
   position: relative;
   width: 100%;
   height: 40vh;
   overflow: hidden;
   
 }
 
 .slides {
   display: flex;
   height: 100%;
   transition: transform 0.5s ease-in-out;
   
 }
 
 .slide {
   min-width:100%;
   /* display: flex; 会使一个元素成为一个 flex 容器，其子元素会自动成为 flex 项目。这种布局方式的主要特性和优点包括： */
   display: flex;
   /* 这里说的是容器内子元素的排列对齐 */
   align-items: center;
   /* align-items: 定义子元素沿交叉轴的对齐方式（如 flex-start、flex-end、center、baseline、stretch）。 */
   justify-content: center;
   /* justify-content: 定义子元素沿主轴的对齐方式（如 flex-start、flex-end、center、space-between、space-around） */
   /* align-content:  
   定义多行内容的对齐方式（在子元素换行的情况下，类似于 justify-content 但作用于交叉轴）。 */

   transition: all 0.5s ease, box-shadow 0.3s ease;
   background-size: cover;
   background-position: center;   
 }
 
 .content {
   text-align: center;
   color: #fff;
   
 }
 
 h1 {
   font-size: 3em;
   font-family: 'Gill Sans', 'Gill Sans MT', Calibri, 'Trebuchet MS', sans-serif;
   color: #fff;
   margin: 0.5em 0;
 }
 
 p {
   font-size: 1.5em;
   margin: 0.5em 0;
   color: #fff;
  //  font-family: 'Gill Sans', 'Gill Sans MT', Calibri, 'Trebuchet MS', sans-serif;
  font-family: Impact, Haettenschweiler, 'Arial Narrow Bold', sans-serif;
 }
 
 button {
   margin-top: 20px;
   padding: 0.5em 1em;
   font-size: 1.1m;
   font-family: Impact, Haettenschweiler, 'Arial Narrow Bold', sans-serif;
   border: none;
   min-width:100px;
   max-width: 100px;
   border-radius: 30px;
   background: #fff;
   color: #333;
   font-weight:700;
   transition: all .5s ease;
   cursor: pointer;
 }
 
 button:hover {
   background: #f0f0f0;
 }
 }
//  .carousel_outbox:hover{
//      transform: scale(1.01);
//     box-shadow: 10 10px 20px rgba(0, 0, 0, 0.4);
//  }
 .slide:hover {
    transform: scale(1.1);
    box-shadow: 0 10px 10px rgba(0, 0, 0, 0.4);
}


// 播放视频

.video_background{
  // border-radius: 10px;
  margin: 0 auto;
  position: relative;
  top: 60px;
  width:100vw;
  video{
    // border-radius: 10px;
    position: relative;
    width: 100%;
    height: 100%;
    object-fit: cover;
    top: 0;
    left: 0;
    z-index: 10;
  }


  .video_text_content{
    position: absolute;
    top:55%;
    left:5%;
    z-index:11;
    h1{
      font-size: 3em;
      color: #fff;
      margin: 0.5em 0;
      font-family: 'Gill Sans', 'Gill Sans MT', Calibri, 'Trebuchet MS', sans-serif;
    }
    p{
      font-size: 1.5em;
      margin: 0.5em 0;
      color: #fff;
      font-family: 'Gill Sans', 'Gill Sans MT', Calibri, 'Trebuchet MS', sans-serif;
    }
    button{
      padding: 10px 20px;
      font-size: 16px;
      background-color: rgba(0, 0, 0, 0.5);
      color: white;
      font-weight:700;
      border: none;
      cursor: pointer;
      border-radius: 5px;
      transition: all 0.4s ease;
      &:hover {
        font-size:18px;
        background-color:#000;
      }
    }
    
  }

}




</style>
