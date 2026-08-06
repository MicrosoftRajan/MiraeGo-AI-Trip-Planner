export function PrimaryButton({ children, onClick, className = '', ariaLabel }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={ariaLabel}
      className={`inline-flex items-center justify-center gap-2 rounded-lg border border-[#23262B] bg-[#17191D] px-5 py-2.5 text-sm font-semibold text-white transition-colors duration-200 hover:border-[#31343B] hover:bg-[#1D2025] focus-visible:outline-none ${className}`}
    >
      {children}
    </button>
  )
}

export function SecondaryButton({ children, onClick, href, className = '', ariaLabel }) {
  const base =
    'inline-flex items-center justify-center gap-2 rounded-lg border border-[#2B2F36] bg-transparent px-5 py-2.5 text-sm font-semibold text-[#C9CED6] transition-colors duration-200 hover:border-[#3A3F48] hover:text-white'

  if (href) {
    return (
      <a href={href} aria-label={ariaLabel} className={`${base} ${className}`}>
        {children}
      </a>
    )
  }

  return (
    <button type="button" onClick={onClick} aria-label={ariaLabel} className={`${base} ${className}`}>
      {children}
    </button>
  )
}

export function ShimmerButton({ children, onClick, className = '', ariaLabel, disabled }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={ariaLabel}
      disabled={disabled}
      className={`inline-flex h-11 items-center justify-center rounded-lg border border-[#2B2F36] bg-[#131518] px-6 text-sm font-medium text-[#C9CED6] transition-colors duration-200 hover:bg-[#171A1F] focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50 ${className}`}
    >
      {children}
    </button>
  )
}

export function SolidButton({ children, onClick, className = '', ariaLabel }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={ariaLabel}
      className={`rounded-lg bg-[#6A52E0] px-6 py-2.5 text-sm font-semibold text-white transition-colors duration-200 hover:bg-[#5B46C1] focus-visible:outline-none ${className}`}
    >
      {children}
    </button>
  )
}
