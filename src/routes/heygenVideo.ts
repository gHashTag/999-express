import { Router } from 'express'
import cors from 'cors'
import fs from 'fs'
import path from 'path'
import { InputFile } from 'grammy'
// @ts-ignore
import ffmpeg from 'fluent-ffmpeg'
import { botAiKoshey } from '../utils/telegram/bots'
import { getVideoWithChatId } from '../supabase/videos'

const router = Router()

type CreateVideoT = {
  event_type: string
  event_data: {
    video_id: string
    url: string
  }
}

async function cropSquareAroundHead(
  inputPath: string,
  outputPath: string
): Promise<string> {
  return new Promise((resolve, reject) => {
    const yOffset = 300
    const size = 1080
    const outputSize = 480
    ffmpeg(inputPath)
      .videoFilters([
        `crop=${size}:${size}:in_w/2-${size}/2:in_h/2-${size}/2-${yOffset}`,
        `scale=${outputSize}:${outputSize}`,
      ])
      .on('end', () => resolve(outputPath))
      .on('error', reject)
      .save(outputPath)
  })
}

router.use(
  cors({
    methods: ['POST'],
    origin: '*',
    optionsSuccessStatus: 200,
  })
)

router.post('/heygen-video', async (req, res) => {
  console.log(req.body, 'req.body')
  const { event_type, event_data }: CreateVideoT = req.body

  try {
    if (event_type === 'avatar_video.success') {
      const videoUrl = event_data.url
      const video_id = event_data.video_id
      const videoData = await getVideoWithChatId(video_id)

      if (!videoData) throw new Error('Video not found')
      const { chat_id } = videoData
      console.log(chat_id, 'chat_id')

      const response = await fetch(videoUrl)
      console.log(response, 'response')
      if (!response.ok) {
        throw new Error(`Failed to fetch video: ${response.statusText}`)
      }

      const videoBuffer = new Uint8Array(await response.arrayBuffer())
      const tempDir = path.join(process.cwd(), 'temp')
      const inputFilePath = path.join(tempDir, `${video_id}.mp4`)
      const outputFilePath = path.join(tempDir, `${video_id}_circular.mp4`)
      console.log(inputFilePath, 'inputFilePath')
      console.log(outputFilePath, 'outputFilePath')

      if (!fs.existsSync(tempDir)) {
        fs.mkdirSync(tempDir)
      }

      fs.writeFileSync(inputFilePath, videoBuffer)
      console.log('Video saved to', inputFilePath)

      const croppedVideoPath = await cropSquareAroundHead(
        inputFilePath,
        outputFilePath
      )
      console.log(croppedVideoPath, 'croppedVideoPath')

      const fileBuffer = fs.readFileSync(croppedVideoPath)
      console.log(fileBuffer, 'fileBuffer')
      const inputFile = new InputFile(
        fileBuffer,
        path.basename(croppedVideoPath)
      )
      console.log(inputFile, 'inputFile')
      console.log(chat_id, 'chat_id')

      await botAiKoshey.api.sendVideoNote(chat_id, inputFile)
      return res.status(200).json({ message: 'ok' })
    } else {
      return res.status(200).json({ message: 'ok' })
    }
  } catch (error: any) {
    return res.status(500).json({ message: JSON.stringify(error) })
  }
})

export default router
