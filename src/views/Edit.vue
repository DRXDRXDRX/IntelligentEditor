<template>
  <div class="EditMain">
    <div class="header-bar">
      <el-tooltip class="box-item" effect="dark" :content="showLeft ? '收起左侧' : '展开左侧'" placement="bottom">
        <i :class="showLeft ? 'ri-indent-decrease' : 'ri-indent-increase'" @click="toggleLeft"></i>
      </el-tooltip>
      <!-- <el-switch @change="handleSwitchTheme" v-model="themeValue" style="--el-switch-on-color: #2C2C2C; --el-switch-off-color: #FE887B">
        <template #active-action>
          <i class="ri-contrast-2-line"></i>
        </template>
        <template #inactive-action>
          <i class="ri-sun-fill"></i>
        </template>
      </el-switch> -->
      <el-tooltip class="box-item" effect="dark" :content="showRight ? '收起大纲' : '展开大纲'" placement="bottom">
        <i :class="showRight ? 'ri-indent-increase' : 'ri-indent-decrease'" @click="toggleRight"></i>
      </el-tooltip>
    </div>
      <left-sidebar />
    <div class="editor" :class="{ extensionLeft: !showLeft, shrinkLeft: showLeft, extensionRight: !showRight, shrinkRight: showRight }">
      <!-- <generic-menu /> -->
      <div class="editorCard" :class="{bothShrink: (!showLeft && !showRight)}">
        <div class="topTools">
          <EditorMenu :editor="editor" v-model:font="font" :themeValue="themeValue" />
        </div>
        <div class="editContent">
          <bubble-menu :editor="editor" :tippy-options="{ duration: 100 }" v-if="editor">
            <div class="bubble-menu">  
              <a-dropdown v-for="item of characterMenuList" :key="item.key">
                  <button @click="editor.chain().focus().toggleBold().run()"
                    :class="{ 'is-active': editor.isActive('bold') }">
                    <i :class="'ri-' + item.icon"></i>{{ item.title }}
                  </button>
                  <template #overlay>
                      <a-menu v-show="item == []">
                        <a-menu-item v-for="subItem of item.subItems" :key="subItem.key" :title="subItem.title">
                          <i :class="'ri-' + subItem.icon" style="font-size:small; margin-right:10px;"></i>
                          <span>{{ subItem.title }}</span>
                        </a-menu-item>
                      </a-menu>
                  </template>
              </a-dropdown>     
            </div>
          </bubble-menu>
          <dialog ref="dialog" @blur="dialog.close()"><polish-options></polish-options></dialog>
          <EditorContent style="margin: 8px;  overflow-y: auto; height: 100%;" :editor="editor" />
        </div>
        
        <div class="bottomCount">
          字数统计:
          {{ editor?.storage.characterCount.characters() }}&nbsp;&nbsp;
          当前字体为：
          {{ font }}
        </div>
      </div>
    </div>
    <div class="rightTools" :class="{ hiddenRight: !showRight, extraRight: !showLeft }">
      <Outline :editor="editor" @heading-click="handleHeadingClick" />
      <chat-main-page></chat-main-page>
    </div>
    <vue-drag-resize
        v-model:active="active"
        v-model:x="x"
        v-model:y="y"
        v-model:width="width"
        v-model:height="height"
        :w="300"
        :h="200"
        :x="100"
        :y="100"
        :minWidth="50"
        :minHeight="50"
    >
    </vue-drag-resize>
  </div>
</template>

<script lang="ts" setup>
import { defineComponent, onMounted, onBeforeUnmount, ref, watch, provide, getCurrentInstance  } from 'vue';
import { Editor, EditorContent, useEditor, BubbleMenu } from '@tiptap/vue-3';
import { storeToRefs } from 'pinia'
import Underline from '@tiptap/extension-underline'
// import Italic from '@tiptap/extension-italic'
import TextAlign from '@tiptap/extension-text-align'

