import { Router } from 'express'
import { postTrip } from '../controllers/trip.controller.js'
import { validateTripBody } from '../middleware/validateRequest.js'

const router = Router()

router.post('/', validateTripBody, postTrip)

export default router
