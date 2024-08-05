<template>
    <div class="article_page">
        <header class="header">
            <div class="navigator">
                <a href="/home">
                    <div class="logo">
                        <img src="/logo-favicon.png" alt="Unbounded intelligence" class="logo">
                        <p>无界智能</p>
                    </div>
                </a>

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
            </div>
        </header>

        <div class="search_bar">
          <input type="text" placeholder="搜索文章......" v-model="searchQuery" @input="onSearchInput" @blur="hideSearchResults" @focus="showSearchResults"  />
          <i class="ri-search-2-line"></i>
          <ul v-if="showResults && searchResults.length" class="search_results">
              <li v-for="result in searchResults" :key="result.id" @click="Article_jump_handler(result.id)">
                  <div class="icon">{{ result.icon }}</div>
                  <div class="result_info">
                      <h4>{{ result.title }}</h4>
                      <p>{{ result.description }}</p>
                  </div>
              </li>
          </ul>
        </div>

        <div class="scroll_line" :style="{ width: lineWidth + '%' }"></div>
        <div class="skip_router">
          <i :class="['ri-arrow-left-s-line','goback']"  @click="goBack"></i>  
          <i :class="['ri-arrow-right-s-line','goforward']" @click="goForward" ></i>
        </div>
        
        <div class="markdown_page">
            <section class="content" v-html="markdownContent"></section>
        </div>
    </div>
</template>



<script setup>
  import { onMounted, onUnmounted, ref,computed ,watch  } from 'vue';
  import { useRoute, useRouter } from 'vue-router';

  // 实现语言切换
  const currentLanguage = ref('简体中文');
  const languageMap = {
    zh: '简体中文',
    en: 'English'
  };
  const handleCommand = (command) => {
    if (languageMap[command]) {
      currentLanguage.value = languageMap[command];
      console.log('Language selected:', languageMap[command]);
    } else {
      console.warn('Unsupported language command:', command);
    }
  };

  // 获取要渲染的帮助文档的id
  const route = useRoute();
  const router = useRouter();
  let title_id = ref('')

  if (route.query.title_id) {
    title_id.value = route.query.title_id;
  }
  watch(() => route.query.title_id, () => {
    title_id  = route.query.title_id
    console.log("检测到数据的变化，正在重新的loadmarkdown")
    let markdownPath = `./help_articles/${title_id}.md`; // 替换为实际的Markdown文件路径
    loadMarkdown(markdownPath);
  });

    const goBack=()=> {
      router.go(-1); // 跳转到上一个页面
    }
    const goForward= () => {
      router.go(1); // 跳转到下一个页面
    }

  // 准备markdown文档渲染
  import { marked } from 'marked';
  const markdownContent = ref('');
  const loadMarkdown = async (path) => {
    try {
      const response = await fetch(path);
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const text = await response.text();
      markdownContent.value = marked(text);
    } catch (error) {
      console.error('Error loading markdown:', error);
      markdownContent.value = '<p>Error loading content.</p>';
    }
  };

  // 类别与搜索
  const categories = ref([
  {
      id: 1,
      icon: '📚',
      title: '关于无界编辑器',
      description: '关于无界编辑器的一切',
  },
  {
      id: 2,
      icon: '💻',
      title: '无界编辑器界面',
      description: '编辑UI 设置',
  },
  {
      id: 3,
      icon: '📱',
      title: '无界编辑器 邮箱验证',
      description: '验证您的个人身份...',
  },
  {
      id: 4,
      icon: '⚡',
      title: '无界编辑器 Pro',
      description: '无界编辑器 Pro相关信息',
  },
  {
      id: 5,
      icon: '🔧',
      title: '无界编辑器 设置',
      description: '关于设置...',
  },
  {
      id: 6,
      icon: '🎨',
      title: '使用自动生成思维导图',
      description: '思维导图可视化',
  },
  {
      id: 7,
      icon: '🔒',
      title: 'API文档',
      description: '关于代码API文档',
  },
  {
      id: 8,
      icon: '🔐',
      title: '密码与账户设置',
      description: '信任与安全相关信息',
  },
  {
      id: 9,
      icon: '💬',
      title: '无界编辑器 对话系统',
      description: '无界编辑器 对话模型设置与接入',
  },
]);

  const searchQuery = ref('');
  const searchResults = ref(categories.value);
  const onSearchInput = () => {
    searchResults.value = categories.value.filter(category => 
      category.title.includes(searchQuery.value) || 
      category.description.includes(searchQuery.value)
    );
  };

  const showResults = ref(false);
  const hideSearchResults = () => {
    setTimeout(() => {
      showResults.value = false;
    }, 100);
  };
  const showSearchResults = () => {
    showResults.value = true;
  };

  const Article_jump_handler = (title_id) => {
    router.push({ path: '/article', query: { title_id } });
    console.log('发送title_id:', title_id);

  };


  onMounted(() => {
    const markdownPath = `./help_articles/${route.query.title_id}.md`; // 替换为实际的Markdown文件路径
    loadMarkdown(markdownPath);
  });

  //实现文档阅读进度条
  const lineWidth = ref(0);
  const updateLineWidth = () => {
    const scrollTop = window.scrollY;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    lineWidth.value = (scrollTop / docHeight) * 100;
  };
  onMounted(() => {
    window.addEventListener('scroll', updateLineWidth);
    updateLineWidth(); // 初始加载时更新位置
  });
  onUnmounted(() => {
    window.removeEventListener('scroll', updateLineWidth);
  });
  



  
</script>



<style lang="scss" scoped> 

