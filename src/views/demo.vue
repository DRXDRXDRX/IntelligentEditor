
<script setup>
import router from '@/router';
import { ref, onMounted } from 'vue';

const avatarUrl = ref('1.png');
const isSidebarOpen = ref(true);
const user_plan =ref("Professional plan")


const user_email= ref("lizjingstudy@gmail.com")
// 需要将handleClick 改成handletitleClick
const handleClick = (title) => {
  console.log(title);
};
const truncateTitle = (title) => {
  const maxLength = 20; // 根据需要调整截断长度
  return title.length > maxLength ? title.slice(0, maxLength) + '...' : title;
};
const starredHistory = ref([
  { id: 100, title: 'Vue.js Overview and Help' },
  { id: 2000, title: 'Hall Sensor Wiring Instructions' },
  { id: 300, title: 'South Korean customer' },
  { id: 400, title: 'Unity 2D UPR Tutorial' },
  { id: 500, title: 'Unity URP模版游戏光照' },
]);


const todayHistory = ref([
  { id: 10, title: 'Vue.js Overview and Help' },
  { id: 20, title: 'Hall Sensor Wiring Instructions' },
  { id: 30, title: 'South Korean customer' },
  { id: 40, title: 'Unity 2D UPR Tutorial' },
  { id: 50, title: 'Unity URP模版游戏光照' },
]);


const yesterdayHistory = ref([
  { id: 6000, title: 'Vision AI Service Integration' },
  { id: 7000, title: 'Image OCR and AI Generation' },
  { id: 8001, title: 'Speech Conversion and Response' },
  { id: 90000, title: 'AI Model Request Summary' },
  { id: 100000, title: 'Generate RAG Model Title' },
  { id: 111, title: 'Sort Embeddings by Similarity' },
  { id: 121, title: 'Topk Text Retrieval Function' },
  { id: 131, title: 'Unity2D 地图变暗效果' },
  { id: 141, title: 'Developing 2D Action Game' },
  { id: 151, title: 'Unity 2D Player Platform Integration' },
  { id: 161, title: 'AI生成服务响应调整' },
]);

const weekHistory = ref([
  { id: 172, title: '设置音频语言' },
  { id: 182, title: '处理长音频文件' },
  { id: 192, title: 'Convert Audio to Text' },
  { id: 202, title: 'Ethical Risks of Digital Technology' },
  { id: 212, title: 'Research Outline for Report' },
  { id: 222, title: 'SpeechToText Interface' },
  { id: 232, title: 'Recognize Language Decode' },
  { id: 242, title: 'Recognize Language, Decode' },
  { id: 252, title: 'ADC Payload Activity Prediction' },
  { id: 262, title: 'File path issue' },
  { id: 272, title: 'Translate Service Request' },
]);

const toggleSidebar = () => {
  isSidebarOpen.value = !isSidebarOpen.value;
};

// const openDialog = ref(null);
// const closeDialog = ref(null);
const Setting_dialog_refer = ref(null);
const Account_dialog_refer = ref(null);
const Comfirm_dialog_refer = ref(null);
const hoveredItem_history_starred = ref(null);
const myElementRef = ref(null);
const activeContent = ref('profile');
const add_new_doc_handler = () => {
  console.log(todayHistory.value.length)
  todayHistory.value.push({ id: todayHistory.value.length+1  , title: truncateTitle('Unity URP模版游戏光照') }); // 使用unshift而不是push来从列表的前面添加
};
const hoveredItem_history = ref(null);
// 定义要被删除的文件的list_id
const To_be_delected_file_list_id = ref(null);
// 定义被删除文件的栏目名（今天，昨天，7天前）
const To_be_delected_column_name = ref(null);
// 当点击垃圾桶的时候就保存这个文章的list_id、栏目名
const Set_to_be_delected_file_title_and_column_name=(tempt_id_name,tempt_column_name)=>{
  console.log('set to be deleted file title'+tempt_id_name+"     "+tempt_column_name)
  
  To_be_delected_file_list_id.value = tempt_id_name
  To_be_delected_column_name.value = tempt_column_name
}




