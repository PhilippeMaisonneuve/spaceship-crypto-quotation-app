import express from 'express'
import cors from 'cors'
import { config } from './config/environment'
import routes from './controllers/routes'
import { errorHandler, notFoundHandler, requestLogger } from './middleware/errorHandler'
import { dbService } from './services/database'

/**
 * Clean, modular Express server for Crypto Quotation API
 */

const app = express()

// Middleware
app.use(cors())
app.use(express.json())
app.use(requestLogger)

// API Routes
app.use('/api', routes)

// Error handling
app.use(notFoundHandler)
app.use(errorHandler)

// Graceful shutdown
process.on('SIGINT', async () => {
  console.log('\n🛑 Shutting down server gracefully...')
  await dbService.disconnect()
  process.exit(0)
})

process.on('SIGTERM', async () => {
  console.log('\n🛑 Received SIGTERM, shutting down gracefully...')
  await dbService.disconnect()
  process.exit(0)
})

// Start server
const server = app.listen(config.port, () => {
  console.log(`🚀 Crypto API server running on port ${config.port}`)
  console.log(`📊 Environment: ${config.nodeEnv}`)
  console.log(`🔗 Health check: http://localhost:${config.port}/api/health`)
})

export default app