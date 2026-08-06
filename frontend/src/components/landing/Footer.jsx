import { FiGithub, FiLinkedin, FiMail } from 'react-icons/fi'

const LINKS = [
  { href: '#features', label: 'Features' },
  { href: '#how-it-works', label: 'How It Works' },
  { href: '#pricing', label: 'Pricing' },
]

const SOCIAL = [
  { href: 'https://github.com', label: 'GitHub', Icon: FiGithub },
  { href: 'https://linkedin.com', label: 'LinkedIn', Icon: FiLinkedin },
  { href: 'mailto:hello@gilora.app', label: 'Email', Icon: FiMail },
]

export default function Footer() {
  return (
    <footer className="border-t border-[#252A31] pb-12 pt-16" role="contentinfo">
      <div className="mx-auto max-w-5xl px-5 sm:px-8">
        <div className="flex flex-col items-center justify-between gap-8 sm:flex-row">
          <div className="flex items-center gap-3">
            <img
              src="/logo/Miraego.png"
              alt=""
              width={32}
              height={32}
              className="h-8 w-8 rounded-md bg-white object-contain p-0.5"
            />
            <div>
              <p className="lp-display text-sm font-semibold text-white">Miraego</p>
              <p className="text-xs text-[#A2AAB7]">AI-powered travel planning</p>
            </div>
          </div>

          <nav aria-label="Footer" className="flex flex-wrap items-center justify-center gap-6">
            {LINKS.map((link) => (
              <a
                key={link.label}
                href={link.href}
                className="text-[13px] text-[#A2AAB7] transition-colors hover:text-white"
              >
                {link.label}
              </a>
            ))}
          </nav>

          <nav aria-label="Social links" className="flex items-center gap-2">
            {SOCIAL.map(({ href, label, Icon }) => (
              <a
                key={label}
                href={href}
                target={href.startsWith('mailto:') ? undefined : '_blank'}
                rel={href.startsWith('mailto:') ? undefined : 'noopener noreferrer'}
                aria-label={label}
                className="flex h-9 w-9 items-center justify-center rounded-md border border-[#2A2E35] text-[#A2AAB7] transition-colors hover:border-[#3A404A] hover:text-white"
              >
                <Icon size={16} aria-hidden />
              </a>
            ))}
          </nav>
        </div>

        <p className="mt-12 text-center text-xs text-[#A2AAB7]">
          © {new Date().getFullYear()} Miraego. Crafted for explorers.
        </p>
      </div>
    </footer>
  )
}
