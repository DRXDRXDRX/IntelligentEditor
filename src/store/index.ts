import { defineStore} from 'pinia'
import { h, ref,reactive, type Component, computed } from 'vue'
import { ElMessage } from 'element-plus'
import http from '@/utils/request.ts'


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

export const useDocIdStore = defineStore('docId', () => {
  const docId = ref('')
  const docTitle = ref('')
  const setDocId = (data) => {
    docId.value = data
  }
  const setDocTitle = title => {
    docTitle.value = title
  }
  return {
    docId,
    docTitle,
    setDocId,
    setDocTitle
  }
})

export const useMarkdownStore = defineStore('markdown', () => {
  const markdown = ref('')
  const setMarkdown = (data) => {
    markdown.value = data
  }
  return {
    markdown,
    setMarkdown
  }
})

// AI聊天的store
export const useAIChatStore = defineStore('aiChat', () => {
  // 聊天记录
  const chatRecords = reactive([]);
  const length = computed(() => chatRecords.length);
  const sendType = ref('chat');
  const ocrFormData = ref(new FormData());
  const visionQAFormData = ref(new FormData());
  const audioFormData = ref(new FormData());
  const system_prompt = ref('你是一个人工智能助手，可以根据我输入的文字返回一些信息');
  const textInput = ref('');
  const chosenPrompt = ref<string>('');
  const queryDocId = ref<string>('');

  const setQueryDocId = (data) => {
    queryDocId.value = data
  }

  const setTextInput = (data) => {
    textInput.value = data
  }

  const clearChosenPrompt = () => {
    chosenPrompt.value = '';
  }

  const setChosenPrompt = (data) => {
    chosenPrompt.value = data;
  }

  const addToChatRecords = (data) => {
    chatRecords.push(data);
  };

  const clearChatRecords = () => {
    chatRecords.splice(0, length.value);
  };

  const createInput = (fileType, apiAddress) => {
    const fileInput = document.createElement('input');
    fileInput.type = 'file';
    fileInput.accept = `${fileType}/*`;
    fileInput.style.display = 'none';
    fileInput.addEventListener('change', async (event) => {
      const files = event?.target.files;
      if (sendType.value === 'ocr') {
        ocrFormData.value.append('file', files[0]);
        ElMessage.success('图片上传成功，请点击发送按钮进行识别');
        textInput.value = '请识别图片中的文字';
      } else if (sendType.value === 'visionQA') {
        visionQAFormData.value.append('file', files[0]);
        ElMessage.success('图片上传成功，请在输入框输入你的问题，然后点击发送按钮对上传的图片进行提问');
      } else if (sendType.value === 'audio') {
        audioFormData.value.append('file', files[0]);
        ElMessage.success('音频上传成功，请点击发送按钮进行语音转文字');
        textInput.value = '请转换音频中的文字';
      }
      fileInput.remove();
    });
    return fileInput;
  };

  const chooseImageItem = ({ item, key }) => {
    ElMessage.success(`选择了: ${item.title}-${key}`);
    if (key === 1) {
      sendType.value = 'ocr';
      const fileInput = createInput('image', 'ocr');
      fileInput.click();
    } else if (key === 2) {
      sendType.value = 'visionQA';
      const fileInput = createInput('image', 'vision');
      fileInput.click();
    }
  };

  const uploadAudio = () => {
    ElMessage.success('上传音频');
    sendType.value = 'audio';
    const fileInput = createInput('audio', 'audio');
    fileInput.click();
  };

  const handleChoose = ({ item, key }) => {
    ElMessage.success(`选择了: ${item.title.split('-')[0]}-${key}`);
    chosenPrompt.value = item.title.split('-')[0];
    system_prompt.value = item.title.split('-')[1];
  };

  // 输入框的发送按钮
  const send = async () => {
    console.log(sendType.value)
    const user_prompt = textInput.value.trim()
    textInput.value = ''
    if(user_prompt === '') {
        ElMessage.warning('不能输入为空')
        return
    }
    console.log(user_prompt);
    console.log(sendType.value)
    if(sendType.value === 'chat'){
      if(chosenPrompt.value === '资源库问答'){
        try {
          const queryResult = await http.request({
            url: '/rag/query',
            method: 'POST',
            data: {
                query: user_prompt
            }
          })
          console.log(queryResult.data)
          // const queryText = queryResult.data.reduce((text, item) => text + item.text + '\n', '')
          system_prompt.value = '请你基于我给定内容(来自我的资料库)回答问题，给定内容为：' + JSON.stringify(queryResult.data)
        } catch (error) {
          console.log(error)
        }
      }

      if(chosenPrompt.value === '文档问答') {
        try {
          const queryResult = await http.request({
            url: '/rag/query',
            method: 'POST',
            data: {
                query: user_prompt,
                doc_id: queryDocId.value
            }
          })
          console.log(queryResult.data)
          system_prompt.value = '请你基于我给定内容回答问题，给定内容为：' + JSON.stringify(queryResult.data)
        } catch (error) {
          console.log(error)
        }
      }
      chatRecords.push({
          id: length.value + 1,
          identity: 'user',
          content: user_prompt,
          system_prompt: system_prompt.value
      })
      console.log(system_prompt.value)
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
              console.log(chatRecords.at(-1).content);
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
    } else if(sendType.value === 'ocr') {
        chatRecords.push({
            id: length.value + 1,
            identity: 'user',
            content: user_prompt,
            system_prompt: '你需要识别图片中的文字'
        })
        try {
            const res = await http.request({
                url: '/ai/ocr',
                method: 'POST',
                data: ocrFormData.value,
                headers: {
                    'Content-Type': 'multipart/form-data', // 这行通常是可选的，浏览器会自动处理
                },
                timeout: 15000
            })
            chatRecords.push({
                id: length.value + 1,
                identity: 'ai',
                content: res.data,
                system_prompt: '你需要识别图片中的文字'
            })
            console.log(res.data)
            console.log(res.msg)
        } catch(error) {
            console.log(error)
        } finally {
            // 清空数据
            for (const [key] of ocrFormData.value.entries()) {
                ocrFormData.value.delete(key);
            }
            sendType.value = 'chat'
        }
    } else if(sendType.value === 'visionQA') {
        chatRecords.push({
            id: length.value + 1,
            identity: 'user',
            content: user_prompt,
            system_prompt: '你需要分析图片并回答我提的问题'
        })
        try {
            visionQAFormData.value.append('user_prompt', user_prompt)
            const res = await http.request({
                url: '/ai/vision',
                method: 'POST',
                data: visionQAFormData.value,
                headers: {
                    'Content-Type': 'multipart/form-data', // 这行通常是可选的，浏览器会自动处理
                },
                timeout: 30000
            })
            chatRecords.push({
                id: length.value + 1,
                identity: 'ai',
                content: res.data,
                system_prompt: '你需要分析图片并回答我提的问题'
            })
            console.log(res.data)
            console.log(res.msg)
        } catch(error) {
            console.log(error)
        } finally {
            // 清空数据
            for (const [key] of visionQAFormData.value.entries()) {
                visionQAFormData.value.delete(key);
            }
            sendType.value = 'chat'
        }
    } else if(sendType.value === 'audio') {
        chatRecords.push({
            id: length.value + 1,
            identity: 'user',
            content: user_prompt,
            system_prompt: '你需要转换音频中的文字'
        })
        try {
            const res = await http.request({
                url: '/ai/audio',
                method: 'POST',
                data: audioFormData.value,
                headers: {
                    'Content-Type': 'multipart/form-data', // 这行通常是可选的，浏览器会自动处理
                },
                timeout: 30000
            })
            chatRecords.push({
                id: length.value + 1,
                identity: 'ai',
                content: res.data,
                system_prompt: '你需要转换音频中的文字'
            })
            console.log(res.data)
            console.log(res.msg)
        } catch(error) {
            console.log(error)
        } finally {
            // 清空数据
            for (const [key] of audioFormData.value.entries()) {
                audioFormData.value.delete(key);
            }
            sendType.value = 'chat'
        }
    }
  }

  const handleEnter = (e) => {
    if(e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault()
        send()
    }
  }

  return {
    chatRecords,
    addToChatRecords,
    clearChatRecords,
    length,
    chooseImageItem,
    uploadAudio,
    handleChoose,
    send,
    textInput,
    setTextInput,
    handleEnter,
    chosenPrompt,
    clearChosenPrompt,
    setChosenPrompt,
    system_prompt,
    setQueryDocId
  }
})

// 用户信息
export const useUserInfoStore = defineStore('userInfo', () => {
  interface UserInfo {
    username: string;
    email: string;
    avatar: string;
    vip: boolean;
  }
  const userInfo = reactive<UserInfo>({
    username: '',
    email: '',
    avatar: '',
    vip: false
  });
  const setUserName = (data:string) => {
    userInfo.username = data;
  }
  const setEmail = (data:string) => {
    userInfo.email = data;
  }
  const setAvatar = (data:string) => {
    userInfo.avatar = data;
  }
  const setVip = (data:boolean) => {
    userInfo.vip = data;
  }

  return {
    userInfo,
    setUserName,
    setEmail,
    setAvatar,
    setVip    
  };
})