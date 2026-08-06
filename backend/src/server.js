import 'dotenv/config'
import express from 'express'
import cors from 'cors'
import { env } from './config/env.js'
import { connectDB } from './config/db.js'
import { errorHandler, notFoundHandler } from './middleware/errorHandler.js'
import apiRoutes from './routes/index.js'

const app = express()

app.use(cors())
app.use(express.json({ limit: '1mb' }))

app.get('/', (_req, res) => {
  res.json({
    service: 'gilora-backend',
    status: 'ok',
    endpoints: {
      health: 'GET /api/health',
      trip: 'POST /api/trip',
    },
  })
})

app.use('/api', apiRoutes)

app.use(notFoundHandler)
app.use(errorHandler)

async function start() {
  try {
    await connectDB()
  } catch (err) {
    console.error('MongoDB connection failed:', err.message)
    process.exit(1)
  }

  const server = app.listen(env.port, () => {
    console.log(`Gilora API running on http://localhost:${env.port}`)
  })

  server.on('error', (err) => {
    console.error(`Failed to bind port ${env.port}:`, err.message)
    process.exit(1)
  })
}

start()
