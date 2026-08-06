import { ValidationError } from '../utils/ValidationError.js'
import { mergeDestinationInfo } from '../utils/destinationIntel.js'

/**
 * @param {unknown} value
 * @param {string} path
 * @param {string[]} errors
 */
function expectString(value, path, errors) {
  if (typeof value !== 'string' || !value.trim()) {
    errors.push(`${path} must be a non-empty string`)
  }
}

/**
 * @param {unknown} value
 * @param {string} path
 * @param {string[]} errors
 */
function expectNumber(value, path, errors) {
  if (typeof value !== 'number' || Number.isNaN(value)) {
    errors.push(`${path} must be a number`)
  }
}

/**
 * Resolves tripTitle (Prompt 8) or title (frontend contract) to a display title.
 * @param {Record<string, unknown>} trip
 * @param {string[]} errors
 * @returns {string | undefined}
 */
function resolveTripTitle(trip, errors) {
  const tripTitle =
    typeof trip.tripTitle === 'string' ? trip.tripTitle.trim() : ''
  const title = typeof trip.title === 'string' ? trip.title.trim() : ''

  if (tripTitle) return tripTitle
  if (title) return title

  errors.push('tripTitle is required')
  return undefined
}

/**
 * Validates Gemini trip output against the frontend trip contract.
 * Required: tripTitle, destination, destinationInfo, days[], tips[], budget, userBudget.
 *
 * Throws ValidationError when any required field is missing or invalid —
 * never returns bad JSON for React to render.
 *
 * @param {unknown} trip
 * @returns {object} Validated trip (normalized for the frontend)
 * @throws {ValidationError}
 */
export function validateTripResponse(trip) {
  const errors = []

  if (!trip || typeof trip !== 'object' || Array.isArray(trip)) {
    throw new ValidationError('Trip must be an object', ['Trip must be an object'])
  }

  const resolvedTitle = resolveTripTitle(trip, errors)
  expectString(trip.destination, 'destination', errors)
  expectString(trip.duration, 'duration', errors)
  expectNumber(trip.travelers, 'travelers', errors)
  expectString(trip.style, 'style', errors)
  expectString(trip.summary, 'summary', errors)

  if (!Array.isArray(trip.days) || trip.days.length === 0) {
    errors.push('days must be a non-empty array')
  } else {
    trip.days.forEach((day, dayIndex) => {
      const base = `days[${dayIndex}]`
      if (!day || typeof day !== 'object') {
        errors.push(`${base} must be an object`)
        return
      }
      expectString(day.id, `${base}.id`, errors)
      expectNumber(day.day, `${base}.day`, errors)
      expectString(day.title, `${base}.title`, errors)
      expectString(day.theme, `${base}.theme`, errors)

      if (!Array.isArray(day.stops) || day.stops.length === 0) {
        errors.push(`${base}.stops must be a non-empty array`)
        return
      }

      day.stops.forEach((stop, stopIndex) => {
        const stopPath = `${base}.stops[${stopIndex}]`
        if (!stop || typeof stop !== 'object') {
          errors.push(`${stopPath} must be an object`)
          return
        }
        expectString(stop.id, `${stopPath}.id`, errors)
        expectString(stop.time, `${stopPath}.time`, errors)
        expectString(stop.name, `${stopPath}.name`, errors)
        expectString(stop.type, `${stopPath}.type`, errors)
        expectString(stop.duration, `${stopPath}.duration`, errors)
        expectString(stop.notes, `${stopPath}.notes`, errors)
        expectNumber(stop.cost, `${stopPath}.cost`, errors)
      })
    })
  }

  if (trip.budget === undefined || trip.budget === null) {
    errors.push('budget is required')
  } else if (typeof trip.budget !== 'object' || Array.isArray(trip.budget)) {
    errors.push('budget must be an object')
  } else {
    expectString(trip.budget.currency, 'budget.currency', errors)
    expectString(trip.budget.currencySymbol, 'budget.currencySymbol', errors)
    expectNumber(trip.budget.total, 'budget.total', errors)
    expectNumber(trip.budget.perPerson, 'budget.perPerson', errors)

    if (!Array.isArray(trip.budget.categories) || trip.budget.categories.length === 0) {
      errors.push('budget.categories must be a non-empty array')
    } else {
      trip.budget.categories.forEach((category, index) => {
        const path = `budget.categories[${index}]`
        if (!category || typeof category !== 'object') {
          errors.push(`${path} must be an object`)
          return
        }
        expectString(category.id, `${path}.id`, errors)
        expectString(category.label, `${path}.label`, errors)
        expectNumber(category.amount, `${path}.amount`, errors)
        expectNumber(category.percent, `${path}.percent`, errors)
      })
    }
  }

  if (trip.userBudget === undefined || trip.userBudget === null) {
    errors.push('userBudget is required')
  } else if (typeof trip.userBudget !== 'object' || Array.isArray(trip.userBudget)) {
    errors.push('userBudget must be an object')
  } else {
    expectNumber(trip.userBudget.amount, 'userBudget.amount', errors)
    expectString(trip.userBudget.currency, 'userBudget.currency', errors)
    expectString(trip.userBudget.currencySymbol, 'userBudget.currencySymbol', errors)
  }

  if (!Array.isArray(trip.tips) || trip.tips.length === 0) {
    errors.push('tips must be a non-empty array')
  } else {
    trip.tips.forEach((tip, index) => {
      const path = `tips[${index}]`
      if (!tip || typeof tip !== 'object') {
        errors.push(`${path} must be an object`)
        return
      }
      expectString(tip.id, `${path}.id`, errors)
      expectString(tip.title, `${path}.title`, errors)
      expectString(tip.body, `${path}.body`, errors)
    })
  }

  // Flights are recommended but optional for backward compatibility with older models
  let flights = []
  if (trip.flights !== undefined && trip.flights !== null) {
    if (!Array.isArray(trip.flights)) {
      errors.push('flights must be an array')
    } else {
      trip.flights.forEach((flight, index) => {
        const path = `flights[${index}]`
        if (!flight || typeof flight !== 'object') {
          errors.push(`${path} must be an object`)
          return
        }
        expectString(flight.id, `${path}.id`, errors)
        expectString(flight.airline, `${path}.airline`, errors)
        expectString(flight.from, `${path}.from`, errors)
        expectString(flight.to, `${path}.to`, errors)
        expectString(flight.duration, `${path}.duration`, errors)
        expectNumber(flight.price, `${path}.price`, errors)
        expectString(flight.currency, `${path}.currency`, errors)
        expectString(flight.currencySymbol, `${path}.currencySymbol`, errors)
      })
      flights = trip.flights
    }
  }

  if (errors.length) {
    throw new ValidationError('Model response failed schema validation', errors)
  }

  const destination =
    typeof trip.destination === 'string' ? trip.destination.trim() : ''
  const destinationInfo = mergeDestinationInfo(trip.destinationInfo, destination)

  // Normalize for React: always expose `title` + complete destinationInfo
  const { tripTitle: _tripTitle, ...rest } = trip
  return {
    ...rest,
    title: resolvedTitle,
    destinationInfo,
    flights,
  }
}
