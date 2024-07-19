<template>
  <div class="confluence-page">
    <header>
      <div class="top_nav">
        <div class="left_nav_wrapper">
          <img src="/logo-favicon.png" alt="Unbounded intelligence" class="logo">
          <div class="text_container">
            <p class="chinesename" style="margin-bottom: 0px;" >无界智能</p>
            <p class="englishname" style="margin-bottom: 0px;">Unbounded intelligence</p>
          </div>

        </div>
        <div class="right_nav_wrapper">
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
      </div>
    </header>

    <div class="video_background">
      <video autoplay muted loop  class="video">
        <source src="/video/Sora_OpenAI.mp4" type="video/mp4">
        您的浏览器不支持 HTML5 视频。
      </video>

      <div class="video_text_content">
        <h1>Introducing Boundless IntelligentEditor</h1>
        <p>Creating realistic text by AI </p>
        <button @click="StartHere">从此开始</button>
      </div>
      
    </div>

    <main>
      <div class="info_present_container">
        <p style="font-size:30px; font-weight:300;padding:15px; color:black;font-family:'Gill Sans', 'Gill Sans MT', Calibri, 'Trebuchet MS', sans-serif;margin-bottom:0px;margin-top:50px;">Boundless IntelligentEditor</p>
        <div class="info_present" :class="{'no_transition': if_transition}" :style="{ transform: `translateX(-${currentSlide * viewImageWidth}px)` }">  
          <div v-for="(slide, index) in info_present_slides" :key="index" class="info_present_slide">
            <div class="content_block">
              <img ref="slideImage" :src="slide.image" alt="Slide Image" />
              <div class="caption">{{ slide.caption }}</div>
              <div class="title">{{ slide.title }}</div>
            </div>
          </div>
        </div>
        <button @click="prevSlide();" class="info_present_button left_button">‹</button>
        <button @click="nextSlide();" class="info_present_button right_button">›</button>
      </div>
       
     

      <div class="parent_container">
       <p style="height:100px;"></p>
        <div class="first_section">
          <div class="left_part">
            <img  src="/section_pics/1.png" alt="first_section_content">
          </div>
          <div class="right_part">
            <h2>内容高效创作与优化</h2>
            <hr ></hr>
            <p>智能续写：基于上下文自动生成内容，提升写作效率。<br>
              智能润色：自然语言处理优化和校对文本，确保文档的专业性和准确性。</p>
          </div>
        </div>
        <div class="second_section">
          <div class="left_part">
            <h2>多模式输入与处理</h2>
            <hr ></hr>
            <p>图像问答：分析并回答有关图片的问题，让图像信息更有价值。<br>
              音频转为文字：将语音内容精准转录为文字，方便记录和整理。</p>
          </div>
          <div class="right_part">
            <img  src="/section_pics/2.png" alt="first_section_content">
          </div>
        </div>
        <div class="third_section">
          <div class="left_part">
            <img  src="/section_pics/3.png" alt="first_section_content">
          </div>
          <div class="right_part">
            <h2>智能数据管理与展示</h2>
            <hr ></hr>
            <p>文档管理：高效管理和组织文档，确保资料井井有条。<br>
              智能数据可视化：从文本生成思维导图，直观展示内容结构。</p>
          </div>
        </div>
        <div class="fourth_section">
          <div class="left_part">
            <h2>无缝协作与跨平台同步</h2>
            <hr ></hr>
            <p>实时同步与多端同步：即时更新和保存协作内容，实现不同设备间的数据同步。<br>
              智能对话与知识库提问：基于GPT模型的智能对话和内置知识库，提供即时帮助和解答，提升协作效率。</p>
          </div>
          <div class="right_part">
            <img  src="/section_pics/3.png" alt="first_section_content">
          </div>
        </div>
      </div>
    </main>

    <end>
      <div class="carousel_outbox">
        <div class="carousel" @mouseover="stopCarousel" @mouseleave="startCarousel">
          <div class="slides" :style="{ transform: `translateX(-${currentIndex * 100}%)` }">
            <div class="slide" v-for="(slide, index) in slides" :key="index" :style="{ backgroundImage: `url(${slide.image})` }">
              <div class="content">
                <h1>{{ slide.title }}</h1>
                <p>{{ slide.description }}</p>
                <button @click="StartHere">了解更多</button>
              </div>
            </div>
          </div>
        </div>
     </div>
    </end>

  </div>
