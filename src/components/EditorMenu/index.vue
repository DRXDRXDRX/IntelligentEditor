<!-- src/components/EditorMenu/index.vue -->
<template>
  <div class="editor-menu">
    <MenuItem v-for="item in menuItems" :key="item.title" :icon="item.icon" :title="item.title" :action="item.action"
      :isActive="item.isActive"  ref="color" @changeColor="changeColor" @changeFontSize="changeFontSize"
      @changeFontFamily="changeFontFamily" @getLink="getLink">
    </MenuItem>
  </div>
</template>

<script setup lang="ts">
import { defineProps, ref, watch, defineEmits, provide } from 'vue'
import MenuItem from '@/components/MenuItem/index.vue'
import { ElMessage, ElMessageBox } from 'element-plus';
import { filesStore } from '@/store'
import http from '@/utils/request'
const fileStore = filesStore()

interface MenuItemType {
  icon: string
  title: string
  action: () => void
  isActive: () => boolean
}

const props = defineProps<{
  editor: any,
  font: string,
  themeValue: boolean
}>()
const emit = defineEmits(["update:font", "showSearch", "showMindmap", "showResourceArchive"])

const menuItems = ref<MenuItemType[]>([])
const changeColor = (newColor) => {
  props.editor.chain().focus().setColor(newColor).run()
}
const changeFontSize = (newSize) => {
  console.log(newSize)
}
// const font = ref('Arial')
const changeFontFamily = (newFamily) => {
  // console.log(newFamily)
  emit("update:font", newFamily)
  props.editor.chain().focus().setFontFamily(newFamily).run()
}



watch(
  () => props.editor,
  (newEditor) => {
    if (newEditor) {
      updateMenuItems(newEditor)
      
    }
  },
  { immediate: true }
)

const updateMenuItems = (newEditor) => {
  menuItems.value = [
    {
      icon: 'bold',
      title: '加粗',
      action: () => { newEditor.chain().focus().toggleBold().run() },
      isActive: () => { return newEditor.isActive('bold'); }
    },
    {
      icon: 'italic',
      title: '倾斜',
      action: () => { newEditor.chain().focus().toggleItalic().run() },
      isActive: () => { return newEditor.isActive('italic') }
    },
    {
      icon: 'underline',
      title: '下划线',
      action: () => { newEditor.chain().focus().toggleUnderline().run() },
      isActive: () => { return newEditor.isActive('underline'); }
    },
    {
      icon: 'strikethrough',
      title: '删除线',
      action: () => { newEditor.chain().focus().toggleStrike().run() },
      isActive: () => { return newEditor.isActive('strike'); }
    },
    {
      icon: 'heading',
      title: 'highlight高亮',
      action: () => { newEditor.chain().focus().toggleHighlight().run() },
      isActive: () => { return newEditor.isActive('highlight'); }
    },
    {
      icon: 'font-family',
      title: '字体',
      action: () => { },
      isActive: () => false
    },
    {
      icon: 'font-color',
      title: '字色',
      action: () => {
        // console.log(color.value[6].textColor)
        // newEditor.chain().focus().setColor(color.value[6].textColor).run()
      },
      isActive: () => false
    },
    {
      icon: 'h-1',
      title: '一级标题',
      action: () => { newEditor.chain().focus().toggleHeading({ level: 1 }).run() },
      isActive: () => { return newEditor.isActive('heading', { level: 1 }); }
    },
    {
      icon: 'h-2',
      title: '二级标题',
      action: () => { newEditor.chain().focus().toggleHeading({ level: 2 }).run() },
      isActive: () => { return newEditor.isActive('heading', { level: 2 }); }
    },
    {
      icon: 'h-3',
      title: '三级标题',
      action: () => { newEditor.chain().focus().toggleHeading({ level: 3 }).run() },
      isActive: () => { return newEditor.isActive('heading', { level: 3 }); }
    },
    {
      icon: 'h-4',
      title: '四级标题',
      action: () => { newEditor.chain().focus().toggleHeading({ level: 4 }).run() },
      isActive: () => { return newEditor.isActive('heading', { level: 4 }); }
    },
    {
      icon: 'h-5',
      title: '五级标题',
      action: () => { newEditor.chain().focus().toggleHeading({ level: 5 }).run() },
      isActive: () => { return newEditor.isActive('heading', { level: 5 }); }
    },
    {
      icon: 'h-6',
      title: '六级标题',
      action: () => { newEditor.chain().focus().toggleHeading({ level: 6 }).run() },
      isActive: () => { return newEditor.isActive('heading', { level: 6 }); }
    },
    {
      icon: 'arrow-right-s-line',
      title: '引用',
      action: () => { newEditor.chain().focus().toggleBlockquote().run() },
      isActive: () => { return newEditor.isActive('blockquote'); }
    },
    {
      icon: 'list-unordered',
      title: '无序列表',
      action: () => { newEditor.chain().focus().toggleBulletList().run() },
      isActive: () => { return newEditor.isActive('bulletList'); }
    },
    {
      icon: 'list-ordered',
      title: '有序列表',
      action: () => { newEditor.chain().focus().toggleOrderedList().run() },
      isActive: () => { return newEditor.isActive('orderedList'); }
    },
    {
      icon: 'list-check-3',
      title: '任务列表',
      action: () => { newEditor.chain().focus().toggleTaskList().run() },
      isActive: () => false
    },
    {
      icon: 'link',
      title: '插入链接',
      action: () => { insertLink(newEditor) },
      isActive: () => { return newEditor.isActive('link'); }
    },
    {
      icon: 'file-image-line',
      title: '图片链接',
      action: () => {
        const url = prompt('请输入图片链接：')
        if (url) {
          newEditor.chain().focus().setImage({ src: url }).run();
        }
      },
      isActive: () => false
    },
    {
      icon: 'image-add-line',
      title: '本地图片',
      action: () => {
          const input = document.createElement('input');
          input.type = 'file';
          input.accept = 'image/*';
          input.onchange = async () => {
            const file = input.files[0];
            if (file) {
              const formData = new FormData()
              formData.append('file', file)
              try {
                const res = await http.request({
                  url: '/file/upload',
                  method: 'POST',
                  data: formData,
                  headers: {
                      'Content-Type': 'multipart/form-data', // 这行通常是可选的，浏览器会自动处理
                  }
                })
                console.log(res.data.file_link)
                newEditor.chain().focus().setImage({ src: res.data.file_link }).run();
                ElMessage({
                  type: 'success',
                  message: '图片插入成功'
                })
              } catch(error) {
                ElMessage({
                  type: 'error',
                  message: '图片插入失败'
                })
                console.log(error)
              }
            }
          };
          input.click();
          input.remove()
      },
      isActive: () => false
    },
    {
      icon: 'code-s-slash-line',
      title: '代码块',
      action: () => { newEditor.chain().focus().toggleCodeBlock().run() },
      isActive: () => { return newEditor.isActive('codeBlock'); }
    },
    {
      icon: 'table-3',
      title: '插入表格',
      action: () => { insertTable(newEditor); },
      isActive: () => { return newEditor.isActive('table'); }
    },
    {
      icon: 'translate',
      title: '翻译',
      action: () => { },
      isActive: () => false
    },
    {
      icon: 'find-replace-line',
      title: '查找与替换',
      action: () => { 
        console.log("替换")
        emit("showSearch")
      },
      isActive: () => false
    },
    {
      icon: 'align-left',
      title: '左对齐',
      action: () => { newEditor.chain().focus().setTextAlign('left').run() },
      isActive: () => newEditor.isActive({textAlign: 'left'})
    },
    {
      icon: 'align-center',
      title: '居中对齐',
      action: () => { newEditor.chain().focus().setTextAlign('center').run() },
      isActive: () => newEditor.isActive({textAlign: 'center'})
    },
    {
      icon: 'align-right',
      title: '右对齐',
      action: () => { newEditor.chain().focus().setTextAlign('right').run() },
      isActive: () => newEditor.isActive({textAlign: 'right'})
    },
    {
      icon: 'align-justify',
      title: '两端对齐',
      action: () => { newEditor.chain().focus().setTextAlign('justify').run() },
      isActive: () => newEditor.isActive({textAlign: 'justify'})
    },
    {
      icon: 'mind-map',
      title: '生成思维导图',
      action: () => { emit('showMindmap') },
      isActive: () => false
    },
    {
      icon: 'youtube-line',
      title: 'Youtube',
      action: () => { insertYoutubeLink(newEditor) },
      isActive: () => newEditor.isActive('youtube')
    },
    {
      icon: 'archive-2-line',
      title: '资源库',
      action: () => { emit('showResourceArchive') },
      isActive: () => false
    }
  ]
  // emits("update:font", props.font)
}


