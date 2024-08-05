<template>
    <div class="root">
        <div class="container" >
            <div class="header">
                <slot name="icon"></slot>
                <h5>无界智灵<i class="ri-bard-line"></i></h5>
                <el-popconfirm title="确认清空吗？" confirm-button-text="确认" cancel-button-text="手滑了" cancel-button-type="info" @confirm="aiChatStore.clearChatRecords" >
                    <template #reference>
                        <button :disabled="aiChatStore.length === 0" class="clear" :class="aiChatStore.length === 0 ? 'disabled' : ''">清空聊天</button>
                    </template>
                </el-popconfirm>
            </div>
            <div class="chatArea" ref="chatArea">
                <div class="emptyShow" v-show="aiChatStore.length === 0">
                    快来和我聊天吧！<i class="ri-bard-line"></i>
                </div>
                <div :class="'chat-' + section.identity" v-for="section of aiChatStore.chatRecords" :key="section.id">
                    <img :src="section.identity === 'user' ? userInfoStore.userInfo.avatar : 'public/logo-frame-color.png'" alt="头像" />
                    <span v-html="md.render(formatContent(section.content))"></span>
                </div>
            </div>
            <div class="magic-column">
                <div class="hint">工具栏</div>
                <div class="prompt" v-show="aiChatStore.chosenPrompt !== ''">
                    <i class="ri-sparkling-line"></i>/{{ aiChatStore.chosenPrompt }}<i class="ri-close-circle-line" @click="aiChatStore.clearChosenPrompt"></i>
                </div>
                <a-dropdown >
                    <i class="ri-image-line"></i>
                    <template #overlay >
                        <a-menu @click="aiChatStore.chooseImageItem" >
                            <a-menu-item v-for="item of imageItems" :key="item.key" :title="item.title">
                                <i :class= "'ri-' + item.icon" style="font-size:small; margin-right:10px;"></i>
                                <span>{{ item.title }}</span>
                            </a-menu-item>
                        </a-menu>
                    </template>
                </a-dropdown>   
                <el-tooltip effect="light" content="语音转文字" placement="top">
                    <i class="ri-folder-music-line" @click="aiChatStore.uploadAudio"></i>
                </el-tooltip>
                <el-tooltip effect="light" content="资源库问答" placement="top">
                    <i class="ri-questionnaire-line" @click="resourceQA"></i>
                </el-tooltip>
                <el-tooltip effect="light" content="文档问答" placement="top">
                    <i class="ri-chat-check-line" @click="openDocList"></i>
                </el-tooltip>
                <el-dialog v-model="docListVisible" :show-close="false" width="75%" top="5vh" modal="true">
                    <template #header="{ close, titleId, titleClass }">
                        <div class="my-header">
                            <h4 :id="titleId" :class="titleClass">请选择一篇文档进行提问</h4>
                            <el-button type="danger" @click="close">关闭</el-button>
                        </div>
                    </template>
                    <doc-list @closeDocListDialog="chooseFinish" :update_doc_list="docListVisible" ></doc-list>
                </el-dialog>  
            </div>
            <div class="input" :class="{focus: focused, lighter: focused}">
                <textarea type="textarea" @focus="focused = true" @blur="focused = false" @keydown="aiChatStore.handleEnter" placeholder="请输入问题..." v-model="aiChatStore.textInput" />
                <div class="selection">
                    <a-dropdown>
                        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M10 8L10.8103 10.1897L13 11L10.8103 11.8103L10 14L9.18973 11.8103L7 11L9.18973 10.1897L10 8Z" fill="currentColor"></path><path d="M13 3L13.5402 4.45982L15 5L13.5402 5.54018L13 7L12.4598 5.54018L11 5L12.4598 4.45982L13 3Z" fill="currentColor"></path><path d="M3.5 1L4.17523 2.82477L6 3.5L4.17523 4.17523L3.5 6L2.82477 4.17523L1 3.5L2.82477 2.82477L3.5 1Z" fill="currentColor"></path><path d="M3.14284 13.2583L9.64284 1.99998" stroke="currentColor" stroke-width="1.3" stroke-linecap="square"></path></svg>
                        <template #overlay>
                            <a-menu @click="aiChatStore.handleChoose">
                                <a-menu-item v-for="item of promptMenuItems" :key="item.key" :title="item.title">
                                    <i :class= "'ri-' + item.icon" style="font-size:small; margin-right:10px;"></i>
                                    <span>{{ item.title.split('-')[0] }}</span>
                                </a-menu-item>
                            </a-menu>
                        </template>
                    </a-dropdown>   
                    <el-tooltip effect="light" content="发送" placement="top">
                        <i class="ri-send-plane-fill" @click="aiChatStore.send"></i>
                    </el-tooltip>
                </div>
            </div>
        </div>
    </div>
