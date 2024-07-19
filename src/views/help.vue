<template>
  <div class="help_page">
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
          <h1>来自 无界智能团队 的建议和答案</h1>
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

      <div class="grid_container">
          <div class="grid_item" v-for="category in filteredCategories" :key="category.id" @click="Article_jump_handler(category.id)">
              <div class="icon">{{ category.icon }}</div>
              <h3>{{ category.title }}</h3>
              <p>{{ category.description }}</p>
          </div>
      </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import { useRouter } from 'vue-router';

// 实现语言切换
const currentLanguage = ref('简体中文');
const languageMap = {
  zh: '简体中文',
  en: 'English',
  // 添加更多语言
};
const handleCommand = (command) => {
  if (languageMap[command]) {
      currentLanguage.value = languageMap[command];
      locale.value = command;
      console.log('Language selected:', languageMap[command]);
  } else {
      console.warn('Unsupported language command:', command);
  }
};

// 搜索相关变量和过滤逻辑
const searchQuery = ref('');
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
      title: '无界编辑器 手机验证',
      description: '验证您的电话号码...',
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

const filteredCategories = computed(() => {
  return categories.value.filter(category => 
      category.title.includes(searchQuery.value) || 
      category.description.includes(searchQuery.value)
  );
});

const searchResults = ref(categories);
const onSearchInput = () => {
  searchResults.value = categories.value.filter(category => 
      category.title.includes(searchQuery.value) || 
      category.description.includes(searchQuery.value)
  );
};

// 实现帮助文档的跳转
const router = useRouter();

const Article_jump_handler = (title_id) => {
  router.push({ path: '/article', query: { title_id } });
  console.log('发送title_id:', title_id);
};

//
const showResults = ref(false);
const hideSearchResults = () => {
  setTimeout(() => {
      showResults.value = false;
  }, 100);
}
const showSearchResults = () => {
    showResults.value = true;
};

const handleSearchResultClick = (id) => {
    Article_jump_handler(id);
};

</script>

<style lang="scss" scoped>
.help_page {
  width: 60vw;
  margin: 0 auto;
  padding: 20px;
  font-family: Arial, sans-serif;
}

.header {
  margin-bottom: 20px;
  width: 100%;
  .navigator {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 20px;
      .logo {
          color: #333;
          img {
              width: 50px;
              height: 50px;
          }
          p {
              display: inline-block;
              padding: 5px;
              font-size: 25px;
              padding-left: 25px;
              font-weight: 800;
              margin: 0px;
              font-family: 'Franklin Gothic Medium', 'Arial Narrow', Arial, sans-serif;
              text-align: left;
          }
      }
      .logo:hover {
          cursor: pointer;
      }

      .el-dropdown-link {
          cursor: pointer;
          font-size: 20px;
          font-family: 'Franklin Gothic Medium', 'Arial Narrow', Arial, sans-serif;
          font-weight: 600;
          color: #333;
          display: flex;
          align-items: center;

          i {
              margin-left: 5px;
          }
      }
  }
  h1 {
      margin-top: 50px;
      font-size: 30px;
      font-weight: 800;

      text-align: center;
      font-family: 'Franklin Gothic Medium', 'Arial Narrow', Arial, sans-serif;
  }
}

.search_bar {
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

.grid_container {
  margin-top: 100px;
  display: grid;
  grid-template-columns: repeat(3, minmax(200px, 3fr));
  // 这里的关键是设置固定的列数而不是使用auto-fill或auto-fit，因为这些关键字会尽可能多地填充列到网格中
  gap: 20px;
  transition: ease-in-out 0.3s;
  .grid_item {
      display: flex;
      flex-direction: column;
      align-items: center;
      padding: 20px;
      border: 1px solid #ddd;
      border-radius: 8px;
      background-color: #fff;
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
      transition: ease-in-out 0.3s;

      .icon {
          font-size: 40px;
          margin-bottom: 10px;
      }

      h3 {
          margin: 10px 0;
      }

      p {
          margin: 5px 0;
          text-align: center;
      }
  }

  .grid_item:hover {
      background-color: #f5f5f5;
      border: 1px solid #606a96;
      cursor: pointer;
      backdrop-filter: blur(10px);
      -webkit-backdrop-filter: blur(1px);
      transform: scale(1.05);
  }
}
</style>
