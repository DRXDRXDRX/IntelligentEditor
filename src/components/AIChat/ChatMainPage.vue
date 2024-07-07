<template>
    <div class="root">
        <div class="container" >
            <h5>无界智灵<i class="ri-bard-line"></i></h5>
            <el-popconfirm title="确认清空吗？" confirm-button-text="确认" cancel-button-text="手滑了" cancel-button-type="info" @confirm="clearChat" >
                <template #reference>
                    <button :disabled="length === 0" class="clear" :class="length === 0 ? 'disabled' : ''">清空聊天</button>
                </template>
            </el-popconfirm>
            <div class="chatArea" ref="chatArea">
                <div class="emptyShow" v-show="length === 0">
                    快来和我聊天吧！<i class="ri-bard-line"></i>
                </div>
                <div :class="'chat-' + section.identity" v-for="section of chatRecords" :key="section.id">
                    <img :src="section.identity === 'user' ? 'public/user_avatar/1.png' : 'public/user_avatar/1.png'" alt="头像" />
                    <span v-html="formatContent(section.content)"></span>
                </div>
            </div>
            <div class="magic-column">
                <div class="hint">工具栏</div>
                <div class="prompt" v-show="chosenPrompt !== ''">
                    <i class="ri-sparkling-line"></i>/{{ chosenPrompt }}<i class="ri-close-circle-line" @click="chosenPrompt = ''"></i>
                </div>
                <a-dropdown>
                    <i class="ri-image-line"></i>
                    <template #overlay>
                        <a-menu @click="chooseImageItem">
                            <a-menu-item v-for="item of imageItems" :key="item.key" :title="item.title">
                                <i :class= "'ri-' + item.icon" style="font-size:small; margin-right:10px;"></i>
                                <span>{{ item.title }}</span>
                            </a-menu-item>
                        </a-menu>
                    </template>
                </a-dropdown>   
                <el-tooltip effect="light" content="语言转文字" placement="top">
                    <i class="ri-folder-music-line" @click="uploadAudio"></i>
                </el-tooltip>
            </div>
            <div class="input" :class="{focus: focused, lighter: focused}">
                <textarea type="textarea" @focus="focused = true" @blur="focused = false" @keydown="handleEnter" placeholder="请输入问题..." v-model="textInput" />
                <div class="selection">
                    <a-dropdown>
                        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M10 8L10.8103 10.1897L13 11L10.8103 11.8103L10 14L9.18973 11.8103L7 11L9.18973 10.1897L10 8Z" fill="currentColor"></path><path d="M13 3L13.5402 4.45982L15 5L13.5402 5.54018L13 7L12.4598 5.54018L11 5L12.4598 4.45982L13 3Z" fill="currentColor"></path><path d="M3.5 1L4.17523 2.82477L6 3.5L4.17523 4.17523L3.5 6L2.82477 4.17523L1 3.5L2.82477 2.82477L3.5 1Z" fill="currentColor"></path><path d="M3.14284 13.2583L9.64284 1.99998" stroke="currentColor" stroke-width="1.3" stroke-linecap="square"></path></svg>
                        <template #overlay>
                            <a-menu @click="handleChoose">
                                <a-menu-item v-for="item of promptMenuItems" :key="item.key" :title="item.title">
                                    <i :class= "'ri-' + item.icon" style="font-size:small; margin-right:10px;"></i>
                                    <span>{{ item.title.split('-')[0] }}</span>
                                </a-menu-item>
                            </a-menu>
                        </template>
                    </a-dropdown>   
                    <el-tooltip effect="light" content="发送" placement="top">
                        <i class="ri-send-plane-fill" @click="send"></i>
                    </el-tooltip>
                </div>
            </div>
        </div>
    </div>
</template>

<script lang="ts" setup>
import { ref, reactive, computed, inject, watch,watchEffect, nextTick } from 'vue'
import { ElMessage } from 'element-plus'
import { useSelectionStore } from '@/store/index.ts'
import http from '@/utils/request.ts'
import { OCRRequest } from '@/api/index.ts'
import html2canvas from 'html2canvas';
const focused = ref<boolean>(false)


