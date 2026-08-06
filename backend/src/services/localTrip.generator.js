import { getUserCurrency } from '../constants/currencies.js'
import { resolveDestinationIntel } from '../utils/destinationIntel.js'

const STYLE_LABELS = {
  budget: 'Budget',
  balanced: 'Balanced',
  comfort: 'Comfort',
  luxury: 'Luxury',
}

const STYLE_COST_MULT = {
  budget: 0.65,
  balanced: 1,
  comfort: 1.45,
  luxury: 2.4,
}

/** Baseline lodging in destination currency units (before FX-ish scaling). */
const LODGING_USD_BASE = {
  JPY: 12_000,
  KRW: 90_000,
  INR: 4_500,
  THB: 1_800,
  SGD: 180,
  AED: 450,
  GBP: 140,
  EUR: 130,
  AUD: 160,
  CAD: 150,
  CHF: 200,
  USD: 120,
}

const STOP_TEMPLATES = {
  Culture: [
    { name: 'Historic district walk', type: 'Culture', duration: '2 hrs', notes: 'Start early while streets are quieter and shops are opening.', baseCost: 0 },
    { name: 'Local museum visit', type: 'Culture', duration: '2 hrs', notes: 'Check for free or discounted entry windows midweek.', baseCost: 18 },
    { name: 'Neighborhood craft market', type: 'Shopping', duration: '1.5 hrs', notes: 'Ask vendors about shipping if you buy fragile items.', baseCost: 25 },
  ],
  Food: [
    { name: 'Breakfast at a local cafe', type: 'Food', duration: '1 hr', notes: 'Order a house specialty — staff usually know the best pick.', baseCost: 12 },
    { name: 'Market lunch crawl', type: 'Food', duration: '1.5 hrs', notes: 'Share a few stalls so you can taste more without over-ordering.', baseCost: 22 },
    { name: 'Signature dinner reservation', type: 'Food', duration: '2 hrs', notes: 'Book ahead on weekends; mention dietary needs when confirming.', baseCost: 45 },
  ],
  Nature: [
    { name: 'Morning park or garden', type: 'Nature', duration: '1.5 hrs', notes: 'Bring water and wear comfortable shoes for uneven paths.', baseCost: 5 },
    { name: 'Scenic viewpoint', type: 'Nature', duration: '1.5 hrs', notes: 'Golden hour light is worth the short hike.', baseCost: 0 },
    { name: 'Riverside or waterfront stroll', type: 'Walk', duration: '1 hr', notes: 'A calm reset between busier stops.', baseCost: 0 },
  ],
  Nightlife: [
    { name: 'Sunset rooftop drink', type: 'Relaxation', duration: '1.5 hrs', notes: 'Arrive 30 minutes before sunset for a seat with a view.', baseCost: 20 },
    { name: 'Live music or local bar', type: 'Nightlife', duration: '2 hrs', notes: 'Ask the host for a neighborhood favorite away from tourist traps.', baseCost: 30 },
    { name: 'Late evening street food', type: 'Food', duration: '1 hr', notes: 'Follow the busiest stall — turnover usually means fresher food.', baseCost: 15 },
  ],
  Adventure: [
    { name: 'Guided active experience', type: 'Adventure', duration: '3 hrs', notes: 'Confirm pickup time and what gear is provided.', baseCost: 55 },
    { name: 'City lookout climb', type: 'Adventure', duration: '2 hrs', notes: 'Start before midday heat; pack light layers.', baseCost: 12 },
    { name: 'Bike or scooter neighborhood loop', type: 'Adventure', duration: '2 hrs', notes: 'Lock valuables and photograph the rental agreement.', baseCost: 20 },
  ],
  Relaxation: [
    { name: 'Slow morning cafe', type: 'Relaxation', duration: '1.5 hrs', notes: 'A buffer morning keeps the rest of the day enjoyable.', baseCost: 14 },
    { name: 'Spa or wellness hour', type: 'Relaxation', duration: '1.5 hrs', notes: 'Book the earliest slot for a quieter room.', baseCost: 40 },
    { name: 'Sunset unwind walk', type: 'Walk', duration: '1 hr', notes: 'No agenda — just pace and people-watch.', baseCost: 0 },
  ],
  Sightseeing: [
    { name: 'Iconic landmark visit', type: 'Sightseeing', duration: '2 hrs', notes: 'Buy tickets online when possible to skip the longest queues.', baseCost: 25 },
    { name: 'Old town orientation walk', type: 'Walk', duration: '1.5 hrs', notes: 'Use this stop to get your bearings for the rest of the trip.', baseCost: 0 },
    { name: 'Photo stop at a city overlook', type: 'Sightseeing', duration: '1 hr', notes: 'Late afternoon light is usually the most flattering.', baseCost: 0 },
  ],
}