const delet_doc_handler = () => {
  
  if (To_be_delected_column_name.value == '今天') {
    console.log('delete today doc' + To_be_delected_file_list_id.value);
    todayHistory.value = todayHistory.value.filter(item => item.id !== To_be_delected_file_list_id.value)
  } else if (To_be_delected_column_name.value == '昨天') {
    console.log('delete yesterday doc');
    yesterdayHistory.value = yesterdayHistory.value.filter(item => item.id !== To_be_delected_file_list_id.value)
  } else if (To_be_delected_column_name.value == 'senven_days') {
    console.log('delete week doc');
    weekHistory.value = weekHistory.value.filter(item => item.id !== To_be_delected_file_list_id.value)
  } else if (To_be_delected_column_name.value == '星标') {
    console.log('delete starred doc');
    starredHistory.value = starredHistory.value.filter(item => item.id !== To_be_delected_file_list_id.value)
  }

};

const Add_to_started = (id, column_name) => {
  console.log('add to started' + id + column_name)
  if(column_name == '今天'){
    let value = todayHistory.value.find(item => item.id === id)?.title;
    starredHistory.value.push({ id: id, title: truncateTitle(value) });
  }else if(column_name == '昨天'){
    let value = yesterdayHistory.value.find(item => item.id === id)?.title;
    starredHistory.value.push({ id: id, title: truncateTitle(value) });
  }else if(column_name == 'senven_days'){
    let value = weekHistory.value.find(item => item.id === id)?.title;
    starredHistory.value.push({ id: id, title: truncateTitle(value) });
  }
};

const Removefrom_star = (id) => {
  console.log('remove from star' + id)
  let value = starredHistory.value.find(item => item.id === id)?.title;
  starredHistory.value = starredHistory.value.filter(item => item.id !== id);
  todayHistory.value.push({ id: id, title: truncateTitle(value) });
};


onMounted(() => {
  const sidebar = document.querySelector('.sidebar');
  if (sidebar) {
    sidebar.addEventListener('wheel', (e) => {
      e.stopPropagation();
    });
  }
});

</script>



