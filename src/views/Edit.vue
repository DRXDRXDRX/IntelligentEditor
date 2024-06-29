<template>
  <div class="EditMain">
    <div class="leftTools">
      <el-switch @change="hanldeSwitchTheme" v-model="themeValue"
        style="--el-switch-on-color: #2C2C2C; --el-switch-off-color: #FE887B">
        <template #active-action>
          <i class="ri-contrast-2-line"></i>
        </template>
        <template #inactive-action>
          <i class="ri-sun-fill"></i>
        </template>
      </el-switch>
      <button onclick="dialog.showModal()">打开弹窗</button>
      <dialog id="dialog" >
          <input type="date" name="" id="">
          <button onclick="dialog.close()">关闭弹窗</button>
      </dialog>
    </div>
    <div class="editor">
      <generic-menu />
      <div class="editorCard">
        <div class="topTools">
          <EditorMenu :editor="editor" v-model:font="font" />
        </div>
        <div class="editContent">
          <EditorContent style="margin: 8px;  overflow-y: auto; height: 100%;" :editor="editor" />
          <bubble-menu :editor="editor" :tippy-options="{ duration: 100 }" v-if="editor">
            <button @click="editor.chain().focus().toggleBold().run()"
              :class="{ 'is-active': editor.isActive('bold') }">
              bold
            </button>
            <button @click="editor.chain().focus().toggleItalic().run()"
              :class="{ 'is-active': editor.isActive('italic') }">
              italic
            </button>
            <button @click="editor.chain().focus().toggleStrike().run()"
              :class="{ 'is-active': editor.isActive('strike') }">
              strike
            </button>
          </bubble-menu>
        </div>
        <div class="bottomCount">
          字数统计:
          {{ editor?.storage.characterCount.characters() }}&nbsp;&nbsp;
          当前字体为：
          {{ font }}
        </div>
      </div>
    </div>
    <div class="rightTools">
      <Outline :editor="editor" @heading-click="handleHeadingClick" />
    </div>
  </div>
</template>

<script lang="ts" setup>
import { defineComponent, onMounted, onBeforeUnmount, ref, watch, provide } from 'vue';
import { Editor, EditorContent, useEditor } from '@tiptap/vue-3';
import { storeToRefs } from 'pinia'
import Underline from '@tiptap/extension-underline'
import Italic from '@tiptap/extension-italic'
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
import BubbleMenu from '@tiptap/extension-bubble-menu';


// 使用Pinia
import { useEditorStore } from '@/store'
import { filesStore } from '@/store';
import EditorMenu from '../components/EditorMenu/index.vue'
import { defineStore } from 'pinia'
import { ElMessage } from 'element-plus';

import Outline from '../components/Outline.vue'
import GenericMenu from '../components/GenericMenu.vue'

const fileStore = filesStore()
// 主题色切换：
const themeValue = ref(false);
const hanldeSwitchTheme = (value) => {
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
    Italic,
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
    BubbleMenu.configure({
      element: document.querySelector('.tip p'),
    }),

  ],
  onUpdate({ edit }) {
    loadHeadings()
    editorStore.setEditorInstance(editor.value)
    for (const file of fileStore.fileList) {
      const reader = new FileReader()
      reader.readAsDataURL(file)
      reader.onload = () => {
        const src = reader.result as string
        editor.value?.chain().focus().setImage({ src }).run()
      }
    }
  },
  onCreate({ edit }) {
    loadHeadings()
    editorStore.setEditorInstance(editor.value)
  },
  injectCSS: false,
})





const handleHeadingClick = (heading) => {
  const { start, end } = heading;
  if (!editor.value) return;
  // console.log(heading);
  // console.log(start, end)
  editor.value.commands.setTextSelection({ from: start, to: end + 1 });
  editor.value.commands.focus();
};

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
});



// 在组件卸载前销毁Editor实例
onBeforeUnmount(() => {
  editor.value?.destroy();
});
</script>

<style scoped>
::selection {
  cursor: pointer;
}
</style>

<style>
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
  transition: all .4s;
}

.EditMain {
  position: relative;
  width: 100vw;
  height: 100vh;
  display: grid;
  grid-template-columns: 20% 60% 20%;
  font-size: 15px;
  scrollbar-width: thin;
  scrollbar-color: #868686 #faf0f0;
}


.leftTools {
  /* border-right: 1px solid #fff; */
  background-color: hsla(0, 17%, 78%, 0.158);
  box-shadow: 0px 0px 5px #fff inset;
  height: 100%;
  width: 100%;
  display: flex;
  justify-content: center;
}

.rightTools {
  height: 100%;
  width: 100%;
  overflow-y: auto;
  /* padding-left:10px; */
}

.editor {
  /* background-color: #e6f6f9; */
  box-shadow: 1px 0 20px 10px #fff;
  height: 100vh;
}

.editorCard {
  position: relative;
  width: 95%;
  height: 97%;
  left: 2.5%;
  top: 1%;
  display: flex;
  flex-direction: column;
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
  /* background-color: white; */


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
</style>