</template>

<script lang="ts" setup>
import { ref, reactive, computed, watch,watchEffect, nextTick } from 'vue'
import { ElMessage } from 'element-plus'
import { useSelectionStore, useAIChatStore, useUserInfoStore } from '@/store/index.ts'
import http from '@/utils/request.ts'
import DocList from '@/components/DocList.vue'
import MarkdownIt from 'markdown-it'

const md = new MarkdownIt()
// import { OCRRequest } from '@/api/index.ts'
// import html2canvas from 'html2canvas';
const focused = ref<boolean>(false)
const emit = defineEmits(['toggleChatSize'])
const aiChatStore = useAIChatStore()
const userInfoStore = useUserInfoStore()

// const textInput = ref<string>('')
// 聊天记录
// const chatRecords = reactive([])
// const length = computed(() => chatRecords.length)
// const clearChat = () => {
//     chatRecords.splice(0, length.value)
// }

// const sendType = ref('chat')

// const ocrFormData = ref(new FormData())
// const visionQAFormData = ref(new FormData())
// const audioFormData = ref(new FormData())


// 创建一个input框，用于隐式（不显示在页面中）选择文件
// const createInput = (fileType, apiAddress) => {
//     // 创建一个input框元素，隐藏：
//     // 创建一个 input 元素并添加到 DOM 中
//     const fileInput = document.createElement('input');
//     fileInput.type = 'file';
//     fileInput.accept = `${fileType}/*`; // 限制只能选择图片文件
//     fileInput.style.display = 'none'; // 隐藏 input 元素
//     // 监听文件选择变化
//     fileInput.addEventListener('change', async (event) => {
//         const files = event.target.files;
//         if(sendType.value === 'ocr') {
//             ocrFormData.value.append('file', files[0])
//             console.log(ocrFormData.value)
//             ElMessage({
//                 message: '图片上传成功，请点击发送按钮进行识别',
//                 type: 'success'
//             })
//             textInput.value = '请识别图片中的文字'
//         } else if(sendType.value === 'visionQA') {
//             visionQAFormData.value.append('file', files[0])
//             ElMessage({
//                 message: '图片上传成功，请在输入框输入你的问题，然后点击发送按钮对上传的图片进行提问',
//                 type: 'success'
//             })
//         } else if(sendType.value === 'audio') {
//             audioFormData.value.append('file', files[0])
//             ElMessage({
//                 message: '音频上传成功，请点击发送按钮进行语音转文字',
//                 type: 'success'
//             })
//             textInput.value = '请转换音频中的文字'
//         }
//         console.log(files)
        
//         // 选择完成后移除 input 元素
//         fileInput.remove();
//         // try {
//         //     const res = await http.request({
//         //         url: `/ai/${apiAddress}`,
//         //         method: 'POST',
//         //         data: formData,
//         //         headers: {
//         //             'Content-Type': 'multipart/form-data', // 这行通常是可选的，浏览器会自动处理
//         //         },
//         //         timeout: 10000
//         //     })
//         //     chatRecords.push({
//         //         id: length.value + 1,
//         //         identity: 'ai',
//         //         content: res.data
//         //     })
//         //     console.log(res.data)
//         //     console.log(res.msg)
//         // } catch(error) {
//         //     console.log(error)
//         // }
        