const DAY_THEMES = [
  { title: 'Arrival & orientation', theme: 'Settle in' },
  { title: 'Local classics', theme: 'Must-sees' },
  { title: 'Neighborhood deep dive', theme: 'Wander' },
  { title: 'Flavors & markets', theme: 'Taste' },
  { title: 'Nature break', theme: 'Outdoors' },
  { title: 'Culture day', theme: 'Heritage' },
  { title: 'Easy pace', theme: 'Balance' },
  { title: 'Hidden corners', theme: 'Discover' },
  { title: 'Active morning', theme: 'Energy' },
  { title: 'Farewell highlights', theme: 'Wrap-up' },
]

const TIMES = ['08:00', '10:30', '13:00', '16:00', '19:00']

/**
 * Deterministic offline itinerary that always matches the trip response schema.
 * Used as the final cascade fallback when all LLM providers fail.
 *
 * @param {{
 *   destination: string,
 *   days: number,
 *   travelers: number,
 *   style: string,
 *   budgetAmount: number,
 *   currency: string,
 *   interests: string[],
 *   prompt: string,
 * }} input
 * @returns {object} Trip object ready for validateTripResponse
 */
export function generateLocalTrip(input) {
  const destination = input.destination.trim()
  const place = destination.split(',')[0].trim() || destination
  const daysCount = clampInt(input.days, 1, 21)
  const travelers = clampInt(input.travelers, 1, 12)
  const styleKey = STYLE_LABELS[input.style] ? input.style : 'balanced'
  const styleLabel = STYLE_LABELS[styleKey]
  const mult = STYLE_COST_MULT[styleKey]
  const destinationInfo = resolveDestinationIntel(destination)
  const fx = scaleForCurrency(destinationInfo.currency)
  const lodgingPerNight =
    LODGING_USD_BASE[destinationInfo.currency] ?? Math.round(120 * fx)
  const interestPool = buildInterestPool(input.interests)
  const userCurrency =
    getUserCurrency(input.currency) || getUserCurrency('USD')

  const days = []
  let stopCounter = 1
  let activityTotal = 0

  for (let d = 1; d <= daysCount; d++) {
    const themeMeta = DAY_THEMES[(d - 1) % DAY_THEMES.length]
    const stopsPerDay = d === daysCount && daysCount > 1 ? 3 : 4
    const stops = []

    for (let s = 0; s < stopsPerDay; s++) {
      const pool = interestPool[(d + s) % interestPool.length]
      const template = pool[(d + s) % pool.length]
      const cost = Math.round(template.baseCost * mult * fx)
      activityTotal += cost

      stops.push({
        id: `s${stopCounter++}`,
        time: TIMES[s] || '18:00',
        name: personalizeName(template.name, place),
        type: template.type,
        duration: template.duration,
        notes: template.notes,
        cost,
      })
    }

    days.push({
      id: `day-${d}`,
      day: d,
      title: `${place}: ${themeMeta.title}`,
      theme: themeMeta.theme,
      stops,
    })
  }

  const lodging = Math.round(lodgingPerNight * daysCount * mult)
  const transport = Math.round(28 * daysCount * travelers * mult * fx)
  const extras = Math.round(activityTotal * 0.15)
  const foodShare = Math.round(activityTotal * 0.45)
  const ticketsShare = Math.max(0, activityTotal - foodShare)
  const total = lodging + transport + extras + activityTotal
  const perPerson = Math.round(total / travelers)

  const categories = normalizePercents([
    { id: 'food', label: 'Food & drink', amount: foodShare },
    { id: 'tickets', label: 'Tickets & entry', amount: ticketsShare },
    { id: 'transport', label: 'Local transport', amount: transport },
    { id: 'lodging', label: 'Lodging (est.)', amount: lodging },
    { id: 'extras', label: 'Extras & shopping', amount: extras },
  ], total)

  const interestsLabel =
    input.interests?.length > 0 ? input.interests.join(', ').toLowerCase() : 'local highlights'
  const budgetAmount =
    Number.isFinite(Number(input.budgetAmount)) && Number(input.budgetAmount) > 0
      ? Number(input.budgetAmount)
      : 50_000

  return {
    tripTitle: `${place} in ${daysCount} ${daysCount === 1 ? 'Day' : 'Days'}`,
    destination,
    destinationInfo,
    duration: `${daysCount} ${daysCount === 1 ? 'day' : 'days'}`,
    travelers,
    style: styleLabel,
    summary: `A ${styleLabel.toLowerCase()} ${daysCount}-day plan for ${place} (${destinationInfo.country}), shaped around ${interestsLabel}, paced for ${destinationInfo.bestSeason.split('—')[0].trim()}.`,
    userBudget: {
      amount: budgetAmount,
      currency: userCurrency.code,
      currencySymbol: userCurrency.symbol,
    },
    days,
    budget: {
      currency: destinationInfo.currency,
      currencySymbol: destinationInfo.currencySymbol,
      total,
      perPerson,
      categories,
    },
    tips: buildTips(place, styleLabel, destinationInfo),
    flights: buildFlights({
      place,
      destinationInfo,
      style: input.style,
      travelers,
      userCurrency,
    }),
  }
}

