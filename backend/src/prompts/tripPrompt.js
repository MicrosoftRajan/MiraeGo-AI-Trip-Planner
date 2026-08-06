import { getUserCurrency } from '../constants/currencies.js'

const STYLE_META = {
  budget: {
    label: 'Budget',
    guidance:
      'Budget traveler — hostels or guesthouses, street food, metro/buses, free or low-cost attractions. Never recommend luxury experiences.',
  },
  balanced: {
    label: 'Balanced',
    guidance:
      'Mid-range — comfortable hotels, popular restaurants, museums, public transport. Mix paid highlights with free time.',
  },
  comfort: {
    label: 'Comfort',
    guidance:
      'Upper mid-range — quality hotels, well-reviewed dining, convenient transport. Avoid ultra-luxury unless it clearly fits the budget.',
  },
  luxury: {
    label: 'Luxury',
    guidance:
      'Premium — 5-star hotels, fine dining, private transport, premium experiences. Only when the numeric budget supports it.',
  },
}

const RESPONSE_SHAPE = `{
  "tripTitle": "string",
  "destination": "string",
  "destinationInfo": {
    "country": "string",
    "currency": "ISO code for destination",
    "currencySymbol": "string",
    "timezone": "IANA timezone e.g. Asia/Tokyo",
    "language": "string",
    "bestSeason": "string"
  },
  "duration": "string (e.g. \\"4 days\\")",
  "travelers": number,
  "style": "string (display label, e.g. Balanced)",
  "summary": "string (1-2 sentences)",
  "userBudget": {
    "amount": number,
    "currency": "ISO code matching traveler input",
    "currencySymbol": "string"
  },
  "days": [
    {
      "id": "day-1",
      "day": 1,
      "title": "string",
      "theme": "string",
      "stops": [
        {
          "id": "s1",
          "time": "HH:MM (24h)",
          "name": "string",
          "type": "Sightseeing|Food|Culture|Nature|Walk|Adventure|Shopping|Relaxation",
          "duration": "string (e.g. \\"2 hrs\\")",
          "notes": "string (practical tip)",
          "cost": number
        }
      ]
    }
  ],
  "budget": {
    "currency": "ISO code (destination currency)",
    "currencySymbol": "string",
    "total": number,
    "perPerson": number,
    "categories": [
      { "id": "food", "label": "Food & drink", "amount": number, "percent": number }
    ]
  },
  "tips": [
    { "id": "t1", "title": "string", "body": "string" }
  ],
  "flights": [
    {
      "id": "f1",
      "airline": "string",
      "flightNumber": "string (e.g. NH825)",
      "from": "City (IATA)",
      "to": "City (IATA)",
      "departureTime": "HH:MM",
      "arrivalTime": "HH:MM",
      "duration": "string (e.g. \\"7h 20m\\")",
      "stops": "Nonstop|1 stop|2 stops",
      "cabin": "Economy|Premium Economy|Business|First",
      "price": number,
      "currency": "ISO code (prefer traveler userBudget currency)",
      "currencySymbol": "string",
      "bookingTip": "string (when to book / fare tip)",
      "scoreLabel": "Best value|Fastest|Recommended|Flexible"
    }
  ]
}`

/**
 * Prompt Builder — constructs system + user prompts for detailed itinerary generation.
 * The model must return JSON only (no markdown, no explanations, no extra text).
 *
 * @param {{
 *   destination: string,
 *   days: number,
 *   travelers: number,
 *   style: string,
 *   budgetAmount: number,
 *   currency: string,
 *   interests: string[],
 *   prompt: string
 * }} input
 * @returns {{ system: string, user: string }}
 */
export function buildTripPrompt(input) {
  const meta = STYLE_META[input.style] || STYLE_META.balanced
  const interests =
    input.interests.length > 0 ? input.interests.join(', ') : 'general sightseeing'
  const userCurrency = getUserCurrency(input.currency)
  const currencyLabel = userCurrency
    ? `${userCurrency.code} (${userCurrency.symbol})`
    : input.currency
  const notes = input.prompt?.trim() || 'None'

  const system = [
    'You are Gilora, an expert worldwide travel planner — not a chatbot.',
    'Generate a detailed day-by-day itinerary for any destination on Earth.',
    'Detect and fill destinationInfo: country, local currency, timezone, language, best season.',
    'Itinerary costs (stop.cost and budget.*) MUST use the destination local currency.',
    'userBudget MUST echo the traveler amount and currency exactly.',
    'Respect the numeric budget strictly — never recommend luxury if the budget or style is low.',
    'Return JSON only.',
    'No markdown.',
    'No explanations.',
    'No extra text.',
    'No code fences.',
    'Costs must be realistic local-currency estimates (numbers only, no symbols in cost fields).',
    'Include exactly the requested number of days.',
    'Each day needs 3–5 stops with sensible pacing and travel time between them.',
    'Budget categories percents should roughly sum to 100.',
    'Provide 3–5 practical local tips.',
    'Include 2–3 AI flight booking recommendations into the destination.',
    'If origin is not specified in traveler notes, infer a sensible major hub for the traveler currency (e.g. DEL/BOM for INR, JFK/SFO for USD, LHR for GBP).',
    'Flight prices MUST use the traveler userBudget currency (not destination currency).',
    'Vary options: one Best value, one Fastest/Recommended, optionally one Flexible/Business-leaning for luxury style.',
    `Exact JSON shape:\n${RESPONSE_SHAPE}`,
  ].join('\n')

  const user = [
    'Plan a detailed trip itinerary with these details:',
    `- Destination: ${input.destination}`,
    `- Number of Days: ${input.days}`,
    `- Total Budget: ${input.budgetAmount} ${currencyLabel}`,
    `- Travel Style: ${meta.label}`,
    `- Style guidance: ${meta.guidance}`,
    `- Interests: ${interests}`,
    `- Travelers: ${input.travelers}`,
    `- Traveler notes: ${notes}`,
    '',
    'Fill destinationInfo accurately for this destination.',
    'Include 2–3 realistic inbound flight booking recommendations with airline, times, duration, stops, cabin, and booking tips.',
    'Return JSON only. No markdown. No explanations. No extra text.',
  ].join('\n')

  return { system, user }
}