</template>

<script setup lang="ts">

import { ref , computed } from 'vue'
// 多语言切换逻辑
import { useI18n } from 'vue-i18n'
const { locale } = useI18n()
const currentLanguage = ref('简体中文')
const languageMap = {
  en: 'English',
  ko: '한국어',
  ja: '日本語',
  fr: 'Français',
  de: 'Deutsch',
  es: 'Español',
  pt: 'Português',
  'zh-CN': '简体中文',
  'zh-TW': '繁體中文'
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
    "image": "/endline_pics/10001.webp",
    "title": "Intelligent polishing",
    "description": "智能润色 - 自然语言处理优化和校对文本"
  },
  {
    "image": "/endline_pics/10002.webp",
    "title": "Intelligent write continuation",
    "description": "智能续写 - 基于上下文自动生成内容"
  },
  {
    "image": "/endline_pics/10003.webp",
    "title": "Intelligent typesetting",
    "description": "音频转文字 - 将语音内容转录为文字"
  },
  {
    "image": "/endline_pics/10004.webp",
    "title": "Full-text translation",
    "description": "全文翻译 - 自动翻译文档内容"
  },
  {
    "image": "/endline_pics/10005.webp",
    "title": "Image Q&A",
    "description": "图像问答 - 分析并回答有关图片的问题"
  },
  {
    "image": "/endline_pics/10006.webp",
    "title": "Knowledge base Q&A",
    "description": "知识库提问 - 通过内置知识库回答问题"
  },
  {
    "image": "/endline_pics/10007.webp",
    "title": "Document management",
    "description": "文档管理 - 管理和组织文档"
  },
  {
    "image": "/endline_pics/10008.webp",
    "title": "Real-time synchronization",
    "description": "实时同步 - 即时更新和保存协作内容"
  },
  {
    "image": "/endline_pics/10009.webp",
    "title": "Multi-end synchronization",
    "description": "多端同步 - 在不同设备之间同步数据"
  },
  {
    "image": "/endline_pics/10010.webp",
    "title": "Intelligent image OCR",
    "description": "智能图像OCR - 从图像中提取文字"
  },
  {
    "image": "/endline_pics/10011.webp",
    "title": "Intelligent conversation",
    "description": "智能对话 - 基于GPT模型的对话功能"
  },
  {
    "image": "/endline_pics/10012.webp",
    "title": "Intelligent data visualization",
    "description": "智能数据可视化 - 例如，选中文本后自动生成思维导图"
  }
]);
 
 let intervalId = null;
 
 const startCarousel = () => {
   intervalId = setInterval(() => {
     currentIndex.value = (currentIndex.value + 1) % slides.value.length;
   }, 2000);
 };
 const stopCarousel = () => {
   clearInterval(intervalId);
 };
 
 const StartHere = () => {
  //进行cookie检查，也就是如果用户登陆过了，并且保质期还在，就直接进入edit页面。否则就跳转到登陆页面？
  alert("Start Here");
};
 
 onMounted(() => {
   startCarousel();
 });
 
 onUnmounted(() => {
   stopCarousel();
 });


const width_pics_num = 4;
const currentSlide = ref(width_pics_num);
const viewImageWidth = ref(0);
const info_present_slides = [];
const slideImage=ref(0)
let title_descrip_pair = [{title:"智能润色",description:"自然语言处理优化和校对文本"},
                          {title:"智能续写",description:"基于上下文自动生成内容"},
                          {title:"音频转文字",description:"将语音内容转录为文字"},
                          {title:"全文翻译",description:"自动翻译文档内容"},
                          {title:"图像问答",description:"分析并回答有关图片的问题"},
                          {title:"知识库提问",description:"通过内置知识库回答问题"},
                          {title:"文档管理",description:"管理和组织文档"},
                          {title:"实时同步",description:"即时更新和保存协作内容"},
                          {title:"多端同步",description:"在不同设备之间同步数据"},
                          {title:"智能图像OCR",description:"从图像中提取文字"},
                          {title:"智能对话",description:"基于GPT模型的对话功能"},
                          {title:"智能数据可视化",description:"选中文本后自动生成思维导图"}
                          ]
