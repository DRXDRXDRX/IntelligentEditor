import { defineStore} from 'pinia'
import { h, ref, type Component } from 'vue'

export const mainStore = defineStore('main',{
  state:()=>{
    return {
        helloPinia:'你好 Pinia!'
    }
  },
  getters:{},
  actions:{}
})

export const useEditorStore = defineStore('editor', () => {
  const headings = ref()
  const activeHeading = ref()
  const editorInstance = ref()
  const setHeadings = (data) => {
    headings.value = data
  }
  const setActiveHeading = (data) => {
    activeHeading.value = data
  }
  const setEditorInstance = (data) => {
    // console.log(editorInstance.value)

    editorInstance.value = data
  }
  return {
    headings,
    setHeadings,
    activeHeading,
    setActiveHeading,
    editorInstance,
    setEditorInstance
  }
})

export const filesStore = defineStore('files', () => {
  const fileList = ref<FileList | []>()
  const srcList = ref([''])
  const insert = ref(false)
  const setFileList = (data) => {
    fileList.value = data
  }
  const addSrc = (data:string) => {
    srcList.value.push(data)
  }
  const changeInsert = () => {
    insert.value = !insert.value
  }
  return {
    fileList,
    setFileList,
    srcList,
    addSrc,
    insert,
    changeInsert
  }
})


export const useSelectionStore = defineStore('selection', () => {
  const selection = ref('')
  const setSelection = (data) => {
    selection.value = data
  }
  return {
    selection,
    setSelection
  }
})