<template>
  <div class="left_sidebar"   :class="{ 'sidebar_closed': !isSidebarOpen }">
    <div class="sidebar_header">
        <button @click="toggleSidebar" class="sidebar_toggle_button">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 26 26" class="toogle_icon">
            <path fill="currentColor" fill-rule="evenodd" d="M8.857 3h6.286c1.084 0 1.958 0 2.666.058.729.06 1.369.185 1.961.487a5 5 0 0 1 2.185 2.185c.302.592.428 1.233.487 1.961.058.708.058 1.582.058 2.666v3.286c0 1.084 0 1.958-.058 2.666-.06.729-.185 1.369-.487 1.961a5 5 0 0 1-2.185 2.185c-.592.302-1.232.428-1.961.487C17.1 21 16.227 21 15.143 21H8.857c-1.084 0-1.958 0-2.666-.058-.728-.06-1.369-.185-1.96-.487a5 5 0 0 1-2.186-2.185c-.302-.592-.428-1.232-.487-1.961C1.5 15.6 1.5 14.727 1.5 13.643v-3.286c0-1.084 0-1.958.058-2.666.06-.728.185-1.369.487-1.96A5 5 0 0 1 4.23 3.544c.592-.302 1.233-.428 1.961-.487C6.9 3 7.773 3 8.857 3M6.354 5.051c-.605.05-.953.142-1.216.276a3 3 0 0 0-1.311 1.311c-.134.263-.226.611-.276 1.216-.05.617-.051 1.41-.051 2.546v3.2c0 1.137 0 1.929.051 2.546.05.605.142.953.276 1.216a3 3 0 0 0 1.311 1.311c.263.134.611.226 1.216.276.617.05 1.41.051 2.546.051h.6V5h-.6c-1.137 0-1.929 0-2.546.051M11.5 5v14h3.6c1.137 0 1.929 0 2.546-.051.605-.05.953-.142 1.216-.276a3 3 0 0 0 1.311-1.311c.134-.263.226-.611.276-1.216.05-.617.051-1.41.051-2.546v-3.2c0-1.137 0-1.929-.051-2.546-.05-.605-.142-.953-.276-1.216a3 3 0 0 0-1.311-1.311c-.263-.134-.611-.226-1.216-.276C17.029 5.001 16.236 5 15.1 5zM5 8.5a1 1 0 0 1 1-1h1a1 1 0 1 1 0 2H6a1 1 0 0 1-1-1M5 12a1 1 0 0 1 1-1h1a1 1 0 1 1 0 2H6a1 1 0 0 1-1-1" clip-rule="evenodd">
            </path>
          </svg>
        </button>
    </div>

    <div :class="['sidebar']" ref="sidebar">
      <button class="add_new_doc" @click="add_new_doc_handler">
        Start New Doc
      </button>
      <div class="starred" >
        <h3>Starred</h3>
        <div class="starred_item">
          <span v-if="starredHistory==[]">Star projects and files you use often</span>
            <transition-group name="list" tag="ul">
                <li v-for="item in starredHistory" :key="item.id" class="list_item">
                  <div class="button_container"  @mouseover="hoveredItem_history_starred = item.id " @mouseleave="hoveredItem_history_starred = null">
                    <button @click="handleClick(item.title)">{{ truncateTitle(item.title) }}</button>
                    <div class="action_buttons"  v-if="hoveredItem_history_starred === item.id">
                      <button @click="Removefrom_star(item.id)"><i class="ri-star-fill"></i></button>
                      <button @click="Set_to_be_delected_file_title_and_column_name(item.id,'星标');Comfirm_dialog_refer.showModal()">
                        <i class="ri-delete-bin-6-line"></i>
                      </button>
                    </div>
                  </div> 
                </li> 
              
            </transition-group>
          
        </div>
      </div>

      <div class="history">
        
        <h3>今天</h3>
        <transition-group name="list" tag="ul">

          <li v-for="item in todayHistory.slice().reverse()" :key="item.id">
            <div class="button_container"  @mouseover="hoveredItem_history = item.id" @mouseleave="hoveredItem_history = null">
              <button @click="handleClick(item.title)">{{ truncateTitle(item.title) }}</button>
                <div class="action_buttons"  v-if="hoveredItem_history === item.id">
                  <button @click="Add_to_started(item.id,'今天');Set_to_be_delected_file_title_and_column_name(item.id,'今天');delet_doc_handler()"><i class="ri-star-line"></i></button>
                  <button @click="Set_to_be_delected_file_title_and_column_name(item.id,'今天');Comfirm_dialog_refer.showModal();">
                    <i class="ri-delete-bin-6-line"></i>
                  </button>
                </div>
            </div>
          </li>        
        </transition-group>
        
        <h3>昨天</h3>
        <transition-group name="list" tag="ul">
          <li v-for="item in yesterdayHistory.slice().reverse()" :key="item.id">
            <div class="button_container"  @mouseover="hoveredItem_history = item.id" @mouseleave="hoveredItem_history = null">
              <button @click="handleClick(item.title)">{{ truncateTitle(item.title) }}</button>
              <div class="action_buttons"  v-if="hoveredItem_history === item.id">
                <button @click="Add_to_started(item.id,'昨天');Set_to_be_delected_file_title_and_column_name(item.id,'昨天');delet_doc_handler()"><i class="ri-star-line"></i></button>
                <button @click="Set_to_be_delected_file_title_and_column_name(item.id,'昨天');Comfirm_dialog_refer.showModal()">
                  <i class="ri-delete-bin-6-line"></i>
                </button>
              </div>
            </div>
          </li>  
        </transition-group>
           
        <h3>senven_days</h3>
        <transition-group name="list" tag="ul"> 
          <li v-for="item in weekHistory.slice().reverse()" :key="item.id">
            <div class="button_container"  @mouseover="hoveredItem_history= item.id" @mouseleave="hoveredItem_history = null">
              <button @click="handleClick(item.title)">{{ truncateTitle(item.title) }}</button>
              <div class="action_buttons"  v-if="hoveredItem_history === item.id">
                <button @click="Add_to_started(item.id,'senven_days');Set_to_be_delected_file_title_and_column_name(item.id,'senven_days');delet_doc_handler()"><i class="ri-star-line"></i></button>
                <button @click="Set_to_be_delected_file_title_and_column_name(item.id,'senven_days');Comfirm_dialog_refer.showModal()">
                  <i class="ri-delete-bin-6-line"></i>
                </button>
              </div>
            </div>
          </li>  
        </transition-group>



      </div>

    


    </div>
    <!-- 添加左下角的元素 -->
    <div class="account_info">
      <button class="account_plan" style="padding:8px 4px 4px 8px; margin:0px;">{{user_plan}}</button>
      <div class="account_email"  @click="Account_dialog_refer.showModal()" >
        <img class="avatar" :src="'/public/user_avatar/' + avatarUrl">
        <span>{{user_email}}</span>
      </div>

      <div class="help_and_settings">
        <router-link to="/help" >
          <div class="help_support">
          <i :class="['ri-question-line','help_icon']"></i>
          <span>Help & support</span>
        </div>
        </router-link>
      
        <div style="display:flex" class="settings" @click="Setting_dialog_refer.showModal()">
          <i :class="['ri-settings-line','setting_icon']"></i>
          <span class="setting_text"> settings </span >
        </div>
      </div>
    </div>

  </div>

   <!-- 对话框，编辑器设置页面 -->
  <dialog ref="Setting_dialog_refer" style="outline:none; background-color: transparent ;cursor:pointer; border:transparent;" >
    <div class="settings_dialog" style="background-color: white;">

      <div class="dialog_head" style="background-color: white;">
        <h2>设置</h2>
        <button @click="Setting_dialog_refer.close()" class="close_button">
          <i class="ri-close-fill"></i>
        </button>
      </div>
      <div class="settings_container" style="background-color: white;">
        
        <div class="settings_left_bar">
          <ul>
            <li>
              <i class="ri-database-2-line"></i>
              <span>通用设置</span>
            </li>
            <li>
              <i class="ri-database-2-line"></i>
              <span>个性化</span>
            </li>
            <li>
              <i class="ri-database-2-line"></i>
              <span>语音</span>
            </li>
            <li>
              <i class="ri-database-2-line"></i>
              <span>数据管理</span>
            </li>
            <li>
              <i class="ri-database-2-line"></i>
              <span>构建者个人资料</span>
            </li>
            <li>
              <i class="ri-database-2-line"></i>
              <span>关联的应用</span>
            </li>
            <li>
              <i class="ri-database-2-line"></i>
              <span>安全</span>
            </li>
          </ul>
        </div>

        <div class="settings_right_bar">
          <ul>
            <li>
              <i class="ri-database-2-line"></i>
              <span>通用设置</span>
            </li>
            <li>
              <i class="ri-database-2-line"></i>
              <span>个性化</span>
            </li>
            <li>
              <i class="ri-database-2-line"></i>
              <span>语音</span>
            </li>
            <li>
              <i class="ri-database-2-line"></i>
              <span>数据管理</span>
            </li>
            <li>
              <i class="ri-database-2-line"></i>
              <span>构建者个人资料</span>
            </li>
            <li>
              <i class="ri-database-2-line"></i>
              <span>关联的应用</span>
            </li>
            <li>
              <i class="ri-database-2-line"></i>
              <span>安全</span>
            </li>
          </ul>
        </div>
      </div>
      </div>  
  
  </dialog>