for (let i = 10001; i <= 10012; i++) {
  info_present_slides.push({
    image: `./public/square_pics/${i}.webp`,
    caption: `${title_descrip_pair[i - 10001].description}`,
    title:`${title_descrip_pair[i - 10001]['title']}`
  });
}
const prompt_info_present_slides_length = info_present_slides.length;

for(let i =0;i<4;i++){
  info_present_slides.unshift(info_present_slides[info_present_slides.length-1-i]);
}
for(let i=0;i<3;i++)
{
  info_present_slides.push(info_present_slides[i+3]);
}
console.log(info_present_slides)
const if_transition = ref(false);
const prevSlide = () => {
  viewImageWidth.value = slideImage.value[0].clientWidth;
  if(currentSlide.value===1)
  {
    if_transition.value=false;
    currentSlide.value = currentSlide.value  -1;
    setTimeout(() => {
      if_transition.value = true;
      currentSlide.value = prompt_info_present_slides_length;
    }, 500);
  }
  else{
    if_transition.value=false;
    currentSlide.value = (currentSlide.value - 1 + prompt_info_present_slides_length) % prompt_info_present_slides_length;

  }
};



const nextSlide = () => {
  viewImageWidth.value = slideImage.value[0].clientWidth;
  if (currentSlide.value === prompt_info_present_slides_length-1) {
    if_transition.value=false;
    currentSlide.value = currentSlide.value  +1;
    setTimeout(() => {
      if_transition.value = true;
      currentSlide.value = 0;
    }, 500);
    // console.log("计时器到了！")
  }
  else{
    if_transition.value=false;
    currentSlide.value = (currentSlide.value + 1) % prompt_info_present_slides_length;
  }
  
};


onMounted(() => {
  viewImageWidth.value = slideImage.value[0].clientWidth;
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
  height: 7.5%; /* 占满高度 */
  width: 100%; /* 占满宽度 */
  display: flex;
  border-radius: 0 0 5px 5px;
  justify-content: flex-start; /* 从左到右排列 */
  box-shadow: 4px 8px 6px rgba(0, 0, 0, 0.2); /* 添加阴影 */
  align-items: center;
  padding: 10px 0px;
  // background-color: #ffffff; /* 顶部导航背景颜色 */
  background-color:#ffffff;
  z-index: 1000; /* 确保导航栏在其他元素之上 */

  .left_nav_wrapper{
    display: flex;
    align-items: center;
    position: relative;
    left:50px;
    .logo {
    height: 43px;
    margin-left: 10px; /* 距离左边50px */
    }
    // 无界智能编辑器名字
    .text_container {
      width:220px;
      display: flex;
      flex-direction: column;
      border: 0px;
      padding-left:20px;

    .chinesename {
      display: block;
      font-family: 'ZCOOL QingKe HuangYou', sans-serif;
      font-size: 25px;
      color: #0e0d0d;
      text-align: left;
      margin-bottom:0px !important;
    }

    .englishname {
      display: block;
      font-family: 'Poppins', sans-serif;
      font-size: 13px;
      font-weight: 150;
      color: #0c0c0c;
      text-align: left;
      margin:0px;
      }
    }

    
    }
  }

.right_nav_wrapper {
    display: flex;
    justify-content: flex-end;
    margin-left: auto; /* 将右侧的元素推到右侧 */
    margin-right: 50px; /* 距离右侧50px */

   

  .el-dropdown-link {
    cursor: pointer;
    font-size: 18px;
    font-weight: 700;
    color: #2c2c2c;
    display: flex;
    align-items: center;
    margin-left: 20px;
    outline: none; // 去除点击时的虚线框

    &.clicked {
      color: #3a3a3a; // 点击后的文本颜色
      font-weight: 700; // 点击后字体粗细
    }
  }

   .el-dropdown-link i {
    margin-left: 5px;
  }
   .el-dropdown-link:hover {
    color: #3a3a3a;
  }

  .github,.register,.login,.help{
    a{
      color: #2c2c2c;
      font-size: 18px;
      font-weight: 700;
      text-decoration: none;
      &:hover {
        color: #3a3a3a;
      }
    }
    transition: ease-in-out 0.3s;
    border-radius: 20px;
    padding-left:10px;
    padding-right: 10px;
    padding-top: 5px;
    padding-bottom: 5px;
  }
  .github:hover ,.register:hover,.login:hover,.help:hover{
    background-color: #3a3a3a30;
  }

  

}





/* 主体内容 */
main {
  margin: 0 auto;
  // background: url('/home_background.svg') no-repeat center center / cover;
  background-color: #DEEBFF;
  display: flex;
  flex-direction: column;
  // padding: 2rem;
  // margin-top: 60px; /* 确保主内容在导航栏下方，值等于导航栏的高度 */
}



// 轮播图：
.carousel_outbox{
   bottom:0vw;
   
  //  当一个元素使用 position: relative; 并且设置 top: 50%; 时，这里的 50% 是相对于元素自身的高度来说的。
  // 由于 top: 50%; 是相对于元素自身的高度的 50%，因此这个元素会从其原始位置向下偏移自身高度的 50%（即 200px 的 50%，也就是 100px）
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
   .slides {
   display: flex;
   height: 100%;
   transition: transform 0.5s ease-in-out;
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
    .content {
      text-align: center;
      color: #fff;
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
        cursor: pointer;
      }
      button:hover {
        background: #f0f0f0;
      }
    }
  }
  .slide:hover {
    transform: scale(1.1);
    box-shadow: 0 10px 10px rgba(0, 0, 0, 0.4);
  }
 }
}
}

 

