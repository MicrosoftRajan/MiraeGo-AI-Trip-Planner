import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'
import {
  HiOutlineCash,
  HiOutlineGlobe,
  HiOutlineClock,
  HiOutlineSun,
  HiOutlineLocationMarker,
} from 'react-icons/hi'

function Meta({ icon: Icon, label, value, light }) {
  return (
    <div
      className={
        light
          ? 'flex items-start gap-2.5 rounded-xl border border-[var(--dash-border)] bg-[var(--dash-surface)] px-3 py-2.5'
          : 'flex items-start gap-2.5 rounded-2xl bg-white/[0.03] px-3 py-2.5'
      }
    >
      <Icon className={`mt-0.5 h-4 w-4 shrink-0 ${light ? 'text-[var(--dash-text)]' : 'text-[#a89bff]'}`} />
      <div className="min-w-0">
        <p className={`text-[10px] font-semibold uppercase tracking-wider ${light ? 'text-[var(--dash-soft)]' : 'text-[var(--dash-soft)]'}`}>
          {label}
        </p>
        <p className={`truncate text-sm font-medium ${light ? 'text-[var(--dash-text)]' : 'text-white'}`}>{value}</p>
      </div>
    </div>
  )
}

export default function CountryPreview({ country, variant = 'dark' }) {
  const light = variant === 'light'
  const reduce = useReducedMotion()

  return (
    <AnimatePresence mode="wait">
      {country ? (
        <motion.div
          key={country.id}
          className={`overflow-hidden rounded-xl border ${light ? 'border-[var(--dash-border)]' : 'border-white/[0.08]'}`}
          initial={reduce ? false : { opacity: 0, y: 12, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={reduce ? undefined : { opacity: 0, y: -8, scale: 0.98 }}
          transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
        >
          <div className="relative h-36 overflow-hidden">
            <img
              src={country.image}
              alt=""
              className="h-full w-full object-cover"
              loading="lazy"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#080a10] via-[#080a10]/40 to-transparent" />
            <div className="absolute bottom-3 left-3 right-3 flex items-end justify-between gap-2">
              <div>
                <p className="text-2xl leading-none">{country.flag}</p>
                <h4 className="dash-display mt-1 text-xl font-bold text-white">
                  {country.name}
                </h4>
                <p className="text-xs text-white/70">
                  <HiOutlineLocationMarker className="mr-1 inline h-3 w-3" />
                  {country.capital}
                </p>
              </div>
              <span className="rounded-full bg-white/10 px-2.5 py-1 text-[11px] font-medium text-white backdrop-blur-md">
                {country.weather}
              </span>
            </div>
          </div>

          <div className={`space-y-3 p-3 ${light ? 'bg-[var(--dash-card)]' : 'bg-[#080a10]/90'}`}>
            <div className="grid grid-cols-2 gap-2">
              <Meta light={light} icon={HiOutlineCash} label="Currency" value={`${country.currencySymbol} ${country.currency}`} />
              <Meta light={light} icon={HiOutlineGlobe} label="Language" value={country.language} />
              <Meta light={light} icon={HiOutlineClock} label="Timezone" value={country.timezone} />
              <Meta light={light} icon={HiOutlineSun} label="Best season" value={country.bestSeason} />
            </div>

            <div>
              <p className={`mb-2 text-[10px] font-semibold uppercase tracking-wider ${light ? 'text-[var(--dash-soft)]' : 'text-[var(--dash-soft)]'}`}>
                Top attractions
              </p>
              <div className="flex flex-wrap gap-1.5">
                {country.attractions.slice(0, 4).map((a) => (
                  <span
                    key={a}
                    className={
                      light
                        ? 'rounded-full border border-[var(--dash-border)] bg-[var(--dash-surface)] px-2.5 py-1 text-[11px] text-[var(--dash-muted)]'
                        : 'rounded-full border border-white/[0.08] bg-white/[0.04] px-2.5 py-1 text-[11px] text-[var(--dash-muted)]'
                    }
                  >
                    {a}
                  </span>
                ))}
              </div>
            </div>

            <p className={`text-xs ${light ? 'text-[var(--dash-muted)]' : 'text-[var(--dash-muted)]'}`}>
              Avg. daily cost{' '}
              <span className={`font-semibold ${light ? 'text-[var(--dash-text)]' : 'text-white'}`}>
                ≈ ₹{country.avgCostPerDay.toLocaleString('en-IN')}
              </span>{' '}
              / traveler
            </p>
          </div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  )
}
