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
    <div class="docTitle">
      <input type="text" v-model="title">
    </div>
    <el-tooltip class="box-item2" effect="dark" :content="showRight ? '收起右侧' : '展开右侧'" placement="bottom">
      <i :class="showRight ? 'ri-indent-increase' : 'ri-indent-decrease'" @click="toggleRight"></i>
    </el-tooltip>
  </div>
  <div class="leftTools" :class="{ hiddenLeft: !showLeft, show_left: showLeft}">
    <left-sidebar @uploadDoc="uploadDoc" @deleteDoc="deleteDoc" />
  </div>
  <div class="editor" :class="{ recover: showLeft}">
    <!-- <generic-menu /> -->
    <div class="editorCard">
      <div class="topTools">
        <EditorMenu :editor="editor" v-model:font="font" :themeValue="themeValue"
          @showSearch="show_search_replace = true" @showMindmap="generateMindmap"
          @showResourceArchive="showResourceArchive" />
        <transition name="fade">
          <div class="search_replace" v-show="show_search_replace">
            <input type="text" v-model="searchTerm" placeholder="搜索" />
            <input type="text" v-model="replaceTerm" placeholder="替换" />
            <el-button type="primary" size="small" @click="search()">搜索全部</el-button>
            <el-button type="primary" size="small" @click="replaceAll()">全部替换</el-button>
            <el-button type="primary" size="small" @click="close()">关闭</el-button>
          </div>
        </transition>
      </div>
      <div class="editContent">
        <!-- <bubble-menu :editor="editor" :tippy-options="{ duration: 100 }" v-if="editor">
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
          </bubble-menu> -->
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
  <div class="rightTools" :class="{ hiddenRight: !showRight}">
    <Outline :editor="editor" @heading-click="handleHeadingClick" />
    <chat-main-page @toggleChatSize="toggleChatSize">
      <template #icon>
        <el-tooltip effect="light" content="放大" placement="top">
          <i class="ri-fullscreen-line" @click="openChatPageDialog"></i>
        </el-tooltip>
      </template>
    </chat-main-page>
  </div>
  <el-dialog v-model="mindmapVisible" @close="closeMindmap" width="65%" top="5vh" modal="true" :show-close="false"
    @open="() => { ElMessage({ message: '开始AI生成思维导图', type: 'success' }) }">
    <template #header="{ close, titleId, titleClass }">
      <div class="my-header">
        <div class="left">
          <el-button type="primary" size="small" @click="insertSvg">
            插入思维导图到文档
          </el-button>
          <el-button type="success" size="small" @click="exportSvg">
            导出思维导图
          </el-button>
          <div :id="titleId" :class="titleClass">AI生成思维导图</div>
        </div>

        <el-button type="danger" size="small" @click="close">
          关闭思维导图
        </el-button>
      </div>
    </template>
    <markup-demo ref="markmap"></markup-demo>
  </el-dialog>
  <el-dialog class="chatDialog" v-model="chatPageFullScreen" width="75%" top="5vh" style="{height: 80vh}"
    :show-close="true" title="AI聊天">
    <chat-main-page>
      <template #icon>
        <el-tooltip effect="light" content="关闭" placement="right">
          <i class="ri-close-circle-line" @click="closeChatPageDialog"></i>
        </el-tooltip>
      </template>
    </chat-main-page>
  </el-dialog>
  <el-dialog class="resourceDialog" v-model="resourceArchiveVisible" :show-close="false" width="75%" top="5vh"
    modal="true" title="资源库">
    <template #header="{ close, titleId, titleClass }">
      <div class="my-header">
        <h4 :id="titleId" :class="titleClass">资源库</h4>
        <el-button type="danger" @click="close">关闭</el-button>
      </div>
    </template>
    <resource-archive :update_resource_list="resourceArchiveVisible"></resource-archive>
  </el-dialog>
</div>
</template>

