import http from '@/utils/request'

// OCR接口：
export const OCRRequest = async (file: File) => {
    const formData = new FormData()
    formData.append('file', file)
    try {
    const res = await http.request({
        url: '/ai/ocr',
        method: 'POST',
        data: formData,
        headers: {
            'Content-Type': 'multipart/form-data', // 这行通常是可选的，浏览器会自动处理
        },
        timeout: 10000
    })
    console.log(res.data)
    console.log(res.msg)
    } catch(error) {
    console.log(error)
    }
}

