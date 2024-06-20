import express from 'express'
import bodyParser from 'body-parser'
import heygenVideoRouter from './routes/heygenVideo'
import dotenv from 'dotenv'
dotenv.config()

const app = express()

const PORT = 3000

app.use(bodyParser.json())

app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.use(heygenVideoRouter)

app.listen(PORT, () => {
  console.log(`🦄 Server running on http://localhost:${PORT}`)
})
