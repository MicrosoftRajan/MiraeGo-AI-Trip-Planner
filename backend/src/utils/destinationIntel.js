/**
 * Rule-based destination intelligence for worldwide planning.
 *
 * Used by:
 * - Local fallback generator (always available)
 * - Response normalization when the LLM omits or partially fills destinationInfo
 *
 * LLM output is preferred when present; this layer guarantees a complete,
 * schema-valid destinationInfo so the frontend never receives nulls.
 */

/** @typedef {{
 *   country: string,
 *   currency: string,
 *   currencySymbol: string,
 *   timezone: string,
 *   language: string,
 *   bestSeason: string,
 * }} DestinationInfo */

/**
 * Ordered specific → general. First match wins.
 * @type {Array<{ test: RegExp, info: DestinationInfo }>}
 */
const DESTINATION_PROFILES = [
  {
    test: /(tokyo|kyoto|osaka|hokkaido|okinawa|japan|nihon|nippon)/i,
    info: {
      country: 'Japan',
      currency: 'JPY',
      currencySymbol: '¥',
      timezone: 'Asia/Tokyo',
      language: 'Japanese',
      bestSeason: 'March–May (sakura) and October–November (foliage)',
    },
  },
  {
    test: /(seoul|busan|jeju|south korea|korea)/i,
    info: {
      country: 'South Korea',
      currency: 'KRW',
      currencySymbol: '₩',
      timezone: 'Asia/Seoul',
      language: 'Korean',
      bestSeason: 'April–June and September–November',
    },
  },
  {
    test: /(paris|lyon|nice|marseille|france|french riviera)/i,
    info: {
      country: 'France',
      currency: 'EUR',
      currencySymbol: '€',
      timezone: 'Europe/Paris',
      language: 'French',
      bestSeason: 'April–June and September–October',
    },
  },
  {
    test: /(rome|florence|venice|milan|naples|italy|tuscany|amalfi)/i,
    info: {
      country: 'Italy',
      currency: 'EUR',
      currencySymbol: '€',
      timezone: 'Europe/Rome',
      language: 'Italian',
      bestSeason: 'April–June and September–October',
    },
  },
  {
    test: /(barcelona|madrid|seville|valencia|spain)/i,
    info: {
      country: 'Spain',
      currency: 'EUR',
      currencySymbol: '€',
      timezone: 'Europe/Madrid',
      language: 'Spanish',
      bestSeason: 'April–June and September–October',
    },
  },
  {
    test: /(berlin|munich|hamburg|germany)/i,
    info: {
      country: 'Germany',
      currency: 'EUR',
      currencySymbol: '€',
      timezone: 'Europe/Berlin',
      language: 'German',
      bestSeason: 'May–September',
    },
  },
  {
    test: /(amsterdam|netherlands|holland)/i,
    info: {
      country: 'Netherlands',
      currency: 'EUR',
      currencySymbol: '€',
      timezone: 'Europe/Amsterdam',
      language: 'Dutch',
      bestSeason: 'April–September',
    },
  },
  {
    test: /(lisbon|porto|portugal)/i,
    info: {
      country: 'Portugal',
      currency: 'EUR',
      currencySymbol: '€',
      timezone: 'Europe/Lisbon',
      language: 'Portuguese',
      bestSeason: 'March–June and September–October',
    },
  },
  {
    test: /(london|edinburgh|manchester|scotland|england|wales|united kingdom|\buk\b|britain)/i,
    info: {
      country: 'United Kingdom',
      currency: 'GBP',
      currencySymbol: '£',
      timezone: 'Europe/London',
      language: 'English',
      bestSeason: 'May–September',
    },
  },
  {
    test: /(new york|los angeles|san francisco|chicago|miami|seattle|boston|las vegas|hawaii|usa|united states|\bu\.s\.a?\b)/i,
    info: {
      country: 'United States',
      currency: 'USD',
      currencySymbol: '$',
      timezone: 'America/New_York',
      language: 'English',
      bestSeason: 'Varies by region — spring and fall are widely pleasant',
    },
  },
  {
    test: /(toronto|vancouver|montreal|calgary|canada)/i,
    info: {
      country: 'Canada',
      currency: 'CAD',
      currencySymbol: 'C$',
      timezone: 'America/Toronto',
      language: 'English / French',
      bestSeason: 'June–September',
    },
  },
  {
    test: /(sydney|melbourne|brisbane|perth|australia)/i,
    info: {
      country: 'Australia',
      currency: 'AUD',
      currencySymbol: 'A$',
      timezone: 'Australia/Sydney',
      language: 'English',
      bestSeason: 'September–November and March–May',
    },
  },
  {
    test: /(singapore)/i,
    info: {
      country: 'Singapore',
      currency: 'SGD',
      currencySymbol: 'S$',
      timezone: 'Asia/Singapore',
      language: 'English / Mandarin / Malay / Tamil',
      bestSeason: 'February–April (relatively drier)',
    },
  },
  {
    test: /(dubai|abu dhabi|uae|united arab emirates)/i,
    info: {
      country: 'United Arab Emirates',
      currency: 'AED',
      currencySymbol: 'د.إ',
      timezone: 'Asia/Dubai',
      language: 'Arabic / English',
      bestSeason: 'November–March',
    },
  },
  {
    test: /(bangkok|phuket|chiang mai|thailand)/i,
    info: {
      country: 'Thailand',
      currency: 'THB',
      currencySymbol: '฿',
      timezone: 'Asia/Bangkok',
      language: 'Thai',
      bestSeason: 'November–February',
    },
  },
  {
    test: /(hanoi|ho chi minh|da nang|vietnam)/i,
    info: {
      country: 'Vietnam',
      currency: 'VND',
      currencySymbol: '₫',
      timezone: 'Asia/Ho_Chi_Minh',
      language: 'Vietnamese',
      bestSeason: 'February–April',
    },
  },
  {
    test: /(bali|jakarta|indonesia)/i,
    info: {
      country: 'Indonesia',
      currency: 'IDR',
      currencySymbol: 'Rp',
      timezone: 'Asia/Jakarta',
      language: 'Indonesian',
      bestSeason: 'April–October (dry season in Bali)',
    },
  },
  {
    test: /(delhi|mumbai|jaipur|goa|bangalore|bengaluru|kerala|agra|chennai|hyderabad|india)/i,
    info: {
      country: 'India',
      currency: 'INR',
      currencySymbol: '₹',
      timezone: 'Asia/Kolkata',
      language: 'Hindi / English (varies by state)',
      bestSeason: 'October–March',
    },
  },
  {
    test: /(zurich|geneva|switzerland)/i,
    info: {
      country: 'Switzerland',
      currency: 'CHF',
      currencySymbol: 'CHF',
      timezone: 'Europe/Zurich',
      language: 'German / French / Italian',
      bestSeason: 'June–September',
    },
  },
  {
    test: /(istanbul|turkey|türkiye|turkiye)/i,
    info: {
      country: 'Turkey',
      currency: 'TRY',
      currencySymbol: '₺',
      timezone: 'Europe/Istanbul',
      language: 'Turkish',
      bestSeason: 'April–June and September–October',
    },
  },
  {
    test: /(cairo|egypt)/i,
    info: {
      country: 'Egypt',
      currency: 'EGP',
      currencySymbol: 'E£',
      timezone: 'Africa/Cairo',
      language: 'Arabic',
      bestSeason: 'October–April',
    },
  },
  {
    test: /(cape town|johannesburg|south africa)/i,
    info: {
      country: 'South Africa',
      currency: 'ZAR',
      currencySymbol: 'R',
      timezone: 'Africa/Johannesburg',
      language: 'English / Afrikaans / Zulu (varies)',
      bestSeason: 'September–November and March–May',
    },
  },
  {
    test: /(mexico city|cancun|tulum|mexico)/i,
    info: {
      country: 'Mexico',
      currency: 'MXN',
      currencySymbol: 'MX$',
      timezone: 'America/Mexico_City',
      language: 'Spanish',
      bestSeason: 'November–April',
    },
  },
  {
    test: /(rio|sao paulo|brazil)/i,
    info: {
      country: 'Brazil',
      currency: 'BRL',
      currencySymbol: 'R$',
      timezone: 'America/Sao_Paulo',
      language: 'Portuguese',
      bestSeason: 'May–September (drier in much of the country)',
    },
  },
  {
    test: /(auckland|wellington|queenstown|new zealand)/i,
    info: {
      country: 'New Zealand',
      currency: 'NZD',
      currencySymbol: 'NZ$',
      timezone: 'Pacific/Auckland',
      language: 'English / Māori',
      bestSeason: 'December–February (summer) and March–May',
    },
  },
]