/**
 * @param {string[]} interests
 */
function buildInterestPool(interests) {
  const selected = (interests || []).filter((i) => STOP_TEMPLATES[i])
  const keys = selected.length > 0 ? selected : ['Sightseeing', 'Food', 'Culture']
  // Always include a sightseeing baseline for structure
  if (!keys.includes('Sightseeing')) keys.unshift('Sightseeing')
  return keys.map((key) => STOP_TEMPLATES[key])
}

/**
 * @param {string} name
 * @param {string} place
 */
function personalizeName(name, place) {
  return `${place}: ${name}`
}

/**
 * Rough FX-ish scale so local amounts look realistic vs a USD base template.
 * @param {string} currency
 */
function scaleForCurrency(currency) {
  switch (currency) {
    case 'JPY':
      return 150
    case 'KRW':
      return 1_350
    case 'INR':
      return 85
    case 'THB':
      return 35
    case 'VND':
      return 25_000
    case 'IDR':
      return 16_000
    case 'SGD':
      return 1.35
    case 'AED':
      return 3.67
    case 'AUD':
      return 1.5
    case 'CAD':
      return 1.35
    case 'GBP':
      return 0.8
    case 'EUR':
      return 0.92
    case 'CHF':
      return 0.9
    case 'TRY':
      return 34
    case 'EGP':
      return 48
    case 'ZAR':
      return 18
    case 'MXN':
      return 17
    case 'BRL':
      return 5
    case 'NZD':
      return 1.65
    default:
      return 1
  }
}

/**
 * @param {Array<{ id: string, label: string, amount: number }>} categories
 * @param {number} total
 */
