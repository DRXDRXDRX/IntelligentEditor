<template>
    <div @mouseup="checkSelection" @mousedown="hideToolbox">
      <!-- <div style="display: flex; justify-content: center; align-items: center; height: 100vh;"> -->
        <p>请选中这段文本进行测试。</p>
      <!-- </div> -->
      <!-- 智能功能的toolbox -->
      <div v-if="showToolbox" :style="toolboxStyle" class="toolbox"> 
        <div id="components-dropdown-demo-placement"  >
          <a-dropdown>

              <template #default>
                <a-button  class="model_button">
                  <i class="ri-flashlight-fill" style="color:green;font-size:18px;" :style="model_icon_style"></i>
                </a-button>
              </template>
              <template #overlay>
                <a-menu>
                  <a-menu-item class="model_list_item">
                    <button class="model_name_button">
                      <i class="ri-flashlight-fill" style="color:green;font-size:medium" ></i>
                      <p style="text-align: left">erine-3.5</p>
                    </button>
                  </a-menu-item>
                  <a-menu-item  class="model_list_item">
                    <button class="model_name_button"> 
                      <i class="ri-flashlight-fill" style="color:purple;font-size:medium"></i>
                      <p>erine-4.0</p>
                    </button>
                  </a-menu-item>
                  <a-menu-item  class="model_list_item">
                    <button   class="model_name_button">
                      <i class="ri-flashlight-fill" style="color:purple;font-size:medium"></i>
                      <p>erine-4.0-turbo</p>
                    </button>
                  </a-menu-item>
                </a-menu>
              </template>
          </a-dropdown>
        </div>
         
        <button @click="continueWriting">
           <i class="ri-magic-line"></i>
          续写
        </button>

        <button @click="polishText">
          <i class="ri-pencil-line"></i>
          润色
        </button>

        <button @click="askQuestion">
          <i class="ri-questionnaire-line"></i>
          提问
        </button>

        <button @click="hideToolbox" class="closeToolbox">
          <i class="ri-close-large-fill"></i>
        </button>

      </div>
      <!-- 智能功能的toolbox 结束 -->
    </div>



  </template>
  
  <script setup>
  import { ref } from 'vue';
  
  // 定义一个常量来控制工具箱是否应该显示
  const shouldShowToolbox = true;
  const showToolbox = ref(false);
  const toolboxStyle = ref({
    position: 'absolute',
    top: '0px',
    left: '0px',
    display: 'none'
  });

  const showModelList = ref(false);
  
  const checkSelection = (event) => {
    const selection = window.getSelection();
    if (selection && selection.toString().length > 0) {
      if (shouldShowToolbox) {
        showToolbox.value = true;
        toolboxStyle.value = {
          position: 'absolute',
          top: `${event.pageY-120}px`,
          left: `${Math.max(event.pageX-500,0)}px`,
        };
      }
    } else {
      showToolbox.value = false;
    }
  };
  
  const hideToolbox = () => {
    showToolbox.value = false;
    showModelList.value = false;
  };
  
  const toggleModelList = () => {
    showModelList.value = !showModelList.value;
    console.log("showModelList"+showModelList.value);

  };
  
  const modelAction = () => {
    console.log('模型按钮点击');
  };
  
  const continueWriting = () => {
    console.log('续写按钮点击');
  };
  
  const polishText = () => {
    console.log('润色按钮点击');
  };
  
  const askQuestion = () => {
    console.log('提问按钮点击');
  };
  
  const selectModel = (model) => {
    console.log(`选择了模型: ${model}`);
    showModelList.value = false;
  };
  </script>
  
  <style  lang="scss" scoped>
    .toolbox {
    background-color: white;
    border-radius: 10px;
    padding: 1px;
    box-shadow: 5px 5px 5px rgba(0, 0, 0, 0.1);
    z-index: 1000;
    width: 300px;
    display: flex; /* 弹性布局 */
    align-items: center; /* 垂直居中 */
    justify-content: space-around; /* 使按钮水平分布 */
    


    button{
      width:60px;
    }
    .model_button{
      width:50px;
    }
    button,.model_button{
      height:40px;
      font-family: 'Microsoft YaHei', sans-serif;
      font-size: 90%;
      font-weight: 500;

      color: grey;
      padding: 3%;
      border-radius: 10px;
      border: transparent;
      background-color: rgba(255, 255, 255, 0.9); /* 白色背景，50% 透明度 */
      transition: background-color 0.3s ease-in-out; /* 过渡效果 */
      display: inline-block;
      flex-direction: row;
    }
    
    button:hover,
    .model_button:hover {
        background-color: #e9e6e6;
    }
    .model_button .ri-flashlight-fill {
        margin-right: auto;
    }  
  }


  .model_list_item{
    display: flex;
    align-items: center;
    justify-content: flex-start;
    i,p {
      display: inline-box;
      margin: 0;
    }
    p{
      margin-left: 5px;
    }
  }
  .model_name_button{
    width: 100%;
    height: 100%;
    border: transparent;
    padding:0;
    background-color: transparent;
    display: flex;
    align-items: center;
    justify-content: flex-start;
    transition: ease-in-out 0.3s;
  }
  .model_list_item:hover .model_name_button {
    background-color: #e9e6e6;
  }
  
  
  
  
  </style>
  