// 聊天记录
const chatRecords = reactive([
    // {
    //     id: 1,
    //     identity: 'user',
    //     content: '你好111111111111111111111111111111111111111111111111111111111111111111111111111111'
    // },
    // {
    //     id: 2,
    //     identity: 'ai',
    //     content: '你好，我是你的人工智能助手，有什么可以帮助你的吗？'
    // },
    // {
    //     id: 3,
    //     identity: 'user',
    //     content: '我想问一些问题'
    // },
    // {
    //     id: 4,
    //     identity: 'ai',
    //     content: '好的，请问'
    // },
    // {
    //     id: 5,
    //     identity: 'user',
    //     content: '你是谁？'
    // },
    // {
    //     id: 6,
    //     identity: 'ai',
    //     content: '我是一个人工智能助手，可以根据我输入的文字返回一些信息'
    // }
])
const length = computed(() => chatRecords.length)
const clearChat = () => {
    chatRecords.splice(0, length.value)
}


// 创建一个input框，用于隐式（不显示在页面中）选择文件
const createInput = (fileType, apiAddress) => {
    // 创建一个input框元素，隐藏：
    // 创建一个 input 元素并添加到 DOM 中
    const fileInput = document.createElement('input');
    fileInput.type = 'file';
    fileInput.accept = `${fileType}/*`; // 限制只能选择图片文件
    fileInput.style.display = 'none'; // 隐藏 input 元素
    // 监听文件选择变化
    fileInput.addEventListener('change', async (event) => {
        const files = event.target.files;
        const formData = new FormData()
        formData.append('file', files[0])
        // 选择完成后移除 input 元素
        fileInput.remove();
        try {
            const res = await http.request({
                url: `/ai/${apiAddress}`,
                method: 'POST',
                data: formData,
                headers: {
                    'Content-Type': 'multipart/form-data', // 这行通常是可选的，浏览器会自动处理
                },
                timeout: 10000
            })
            chatRecords.push({
                id: length.value + 1,
                identity: 'ai',
                content: res.data
            })
            console.log(res.data)
            console.log(res.msg)
        } catch(error) {
            console.log(error)
        }
        
    });
    return fileInput;
}

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
    },
    {
        key: 3,
        title: '截图识别',
        icon: 'screenshot-line'
    }
]
// 上传图片
const chooseImageItem = ({ item, key }: { item: string ,key: string }) => {
    ElMessage.success(`选择了: ${item.title}-${key}`)
    const fileInput = createInput('image', 'ocr')
    // 触发点击事件
    if(key === 1) {
        fileInput.click();
    }
    if(key === 3) {
        ElMessage.success('截图识别')
        captureArea()
    }
}
// 上传音频
const uploadAudio = () => {
    ElMessage.success('上传音频')
    const fileInput = createInput('audio', 'audio')
    fileInput.click();
}
const system_prompt = ref('你是一个人工智能助手，可以根据我输入的文字返回一些信息')
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

const textInput = ref<string>('')
watchEffect(() => {
    textInput.value = selectionStore.selection
})
const chosenPrompt = ref<string>('')
// 选择prompt方法
const handleChoose = ({ item, key }: { item: string, key: string }) => {
    console.log(key)
    console.log(item.title.split('-')[0])
    ElMessage.success(`选择了: ${item.title.split('-')[0]}-${key}`)
    chosenPrompt.value = item.title.split('-')[0]
    system_prompt.value = item.title.split('-')[1]  
    console.log(system_prompt.value)
    // textInput.value = '/ ' + item.title.split('-')[0] + '\n'
}

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
watch(chatRecords, scrollToBottom, { deep: true })

const formatContent = (content) => {
    // 将换行符替换为 <br> 标签
    return content.replace(/\n/g, '<br>');
}