<script lang="ts" setup>
import { defineComponent, onMounted, onUpdated, onBeforeUnmount, ref, watch, watchEffect, provide, getCurrentInstance } from 'vue';
import { Editor, EditorContent, useEditor, BubbleMenu } from '@tiptap/vue-3';
import { storeToRefs } from 'pinia'
import { useSocketStore } from '@/store'
import Underline from '@tiptap/extension-underline'
// import Italic from '@tiptap/extension-italic'
import TextAlign from '@tiptap/extension-text-align'
import Document from '@tiptap/extension-document'
import Paragraph from '@tiptap/extension-paragraph'
import Text from '@tiptap/extension-text'

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
import Typography from "@tiptap/extension-typography";
import Youtube from '@tiptap/extension-youtube'
import Blockquote from '@tiptap/extension-blockquote'


// 使用Pinia
import { useEditorStore, useSelectionStore, useDocIdStore, useMarkdownStore, useUserInfoStore } from '@/store'
import { filesStore } from '@/store';
import EditorMenu from '../components/EditorMenu/index.vue'
import { defineStore } from 'pinia'
import { ElMessage } from 'element-plus';

import Outline from '../components/Outline.vue'
import PolishOptions from '../components/PolishOptions.vue'
import ChatMainPage from '../components/AIChat/ChatMainPage.vue'
import ResourceArchive from '../components/ResourceArchive.vue'
import LeftSidebar from '../components/LeftSidebar.vue'
import http from '@/utils/request.ts'
import SearchAndReplace from "@sereneinserenade/tiptap-search-and-replace";
import markupDemo from '@/components/Markmap.vue'
import MarkdownIt from 'markdown-it'
import TurndownService from 'turndown'

const md = new MarkdownIt()
const turndownService = new TurndownService()

const userInfoStore = useUserInfoStore()
const markdownStore = useMarkdownStore()
const docIdStore = useDocIdStore()
const selectionStore = useSelectionStore()
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
let socket = new WebSocket('https://firlin.cn/api/v1/docws');
const connect = () => {
  socket = new WebSocket('https://firlin.cn/api/v1/docws');
  socket.addEventListener('open', handleOpen);
  socket.addEventListener('message', handleMessage);
  socket.addEventListener('close', handleClose);
  socket.addEventListener('error', handleError);
}

// 发送数据
const dataToSend = ref({
  id: "668616147448aeceb9f229bd",
  json: {
    key: "",
  },
  html: ''
});

const sendData = () => {
  if (socket && socket.readyState === WebSocket.OPEN) {
    console.log('发送数据：', dataToSend.value);
    // 将JavaScript对象转换为JSON字符串
    const message = JSON.stringify(dataToSend.value);
    socket.send(message); // 发送消息
  } else {
    console.log(socket)
    console.error('WebSocket 连接未打开或已关闭。');
  }
};

const font = ref('Arial')

