export default function Footer() {
  return (
    <footer className="relative mt-16 border-t border-divider sm:mt-24">
      <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6 sm:py-12">
        <div className="flex flex-col gap-10 md:flex-row md:items-end md:justify-between">
          <div className="max-w-md">
            <p className="font-display text-3xl font-semibold tracking-tight text-ink">
              Gilora
            </p>
            <p className="mt-3 text-ink-muted leading-relaxed">
              AI trip planning that turns a rough idea into a day-by-day itinerary
              you can shape — expand, trim, and reorder until it feels like yours.
            </p>
          </div>

          <nav
            className="grid grid-cols-2 gap-8 sm:grid-cols-3 sm:gap-12"
            aria-label="Footer"
          >
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.14em] text-ink-soft">
                Product
              </p>
              <ul className="mt-3 space-y-2 text-sm text-ink-muted">
                <li>
                  <a
                    href="#planner"
                    className="rounded-sm transition-colors duration-300 hover:text-sea focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sea/30"
                  >
                    Trip planner
                  </a>
                </li>
                <li>
                  <a
                    href="#timeline"
                    className="rounded-sm transition-colors duration-300 hover:text-sea focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sea/30"
                  >
                    Itinerary
                  </a>
                </li>
                <li>
                  <a
                    href="#budget"
                    className="rounded-sm transition-colors duration-300 hover:text-sea focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sea/30"
                  >
                    Budget
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.14em] text-ink-soft">
                Explore
              </p>
              <ul className="mt-3 space-y-2 text-sm text-ink-muted">
                <li>
                  <a
                    href="#tips"
                    className="rounded-sm transition-colors duration-300 hover:text-sea focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sea/30"
                  >
                    Travel tips
                  </a>
                </li>
                <li>
                  <a
                    href="#top"
                    className="rounded-sm transition-colors duration-300 hover:text-sea focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sea/30"
                  >
                    Back to top
                  </a>
                </li>
              </ul>
            </div>
          </nav>
        </div>

        <div className="mt-10 flex flex-col gap-3 border-t border-divider pt-6 text-sm text-ink-soft sm:mt-12 sm:flex-row sm:items-center sm:justify-between">
          <p>© {new Date().getFullYear()} Gilora. Crafted for curious travelers.</p>
          <p className="font-medium text-ink-muted">Plan less. Wander more.</p>
        </div>
      </div>
    </footer>
  )
}