// 输入框的发送按钮
const send = async () => {
    const user_prompt = textInput.value.trim()
    textInput.value = ''
    if(user_prompt === '') {
        ElMessage.warning('不能输入为空')
        return
    }
    console.log(user_prompt);
    chatRecords.push({
        id: length.value + 1,
        identity: 'user',
        content: user_prompt,
        system_prompt: system_prompt.value
    })
    console.log(system_prompt.value)

    // try {
    //     const res = await http.request({
    //         url: '/ai/generate',
    //         method: 'POST',
    //         data: {
    //             user_prompt,
    //             system_prompt: system_prompt.value
    //         },
    //         timeout: 20000
    //     })
    //     chatRecords.push({
    //         id: length.value + 1,
    //         identity: 'ai',
    //         content: res.data
    //     })
    //     console.log(res)
    //     ElMessage.success(textInput.value)
    //     ElMessage.success(res.msg)
    //     ElMessage.success(res.data)
    // } catch (error) {
    //     ElMessage.error('请求失败')
    //     console.log(error)
    // }
    const sentMessages = []
    if(length.value === 1) {
        sentMessages.push({
            system_prompt: system_prompt.value,
            role: chatRecords.at(-1).identity,
            text: user_prompt
        })
    } else if(length.value > 1 && length.value < 6){
        for(let i = 0; i < length.value; i++) {
            sentMessages.push({
                system_prompt: chatRecords.at(i).system_prompt,
                role: chatRecords.at(i).identity === 'user' ? 'user' : 'assistant',
                text: chatRecords.at(i).content
            })
        }
    } else {
        for(let i = length.value - 5; i < length.value; i++) {
            sentMessages.push({
                system_prompt: chatRecords.at(i).system_prompt,
                role: chatRecords.at(i).identity === 'user' ? 'user' : 'assistant',
                text: chatRecords.at(i).content
            })
        }
    }
    console.log(sentMessages)

    try {
        const res = await http.request({
            url: '/ai/stream',
            method: 'POST',
            data: [...sentMessages],
            timeout: 20000
        })
        console.log(res.data)
        // SSE:
        const eventSource = new EventSource(`https://firlin.cn/api/v1/ai/stream?id=${res.data}`,{ withCredentials: true })
        // 发送请求：
        console.log(eventSource)
        eventSource.onopen = () => {
            console.log('连接已建立')
        };
        // console.log(eventSource)

        chatRecords.push({
            id: length.value + 1,
            identity: 'ai',
            content: '',
            system_prompt: system_prompt.value
        })
        eventSource.onmessage = (event) => {
            console.log(event.data)
            // console.log(JSON.parse(event.data))
            // console.log(1)
            // 每个字延迟20ms加入：
            let timer = setInterval(() => {
                if(event.data === '') {
                    chatRecords.at(-1).content += ' '
                    clearInterval(timer)
                }
                chatRecords.at(-1).content += event.data
                console.log(chatRecords.at(-1).content)
                clearInterval(timer)
            }, 20)
            // chatRecords.at(-1).content += JSON.parse(event.data).data
            
        }
        eventSource.onerror = (event) => {
            console.log(event)
            console.log('连接已断开')
            eventSource.close()
        }
        // chatRecords.push({
        //     id: length.value + 1,
        //     identity: 'ai',
        //     content: res.data
        // })
        // console.log(res)
        // ElMessage.success(textInput.value)
        // ElMessage.success(res.msg)
        // ElMessage.success(res.data)
    } catch (error) {
        ElMessage.error('请求失败')
        console.log(error)
    }


    

}

const handleEnter = (e) => {
    if(e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault()
        send()
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
        justify-content:flex-end;
        align-items:center;
        
        h5 {
            position: absolute;
            top: 1%;
            font-size:16px;
            letter-spacing: 0.1em;
            text-align:center;
            i {
                color: #8A57EA;
            }
        }

        .clear {
            position: absolute;
            top: 1.5%;
            right: 1%;
            font-size: 9px;
            cursor:pointer;
            color:#959595;
            transition: all .3s ease-in-out;
            &:hover {
                color: #8A57EA;
            }
        }

        .chatArea {
            position: relative;
            width: 100%;
            height: 61%;
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
            width: 96%;
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
            width: 96%;
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
</style>