function normalizePercents(categories, total) {
  if (total <= 0) {
    return categories.map((c) => ({ ...c, percent: 0 }))
  }

  const withPct = categories.map((c) => ({
    ...c,
    percent: Math.round((c.amount / total) * 100),
  }))

  const drift = 100 - withPct.reduce((sum, c) => sum + c.percent, 0)
  if (withPct.length && drift !== 0) {
    const largest = withPct.reduce((best, c) => (c.amount > best.amount ? c : best), withPct[0])
    largest.percent += drift
  }

  return withPct
}

/**
 * @param {string} place
 * @param {string} styleLabel
 * @param {{ language: string, bestSeason: string, currency: string }} destinationInfo
 */
function buildTips(place, styleLabel, destinationInfo) {
  return [
    {
      id: 't1',
      title: 'Confirm opening hours',
      body: `Popular spots in ${place} change hours seasonally — double-check the day before each major stop. Best overall window: ${destinationInfo.bestSeason}.`,
    },
    {
      id: 't2',
      title: 'Build buffer time',
      body: 'Leave 30–45 minutes between paid attractions so transit delays do not cascade through the day.',
    },
    {
      id: 't3',
      title: `${styleLabel} spending cue`,
      body:
        styleLabel === 'Budget'
          ? 'Prioritize free walks and markets; save paid tickets for one highlight per day.'
          : styleLabel === 'Luxury'
            ? 'Book signature dining and experiences early — premium slots fill first on weekends.'
            : 'Mix one paid highlight with free neighborhood time each day to stay flexible.',
    },
    {
      id: 't4',
      title: 'Language & cash',
      body: `Useful languages: ${destinationInfo.language}. Carry a little ${destinationInfo.currency} cash — stalls and transit often prefer it.`,
    },
  ]
}

const HUB_BY_CURRENCY = {
  INR: { city: 'Delhi', iata: 'DEL', airline: 'Air India' },
  USD: { city: 'New York', iata: 'JFK', airline: 'United' },
  EUR: { city: 'Paris', iata: 'CDG', airline: 'Air France' },
  GBP: { city: 'London', iata: 'LHR', airline: 'British Airways' },
  AED: { city: 'Dubai', iata: 'DXB', airline: 'Emirates' },
  SGD: { city: 'Singapore', iata: 'SIN', airline: 'Singapore Airlines' },
  AUD: { city: 'Sydney', iata: 'SYD', airline: 'Qantas' },
  CAD: { city: 'Toronto', iata: 'YYZ', airline: 'Air Canada' },
  JPY: { city: 'Tokyo', iata: 'NRT', airline: 'ANA' },
  KRW: { city: 'Seoul', iata: 'ICN', airline: 'Korean Air' },
}

const DEST_AIRPORTS = {
  Japan: { city: 'Tokyo', iata: 'HND', airline: 'ANA' },
  'South Korea': { city: 'Seoul', iata: 'ICN', airline: 'Korean Air' },
  France: { city: 'Paris', iata: 'CDG', airline: 'Air France' },
  Italy: { city: 'Rome', iata: 'FCO', airline: 'ITA Airways' },
  USA: { city: 'New York', iata: 'JFK', airline: 'Delta' },
  'United Arab Emirates': { city: 'Dubai', iata: 'DXB', airline: 'Emirates' },
  Thailand: { city: 'Bangkok', iata: 'BKK', airline: 'Thai Airways' },
  Switzerland: { city: 'Zurich', iata: 'ZRH', airline: 'Swiss' },
  Spain: { city: 'Madrid', iata: 'MAD', airline: 'Iberia' },
  Indonesia: { city: 'Denpasar', iata: 'DPS', airline: 'Garuda' },
  India: { city: 'Delhi', iata: 'DEL', airline: 'IndiGo' },
  'United Kingdom': { city: 'London', iata: 'LHR', airline: 'British Airways' },
  Morocco: { city: 'Marrakech', iata: 'RAK', airline: 'Royal Air Maroc' },
  Australia: { city: 'Sydney', iata: 'SYD', airline: 'Qantas' },
  Egypt: { city: 'Cairo', iata: 'CAI', airline: 'EgyptAir' },
}