//     });
//     return fileInput;
// }

const captureArea = async () => {
  const canvas = await html2canvas(document.documentElement, {
    x: 0,
    y: 0,
    width: 200,
    height: 200,
  });
  const dataUrl = canvas.toDataURL();
  console.log(dataUrl);
    //   展示出来
  const img = new Image();
    img.src = dataUrl;
    document.body.appendChild(img);

  
  const file = await dataURLtoFile(dataUrl, 'OCR.png');
  console.log(file);
  // 这里可以处理 file 对象，例如上传到服务器
  OCRRequest(file)
};
const dataURLtoFile = async (dataUrl, filename) => {
  const res = await fetch(dataUrl);
  const blob = await res.blob();
  return new File([blob], filename, { type: blob.type });
};

const imageItems = [
    {
        key: 1,
        title: 'OCR识图',
        icon: 'character-recognition-line'
    },
    {
        key: 2,
        title: '图片提问',
        icon: 'questionnaire-line',
    }
]
// 上传图片
// const chooseImageItem = ({ item, key }: { item: string ,key: string }) => {
//     ElMessage.success(`选择了: ${item.title}-${key}`)
//     // 触发点击事件
//     if(key === 1) {
//         sendType.value = 'ocr'
//         const fileInput = createInput('image', 'ocr')
//         fileInput.click();
        
//     }
//     if(key === 2) {
//         ElMessage.success('图片提问')
//         sendType.value = 'visionQA'
//         const fileInput = createInput('image', 'vision')
//         fileInput.click();
//     }
// }
// 上传音频
// const uploadAudio = () => {
//     ElMessage.success('上传音频')
//     sendType.value = 'audio'
//     const fileInput = createInput('audio', 'audio')
//     fileInput.click();
// }
// const system_prompt = ref('你是一个人工智能助手，可以根据我输入的文字返回一些信息')

// prompt的List
const promptMenuItems = ref([
    { key: '1', title: '润色-请对以下文本进行润色，确保语言流畅、用词精准、语法正确;请在润色后的文本保持原意不变，同时改进表达方式，使其更加严谨，科学，大方',color: 'green', icon: 'magic-line' },
    { key: '2', title: '续写-请对以下文本进行续写，确保续写内容与原文风格一致，符合主题连贯，语言流畅的要求。',color: 'yellow', icon: 'edit-line' },
    { key: '3', title: '翻译-请将以下中文文本翻译为英文文本，使用准确、流畅的语言；你只需要返回翻译后的文本。',color: 'red', icon: 'translate' },
    { key: '4', title: '文档排版-请对以下文本进行格式排版，使其结构清晰、段落分明、标题明显。确保每个段落之间有适当的空行，标题使用加粗字体，并将列表项适当缩进。保持原意不变，同时改进排版方式，使其更易于阅读。',color: 'blue', icon: 'file-list-3-line' },
    // { key: '5', title: '纠正语法错误', color: 'purple', icon: 'flashlight-fill' },
    // { key: '6', title: '续写',color: 'pink', icon: 'flashlight-fill'}
])
// 输入框的内容
const selectionStore = useSelectionStore()


watchEffect(() => {
    aiChatStore.setTextInput(selectionStore.selection)
    // aiChatStore.textInput.value = selectionStore.selection
})

// const chosenPrompt = ref<string>('')
// 选择prompt方法
// const handleChoose = ({ item, key }: { item: string, key: string }) => {
//     console.log(key)
//     console.log(item.title.split('-')[0])
//     ElMessage.success(`选择了: ${item.title.split('-')[0]}-${key}`)
//     chosenPrompt.value = item.title.split('-')[0]
//     system_prompt.value = item.title.split('-')[1]  
//     console.log(system_prompt.value)
//     // textInput.value = '/ ' + item.title.split('-')[0] + '\n'
// }

// 滚动到聊天框底部
const chatArea = ref(null)
const scrollToBottom = () => {
    nextTick(() => {
        if (chatArea) {
            chatArea.value.scrollTop = chatArea.value.scrollHeight
        }
    })
}

