// i18n.js
import { createI18n } from 'vue-i18n'

const messages = {
  en: {
    message: {
      hello: 'hello world'
    }
  },
  ko: {
    message: {
      hello: '안녕하세요'
    }
  },
  ja: {
    message: {
      hello: 'こんにちは世界'
    }
  },
  fr: {
    message: {
      hello: 'Bonjour le monde'
    }
  },
  de: {
    message: {
      hello: 'Hallo Welt'
    }
  },
  es: {
    message: {
      hello: 'Hola Mundo'
    }
  },
  pt: {
    message: {
      hello: 'Olá Mundo'
    }
  }
}

const i18n = createI18n({
  locale: 'en', // 默认语言
  fallbackLocale: 'en', // 回退语言
  messages,
})

export default i18n
