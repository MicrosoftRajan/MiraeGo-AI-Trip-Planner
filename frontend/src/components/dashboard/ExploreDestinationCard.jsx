import { motion, useReducedMotion } from 'framer-motion'
import {
  HiOutlineCash,
  HiOutlineLocationMarker,
  HiOutlineSun,
} from 'react-icons/hi'
import { AiIcon } from '@/components/icons'
import { cn } from '../../utils'

function MetaItem({ icon: Icon, label, value }) {
  return (
    <div className="min-w-0">
      <p className="flex items-center gap-1 text-[10px] font-semibold uppercase tracking-wider text-[var(--dash-soft)]">
        <Icon className="h-3 w-3 shrink-0" aria-hidden />
        {label}
      </p>
      <p className="mt-0.5 truncate text-sm font-medium text-[var(--dash-text)]">{value}</p>
    </div>
  )
}

export default function ExploreDestinationCard({ country, index = 0, onGenerateTrip, layout = 'carousel' }) {
  const reduce = useReducedMotion()

  return (
    <motion.article
      className={cn(
        'explore-card group relative flex shrink-0 snap-start flex-col overflow-hidden rounded-2xl border border-[var(--dash-border)] bg-[var(--dash-card)] shadow-[0_2px_8px_rgb(0_0_0/0.04)]',
        layout === 'carousel' ? 'w-[min(100%,340px)]' : 'w-full',
      )}
      initial={reduce ? false : { opacity: 0, y: 20 }}
      whileInView={reduce ? undefined : { opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{ delay: index * 0.06, duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
    >
      <div className="relative aspect-[4/3] overflow-hidden">
        <img
          src={country.image}
          alt={country.name}
          className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-110"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />

        <span className="absolute left-4 top-4 text-3xl drop-shadow-lg">{country.flag}</span>

        <div className="absolute bottom-4 left-4 right-4">
          <h3 className="text-xl font-semibold tracking-tight text-white">{country.name}</h3>
          <p className="mt-0.5 flex items-center gap-1 text-sm text-white/80">
            <HiOutlineLocationMarker className="h-3.5 w-3.5" aria-hidden />
            {country.capital}
          </p>
        </div>

        <span className="absolute right-4 top-4 rounded-full border border-white/20 bg-black/30 px-2.5 py-1 text-[11px] font-medium text-white backdrop-blur-md">
          {country.weather}
        </span>
      </div>

      <div className="flex flex-1 flex-col gap-4 p-4">
        <div className="grid grid-cols-2 gap-x-4 gap-y-3">
          <MetaItem
            icon={HiOutlineCash}
            label="Currency"
            value={`${country.currencySymbol} ${country.currency}`}
          />
          <MetaItem icon={HiOutlineSun} label="Best season" value={country.bestSeason} />
          <MetaItem
            icon={HiOutlineLocationMarker}
            label="Top attraction"
            value={country.topAttraction}
          />
          <MetaItem
            icon={HiOutlineCash}
            label="Daily cost"
            value={`≈ ₹${country.avgCostPerDay.toLocaleString('en-IN')}`}
          />
        </div>

        <div className="mt-auto flex items-center justify-between gap-3 border-t border-[var(--dash-border)] pt-4">
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-wider text-[var(--dash-soft)]">
              Avg. budget
            </p>
            <p className="text-base font-semibold text-[var(--dash-text)]">
              ₹{(country.avgCostPerDay * 5).toLocaleString('en-IN')}
              <span className="text-sm font-normal text-[var(--dash-muted)]"> / 5 days</span>
            </p>
          </div>

          <button
            type="button"
            onClick={() => onGenerateTrip?.(country)}
            className={cn(
              'inline-flex items-center gap-1.5 rounded-xl bg-[var(--dash-accent)] px-4 py-2.5 text-sm font-medium text-[var(--dash-on-accent)]',
              'transition-all duration-300 ease-out',
              'hover:bg-[var(--dash-accent-hover)] hover:shadow-lg hover:shadow-black/10',
              'group-hover:scale-[1.02] active:scale-[0.98]',
            )}
          >
            <AiIcon className="h-4 w-4" alt="" />
            Generate Trip
          </button>
        </div>
      </div>
    </motion.article>
  )
}
