import { useEffect, useMemo, useRef, useState } from 'react'
import { analyzeBudget, matchCountry, suggestCountries } from '../utils/dashboard'
import { validatePlannerForm } from '../utils/validatePlannerForm'

export const TRIP_FORM_INITIAL = {
  destination: '',
  description: '',
  budgetAmount: '80000',
  currency: 'INR',
  days: 5,
  adults: 2,
  children: 0,
  infants: 0,
  style: 'comfort',
  interests: ['Food', 'Culture'],
  accommodation: 'Hotel',
  transport: 'Mixed',
}

export default function useTripForm(initial = TRIP_FORM_INITIAL) {
  const [form, setForm] = useState(initial)
  const [errors, setErrors] = useState({})
  const [suggestionsOpen, setSuggestionsOpen] = useState(false)
  const [pendingBypass, setPendingBypass] = useState(false)
  const destRef = useRef(null)

  const country = useMemo(() => matchCountry(form.destination), [form.destination])
  const suggestions = useMemo(
    () => suggestCountries(form.destination, 5),
    [form.destination],
  )
  const travelers = (Number(form.adults) || 0) + (Number(form.children) || 0)

  const analysis = useMemo(
    () =>
      analyzeBudget({
        budgetAmount: form.budgetAmount,
        currency: form.currency,
        style: form.style,
        days: form.days,
        travelers: Math.max(1, travelers),
        country,
      }),
    [form.budgetAmount, form.currency, form.style, form.days, travelers, country],
  )

  useEffect(() => {
    setPendingBypass(false)
  }, [form.budgetAmount, form.style, form.destination, form.days, form.currency])

  useEffect(() => {
    const onDoc = (e) => {
      if (!destRef.current?.contains(e.target)) setSuggestionsOpen(false)
    }
    document.addEventListener('mousedown', onDoc)
    return () => document.removeEventListener('mousedown', onDoc)
  }, [])

  const update = (key, value) => {
    setForm((prev) => ({ ...prev, [key]: value }))
    setErrors((prev) => {
      if (!prev[key] && !(key === 'adults' && prev.travelers)) return prev
      const next = { ...prev }
      delete next[key]
      if (key === 'adults' || key === 'children') delete next.travelers
      return next
    })
  }

  const toggleInterest = (interest) => {
    setForm((prev) => {
      const has = prev.interests.includes(interest)
      return {
        ...prev,
        interests: has
          ? prev.interests.filter((i) => i !== interest)
          : [...prev.interests, interest],
      }
    })
    setErrors((prev) => {
      if (!prev.interests) return prev
      const next = { ...prev }
      delete next.interests
      return next
    })
  }

  const submit = (e, { force = false, onValid } = {}) => {
    e?.preventDefault?.()
    const result = validatePlannerForm(form)
    if (!result.ok) {
      setErrors(result.errors)
      return null
    }
    if (!force && !pendingBypass && analysis.status === 'warn') {
      return null
    }
    setErrors({})
    onValid?.(result.data)
    return result.data
  }

  const reset = () => {
    setForm(initial)
    setErrors({})
    setPendingBypass(false)
    setSuggestionsOpen(false)
  }

  return {
    form,
    errors,
    country,
    suggestions,
    suggestionsOpen,
    setSuggestionsOpen,
    pendingBypass,
    setPendingBypass,
    analysis,
    destRef,
    update,
    toggleInterest,
    submit,
    reset,
  }
}
