import { Bot, Context } from 'grammy'

if (!process.env.NEXT_PUBLIC_TELEGRAM_BOT_TOKEN_AI_KOSHEY) {
  throw new Error('NEXT_PUBLIC_TELEGRAM_BOT_TOKEN_AI_KOSHEY is not set')
}
if (!process.env.NEXT_PUBLIC_TELEGRAM_BOT_TOKEN_AI_KOSHEY_TEST) {
  throw new Error('NEXT_PUBLIC_TELEGRAM_BOT_TOKEN_AI_KOSHEY_TEST is not set')
}

const tokenProd = process.env.NEXT_PUBLIC_TELEGRAM_BOT_TOKEN_AI_KOSHEY
const tokenTest = process.env.NEXT_PUBLIC_TELEGRAM_BOT_TOKEN_AI_KOSHEY_TEST

export const tokenAiKoshey =
  process.env.NODE_ENV === 'development' ? tokenTest : tokenProd

console.log(tokenAiKoshey, 'tokenAiKoshey')
export const botAiKoshey = new Bot<Context>(tokenAiKoshey)