const insertLink = (editor) => {
  ElMessageBox.prompt('请输入链接 URL', '提示', {
    confirmButtonText: '确认',
    cancelButtonText: '取消',
    inputPattern: /^(https?|ftp):\/\/[^\s/$.?#].[^\s]*$/,
    inputErrorMessage: '无效的 URL',
  })
    .then(({ value }) => {
      if (editor.state.selection.empty) {
        // 没有选中文字时，插入完整链接
        editor.chain().focus().insertContent(`<a href="${value}" target="_blank">${value}</a>`).run()
      } else {
        // 有选中文字时，给选中的文字加上链接
        const { from, to } = editor.state.selection
        editor.chain().focus().setLink({ href: value }, from, to).run()
      }
      ElMessage({
        type: 'success',
        message: `链接已插入: ${value}`,
      })
      updateMenuItems(editor)
    })
    .catch(() => {
      ElMessage({
        type: 'info',
        message: '操作已取消',
      })
    })
}

const insertYoutubeLink = (editor) => {
  ElMessageBox.prompt('请输入 Youtube 视频或音乐地址', '提示', {
    confirmButtonText: '确认',
    cancelButtonText: '取消',
    // inputPattern: /^https:\/\/(?:www\.)?(?:youtube\.com|music\.youtube\.com)\/watch\?v=([a-zA-Z0-9_-]{11})$/,
    // inputErrorMessage: '无效的 Youtube 视频或音乐地址',
  })
    .then(({ value }) => {
      console.log(value)
      editor.chain().focus().setYoutubeVideo({
        src: value,
        width: 840,
        height: 480,
      }).run()
      ElMessage({
        type: 'success',
        message: `Youtube 视频或音乐已插入: ${value}`,
      })
    })
    .catch(() => {
      ElMessage({
        type: 'info',
        message: '操作已取消',
      })
    })
}

function insertTable(editor) {
  const rows = prompt('Enter number of rows')
  const cols = prompt('Enter number of columns')
  if (rows && cols) {
    editor.chain().focus().insertTable({ rows: parseInt(rows), cols: parseInt(cols) }).run()
  }
}


</script>

<style scoped>
.editor-menu {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  background-color: #f9eaea82;
  padding: 0.5rem;
  border-bottom: 1px solid #ccc;
  border-radius: 10px;
  box-shadow: 0 0 5px 2px rgba(0, 0, 0, 0.1);
  overflow-x: auto;

  .menu-item {
    margin-right: 0.5rem;
  }
}
</style>