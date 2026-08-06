import { Router } from 'express'
import { getDbStatus } from '../config/db.js'
import tripRoutes from './trip.routes.js'

const router = Router()

router.get('/health', (_req, res) => {
  res.json({
    status: 'ok',
    service: 'gilora-backend',
    db: getDbStatus(),
  })
})

router.use('/trip', tripRoutes)

export default router
