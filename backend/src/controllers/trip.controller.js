import { asyncHandler } from '../utils/asyncHandler.js'
import { createTrip } from '../services/trip.service.js'

/**
 * POST /api/trip — HTTP adapter only; orchestration lives in trip.service.
 */
export const postTrip = asyncHandler(async (req, res) => {
  const trip = await createTrip(req.validated)
  res.status(200).json({ trip })
})