// 列表
import ListItem from '@tiptap/extension-list-item'
import OrderedList from '@tiptap/extension-ordered-list'
import BulletList from '@tiptap/extension-bullet-list'
// 代码
import CodeBlockLowlight from '@tiptap/extension-code-block-lowlight'
import css from 'highlight.js/lib/languages/css'
import js from 'highlight.js/lib/languages/javascript'
import ts from 'highlight.js/lib/languages/typescript'
import html from 'highlight.js/lib/languages/xml'
import python from 'highlight.js/lib/languages/python'
import java from 'highlight.js/lib/languages/java'
import c from 'highlight.js/lib/languages/c'
import { common, createLowlight } from 'lowlight'
const lowlight = createLowlight()
lowlight.register({ html, ts, css, js, python, java, c })
// 字数统计
import CharacterCount from '@tiptap/extension-character-count'
import Heading from '@tiptap/extension-heading'
import StarterKit from '@tiptap/starter-kit'
import Placeholder from '@tiptap/extension-placeholder'
import { UndoRound, MoreHorizOutlined } from '@vicons/material'
import TaskItem from '@tiptap/extension-task-item'
import TaskList from '@tiptap/extension-task-list'
import Link from '@tiptap/extension-link'
import Table from '@tiptap/extension-table'
import TableCell from '@tiptap/extension-table-cell'
import TableRow from '@tiptap/extension-table-row'
import TableHeader from '@tiptap/extension-table-header'
import Image from '@tiptap/extension-image';
import Strike from '@tiptap/extension-strike';
import Highlight from '@tiptap/extension-highlight';
import Dropcursor from '@tiptap/extension-dropcursor';
import { Color } from '@tiptap/extension-color';
import TextStyle from '@tiptap/extension-text-style';
import FontFamily from '@tiptap/extension-font-family';


// 使用Pinia
import { useEditorStore } from '@/store'
import { filesStore } from '@/store';
import EditorMenu from '../components/EditorMenu/index.vue'
import { defineStore } from 'pinia'
import { ElMessage } from 'element-plus';

import Outline from '../components/Outline.vue'
import PolishOptions from '../components/PolishOptions.vue'
import ChatMainPage from '../components/AIChat/ChatMainPage.vue'
import LeftSidebar from '../components/LeftSidebar.vue'
import http from '@/utils/request.ts'

const fileStore = filesStore()
// 主题色切换：
const themeValue = ref(false);
// false为白天模式，true为黑夜模式
const handleSwitchTheme = (value) => {
  themeValue.value = value;
  if (value) {
    document.body.style.backgroundColor = '#464545  ';
    document.body.style.color = '#fff';

  } else {
    document.body.style.backgroundColor = '#fff';
    document.body.style.color = '#000';
  }
};

const editorStore = useEditorStore()
// 加载headings
const loadHeadings = () => {
  const headings = [] as any[]
  if (!editor.value) return
  const transaction = editor.value.state.tr
  if (!transaction) return

  editor.value?.state.doc.descendants((node, pos) => {
    if (node.type.name === 'heading') {
      // console.log(pos, node)
      const start = pos
      const end = pos + node.content.size
      // const end = pos + node
      const id = `heading-${headings.length + 1}-level-${node.attrs.level}`
      if (node.attrs.id !== id) {
        transaction?.setNodeMarkup(pos, undefined, {
          ...node.attrs,
          id
        })
      }

      headings.push({
        level: node.attrs.level,
        text: node.textContent,
        start,
        end,
        id
      })
    }
  })

  transaction?.setMeta('addToHistory', false)
  transaction?.setMeta('preventUpdate', true)

  editor.value?.view.dispatch(transaction)
  editorStore.setHeadings(headings)

}


// WenSocket:
const { appContext } = getCurrentInstance();
const socket = appContext.config.globalProperties.$socket;
// 发送数据

const dataToSend = ref({
  id: "668616147448aeceb9f229bd",
  title: 'title',
  json: {
    key: "",
  },
});

const sendData = () => {
  if (socket.readyState === WebSocket.OPEN) {
    console.log("发送数据：", dataToSend.value);
    // 将JavaScript对象转换为JSON字符串
    const message = JSON.stringify(dataToSend.value);
    socket.send(message); // 发送消息
    
  } else {
    console.error('WebSocket 连接未打开或已关闭。');
  }
};


const font = ref('Arial')