// 监听 chatRecords 变化
watch(aiChatStore.chatRecords, scrollToBottom, { deep: true })

const formatContent = (content) => {
    // 将换行符替换为 <br> 标签
    
    const result = content.replace(/(\*\*[^*]+\*\*):\s*-\s*/g, '$1:\n- ').replace(/ - /g, '\n- ').replace(/\s*\n\s*\n/g, '\n\n'); // 去除多余的空行
    console.log(content);
    
    return result
}

// 输入框的发送按钮
// const send = async () => {
//     console.log(sendType.value)
//     const user_prompt = textInput.value.trim()
//     textInput.value = ''
//     if(user_prompt === '') {
//         ElMessage.warning('不能输入为空')
//         return
//     }
//     console.log(user_prompt);
//     console.log(sendType.value)
//     if(sendType.value === 'chat'){
        
//         chatRecords.push({
//             id: length.value + 1,
//             identity: 'user',
//             content: user_prompt,
//             system_prompt: system_prompt.value
//         })
//         console.log(system_prompt.value)
//         const sentMessages = []
//         if(length.value === 1) {
//             sentMessages.push({
//                 system_prompt: system_prompt.value,
//                 role: chatRecords.at(-1).identity,
//                 text: user_prompt
//             })
//         } else if(length.value > 1 && length.value < 6){
//             for(let i = 0; i < length.value; i++) {
//                 sentMessages.push({
//                     system_prompt: chatRecords.at(i).system_prompt,
//                     role: chatRecords.at(i).identity === 'user' ? 'user' : 'assistant',
//                     text: chatRecords.at(i).content
//                 })
//             }
//         } else {
//             for(let i = length.value - 5; i < length.value; i++) {
//                 sentMessages.push({
//                     system_prompt: chatRecords.at(i).system_prompt,
//                     role: chatRecords.at(i).identity === 'user' ? 'user' : 'assistant',
//                     text: chatRecords.at(i).content
//                 })
//             }
//         }
//         console.log(sentMessages)

//         try {
//             const res = await http.request({
//                 url: '/ai/stream',
//                 method: 'POST',
//                 data: [...sentMessages],
//                 timeout: 20000
//             })
//             console.log(res.data)
//             // SSE:
//             const eventSource = new EventSource(`https://firlin.cn/api/v1/ai/stream?id=${res.data}`,{ withCredentials: true })
//             // 发送请求：
//             console.log(eventSource)
//             eventSource.onopen = () => {
//                 console.log('连接已建立')
//             };
//             // console.log(eventSource)

//             chatRecords.push({
//                 id: length.value + 1,
//                 identity: 'ai',
//                 content: '',
//                 system_prompt: system_prompt.value
//             })
//             eventSource.onmessage = (event) => {
//                 console.log(event.data)
//                 // console.log(JSON.parse(event.data))
//                 // console.log(1)
//                 // 每个字延迟20ms加入：
//                 let timer = setInterval(() => {
//                     if(event.data === '') {
//                         chatRecords.at(-1).content += ' '
//                         clearInterval(timer)
//                     }
//                     chatRecords.at(-1).content += event.data
//                     console.log(chatRecords.at(-1).content)
//                     clearInterval(timer)
//                 }, 20)
//                 // chatRecords.at(-1).content += JSON.parse(event.data).data
                