// 使用ref创建可变的响应式引用
// 编辑器初始化
const editor = useEditor({
  content: '',
  extensions: [
    Document,
    Paragraph,
    Text,
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
    SearchAndReplace.configure(),
    Typography,
    Youtube,
    Blockquote,
  ],
  onUpdate({ editor }) {

    editorStore.setEditorInstance(editor.value)
    // 实时将编辑器内容解析markdown

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
    dataToSend.value.html = editor.getHTML()
    dataToSend.value.id = docIdStore.docId
    sendData()
    // socket.send(dataToSend.value)
    loadHeadings()

  },
  async onCreate({ editor }) {

    editorStore.setEditorInstance(editor.value)

    // 添加粘贴监听
    editor.view.dom.addEventListener('paste', () => {
      // console.log(editor.getHTML())
      // console.log(turndownService.turndown(editor.getHTML()))
      // 去除所有的\
      // console.log(turndownService.turndown(editor.getHTML()).replaceAll(/\\/g, ''))
      editor.commands.setContent(md.render(turndownService.turndown(editor.getHTML()).replaceAll(/\\/g, '')))
      // console.log(md.render(turndownService.turndown(editor.getHTML())))
      loadHeadings()
    });

    watchEffect(() => {
      if (docIdStore.docId) {
        http.request({
          url: '/doc',
          method: 'GET',
          params: {
            id: docIdStore.docId
          }
        }).then(docResult => {
          // console.log(docResult.data)
          // console.log(docResult.data.json)
          console.log(docResult.data.json)
          editor.commands.setContent(JSON.parse(docResult.data.json.key))
          loadHeadings()
        }).catch(error => {
          console.log(error)
        })
      }
    })
    // const docResult = await http.request({
    //   url: '/doc',
    //   method: 'GET',
    //   params:{
    //     docIdStore.docId
    //   }
    // })
    // console.log(docResult)
    // editor.commands.setContent(JSON.parse(docResult.data.json.key))

  },
  onSelectionUpdate({ editor }) {
    // console.log(1);
    // 判断选中的是不是图片
    const { from, to } = editor.state.selection
    // 获取选中内容
    const selectedText = editor.state.doc.textBetween(from, to)
    console.log(selectedText)
    selectionStore.setSelection(selectedText)
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

const title = ref(docIdStore.docTitle)
watch(title, (newVal) => {
  docIdStore.setDocTitle(newVal)
  // console.log(docIdStore.docTitle)
})
watchEffect(() => {
  title.value = docIdStore.docTitle
  if (docIdStore.docId) {
    http.request({
      url: '/doc',
      method: 'POST',
      data: {
        id: docIdStore.docId,
        title: docIdStore.docTitle
      }
    }).then(res => {
      // console.log(res)
    })
  }
})

const show_search_replace = ref(false);
const searchTerm = ref<string>('');

const replaceTerm = ref<string>('');

const caseSensitive = ref<boolean>(false);

const updateSearchReplace = (clearIndex: boolean = false) => {
  if (!editor.value) return;

  if (clearIndex) editor.value.commands.resetIndex();

  editor.value.commands.setSearchTerm(searchTerm.value);
  editor.value.commands.setReplaceTerm(replaceTerm.value);
  editor.value.commands.setCaseSensitive(caseSensitive.value);
}

const clear = () => {
  searchTerm.value = replaceTerm.value = "";
  editor.value.commands.resetIndex();
};

let temp = []


watch(
  () => searchTerm.value.trim(),
  (val, oldVal) => {
    if (!val) clear();
    if (val !== oldVal) updateSearchReplace(true);
    const { results, resultIndex } = editor.value.storage.searchAndReplace;
    temp = [...results]
  }
);

watch(
  () => replaceTerm.value.trim(),
  (val, oldVal) => (val === oldVal ? null : updateSearchReplace())
);

watch(
  () => caseSensitive.value,
  (val, oldVal) => (val === oldVal ? null : updateSearchReplace(true))
);


const search = () => {
  if (!editor.value) return;
  if (!searchTerm.value) {
    ElMessage.warning('搜索内容不能为空');
    return;
  };
  const { results, resultIndex } = editor.value.storage.searchAndReplace;
  console.log(results)
  if (results.length === 0) {
    ElMessage.warning('未找到匹配项');
    return;
  }
  temp = [...results]
  console.log(resultIndex)
  // 把所有搜索结果高亮：
  results.forEach((result) => {
    editor.value.commands.setTextSelection(result);
    editor.value.chain().focus().setHighlight().run();
  });

}

const replaceAll = () => {
  if (!editor.value) return;

  editor.value.commands.replaceAll();
  console.log(temp)
  // 去掉所有高亮
  temp.forEach((result) => {
    editor.value.commands.setTextSelection(result);
    editor.value.chain().focus().unsetHighlight().run();
  });
}

const close = () => {
  show_search_replace.value = false;
  searchTerm.value = ''
  replaceTerm.value = ''
  // 去掉所有高亮
  temp.forEach((result) => {
    editor.value.commands.setTextSelection(result);
    editor.value.chain().focus().unsetHighlight().run();
  });
}

const handleOpen = () => {
  console.log('WebSocket 连接已打开。');
};

const handleMessage = (event) => {
  console.log('收到消息:', event.data);
};

const handleClose = (e) => {
  console.log('WebSocket 连接已关闭。', e);
  let timer = setTimeout(() => {
    socket.removeEventListener('open', handleOpen);
    socket.removeEventListener('message', handleMessage);
    socket.removeEventListener('close', handleClose);
    socket.removeEventListener('error', handleError);
    console.log('尝试重新连接');
    connect()
    clearInterval(timer)
  }, 1000)
};

const handleError = (error) => {
  console.error('WebSocket 出现错误:', error);
};


// 思维导图：
const markmap = ref(null)
const mindmapVisible = ref(false)
const closeMindmap = () => {
  markdownStore.setMarkdown('')
  console.log(markdownStore.markdown)
}
const generateMindmap = () => {
  console.log(editor.value.getHTML())
  mindmapVisible.value = true
  http.request({
    url: '/ai/stream',
    method: 'POST',
    data: [
      {
        role: 'user',
        text: '请将以下 HTML 内容转换为 Markdown 格式的大纲，重点关注标题和列表结构。请不要包含正文详细内容、链接、图片等非结构化信息。只需输出 Markdown 标记，如标题、列表等，以便直接转为思维导图:' + editor.value.getHTML()
      }
    ],
  }).then(res => {
    console.log(res.data)
    const eventSource = new EventSource(`https://firlin.cn/api/v1/ai/stream/line?id=${res.data}`, { withCredentials: true })
    // 发送请求：
    console.log(eventSource)
    eventSource.onopen = () => {
      console.log('连接已建立')
    };
    eventSource.onmessage = (event) => {
      const section = JSON.parse(event.data).data
      console.log(section)
      markdownStore.setMarkdown(markdownStore.markdown + section)
    }
    eventSource.onerror = (event) => {
      console.log(event)
      console.log('连接已断开')

      eventSource.close()
      ElMessage({
        message: '思维导图生成成功',
        type: 'success'
      })
    }
    // markdownContent.value = res.data.markdown
    // markdownStore.setMarkdown(res.data.markdown)
    // console.log(markdownContent.value)
  })
}

const insertSvg = () => {
  const svg = markmap.value.svgRef;
  if (!svg) {
    console.error('SVG element not found');
    return;
  }

  // 获取 SVG 的实际大小
  const rect = svg.getBoundingClientRect();
  const width = rect.width;
  const height = rect.height;

  // 设置 SVG 的宽度和高度属性（如果没有）
  svg.setAttribute('width', width);
  svg.setAttribute('height', height);

  try {
    const svgString = new XMLSerializer().serializeToString(svg);
    console.log('Serialized SVG:', svgString);

    const encodedData = window.btoa(unescape(encodeURIComponent(svgString)));
    console.log('Encoded Data:', encodedData);

    const img = new window.Image();
    img.src = `data:image/svg+xml;base64,${encodedData}`;

    img.onload = () => {
      console.log('Image loaded');

      const dpr = window.devicePixelRatio || 1;

      const canvas = document.createElement('canvas');
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      const ctx = canvas.getContext('2d');
      ctx.scale(dpr, dpr);

      if (ctx) {
        ctx.drawImage(img, 0, 0, width, height);

        // 高质量绘制选项
        ctx.imageSmoothingEnabled = true;
        ctx.imageSmoothingQuality = 'high';

        const imgBase64 = canvas.toDataURL('image/png');
        console.log('Base64 Image:', imgBase64);

        canvas.toBlob(function (blob) {
          console.log('Blob data:', blob);
          const file = new File([blob], `${docIdStore.docTitle}_mindmap.png`, { type: 'image/png' });
          const formData = new FormData();
          formData.append('file', file);
          http.request({
            url: '/file/upload',
            method: 'POST',
            data: formData,
            headers: {
              'Content-Type': 'multipart/form-data'
            }
          }).then(res => {
            console.log(res.data.file_link);
            editor.value?.chain().focus().setImage({ src: res.data.file_link }).run();
            ElMessage({
              message: '思维导图插入成功',
              type: 'success'
            });
          }).catch(err => {
            console.error('Upload error:', err);
          });
        }, 'image/png');

      } else {
        console.error('Failed to get canvas context');
      }
    };

    img.onerror = (error) => {
      console.error('Image load error:', error);
    };

  } catch (error) {
    console.error('Error serializing SVG:', error);
  }
};

const exportSvg = async () => {
  const svg = markmap.value.svgRef
  if (!svg) return
  const svgString = new XMLSerializer().serializeToString(svg)
  // 转成blob对象
  const blob = new Blob([svgString], { type: 'image/svg+xml' })
  // 下载
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `${docIdStore.docTitle}_mindmap.svg`
  a.click()
  URL.revokeObjectURL(url)
  a.remove()
}


const uploadDoc = (content) => {
  editor.value?.chain().focus().setContent(md.render(content)).run()
  loadHeadings()
  http.request({
    url: '/doc',
    method: 'POST',
    data: {
      id: docIdStore.docId,
      json: {
        key: JSON.stringify(editor.value.getJSON())
      },
      html: editor.value.getHTML()
    },
  }).then(res => {
    console.log(res.data)
  })
  console.log('成功')
}

const deleteDoc = () => {
  editor.value?.chain().focus().setContent('').run()
}



const chatPageFullScreen = ref(false)
const openChatPageDialog = () => {
  chatPageFullScreen.value = true
}
const closeChatPageDialog = () => {
  chatPageFullScreen.value = false
}


const resourceArchiveVisible = ref(false)
const showResourceArchive = () => {
  resourceArchiveVisible.value = true
}


onMounted(() => {

  http.request({
    url: '/user/me',
    method: 'get',
  }).then((res) => {
    console.log(res);

    userInfoStore.setUserName(res.data.user_name)
    userInfoStore.setAvatar(res.data.avatar)
    userInfoStore.setVip(res.data.vip)
    userInfoStore.setEmail(res.data.mail)
  });

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


  socket.addEventListener('open', handleOpen);
  socket.addEventListener('message', handleMessage);
  socket.addEventListener('close', handleClose);
  socket.addEventListener('error', handleError);
});



// 在组件卸载前销毁Editor实例
onBeforeUnmount(() => {
  editor.value?.destroy();

  socket.removeEventListener('open', handleOpen);
  socket.removeEventListener('message', handleMessage);
  socket.removeEventListener('close', handleClose);
  socket.removeEventListener('error', handleError);
});




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
  width: 0 !important;
  /* transform: translateX(100%); */
}



.hiddenLeft {
  overflow: hidden !important;
  /* transform: translateX(-100%);
  width:0 !important;
  height: 0 !important; */
  animation: hide_left .5s ease-in-out forwards;
}



@keyframes hide_left {
  99% {
    height: 94vh;
    transform: translateX(-100%);
  }

  100% {
    width: 0;
    height: 0;
  }
}

.show_left {
  animation: show_left .5s ease-in-out forwards;
}

@keyframes show_left {
  0% {
    transform: translateX(-100%);
  }

  100% {
    transform: translateX(0);
  }
}

.recover {
  animation: recover .5s ease-in-out forwards;
}

@keyframes recover {
  0% {
    /* width: calc(100% + 250px); */
    transform: translateX(-250px);
  }

  100% {
    /* transform: translateX(0); */
  }
}


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
  /* display: grid;
  gap: 0;
  grid-template-rows: 45px 1fr;
  grid-template-columns: 2fr 12fr 5fr; */
  display: flex;
  flex-wrap: wrap;
  font-size: 15px;
  scrollbar-width: thin;
  scrollbar-color: #868686 #faf0f0;
  overflow-x: hidden;
  overflow-y: hidden;
}

.header-bar {
  /* position: fixed;
  top:0; */
  /* grid-column: 1 / 4; */
  width: 100vw;
  height: 45px;
  background-color: #fff;
  padding: 0.5rem;
  border-bottom: 1px solid #ccc;
  box-shadow: 0 1px 5px 0px #ccc;
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 10px;

  .docTitle {
    position: absolute;
    width: 210px;
    height: 35px;
    left: 40px;

    input {
      width: 100%;
      font-size: 18px;
      padding: 5px;
      font-weight: normal;
      height: 100%;
      border: 1px solid transparent;
      border-radius: 10px;
      outline: none;
      transition: border .3s ease-in-out;

      /* text-decoration: underline */
      &:focus {
        border-color: #409EFF;

      }
    }
  }

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
  height: 94vh;
  width: 250px;
  transition: all .5s ease-in-out !important;
}




.rightTools {
  height: 94vh;
  width: 300px;
  overflow-y: auto;
  transition: all .5s ease-in-out;
  /* padding-left:10px; */
}

.editor {
  flex: 1;
  /* background-color: #e6f6f9; */
  /* box-shadow: 1px 0 20px 10px #fff; */
  height: 94vh;
  /* width: 100%; */
  transition: all .5s ease-in-out !important;
}

/* .editor.recover {
  width: 250px !important; 
} */

.editorCard {
  position: relative;
  width: 98%;
  height: 97%;
  left: 1%;
  top: 1%;
  display: flex;
  flex-direction: column;
  transition: transform 0.5s ease-in-out;
}

.topTools {
  height: fit-content;
  margin-bottom: 10px;
  position: relative;
}

.topTools .search_replace {
  width: 250px;
  height: 60px;
  position: absolute;
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  bottom: -40px;
  right: 0;
  z-index: 10;

  input {
    width: 120px;
    border: 1px solid #ccc;
    border-radius: 5px;
    padding: 0 5px;
    margin-right: 5px;
    outline: none;
    border: 1px solid transparent;
    transition: all .3s ease-in-out;

    &:focus {
      border-color: #409EFF;
    }
  }
}

/* 定义淡入淡出的效果 */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s;
}