const DEFAULT_INFO = {
  country: 'Worldwide',
  currency: 'USD',
  currencySymbol: '$',
  timezone: 'UTC',
  language: 'Local language / English commonly useful',
  bestSeason: 'Check local climate — shoulder seasons are often ideal',
}

/**
 * Resolves destination intelligence from a free-text destination.
 * @param {string} destination
 * @returns {DestinationInfo}
 */
export function resolveDestinationIntel(destination) {
  const text = typeof destination === 'string' ? destination.trim() : ''
  if (!text) {
    return { ...DEFAULT_INFO }
  }

  for (const profile of DESTINATION_PROFILES) {
    if (profile.test.test(text)) {
      return { ...profile.info }
    }
  }

  // Unknown destination: keep place name as country label for UI clarity.
  const place = text.split(',')[0].trim() || text
  return {
    ...DEFAULT_INFO,
    country: place,
  }
}

/**
 * Merges model-provided destinationInfo with rule-based fallbacks.
 * Never returns empty required fields.
 *
 * @param {unknown} partial
 * @param {string} destination
 * @returns {DestinationInfo}
 */
export function mergeDestinationInfo(partial, destination) {
  const base = resolveDestinationIntel(destination)
  if (!partial || typeof partial !== 'object' || Array.isArray(partial)) {
    return base
  }

  const src = /** @type {Record<string, unknown>} */ (partial)

  return {
    country: pickString(src.country, base.country),
    currency: pickString(src.currency, base.currency).toUpperCase(),
    currencySymbol: pickString(src.currencySymbol, base.currencySymbol),
    timezone: pickString(src.timezone, base.timezone),
    language: pickString(src.language, base.language),
    bestSeason: pickString(src.bestSeason, base.bestSeason),
  }
}

/**
 * @param {unknown} value
 * @param {string} fallback
 */
function pickString(value, fallback) {
  if (typeof value === 'string' && value.trim()) return value.trim()
  return fallback
}