.article_page{
    width:80vw;
    margin: 0 auto;
    padding: 20px;
    font-family: Arial, sans-serif;
    .header {
        margin-bottom: 20px;
        width: 100%;
        .navigator {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 20px;
            .logo{
                color:#333;
                img{
                    width: 50px;
                    height: 50px;
                }
                p{
                    display: inline-block;
                    padding:5px;
                    font-size: 25px;
                    padding-left:25px;
                    font-weight: 800;
                    margin:0px;
                    font-family: 'Franklin Gothic Medium', 'Arial Narrow', Arial, sans-serif;
                    text-align:left;
                } 
            }
            .logo:hover{
              cursor: pointer;
            }
    
            .el-dropdown-link{
              cursor: pointer;
              font-size: 20px;
              font-family:'Franklin Gothic Medium', 'Arial Narrow', Arial, sans-serif;
              font-weight: 600;
              color: #333;
              display: flex;
              align-items: center;
              i{
                  margin-left: 5px;
              }
            }
        }
       
    }
    
.search_bar {
  width: 100%;
  position: relative;
  display: flex;
  justify-content: center;
  margin-bottom: 20px;
  background: transparent;
  i {
      left: 15px;
      position: absolute;
      font-size: 25px;
      top: 35%;
      color: #c2bfbf;
      transition: ease-in-out 0.3s;
  }
  input {
      width: 100%;
      height: 65px;
      border-radius: 15px;
      margin-top: 15px;
      text-align: left;
      font-size: 20px;
      padding: 0 50px;
      border: 1px solid #c6c6c0;
      transition: ease-in-out 0.3s;
      color: black;
  }
  ::placeholder {
      color: #c2bfbf;
      font-size: 20px;
  }

  input:hover,
  input:focus {
      background-color: #f5f5f5;
      cursor: pointer;
      box-shadow: 0px 5px 15px #4e4e4e;
      outline: none;
  }
  input:focus {
      box-shadow: 0px 10px 30px #4e4e4e;
  }
  input:focus + i {
      color: rgb(0, 0, 207);
  }

  .search_results {
      position: absolute;
      top: 100%;
      left: 0;
      right: 0;
      background: rgb(235, 233, 233);
      border: 1px solid #ddd;
      border-radius: 15px;
      box-shadow: 0 12px 15px rgba(0, 0, 0, 0.336);
      list-style: none;
      margin:0;
      margin-top:5px;
      padding: 0;
      z-index: 1000;
      li {
          display: flex;
          align-items: center;
          padding: 10px;
          border-bottom: 1px solid #ddd;
          cursor: pointer;
          &:last-child {
              border-bottom: none;
          }
          &:hover {
              background: #f5f5f5;
          }
          &:first-child:hover {
            border-top-left-radius: 15px;
            border-top-right-radius: 15px;
          }
          &:last-child:hover {
            border-bottom-left-radius: 15px;
            border-bottom-right-radius: 15px;
          }
          .icon {
              font-size: 20px;
              margin-right: 10px;
          }
          .result_info {
              h4 {
                  margin: 0;
                  font-size: 18px;
              }
              p {
                  margin: 0;
                  color: #666;
              }
          }
        }
      }
  }

    // 进度条样式
    .scroll_line{
        position: sticky;
        top: 0;
        z-index: 10; /* 确保滚动条在内容上方 */
        margin-top:50px;
        height:5px;
        background-image:linear-gradient(to

 right,white , #8b00ff);
    }



    .markdown_page{
        margin:auto;
        width: 60vw;
      
        background-color: #f5f5f5;
        border-radius: 15px;
        padding: 20px;
        .content{
            font-size: 1.5em;
            
            :deep(h1){
              font-size: 45px;
              font-family:system-ui, "Segoe UI", "Roboto", "Helvetica", "Arial", sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol";
              font-family:'Segoe UI', Tahoma, Verdana, sans-serif;
              transform: scaleY(0.9); /* 水平拉伸文字 */  
            }
            :deep(h3){
              background-color: rgb(239, 234, 234);
              font-size: 25px;
              font-weight: 600;
              width:auto;
              display: inline-block; /* 使宽度自适应内容 */
              color:#666;
              padding:5px;
              padding-left: 15px;
              padding-right: 15px;
              border-radius: 15px;
            }
            :deep(blockquote){
                color:grey;
            }
            :deep(p){
                font-size: 0.9em;
                font-weight: 100;
            }
            :deep(li){
                font-size: 0.8em;
            }
            :deep(img){
              max-width: 100%;
              height: auto;
            }

        }
    }
    .skip_router{
      position: absolute;
      background:transparent;
      justify-content: space-between;
      display: flex;
      width:78%;
      border-radius: 14px;
      
      .goback {
          position: relative;
          margin-top:10px;
          font-size: 30px;
          width:35px;
          height:55px;
          color: #bbb9bc;
          padding:15px;
          cursor: pointer;
          border-radius: 18px;
          transition:ease-in-out 0.2s; 
      }
      .goback::before{
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        transition:transform ease-in-out 0.2s, background ease-in-out 0.2s;
      }

      .goback:hover {
        transform: scale(1.3);
        color: black;
        background: radial-gradient(circle, #ece9e9, #ffffff);
      }

      .goforward{
          position: relative;
          margin-top:10px;
          font-size: 30px;
          width:35px;
          height:55px;
          color: #bbb9bc;
          padding:15px;
          cursor: pointer;
          border-radius: 18px;
          transition:ease-in-out 0.2s; 
      }
      .goforward::before{
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        transition:transform ease-in-out 0.2s, background ease-in-out 0.2s;
      }
      .goforward:hover {
        transform: scale(1.3);
        color: black;
        background: radial-gradient(circle, #ece9e9, #ffffff);
      }
    }

}

</style>
