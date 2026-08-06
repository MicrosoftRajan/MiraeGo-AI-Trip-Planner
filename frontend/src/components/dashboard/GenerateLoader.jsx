import { MultiStepLoader } from '@/components/ui/multi-step-loader'
import { GENERATION_STEPS } from '../../constants/dashboard'

const DEFAULT_LOADING_STATES = GENERATION_STEPS.map((text) => ({ text }))

/**
 * Full-screen multi-step loader shown while Gilora AI is planning a trip.
 * Accepts `active` (preferred) or legacy `open`.
 */
export default function GenerateLoader({
  active,
  open,
  steps,
  duration = 2000,
  loop = true,
}) {
  const loading = Boolean(active ?? open)
  const loadingStates = steps
    ? steps.map((step) => (typeof step === 'string' ? { text: step } : step))
    : DEFAULT_LOADING_STATES

  return (
    <MultiStepLoader
      loadingStates={loadingStates}
      loading={loading}
      duration={duration}
      loop={loop}
    />
  )
}