<!-- 对话框，用户个人信息设置 -->
<dialog ref="Account_dialog_refer" style="outline:none; background-color: transparent; cursor:pointer; border:transparent;">
  <div class="account_dialog_outer" style="background-color: white;">
    <div class="account_dialog_header">
      <h2>Account Settings</h2>
      <button @click="Account_dialog_refer.close()" class="close_button">
        <i class="ri-close-fill"></i>
      </button>
    </div>

    <div class="account_dialog_wrapper">
      <!-- 侧边导航栏 -->
      <nav class="account_sidebar">
        <ul>
          <li>
            <button @click=" activeContent='profile' ">Profile</button>
          </li>
          <li>
            <button @click=" activeContent='billing' ">Billing</button>
          </li>
          <li>
            <button @click=" activeContent='security' ">Security</button>
          </li>
        </ul>
      </nav>

    <!-- 内容区 -->
      <div class="accout_content">
        <!-- 不同的表单 -->
          <div v-if="activeContent === 'profile'">
            <h2>Profile</h2>
            <form @submit.prevent="updateName">
              <div class="form-group">
                <label for="fullName">Full name</label>
                <input type="text" id="fullName" v-model="fullName" />
              </div>
              <div class="form-group">
                <label for="nickname">What should we call you?</label>
                <input type="text" id="nickname" v-model="nickname" />
              </div>
              <button type="submit" class="update-button">Update Name</button>
            </form>
          </div>

          <div v-if="activeContent === 'billing'">
            <h2 class="billing">Billing</h2>
            <div class="subscribing_card">
              <h2>Thanks for being a Pro, Li</h2>
              <ul>
                <li><i class="ri-check-line" style="margin-right:12px;"></i>Level up your Unbounded editor usage </li>
                <li><i class="ri-check-line" style="margin-right:12px;"></i>Access to Ernie-bot 4,Ernie-bot 4-turbo,more</li>
                <li><i class="ri-check-line" style="margin-right:12px;"></i>Work with Unbounded editor around multi-file</li>
                <li><i class="ri-check-line" style="margin-right:12px;"></i>Priority access during high-traffic periods</li>
                <li><i class="ri-check-line" style="margin-right:12px;"></i>Early access to new features</li>
              </ul>
            </div>
          </div>


          <div v-if="activeContent === 'security'">
            <h2>Security</h2>
            <div class="form-group">
              <label for="password">Password</label>
              <input type="text" id="password" />
            </div>
            <button class="update-button">Update</button>
          </div>


      </div>
    </div>
  </div>