// 展示内部信息
.info_present_container {
  position: relative;
  width: 88vw;
  overflow: hidden;
  margin: auto;
  display:block;
  
  

  .info_present {
    padding-top:10px;
    display: flex;
    transition: transform 0.5s ease-in-out;
    &.no_transition{
      transition: none;
    }
    
    .info_present_slide {
      padding:5px;
      min-width: 23vw;
      box-sizing: border-box;
      position: relative;
      overflow: hidden;
      min-height: 43vh;
      text-align: center;
      .content_block{
      position: relative;
      transition: ease-in-out 0.3s;
      img {
        border-radius: 25px;
        padding:10px;
        width: 100%;
        height: 100%; /* 修改为 100% 使 img 元素填充整个父元素 */
        object-fit: cover; /* 添加 object-fit: cover; 以保持宽高比并裁剪多余部分 */
      }
      .caption {
        position: absolute;
        bottom: 10px;
        left: 50%;
        transform: translateX(-50%);
        background-color: rgba(0, 0, 0, 0.5);
        color: white;
        padding: 10px;
        border-radius: 5px;
        width:50%;
      }
      .title{
        position: absolute;
        top: 8%;;
        left: 7%  ;
        font-size:19px;
        font-weight:500;
        color:white;
      }
     }
      
    }
    
      .content_block:hover {
        transform: scale(1.08);
      }
    }
    

    .info_present_button {
      position: absolute;
      top: 50%;
      transform: translateY(-50%);
      background-color: rgba(255, 255, 255, 0.5);
      border: none;
      font-size: 2rem;
      cursor: pointer;

    }
    .left_button {
      left: 20px;
    }

    .right_button {
      right: 20px;
    }
}



