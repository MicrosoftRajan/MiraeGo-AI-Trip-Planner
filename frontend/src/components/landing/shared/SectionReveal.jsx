import { motion, useReducedMotion } from 'framer-motion'

const defaultVariants = {
  hidden: { opacity: 0, y: 28 },
  visible: { opacity: 1, y: 0 },
}

const MOTION_TAGS = {
  div: motion.div,
  section: motion.section,
  li: motion.li,
  article: motion.article,
}

export default function SectionReveal({
  children,
  className = '',
  delay = 0,
  once = true,
  as = 'div',
  amount = 0.2,
}) {
  const reduce = useReducedMotion()
  const Tag = MOTION_TAGS[as] || motion.div

  if (reduce) {
    const Static = as
    return <Static className={className}>{children}</Static>
  }

  return (
    <Tag
      className={className}
      initial="hidden"
      whileInView="visible"
      viewport={{ once, amount }}
      variants={defaultVariants}
      transition={{
        duration: 0.7,
        delay,
        ease: [0.22, 1, 0.36, 1],
      }}
    >
      {children}
    </Tag>
  )
}