//             }
//             eventSource.onerror = (event) => {
//                 console.log(event)
//                 console.log('连接已断开')
//                 eventSource.close()
//             }
//             // chatRecords.push({
//             //     id: length.value + 1,
//             //     identity: 'ai',
//             //     content: res.data
//             // })
//             // console.log(res)
//             // ElMessage.success(textInput.value)
//             // ElMessage.success(res.msg)
//             // ElMessage.success(res.data)
//         } catch (error) {
//             ElMessage.error('请求失败')
//             console.log(error)
//         }
//     } else if(sendType.value === 'ocr') {
//         chatRecords.push({
//             id: length.value + 1,
//             identity: 'user',
//             content: user_prompt,
//             system_prompt: '你需要识别图片中的文字'
//         })
//         try {
//             const res = await http.request({
//                 url: '/ai/ocr',
//                 method: 'POST',
//                 data: ocrFormData.value,
//                 headers: {
//                     'Content-Type': 'multipart/form-data', // 这行通常是可选的，浏览器会自动处理
//                 },
//                 timeout: 15000
//             })
//             chatRecords.push({
//                 id: length.value + 1,
//                 identity: 'ai',
//                 content: res.data,
//                 system_prompt: '你需要识别图片中的文字'
//             })
//             console.log(res.data)
//             console.log(res.msg)
//         } catch(error) {
//             console.log(error)
//         } finally {
//             // 清空数据
//             for (const [key] of ocrFormData.value.entries()) {
//                 ocrFormData.value.delete(key);
//             }
//             sendType.value = 'chat'
//         }
//     } else if(sendType.value === 'visionQA') {
//         chatRecords.push({
//             id: length.value + 1,
//             identity: 'user',
//             content: user_prompt,
//             system_prompt: '你需要分析图片并回答我提的问题'
//         })
//         try {
//             visionQAFormData.value.append('user_prompt', user_prompt)
//             const res = await http.request({
//                 url: '/ai/vision',
//                 method: 'POST',
//                 data: visionQAFormData.value,
//                 headers: {
//                     'Content-Type': 'multipart/form-data', // 这行通常是可选的，浏览器会自动处理
//                 },
//                 timeout: 30000
//             })
//             chatRecords.push({
//                 id: length.value + 1,
//                 identity: 'ai',
//                 content: res.data,
//                 system_prompt: '你需要分析图片并回答我提的问题'
//             })
//             console.log(res.data)
//             console.log(res.msg)
//         } catch(error) {
//             console.log(error)
//         } finally {
//             // 清空数据
//             for (const [key] of visionQAFormData.value.entries()) {
//                 visionQAFormData.value.delete(key);
//             }
//             sendType.value = 'chat'
//         }
//     } else if(sendType.value === 'audio') {
//         chatRecords.push({
//             id: length.value + 1,
//             identity: 'user',
//             content: user_prompt,
//             system_prompt: '你需要转换音频中的文字'
//         })
//         try {
//             const res = await http.request({
//                 url: '/ai/audio',
//                 method: 'POST',
//                 data: audioFormData.value,
//                 headers: {
//                     'Content-Type': 'multipart/form-data', // 这行通常是可选的，浏览器会自动处理
//                 },
//                 timeout: 30000
//             })
//             chatRecords.push({
//                 id: length.value + 1,
//                 identity: 'ai',
//                 content: res.data,
//                 system_prompt: '你需要转换音频中的文字'
//             })
//             console.log(res.data)
//             console.log(res.msg)
//         } catch(error) {
//             console.log(error)
//         } finally {
//             // 清空数据
//             for (const [key] of audioFormData.value.entries()) {
//                 audioFormData.value.delete(key);
//             }
//             sendType.value = 'chat'
//         }
//     }
    


// }

// const handleEnter = (e) => {
//     if(e.key === 'Enter' && !e.shiftKey) {
//         e.preventDefault()
//         send()
//     }
// }


const resourceQA = () => {
    aiChatStore.setChosenPrompt('资源库问答')
    ElMessage({
        message: '请在输入框输入你的问题，然后点击发送按钮对资源库进行提问',
        type: 'success'
    })
}

const docListVisible = ref(false)
const openDocList = () => {
    docListVisible.value = true
}
const chooseFinish = async (id) => {
    docListVisible.value = false
    try {
        const vectoringResult = await http.request({
            url: '/rag/doc',
            method: 'POST',
            data: {
                doc_id: id
            }
        })
        console.log(vectoringResult);
        
        if(vectoringResult.code === 0) {
            ElMessage({
                message: '文档解析成功，请在输入框输入问题对文档进行提问',
                type: 'success'
            })
            aiChatStore.setQueryDocId(id)
            aiChatStore.setChosenPrompt('文档问答')
        } else {
            ElMessage({
                message: '文档解析失败，请重新选择文档',
                type: 'error'
            })
        }
    } catch(error) {
        console.log(error)
    }
}
</script>