</dialog>

<!-- 对话框，是否要删除的确认页面 -->
<dialog ref="Comfirm_dialog_refer" style="outline:none; background-color: transparent; cursor:pointer; border:transparent;">
  <div class="Comfirm_dialog_outer">
    <div class="head_side" >
      <div class="head_name">是否删除此项目？</div>
    </div>  
    <div class="down_side">
      <button @click="delet_doc_handler();Comfirm_dialog_refer.close()">确定</button>
      <button @click="Comfirm_dialog_refer.close() " >取消</button>
    </div>
   
        
  </div>
</dialog>

</template>




<style lang="scss" scoped>
  html, body {
    overflow: hidden; /* 禁止滚动并隐藏超出部分 */
    height: 100vh; /* 定义高度为视口高度 */
    width:100vw; /* 定义宽度为视口宽度 */
    margin: 0; /* 移除默认的边距 */
  }


.left_sidebar {
  width:250px;
  display: flex;
  flex-direction: column;
  position: relative;

  .sidebar_header {
    display: flex;
    flex-shrink: 0;
    justify-content: flex-start;
    width: 100%;
    height:40px;
    background: transparent ;
    border-bottom: 1px;
    button{
      margin:0px;
     
      padding:10px;
      padding-left:15px;
      padding-right:15px;
    }
    .toogle_icon{
      stroke-width: 2;
      flex-shrink: 0;
      height: 26px;
      width: 26px;
      fill:grey;
    }
    .sidebar_toggle_button {
    padding: 10px;
    border: none;
    background:transparent;
    cursor: pointer;
    transition: 0.3s,ease-in-out;
  }
  .sidebar_toggle_button:hover {
    background-color: #d8d8d8;
  }
  }

  
  
  

.sidebar {
  width: 250px;
  height: calc(100vh - 40px); /* Adjust based on header height */
  padding: 10px;
  border-right: 1px solid #ccc;
  overflow-y: auto;
  transition: transform 0.3s ease;
  
  
  .add_new_doc{
    padding: 10px;
    width:100%;
    margin-right: 10px;
    margin-bottom:5px;
    border: 2px dashed #aaa8a8 ;
    background-color: #FFFFFF;
    color: rgba(0, 0, 0, 0.895);
    border-radius: 8px;
    font-weight: 700;
    font-size:16px;
    cursor: pointer;
    transition: 0.2s ease-in-out;
  }
  .add_new_doc:hover {
    background-color: #d7d6ce;
  }
  .add_new_doc:active {
  transform: scale(0.80); /* 当按钮被点击时，缩小到原来的95% */
  }


  h3 {
    font-size: 16px;
    font-weight: bold;
    margin-bottom: 8px;
  } 
 .history, .starred{
    button{
      padding:auto;
      justify-content: flex-start; /* 修正属性 */
      display: flex;
      margin:2px 0px;
      font-weight:500;
      width: 100%; /* 使按钮横向填充 */
      border: none; 
      background-color: transparent;
      transition:0.2s ease-in-out;      
    }
    button:hover {
      background-color: #d8d8d8;
    }
  }
  

  .starred {

    .starred_item {
        display: flex;
        flex-direction: column;
        justify-content: flex-end;
        height:100%;
        padding: 4px 2px;
        width: 100%;
        background-color: transparent;
        border: 2px dashed #ccc;
        border-radius: 8px;
        cursor: pointer;
        transition: background-color 0.3s, border-color 0.3s;
        position: relative;

        .button_container{
          display: flex;
          justify-content: flex-end;
          position:relative;
          align-items: center;
          width:100%;
          .action_buttons{
            display: flex;
            position: absolute;
            button{
              width:100%;
              font-size:15px;
              padding:1px;
              border-radius:1px;
            }
          }
        }

        .list-enter-active, .list-leave-active {
          transition: all 1s;
        }
        .list-enter-from, .list-leave-to {
          opacity: 0;
          transform: translateY(30px);
        }

        ul{
          list-style: none;
          padding: 0;
          margin-bottom: 0px;
        }
        li{
          display: flex;
          align-items: center;
          margin-bottom: 8px;
          background-color: #fff;
          border-radius: 4px;
          cursor: pointer;
          transition: background-color 0.3s;
        }

    }
  } 
  

 
    
 

  .title {
    font-size: 14px;
    color: #333;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }


}




.history {
  .button_container{
    display:flex;
    justify-content: flex-end;
    position:relative;
    align-items: center;
    .action_buttons{
    display:flex;
    position: absolute;
    button{
      font-size:15px;
      padding:1px;
      border-radius:1px;
    }
  }
  }
  
  h3 {
  font-size: 14px;
  margin-top: 20px;
  margin-bottom: 10px;
  }

  .list-enter-active, .list-leave-active {
        transition: all 1s;
  }
  .list-enter-from, .list-leave-to {
    opacity: 0;
    transform: translateY(30px);
  }
  ul{
    list-style: none;
    padding: 0;
  }
  li {
    margin-bottom: 5px;
  }

  .history_button {
    display: inline-block;
    padding: 4px 2px;
    width: 100%;
    background-color: transparent;
    border: 1px solid #ccc;
    border-radius: 4px;
    cursor: pointer;
    transition: background-color 0.3s, border-color 0.3s;
    position: relative;
  }

  .history_button:hover {
    background-color: #d8d8d8;
  }

  .history_button::after {
    content: '';
    position: absolute;
    top: 0;
    right: 0;
    bottom: 0;
    width: 50px; /* Adjust the width of the gradient */
    background: linear-gradient(to right, rgba(255, 255, 255, 0), rgba(255, 255, 255, 0.6));
    pointer-events: none;
  }
 
  } 
 

.account_info {
  transition: transform 0.3s ease;
  position: absolute ;
  display:inline-block;
  bottom: 0;
  left: 0;
  width: inherit;
  background: #f8f8f8;
  border-top: 1px solid #ccc;
  padding: 10px;

  .account_plan {
  border:none;
  font-size: 12px;
  color: #666;
  margin-bottom:1px;
  transition: 0.3s ease-in-out;
  }

  .account_email {
    border-radius: 5px;
    display: flex;
    align-items: center;
    margin-top: 5px;
    padding:5px;
    transition: 0.3s ease-in-out;

    .avatar {
    display: inline-block;
    margin:0px;
    margin-right: 7px;
    margin-left:6px;
    width: 30px; /* 根据需要调整头像大小 */
    height: 30px;
    border-radius: 50%;
    background-size: cover;
    background-position: center;
    }
  }
  


  .help_and_settings{
    display: flex;
    align-items: center;
    margin-top: 10px;  
    .setting_icon,.help_icon{
      top:2px;
    }
    .help_icon {

      position:relative;
      margin-left:3px;
      
      display:inline-block;
      font-size:15px;
      margin-right: 5px;
    }
    .help_support {
      color: rgba(0,0,0,.85);
      font-weight: normal;
      position:relative;
      display: inline-block;
      align-items: center;
      position:relative;
      box-sizing: content-box;
      transition: 0.2s ease-in-out;
      padding: 3px 8px;
      border-radius: 5px;

    }
    .setting_icon{
        position:relative;
        font-size:15px;
        
        display: inline-block;
        align-items:center;
        vertical-align:center;
        size:10px;
    }
    .setting_text{
      margin-left:8px;
      position:relative;
      display: inline-block;
      align-items: center;
      position:relative;
      box-sizing: content-box;
      
    }
    .settings{
      position:relative;
      border-radius: 5px;
      left:10px;
      transition: 0.2s ease-in-out;
      padding: 3px 8px;
    }
   
  }
  .account_email:hover,.account_plan:hover,.settings:hover,.help_support:hover{
      background-color: #d8d8d8;
  }

}


}

.sidebar_closed .sidebar,
.sidebar_closed .history:not(.sidebar_toggle_button), 
.sidebar_closed .account_info:not(.sidebar_toggle_button) {
  transform: translateX(-250px);
}
.sidebar_closed * {
  background-color: white !important;
}




.settings_dialog {
    width: 600px;
    max-width: 90%;
    padding: 20px;
    padding-top: 15px;
    padding-bottom: 15px;

    border: none;
    border-radius: 10px;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
  .dialog_head{
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 16px;
    padding-bottom: 5px;
    
    border-bottom: 1px solid #ccc;
    button {
      position: relative;
      bottom:6px;
      padding:5px;
      height:25px;
      width:25px;
      box-sizing:border-box;
      border: 1px solid transparent;
      border-radius: 50%;
      outline: none;
      transition: 0.3s ease-in-out;
      display: flex; /* 添加flex布局 */
      justify-content: center; /* 水平居中 */
     
    }
    button:hover{
      background-color: #d8d8d8;
    }
    
  }
  .settings_container {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    


    .settings_left_bar,.settings_right_bar{
      justify-content: center;
      flex-direction: column;
      display: inline-block;
      ul{
        list-style: none;
        li{
          display: flex;
          align-items: center;
          background-color: #fff;
          border-radius: 6px;
          cursor: pointer;
          transition: background-color 0.3s;
        }
      }
      i{
        font-size: 15px;
        margin-right: 10px;
      }
      li:hover {
        background-color: #d8d8d8;
      }
    }

    .settings_left_bar{
      width:40%;
      ul{
        margin-bottom:0px;
        margin-top:12px;
        padding-bottom:5px;
        padding: 5px;
        li{
          padding: 6px;
        }
      }
    }
    
    .settings_right_bar{
      display: inline-block;
      max-height: 280px; /* 设置最大高度 */
      overflow-y: auto; /* 当内容超出指定高度时，垂直方向上显示滚动条 */
      width:60%;
      margin-top:10px;
      border:1px;
      ul{
        display:block;
        padding:15px;
        padding-bottom:5px;
        li{
          margin-bottom: 3px;
          padding: 10px;
          background-color: #fff;
        }
      }
    }
  }
}




// 设置账户设置的对话框
/* 设置账户设置的对话框 */
.account_dialog_outer {
  background: white;
  display: flex;
  padding: 15px;
  width: 800px;
  border: none;
  border-radius: 10px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
  flex-direction: column;


  .account_dialog_header{
  display: flex;
  justify-content: space-between;
  background-color: #F0F0F0;
  border-radius: 10px;
  border :transparent solid 1px;
  margin-bottom: 10px;
  h2{
    margin:0px;
    padding:10px;
  }
  button{
    background:transparent;
    border:none;
    transition: 0.2s ease-in-out;
  }
  button:hover{
    background-color: #d8d8d8;
  }

  }


.account_dialog_wrapper {
  display: flex;
  justify-content: space-between;
}

.account_sidebar {
  
  margin-left: 2px;
  border-radius: 10px;

  display: inline-block;
  
  width: 280px;
  background-color: #F5F4EF;
  padding: 20px;

  ul {
    list-style: none;
    padding: 0;
  }
  li {
    margin-bottom: 10px;
    
  }
  button {
    border: none;
    display: block;
    padding: 10px;
    font-size:16px;
    width:100%;
    text-decoration: none;
    color: #575555;
    border-radius: 5px;
    text-align: left;
    transition:  0.3s ease-in-out;
  }
  button:hover,button.active {
    background-color: #ddd;
  }
  }

  .accout_content {
    display: inline-block;
    width: 60%;
    height:308px;
    padding: 20px;
    border-radius: 10px;
      h2 {
        margin-bottom: 20px;
      }
      .form-group {
        margin-bottom: 20px;
      }
      label {
      display: block;
      margin-bottom: 5px;
      font-weight: bold;
      }
      input[type="text"] {
        width: 100%;
        padding: 8px;
        border: 1px solid #ccc;
        border-radius: 5px;
      }
      .update-button {
        padding: 10px 20px;
        background-color: #f29595;
        color: white;
        border: none;
        border-radius: 5px;
        cursor: pointer;
        transition: background-color 0.3s;
        }
      
      .update-button:hover {
        background-color: #e06b6b;
      }
     

      .billing{
        margin-bottom: 10px;
        
      }

      .subscribing_card{
        padding-top:20px;
        padding-bottom: 3px;
        border-radius: 10px;
        padding-left:30px;
        background-color: #5645A1;
        color:white;
        font-size:15px;
        font-weight:400;
        line-height: 1.5;
        
        h2{  
          position: relative;
          left:-15px;
          color:white;
          letter-spacing: -.05em;
          // font-weight: 500;
          line-height: 1.75rem;
          // font-size:1.25rem;
          font-family: ui-sans-serif,system-ui,sans-serif,"Apple Color Emoji","Segoe UI Emoji","Segoe UI Symbol","Noto Color Emoji";
        }
      }
      
      
        ul{
          list-style: none;
          padding: 0;
        }
        }
       
      }
    

      .Comfirm_dialog_outer{
        height:200px;
        width:400px;
        display: flex;
        flex-direction: column;
        padding: 50px;
        background-color: #ffffff;
        border-radius: 10px;
        box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
        .head_side{
          margin-bottom: 20px;
          display:block;
          text-align: center;
          .head_name{
            font-size: 20px;
            font-weight: bold;
          }
        }
        .down_side{
          margin-top:20px;
          display: flex;
          justify-content: space-between; /* 修正属性值 */
          button {
            
            display:inline-block;
            padding: 5px 10px;
            margin: 0 10px;
            background-color: #cac6c6;
            color: #4a4949;;
            border: none;
            border-radius: 5px;
            cursor: pointer;
            transition: background-color 0.3s;
          }
          button:hover {
            background-color: #d7d2d23e;
          }
          button:active {
            transform: scale(0.80); /* 当按钮被点击时，缩小到原来的95% */
          }
        }
      
      }
</style>