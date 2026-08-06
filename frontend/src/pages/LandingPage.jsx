import { lazy, Suspense } from 'react'
import '../styles/landing.css'
import Navbar from '../components/landing/Navbar'
import Hero from '../components/landing/Hero'
import Features from '../components/landing/Features'

const Demo = lazy(() => import('../components/landing/Demo'))
const HowItWorks = lazy(() => import('../components/landing/HowItWorks'))
const Destinations = lazy(() => import('../components/landing/Destinations'))
const CrowdSection = lazy(() => import('../components/landing/CrowdSection'))
const Testimonials = lazy(() => import('../components/landing/Testimonials'))
const Pricing = lazy(() => import('../components/landing/Pricing'))
const CTA = lazy(() => import('../components/landing/CTA'))
const Footer = lazy(() => import('../components/landing/Footer'))

function SectionFallback() {
  return (
    <div className="mx-auto max-w-5xl px-5 py-24 sm:px-8" aria-hidden>
      <div className="lp-skeleton mx-auto mb-4 h-3 w-24 rounded-full" />
      <div className="lp-skeleton mx-auto mb-12 h-10 w-64 max-w-full rounded-xl" />
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {[1, 2, 3].map((n) => (
          <div key={n} className="lp-skeleton h-40 rounded-2xl" />
        ))}
      </div>
    </div>
  )
}

export default function LandingPage({ onGetStarted }) {
  return (
    <div className="landing-root dark">
      <a
        href="#main"
        className="absolute left-4 top-4 z-[100] -translate-y-16 rounded-lg bg-white px-4 py-2 text-sm font-semibold text-[#08090A] opacity-0 transition focus:translate-y-0 focus:opacity-100 focus:outline-none focus:ring-2 focus:ring-[#7C3AED]"
      >
        Skip to content
      </a>
      <Navbar onGetStarted={onGetStarted} />

      <main id="main">
        <Hero onGetStarted={onGetStarted} />
        <Features />
        <Suspense fallback={<SectionFallback />}>
          <Demo />
          <HowItWorks />
          <Destinations onGetStarted={onGetStarted} />
          <CrowdSection onGetStarted={onGetStarted} />
          <Testimonials />
          <Pricing onGetStarted={onGetStarted} />
          <CTA onGetStarted={onGetStarted} />
          <Footer />
        </Suspense>
      </main>
    </div>
  )
}