// 使用ref创建可变的响应式引用
// 编辑器初始化
const editor = useEditor({
  content: '',
  extensions: [
    StarterKit,
    TaskList,
    TaskItem,
    Placeholder.configure({
      placeholder: '开始输入文本 …'
    }),
    OrderedList,
    BulletList,
    ListItem,
    CharacterCount.configure({
      limit: 10000
    }),
    Underline,
    Highlight.configure({
      multicolor: true,
    }),
    TextAlign.configure({
      types: ['heading', 'paragraph'],
      alignments: ['left', 'center', 'right', 'justify'],
      defaultAlignment: 'left'
    }),
    Heading.configure({
      levels: [1, 2, 3, 4, 5, 6]
    }),
    Link,
    Image.configure({
      inline: true,
      allowBase64: true
    }),
    Table.configure({
      //是否允许缩放
      resizable: true,
      //拖动时边框大小
      handleWidth: 5,
      //单元格最小宽度
      cellMinWidth: 25,
      //最好一列是否自适应宽度
      lastColumnResizable: true,
      allowTableNodeSelection: false
    }),
    TableRow,
    TableCell,
    TableHeader,
    TaskList.configure({
      itemTypeName: 'taskItem',
    }),
    CodeBlockLowlight.configure({
      lowlight,
      languageClassPrefix: 'language-',
    }),
    Dropcursor,
    Color,
    TextStyle,
    FontFamily.configure({
      types: ['textStyle'],
    }),

  ],
  onUpdate({ editor }) {
    
    editorStore.setEditorInstance(editor.value)
    // http.request({
    //   url: '/doc',
    //   method: 'POST',
    //   data: {
    //     json: JSON.stringify(editor.getJSON()),
    //     html: editor.getHTML()
    //   }
    // }).then(res => {
    //   console.log(res.data)
    // })

    
    // WebSocket进行实时保存：
    // 发送数据的方法
    dataToSend.value.json.key = JSON.stringify(editor.getJSON())
    sendData()
    // socket.send(dataToSend.value)
    loadHeadings()
    
  },
  async onCreate({ editor }) {

    editorStore.setEditorInstance(editor.value)
    const listResult = await http.request({
      url: '/doc/list',
      method: 'GET'
    })
    console.log(listResult.data.docs)
    const id = listResult.data.docs[0].id

    const docResult = await http.request({
      url: '/doc',
      method: 'GET',
      params:{
        id
      }
    })
    console.log(docResult)
    editor.commands.setContent(JSON.parse(docResult.data.json.key))
    loadHeadings()
  
},
  onSelectionUpdate({ editor }) {
    // console.log(1);
    // 判断选中的是不是图片
    const { from, to } = editor.state.selection
    // console.log(editor.state.selection)
  },

  injectCSS: false,
})

const dialog = ref<HTMLElement | null>(null)
const polish = () => {
  dialog.value.showModal()
  const { from, to } = editor.value.state.selection
  const selectedText = editor.value.state.doc.textBetween(from, to)
  // console.log(selectedText)
  http.request({
    url: '/doc/polish',
    method: 'POST',
    data: {
      selectedText
    }
  }).then(res => {
    // 用润色后的文本替换选中的文本
    // console.log(editor.commands)
    // editor.commands.setContent(res.data.text);
    // editor.commands.insertContentAt(editor.state.selection.from, res.data.text);
    console.log(from, to)

    const newFrom = from
    editor.value.commands.deleteRange({ from, to })
    console.log(newFrom)
    editor.value.chain().insertContentAt(newFrom, res.data).run();
    // console.log(from, to)
    console.log(res.data);
  }).catch(err => {
    console.log(err);
  })

}



const handleHeadingClick = (heading) => {
  const { start, end } = heading;
  if (!editor.value) return;
  // console.log(heading);
  // console.log(start, end)
  editor.value.commands.setTextSelection({ from: start, to: end + 1 });
  editor.value.commands.focus();
};

const showLeft = ref(true)
const showRight = ref(true)
const first = ref(0)
const toggleLeft = () => {
  showLeft.value = !showLeft.value
}
const toggleRight = () => {
  showRight.value = !showRight.value
}

const characterMenuList = [
  {
    key: 1,
    title: "加粗",
    icon: 'bold',
  },
  {
    key: 2,
    title: "倾斜",
    icon: 'italic',
  },
  {
    key: 3,
    title: "下划线",
    icon: 'underline',
  },
  {
    key: 4,
    title: "删除线",
    icon: 'strikethrough',
  },
  {
    key: 5,
    title: "高亮",
    icon: 'heading',
  },
  {
    key: 6,
    title: '翻译',
    icon: 'translate'
  }
]
const imageMenuList = [
  {
    key: 1,
    title: "AI问图",
    icon: 'image',
    subItems: []
  },
  {
    key: 2,
    title: "删除图片",
    icon: 'delete-bin',
    subItems: []
  },
  {
    key: 3,
    title: "复制图片",
    icon: 'copy',
    subItems: []
  },
  {
    key: 4,
    title: "下载图片",
    icon: 'download',
    subItems: []
  },
  {
    key: 5,
    title: "查看图片",
    icon: 'eye',
    subItems: []
  }
]