.fade-enter-from,
.fade-leave-to

/* .fade-leave-active in <2.1.8 */
  {
  opacity: 0;
}

.fade-enter-to,
.fade-leave-from {
  opacity: 1;
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
    padding: 10px 0 30px 10px;
    position: fixed;
    top: 50%;
    left: 40%;
    transform: translate(-50%, -50%);
    background-color: #fff;
    border-radius: 10px;
    border: none;
    box-shadow: 0 0 10px #CDCDCD;
  }

  .tiptap {
    height: 100%;
    overflow-y: auto;
  }

  .tiptap blockquote {
    margin-left: 0;
    padding-left: 0.5em;
    border-left: 2px solid #ccc;
    /* 竖线样式 */
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
  flex-wrap: wrap;
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
    width: fit-content;
    height: 40px;
    font-size: 15px;
    font-weight: 700;
    text-align: center;
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


.my-header {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  gap: 10px;

  .left {
    display: flex;
    align-items: center;
    flex: 1;
    margin-right: 130px;

    div {
      flex: 1;
      font-size: 22px;
      font-weight: 700;
      text-align: center;
    }
  }
}

.ri-fullscreen-line {
  cursor: pointer;
  font-size: 16px;
  border-radius: 5px;
  padding: 1px 3px 0;
  transition: all .3s ease-in-out;

  &:hover {
    background-color: #E5E5E5;
  }
}

.ri-close-circle-line {
  cursor: pointer;
  font-size: 20px;
  border-radius: 5px;
  padding: 1px 5px 0;
  transition: all .3s ease-in-out;

  &:hover {
    background-color: #E5E5E5;
  }
}

.chatDialog {
  height: 600px;
  padding: 0;

  .el-dialog__header {
    display: none !important;
  }

  .el-dialog__body {
    height: 600px;

    .root {
      height: 100%;
    }

    .root .container .charArea {
      width: 96% !important;
      height: 70% !important;
    }
  }
}

.resourceDialog {
  height: 600px;

  /* padding: 0; */
  .el-dialog__header {
    padding-bottom: 0 !important;
  }

  /* .el-dialog__body {
    height:600px;
  } */
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
  display: flex;
  /* 弹性布局 */
  align-items: center;
  /* 垂直居中 */
  justify-content: space-around;
  /* 使按钮水平分布 */



  button {
    width: 60px;
  }

  .model_button {
    width: 50px;
  }

  button,
  .model_button {
    height: 40px;
    font-family: 'Microsoft YaHei', sans-serif;
    font-size: 90%;
    font-weight: 500;

    color: grey;
    padding: 1%;
    border-radius: 10px;
    border: transparent;
    background-color: rgba(255, 255, 255, 0.9);
    /* 白色背景，50% 透明度 */
    transition: background-color 0.3s ease-in-out;
    /* 过渡效果 */
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


.model_list_item {
  display: flex;
  align-items: center;
  justify-content: flex-start;

  i,
  p {
    display: inline-box;
    margin: 0;
  }

  p {
    margin-left: 5px;
  }
}

.model_name_button {
  width: 100%;
  height: 100%;
  border: transparent;
  padding: 0;
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