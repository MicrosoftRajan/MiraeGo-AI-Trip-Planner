import { useCallback, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import useTrip from '../hooks/useTrip'
import useTripActions from '../hooks/useTripActions'
import useTripStatus from '../hooks/useTripStatus'
import DashShell from '../components/dashboard/DashShell'
import PlannerCard from '../components/dashboard/PlannerCard'

export default function PlannerPage() {
  const navigate = useNavigate()
  const trip = useTrip()
  const { loading } = useTripStatus()
  const { generateTrip } = useTripActions()

  useEffect(() => {
    if (trip && !loading) {
      navigate('/', { replace: true })
    }
  }, [trip, loading, navigate])

  const handleGenerate = useCallback(
    (data) => {
      void generateTrip(data)
    },
    [generateTrip],
  )

  return (
    <DashShell>
      <div className="mx-auto w-full max-w-2xl px-4 py-8 sm:px-6 sm:py-10">
        <motion.div
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
        >
          <PlannerCard loading={loading} onGenerate={handleGenerate} />
        </motion.div>
      </div>
    </DashShell>
  )
}