<style lang="scss" scoped>
.root {
    // background-color:#F7F7F7;
    height: 61%;
    margin:5px;
    margin-left:0;
    padding:5px;
    .container {
        background-color:white;
        height:100%;
        border-radius:10px;
        border: 1px solid #F7F7F7;
        box-shadow: 0 0 5px 1px rgba(0, 0, 0, 0.1);
        padding:5px;
        position: relative;
        display: flex;
        flex-direction:column;
        justify-content:space-between;
        align-items:center;

        .header {
            width: 100%;
            display: flex;
            justify-content: space-between;
            align-items: center;
            i {
                font-sie:18px !important;
                cursor:pointer;
                padding: 0 3px;
                border-radius: 5px;
                margin-right:10px;
                transition: all .3s ease-in-out;
                &:hover {
                    background-color: #E5E5E5;
                }
            }
            h5 {
                font-size:16px;
                letter-spacing: 0.1em;
                text-align:center;
                margin-bottom: 0;
                i {
                    color: #8A57EA;
                }
            }
            button.clear {
                position: static;
                padding: 5px;
                height: 28px;
                font-size: 9px;
                cursor:pointer;
                color:#959595;
                transition: all .3s ease-in-out;
                &:hover {
                    color: #8A57EA;
                }
            }
        }
        
        
        .chatArea {
            position: relative;
            width: 100%;
            height: 70%;
            padding: 5px;
            background-color: #F4F4F4;
            border-radius: 10px;
            border: 1px solid transparent;
            overflow-y: auto;
            scrollbar-color: #C6C6C6 #F7F7F7;
            scrollbar-width: 2px;
            transition: all .3s ease-in-out;
            scrollbar-arrow: none;
            &::-webkit-scrollbar {
                width: 20px;
            }
            &::-webkit-scrollbar-track {
                background: #F7F7F7;
                border-radius: 10px;
            }
            &::-webkit-scrollbar-thumb {
                background-color: #C6C6C6;
                border-radius: 10px;
                border: 2px solid #F7F7F7;
            }
            &::-webkit-scrollbar-thumb:hover {
                background-color: #A0A0A0;
            }

            .emptyShow {
                position: absolute;
                top: 50%;
                left: 50%;
                transform: translate(-50%, -50%);
                font-size: 15px;
                color: #C6C6C6;
                cursor: default;
                user-select: none;
            }

            .chat-ai, .chat-user {
                margin: 10px 0;
                display:flex;
                align-items:flex-start !important;
                img {
                    width: 20px;
                    height: 20px;
                    border-radius: 50%;
                    margin-top:5px !important;
                    margin: 0 5px;
                }
                span {
                    background-color: #F7F7F7;
                    padding: 5px;
                    font-size:12px;
                    letter-spacing: 0.05em;
                    border-radius: 6px;
                    border: 1px solid #F7F7F7;
                    box-shadow: 0 0 5px 1px rgba(85, 85, 85, 0.1);
                    max-width: 80%;
                    // 断行
                    word-break: break-all;
                    // 允许在任意字符间断行
                    hyphens: auto;
                    scrollbar-color: #C6C6C6 #F7F7F7;
                    scrollbar-width: 2px;
                    transition: all .3s ease-in-out;
                    animation: fade .5s ease-in-out;
                }
            }

            .chat-ai {
                justify-content:flex-start;
                align-items:center;
            }

            .chat-user {
                flex-direction: row-reverse;
                justify-content:flex-start;
            }

            @keyframes fade {
                0% {
                    opacity: 0;
                }
                100% {
                    opacity: 1;
                }
            }
        }

        .magic-column {
            position: relative;
            width: 100%;
            height: 30px;
            display:flex;
            justify-content:flex-end;
            align-items:center;
            // margin-right:5px;
            // border: 2px dotted grey;
            border-radius: 6px;
            // margin: 5px 0;

            .hint {
                position: absolute;
                left: 50%;
                transform: translateX(-50%);
                font-size: 10px;
                letter-spacing: 2px;
                color: rgb(181, 180, 180);
                user-select: none;  
                cursor: default;
                z-index: 10;
            }

            .prompt {
                position: absolute;
                left: 1%;
                display: flex;
                align-items: flex-start;
                background-color: #F7F7F7;
                border-radius: 8px;
                font-size: 13px;
                color: #8A57EA;
                cursor: default;
                transition: all .3s ease-in-out !important;

                i {
                    font-size: 15px;
                    &:first-child {
                        margin-left:2px;
                        margin-right: 3px;
                        color: #8A57EA;
                        cursor: default;
                    }
                    &:last-child {
                        margin-left: 5px;
                        cursor: pointer;
                        transition: all .3s ease-in-out;
                        &:hover {
                            color: #FF0000;
                        }
                    }
                }

                &:hover {
                    background-color: #E5E5E5;
                }
            }

            i {
                margin-right:2px;
                cursor:pointer;
                font-size:23px;
                color:#959595;
                transition: all .3s ease-in-out;
                &:hover {
                    color: #8A57EA;
                }
            }

        }
        .input {
            // position: absolute;
            // bottom: 1%;
            background-color: #F7F7F7;
            border: 1px solid transparent;
            border-radius: 10px;
            width: 100%;
            padding: 5px;
            // height: 60px;
            max-height:20%;
            display: flex;
            flex-direction: column;
            transition: all .3s ease-in-out;
            textarea {
                width: 100%;
                height: 80px;
                border: none;
                border-radius:10px 10px 0 0;
                background-color:#F7F7F7;
                outline: none;
                color: #000;
                font-size:14px;
                resize:none;
                overflow-y:auto;
                word-break: break-all;
                /* 允许在任意字符间断行 */
                hyphens: auto;
                /* 允许自动连字符 */
                scrollbar-color: #C6C6C6 #F7F7F7;
                scrollbar-width: 2px;
                transition: all .3s ease-in-out;
                scrollbar-arrow: none;
                &::placeholder {
                    font-size:14px;
                    color: #C6C6C6;
                }
                /* Custom Scrollbar */
                &::-webkit-scrollbar {
                    width: 20px;
                }
                &::-webkit-scrollbar-track {
                    background: #F7F7F7;
                    border-radius: 10px;
                }
                &::-webkit-scrollbar-thumb {
                    background-color: #C6C6C6;
                    border-radius: 10px;
                    border: 2px solid #F7F7F7;
                }
                &::-webkit-scrollbar-thumb:hover {
                    background-color: #A0A0A0;
                }
            }
            textarea:focus {
                outline:none;
                background-color:#fff;
            }
            .selection {
                position:relative;
                display:flex;
                justify-content:flex-start;
                align-items: center;
                margin-top:5px;
                width: 100%;
                // background-color: #989898;
                
                
                svg {
                    border:none;
                    outline:none;
                    margin-top: 9px;
                    margin-right:5px;
                    cursor:pointer;
                    color:#959595;
                    &:hover {
                        color: #8453DF;
                    }
                }
                i {
                    cursor:pointer;
                    font-size:17px;
                    color:#959595;
                    // transform: translateY(3px);
                    &:hover {
                        color: #8453DF;
                    }
                }
                i.ri-send-plane-fill {
                    position: absolute;
                    right: 10px;
                }
            }
            
        }
        .focus {
            border: 1px solid #C6C6C6;
            // box-shadow: 0 0 5px 1px rgba(0, 0, 0, 0.1);
        }
        .lighter {
            background-color: #FFF;
        }
    }
}
.ant-dropdown:first-of-type .ant-dropdown-menu {
    margin-bottom:-5px;   
}


button {
  position: absolute;
  top: 0;
  right: 0;
  z-index: 10;
}

.disabled {
    cursor: not-allowed;
    color: #C6C6C6;
    &:hover {
        color: #C6C6C6;
    }
}

.my-header {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  gap: 10px;

  button {
    position: static;
  }
}
</style>