/**
 * Deterministic inbound flight options for the local fallback generator.
 * @param {{
 *   place: string,
 *   destinationInfo: { country: string },
 *   style: string,
 *   travelers: number,
 *   userCurrency: { code: string, symbol: string }
 * }} args
 */
function buildFlights({ place, destinationInfo, style, travelers, userCurrency }) {
  const hub = HUB_BY_CURRENCY[userCurrency.code] || HUB_BY_CURRENCY.USD
  const dest =
    DEST_AIRPORTS[destinationInfo.country] ||
    DEST_AIRPORTS[place] || {
      city: place,
      iata: 'XXX',
      airline: hub.airline,
    }

  const fx = scaleForCurrency(userCurrency.code === 'USD' ? 'USD' : userCurrency.code)
  // Base USD-ish fares scaled into traveler currency
  const baseUsd =
    style === 'luxury' ? 920 : style === 'comfort' ? 640 : style === 'budget' ? 380 : 520
  const valuePrice = Math.round(baseUsd * fx * Math.max(1, travelers * 0.85))
  const fastPrice = Math.round(valuePrice * 1.18)
  const flexPrice = Math.round(valuePrice * (style === 'luxury' ? 1.55 : 1.32))

  return [
    {
      id: 'f1',
      airline: hub.airline,
      flightNumber: `${hub.iata.slice(0, 2)}${Math.max(100, Math.round(fx * 12))}`.slice(0, 6),
      from: `${hub.city} (${hub.iata})`,
      to: `${dest.city} (${dest.iata})`,
      departureTime: '08:40',
      arrivalTime: '21:15',
      duration: '9h 05m',
      stops: '1 stop',
      cabin: style === 'luxury' ? 'Business' : 'Economy',
      price: valuePrice,
      currency: userCurrency.code,
      currencySymbol: userCurrency.symbol,
      bookingTip: 'Book 6–8 weeks out for the best fare window on this route.',
      scoreLabel: 'Best value',
    },
    {
      id: 'f2',
      airline: dest.airline,
      flightNumber: `${dest.iata.slice(0, 2)}418`,
      from: `${hub.city} (${hub.iata})`,
      to: `${dest.city} (${dest.iata})`,
      departureTime: '22:10',
      arrivalTime: '14:55',
      duration: '7h 20m',
      stops: 'Nonstop',
      cabin: style === 'budget' ? 'Economy' : style === 'luxury' ? 'Business' : 'Premium Economy',
      price: fastPrice,
      currency: userCurrency.code,
      currencySymbol: userCurrency.symbol,
      bookingTip: 'Overnight nonstop — arrive rested; check baggage allowance before paying.',
      scoreLabel: 'Fastest',
    },
    {
      id: 'f3',
      airline: hub.airline,
      flightNumber: `${hub.iata.slice(0, 2)}902`,
      from: `${hub.city} (${hub.iata})`,
      to: `${dest.city} (${dest.iata})`,
      departureTime: '11:25',
      arrivalTime: '02:40',
      duration: '11h 45m',
      stops: '1 stop',
      cabin: style === 'luxury' ? 'First' : 'Economy',
      price: flexPrice,
      currency: userCurrency.code,
      currencySymbol: userCurrency.symbol,
      bookingTip: 'More flexible change rules — useful if your dates may shift.',
      scoreLabel: style === 'luxury' ? 'Recommended' : 'Flexible',
    },
  ]
}

/**
 * @param {number} value
 * @param {number} min
 * @param {number} max
 */
function clampInt(value, min, max) {
  const n = Number(value)
  if (!Number.isFinite(n)) return min
  return Math.min(max, Math.max(min, Math.trunc(n)))
}
