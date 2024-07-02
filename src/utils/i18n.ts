// 定义消息结构的接口
interface MessageStructure {
  hello: string;
}

// 定义每个语言的消息接口
interface Messages {
  en: MessageStructure;
  ko: MessageStructure;
  ja: MessageStructure;
  fr: MessageStructure;
  de: MessageStructure;
  es: MessageStructure;
  pt: MessageStructure;
}

// 创建I18n配置接口
interface I18nOptions {
  locale: string;
  fallbackLocale: string;
  messages: Messages;
}

// 引入 createI18n 函数
import { createI18n } from 'vue-i18n';

// 定义 messages 对象并类型化
const messages: Messages = {
  en: {
    hello: 'hello world',
  },
  ko: {
    hello: '안녕하세요',
  },
  ja: {
    hello: 'こんにちは世界',
  },
  fr: {
    hello: 'Bonjour le monde',
  },
  de: {
    hello: 'Hallo Welt',
  },
  es: {
    hello: 'Hola Mundo',
  },
  pt: {
    hello: 'Olá Mundo',
  },
};

// 创建 i18n 实例并类型化
const i18n = createI18n<I18nOptions>({
  locale: 'en', // 默认语言
  fallbackLocale: 'en', // 回退语言
  messages,
});

export default i18n;