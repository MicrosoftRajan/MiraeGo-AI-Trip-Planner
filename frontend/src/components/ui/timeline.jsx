"use client"
import { useScroll, useTransform, motion } from "motion/react"
import { useEffect, useRef, useState } from "react"
import { cn } from "@/lib/utils"

export const Timeline = ({
  data,
  title,
  description,
  className,
}) => {
  const ref = useRef(null)
  const containerRef = useRef(null)
  const [height, setHeight] = useState(0)

  useEffect(() => {
    if (!ref.current) return undefined

    const updateHeight = () => {
      if (ref.current) {
        setHeight(ref.current.getBoundingClientRect().height)
      }
    }

    updateHeight()
    const observer = new ResizeObserver(updateHeight)
    observer.observe(ref.current)
    return () => observer.disconnect()
  }, [data])

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start 10%", "end 50%"],
  })

  const heightTransform = useTransform(scrollYProgress, [0, 1], [0, height])
  const opacityTransform = useTransform(scrollYProgress, [0, 0.1], [0, 1])

  return (
    <div
      className={cn("w-full bg-white font-sans md:px-4", className)}
      ref={containerRef}
    >
      {(title || description) && (
        <div className="mx-auto max-w-7xl px-4 pb-6 pt-4 md:px-6 lg:px-8">
          {title ? (
            <h2 className="mb-2 max-w-4xl text-2xl font-semibold tracking-tight text-[#111111] md:text-3xl">
              {title}
            </h2>
          ) : null}
          {description ? (
            <p className="max-w-md text-sm text-[#6b7280] md:text-base">
              {description}
            </p>
          ) : null}
        </div>
      )}

      <div ref={ref} className="relative mx-auto max-w-7xl pb-12">
        {data.map((item, index) => (
          <div
            key={item.id ?? index}
            className="flex justify-start pt-8 md:gap-8 md:pt-16"
          >
            <div className="sticky top-28 z-40 flex max-w-xs flex-col items-center self-start md:w-full md:flex-row lg:max-w-[11rem]">
              <div className="absolute left-3 flex h-10 w-10 items-center justify-center rounded-full bg-white md:left-3">
                <div className="h-3 w-3 rounded-full border border-[#d4d4d8] bg-[#111111] p-1.5" />
              </div>
              <h3 className="hidden text-xl font-bold text-[#9ca3af] md:block md:pl-16 md:text-3xl lg:text-4xl">
                {item.title}
              </h3>
            </div>

            <div className="relative w-full pl-16 pr-4 md:pl-4">
              <h3 className="mb-3 block text-left text-xl font-bold text-[#9ca3af] md:hidden">
                {item.title}
              </h3>
              {item.content}
            </div>
          </div>
        ))}

        <div
          style={{ height: `${height}px` }}
          className="absolute left-8 top-0 w-[2px] overflow-hidden bg-[linear-gradient(to_bottom,var(--tw-gradient-stops))] from-transparent from-[0%] via-[#e5e5e5] to-transparent to-[99%] [mask-image:linear-gradient(to_bottom,transparent_0%,black_10%,black_90%,transparent_100%)] md:left-8"
        >
          <motion.div
            style={{
              height: heightTransform,
              opacity: opacityTransform,
            }}
            className="absolute inset-x-0 top-0 w-[2px] rounded-full bg-gradient-to-t from-[#111111] via-[#525252] to-transparent from-[0%] via-[10%]"
          />
        </div>
      </div>
    </div>
  )
}
