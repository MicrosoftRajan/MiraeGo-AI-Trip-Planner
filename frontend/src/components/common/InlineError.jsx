/**
 * Compact field / form alert line.
 */
export default function InlineError({ children, id, className = '' }) {
  if (!children) return null

  return (
    <p
      id={id}
      role="alert"
      className={className || 'mt-2 text-sm text-coral'}
    >
      {children}
    </p>
  )
}