// 截图：
const x = ref(100);
const y = ref(180);
const width = ref(300);
const height = ref(200);
const active = ref(false);
provide('screenShotInfo', {
  x,
  y,
  width,
  height,
  active
})


onMounted(() => {
  if (editor.value) {
    editorStore.setEditorInstance(editor.value)
    loadHeadings()
  }

  const reader = new FileReader()
  const editorArea = document.querySelector('.editContent')
  console.log(editorArea);

  editorArea.addEventListener('dragover', (e) => {
    console.log('dragover');
    e.preventDefault()
  })
  editorArea.addEventListener('drop', (e) => {
    console.log('drop');
    e.preventDefault()
    reader.readAsDataURL(e.dataTransfer.files[0])
  })
  reader?.addEventListener('load', (e) => {
    console.log(e.target?.result)
    const src = e.target?.result as string
    editor.value?.chain().focus().setImage({ src }).run()
  })


  // 监听连接打开事件
  socket.addEventListener('open', () => {
    // connectionStatus.value = '已连接';
    console.log('WebSocket 连接已打开。')
  });

  // 监听消息事件
  socket.addEventListener('message', (event) => {
    console.log('收到消息:', event.data);
  });

  // 监听错误事件
  socket.addEventListener('error', (error) => {
    console.error('WebSocket 出现错误:', error);
    // connectionStatus.value = '连接出错';
  });

  // 监听连接关闭事件
  socket.addEventListener('close', () => {
    // connectionStatus.value = '已断开连接';
    console.log('WebSocket 连接已关闭。')
  });
});



// 在组件卸载前销毁Editor实例
onBeforeUnmount(() => {
  editor.value?.destroy();

  if (socket) {
    socket.close();
    console.log('WebSocket 连接已关闭close。')
  }
});