.parent_container{
  position: relative;
  display:block;
  background-color: #E6FCFF;
// 第一部分
  .first_section{
    position: relative;
    display:flex;
    margin-top:20px;
    padding: 20px;
    padding-left:100px;
    
    
    .left_part .right_part{
      display:inline-block;
      box-sizing: border-box; /* 确保 padding 和 border 不会增加元素的总宽度 */
      vertical-align: top; /* 防止由于不同内容高度导致的对齐问题 */
    }
    .left_part{
      width:40%;
      background: rgba(255, 255, 255, 0.3);
      border-radius: 10px;
      backdrop-filter: blur(10px);
      -webkit-backdrop-filter: blur(1px);
      transition: transform 0.3s ease-in-out;
      img{
        border-radius: 10px;
        width: 100%;
        height: 100%;
        object-fit: cover;
      }
    }
    .left_part:hover {
      box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
      border: 1px solid rgba(255, 255, 255, 0.18);
      transform: scale(1.05);
      box-shadow: 10 10px 20px rgba(0, 0, 0, 0.4);
    }
    .right_part{
      width:50%;
      margin-left:15px;
      padding:7%;
      padding-left:35px;
      padding-right:35px;
      h2{
        font-weight: bold;
        font-size: 2em;
        margin-bottom: 30px;
      }
      hr {
          display: block;
          overflow: hidden;
          height:2px;
          width: 100%;
          border:none;
          background-color: #DFE1E5;
          margin-bottom: 50px;
      }
      p{
        font-size: 18px;
        margin-right:20px;
      }
    }
  }
  // 第二部分 第四部分
  .second_section ,.fourth_section{
    position: relative;
    display:flex;
    margin-top:20px;
    padding: 20px;
    padding-left:100px;

    .left_part .right_part{
      display:inline-block;
      box-sizing: border-box; /* 确保 padding 和 border 不会增加元素的总宽度 */
      vertical-align: top; /* 防止由于不同内容高度导致的对齐问题 */
    }
    .right_part{
      width:40%;
      background: rgba(255, 255, 255, 0.3);
      border-radius: 10px;
      backdrop-filter: blur(10px);
      -webkit-backdrop-filter: blur(1px);
      transition: transform 0.3s ease-in-out;
      img{
        border-radius: 10px;
        width: 100%;
        height: 100%;
        object-fit: cover;
      }
    }
    .right_part:hover {
      box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
      border: 1px solid rgba(255, 255, 255, 0.18);
      transform: scale(1.05);
      box-shadow: 10 10px 20px rgba(0, 0, 0, 0.4);
    }
    .left_part{
      width:50%;
      margin-left:15px;
      padding:7%;
      padding-left:35px;
      padding-right:35px;
      h2{
        font-weight: bold;
        font-size: 2em;
        margin-bottom: 30px;
      }
      hr {
          display: block;
          overflow: hidden;
          height:2px;
          width: 100%;
          border:none;
          background-color: #DFE1E5;
          margin-bottom: 50px;
      }
      p{
        font-size: 18px;
        margin-right:20px;
      }
    }
  }
  //第三部分
  .third_section{
    position: relative;
    display:flex;
    margin-top:20px;
    padding: 20px;
    padding-left:100px;

    .left_part .right_part{
      display:inline-block;
      box-sizing: border-box; /* 确保 padding 和 border 不会增加元素的总宽度 */
      vertical-align: top; /* 防止由于不同内容高度导致的对齐问题 */
    }
    .left_part{
      width:40%;
      background: rgba(255, 255, 255, 0.3);
      border-radius: 10px;
      backdrop-filter: blur(10px);
      -webkit-backdrop-filter: blur(1px);
      transition: transform 0.3s ease-in-out;
      img{
        border-radius: 10px;
        width: 100%;
        height: 100%;
        object-fit: cover;
      }
    }
    .left_part:hover {
      box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
      border: 1px solid rgba(255, 255, 255, 0.18);
      transform: scale(1.05);
      box-shadow: 10 10px 20px rgba(0, 0, 0, 0.4);
    }
    .right_part{
      width:50%;
      margin-left:15px;
      padding:7%;
      padding-left:35px;
      padding-right:35px;
      h2{
        font-weight: bold;
        font-size: 2em;
        margin-bottom: 30px;
      }
      hr {
          display: block;
          overflow: hidden;
          height:2px;
          width: 100%;
          border:none;
          background-color: #DFE1E5;
          margin-bottom: 50px;
      }
      p{
        font-size: 18px;
        margin-right:20px;
      }
    }
  }
}


// 播放视频
.video_background{
  border-radius: 10px;
  margin-left:6vw;
  margin-right:6vw;
  margin-top:90px;
  border:solid 0px;
  height:70vh;
  width:88vw;
  
  position: relative;

  video{
    border-radius: 10px;
    position: relative;
    width: 100%;
    height: 100%;
    object-fit: cover;
    z-index: 10;
  }


  .video_text_content{
    position: relative;
    top: -75%;
    left:6%;
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
      padding: 15px 20px;
      font-size: 16px;
      background-color: rgba(0, 0, 0, 0.5);
      color: white;
      border: none;
      cursor: pointer;
      border-radius: 5px;
      transition: background-color 0.3s ease;
    }
    
  }

}




</style>