//toolbox
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
      console.log('选中了文本');
      if (shouldShowToolbox) {
        showToolbox.value = true;
        toolboxStyle.value = {
          position: 'relative',
          top: `${event.pageY-120}px`,
          left: `${Math.max(event.pageX-500,0)}px`,
        };
        console.log(event.pageY);
        console.log(event.pageX);

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

<style scoped>
::selection {
  cursor: pointer;
}

/* 选中文本的AI功能 */
.contextMenu {
  position: absolute;
  background-color: white;
  border: 1px solid #ddd;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
  z-index: 1000;
}
.contextMenu button {
  display: block;
  width: 100%;
  padding: 8px 16px;
  border: none;
  background: none;
  text-align: left;
  cursor: pointer;
}
.contextMenu button:hover {
  background-color: #f0f0f0;
}
</style>

<style>
/* 大纲栏的缩进 */
.hiddenRight {
  transform: translateX(100%);
}

.extraRight {
  grid-row:2 / 3;
  animation: .5s ease-in-out;
}

.bothShrink {
  width: 98% !important;
  transform: translateX(-1%);
}

/* .hiddenLeft {
  transform: translateX(-100%); 
  opacity:0;
  animation: hidden-left .5s ease-in-out;
} */

/* @keyframes hidden-left {
  from {transform:translateX(-100%);}
  to {transform:translateX(100%);}
} */

.hiddenIcon {
  transform: rotate(180deg);
}

.extensionLeft {
  grid-column: 1 / 3;
  grid-row:2 / 4;
  /* width: 140%; */
  /* animation: extension-left .5s ease-in-out; */
}

.shrinkLeft {
  width: 100% !important;
  /* animation: shrink-left .5s ease-in-out; */
}

.shrinkLeft.extensionRight {
  width: 150% !important;
}

@keyframes extension-left {
  from {
    width: 100%;
  }
  to {
    width: 135%;
  }
}

@keyframes shrink-left {
  from {
    width: 133%;
  }
  to {
    width: 100%;
  }
}

.extensionRight {
  width: 134% !important;
  /* transform:translateX(-21%); */
  /* transition: all 0.5s ease-in-out !important; */
  /* animation: extension-right .5s ease-in-out !important; */
}

.shrinkRight {
  /* grid-column: 2 / 4; */
  width: 100% ;
  /* animation: shrink-right .5s ease-in-out !important; */
}

/* @keyframes extension-right {
  from {
    width: 100% !important;
  }
  to {
    width: 125% !important;
  }
}

@keyframes shrink-right {
  from {
    width: 125%;
  }
  to {
    width: 100%;
  }
} */


h1 {
  font-size: 30px;
  /* 自定义一级标题的字体大小 */
}

h2 {
  font-size: 26px;
  /* 自定义一级标题的字体大小 */
}

h3 {
  font-size: 24px;
  /* 自定义一级标题的字体大小 */
}

h4 {
  font-size: 22px;
  /* 自定义一级标题的字体大小 */
}

h5 {
  font-size: 20px;
  /* 自定义一级标题的字体大小 */
}

h6 {
  font-size: 18px;
  /* 自定义一级标题的字体大小 */
}

body {
  transition: color .1s ease-out;
  transition: background-color .5s ease-out;
}

.EditMain {
  position: relative;
  width: 100vw;
  height: 100vh;
  display: grid;
  gap:0;
  grid-template-rows: 45px 1fr;
  grid-template-columns: 2fr 13fr 5fr;
  font-size: 15px;
  scrollbar-width: thin;
  scrollbar-color: #868686 #faf0f0;
  overflow-x: hidden;
}

.header-bar {
  /* position: fixed;
  top:0; */
  grid-column: 1 / 4;
  width: 100vw;
  height: 45px;
  background-color: #fff;
  padding: 0.5rem;
  border-bottom: 1px solid #ccc;
  box-shadow: 0 1px 5px 0px #ccc;
  display: flex;
  justify-content:space-between;
  align-items:center;
}

.header-bar i {
  font-size: 30px;
  cursor: pointer;
  transition: all .5s ease-in-out;
}

.header-bar i:hover {
  color: #409EFF;
}

.leftTools {
  /* border-right: 1px solid #fff; */
  /* background-color: hsla(0, 17%, 78%, 0.158); */
  /* box-shadow: 0px 0px 5px #fff inset; */
  height: 100%;
  width: 100%;
  display: flex;
  justify-content: center;
  transition: all .5s ease-in-out !important;
}

.rightTools {
  height: 100%;
  width: 100%;
  overflow-y: auto;
  transition: all .5s ease-in-out;
  /* padding-left:10px; */
}

.editor {
  /* background-color: #e6f6f9; */
  /* box-shadow: 1px 0 20px 10px #fff; */
  /* height: 100vh; */
  /* width: 100%; */
  transition: all .5s ease-in-out;
}

.editorCard {
  position: relative;
  width: 96%;
  height: 97%;
  left: 2.5%;
  top: 1%;
  display: flex;
  flex-direction: column;
  transition: transform 0.5s ease-in-out;
}

.topTools {
  height: fit-content;
  margin-bottom: 10px;
}

.editContent {
  background-color: rgba(242, 240, 240, 0.4);
  border-radius: 10px;
  position: relative;
  width: 100%;
  height: 100%;
  overflow: hidden;
  padding: 2px;
  /* border: 2px solid black; */
  /* border-radius: 10px; */
  /* background-color: yellow; */
  word-break: break-all;
  /* 允许在任意字符间断行 */
  hyphens: auto;
  /* 允许自动连字符 */

  dialog {
    width: 500px;
    height: 300px;
    padding:10px 0 30px 10px;
    position: fixed;
    top: 50%;
    left: 40%;
    transform: translate(-50%, -50%);
    background-color: #fff;
    border-radius: 10px;
    border:none;
    box-shadow: 0 0 10px #CDCDCD;
  }

  .tiptap {
    height: 100%;
    overflow-y: auto;
  }
}

.bottomCount {
  /* background-color: rgba(207, 220, 245, 0.199); */
  border-top: 1px dashed #9ca19f65;
  height: 30px;
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  line-height: 30px;
}

.bubble-menu {
  width: 450px;
  display: flex;
  flex-wrap:wrap;
  justify-content: flex-start;
  align-items: center;
  background-color: #fff;
  border-radius: 10px;
  padding: 5px;
  box-shadow: 5px 5px 5px rgba(0, 0, 0, 0.1);
  /* position: absolute;
  top: 0;
  left: 0;
  z-index: 100; */

  button {
    /* width: 60px; */
    color: grey;
    width:fit-content;
    height: 40px;
    font-size: 15px;
    font-weight:700;
    text-align:center;
    padding: 5px;
    margin: 0 3px;
    background-color: rgba(255, 255, 255, 0.9);
    border: none;
    cursor: pointer;
    transition: all .3s;
    outline: none;

    &:hover {
      color: #409EFF;
      background-color: #e9e6e6;
      /* transform: scale(1.05); */
    }

    &.is-active {
      background-color: #CDCDCD;
      color: #409EFF;
      font-weight: 700;
    }
  }
}

vue-drag-resize {
  position: absolute;
  /* border: 1px solid #000; */
  top: 200px;
  left: 207px;
  width: 100px;
  height: 100px;
  /* background-color: pink; */
}

</style>

<style lang="scss">
.ProseMirror img {
  width: 500px;
  /* 固定宽度，或者使用百分比 */
  height: auto;
  /* 保持宽高比 */
}

ul[data-type="taskList"] {
  list-style: none;
  padding: 0;

  p {
    margin: 0;
  }

  li {
    display: flex;
    align-items: center;

    >label {
      display: flex;
      align-items: center;
      flex: 0 0 auto;
      margin-right: 0.5rem;
      user-select: none;
    }

    >div {
      flex: 1 1 auto;
    }
  }

  li[data-checked="true"] {
    text-decoration: line-through;
  }
}

.dropcursor {
  background-color: transparent !important;
  border: none;
}

a {
  cursor: pointer;
}

b {
  font-weight: bold;
}

.ProseMirror {
  overflow-y: scroll;
}

.ProseMirror p {
  margin: 0;
}

.ProseMirror:focus {
  outline: none;
}

.tiptap p.is-editor-empty:first-child::before {
  color: #adb5bd;
  content: attr(data-placeholder);
  float: left;
  height: 0;
  pointer-events: none;
}

.tiptap {
  >*+* {
    margin-top: 0.75em;
  }

  ul {
    padding: 0 2rem;
    list-style: square;
  }

  ol {
    padding: 0 2rem;
    list-style: decimal;
  }

  table {
    border-collapse: collapse;
    table-layout: fixed;
    width: 100%;
    margin: 0;
    overflow: hidden;

    td,
    th {
      min-width: 1em;
      border: 2px solid #ced4da;
      padding: 3px 5px;
      vertical-align: top;
      box-sizing: border-box;
      position: relative;

      >* {
        margin-bottom: 0;
      }
    }

    th {
      font-weight: bold;
      text-align: left;
      background-color: #f1f3f5;
    }

    .selectedCell:after {
      z-index: 2;
      position: absolute;
      content: '';
      left: 0;
      right: 0;
      top: 0;
      bottom: 0;
      background: rgba(200, 200, 255, 0.4);
      pointer-events: none;
    }

    .column-resize-handle {
      position: absolute;
      right: -2px;
      top: 0;
      bottom: -2px;
      width: 4px;
      background-color: #adf;
      pointer-events: none;
    }

    p {
      margin: 0;
    }
  }

  pre {
    width: 94%;
    height: fit-content;
    background: #272C35;
    color: #c5c3c3;
    font-family: 'JetBrainsMono', monospace;
    padding: 0.75rem 1rem;
    border-radius: 0.5rem;


    code {
      white-space: pre-wrap;
      /* 允许保留空白符，并且允许换行 */
      word-break: break-all;
      color: inherit;
      padding: 0;
      background: none;
      font-size: 1rem;
      font-weight: 700;
      max-width: 100% !important;
    }

    .hljs-comment,
    .hljs-quote {
      color: #616161;
    }

    .hljs-variable,
    .hljs-template-variable,
    .hljs-attribute,
    .hljs-tag,
    .hljs-name,
    .hljs-regexp,
    .hljs-link,
    .hljs-name,
    .hljs-selector-id,
    .hljs-selector-class {
      color: #A93226;
    }

    .hljs-number,
    .hljs-meta,
    .hljs-built_in,
    .hljs-builtin-name,
    .hljs-literal,
    .hljs-type,
    .hljs-params {
      color: #F39C12;
    }

    .hljs-string,
    .hljs-symbol,
    .hljs-bullet {
      color: #58D68D;
    }

    .hljs-title,
    .hljs-section {
      color: #fdf787;
    }

    .hljs-keyword,
    .hljs-selector-tag {
      color: #3498DB;
    }

    .hljs-emphasis {
      font-style: italic;
    }

    .hljs-strong {
      font-weight: 700;
    }
  }
}

.tableWrapper {
  max-width: 100%;

  // overflow-x: auto;
}

.resize-cursor {
  cursor: ew-resize;
  cursor: col-resize;
}




// 智能功能的toolbox
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
      padding: 1%;
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