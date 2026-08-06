"use client"

import { AnimatePresence, motion, useSpring } from "framer-motion"
import { Play, Plus } from "lucide-react"
import {
  MediaControlBar,
  MediaController,
  MediaMuteButton,
  MediaPlayButton,
  MediaSeekBackwardButton,
  MediaSeekForwardButton,
  MediaTimeDisplay,
  MediaTimeRange,
  MediaVolumeRange,
} from "media-chrome/react"
import { useState } from "react"

import { cn } from "@/lib/utils"

const DEFAULT_SRC = "https://skiper-ui.com/showreel/skiper-ui-showreel.mp4"

export const VideoPlayer = ({ style, ...props }) => (
  <MediaController
    style={{
      ...style,
    }}
    {...props}
  />
)

export const VideoPlayerControlBar = (props) => <MediaControlBar {...props} />

export const VideoPlayerTimeRange = ({ className, ...props }) => (
  <MediaTimeRange
    className={cn(
      "[--media-range-thumb-opacity:0] [--media-range-track-height:2px]",
      className
    )}
    {...props}
  />
)

export const VideoPlayerTimeDisplay = ({ className, ...props }) => (
  <MediaTimeDisplay className={cn("p-2.5", className)} {...props} />
)

export const VideoPlayerVolumeRange = ({ className, ...props }) => (
  <MediaVolumeRange className={cn("p-2.5", className)} {...props} />
)

export const VideoPlayerPlayButton = ({ className, ...props }) => (
  <MediaPlayButton className={cn("", className)} {...props} />
)

export const VideoPlayerSeekBackwardButton = ({ className, ...props }) => (
  <MediaSeekBackwardButton className={cn("p-2.5", className)} {...props} />
)

export const VideoPlayerSeekForwardButton = ({ className, ...props }) => (
  <MediaSeekForwardButton className={cn("p-2.5", className)} {...props} />
)

export const VideoPlayerMuteButton = ({ className, ...props }) => (
  <MediaMuteButton className={cn("", className)} {...props} />
)

export const VideoPlayerContent = ({ className, ...props }) => (
  <video className={cn("mb-0 mt-0", className)} {...props} />
)

export const Skiper67 = ({
  src = DEFAULT_SRC,
  className,
  previewClassName,
  hint = "Click the video to play",
}) => {
  const [showVideoPopOver, setShowVideoPopOver] = useState(false)

  const SPRING = {
    mass: 0.1,
  }

  const x = useSpring(0, SPRING)
  const y = useSpring(0, SPRING)
  const opacity = useSpring(0, SPRING)

  const handlePointerMove = (e) => {
    opacity.set(1)
    const bounds = e.currentTarget.getBoundingClientRect()
    x.set(e.clientX - bounds.left)
    y.set(e.clientY - bounds.top)
  }

  return (
    <div
      className={cn(
        "relative flex h-full min-h-[22rem] w-full items-center justify-center sm:min-h-[26rem]",
        className
      )}
    >
      <div className="absolute top-1/4 grid content-start justify-items-center gap-6 text-center">
        <span className="relative max-w-[16ch] text-xs uppercase leading-tight tracking-wider text-[#A2AAB7] after:absolute after:left-1/2 after:top-full after:h-16 after:w-px after:bg-gradient-to-b after:from-[#A2AAB7]/40 after:to-transparent after:content-['']">
          {hint}
        </span>
      </div>

      <AnimatePresence>
        {showVideoPopOver && (
          <VideoPopOver
            src={src}
            setShowVideoPopOver={setShowVideoPopOver}
          />
        )}
      </AnimatePresence>

      <button
        type="button"
        onMouseMove={handlePointerMove}
        onMouseLeave={() => {
          opacity.set(0)
        }}
        onClick={() => setShowVideoPopOver(true)}
        aria-label="Play demo video"
        className={cn(
          "relative size-45 cursor-none overflow-hidden rounded-xl border border-[#2A2E35] bg-[#101216] shadow-[0_0_0_1px_rgba(106,82,224,0.12)] outline-none transition-[border-color,box-shadow] focus-visible:border-[#6A52E0]/65 focus-visible:shadow-[0_0_0_3px_rgba(106,82,224,0.25)]",
          previewClassName
        )}
      >
        <video
          autoPlay
          muted
          playsInline
          loop
          className="absolute inset-0 h-full w-full object-cover"
        >
          <source src={src} />
        </video>
        <motion.div
          style={{ x, y, opacity }}
          className="pointer-events-none absolute left-0 top-0 z-20 flex w-fit select-none items-center justify-center gap-2 p-2 text-sm text-white mix-blend-exclusion"
        >
          <Play className="size-4 fill-white" /> Play
        </motion.div>
      </button>
    </div>
  )
}

const VideoPopOver = ({ src, setShowVideoPopOver }) => {
  return (
    <div className="fixed left-0 top-0 z-[101] flex h-screen w-screen items-center justify-center">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.2 }}
        className="absolute left-0 top-0 h-full w-full bg-[#0B0D10]/90 backdrop-blur-lg"
        onClick={() => setShowVideoPopOver(false)}
      />
      <motion.div
        initial={{ clipPath: "inset(43.5% 43.5% 33.5% 43.5%)", opacity: 0 }}
        animate={{ clipPath: "inset(0 0 0 0)", opacity: 1 }}
        exit={{
          clipPath: "inset(43.5% 43.5% 33.5% 43.5%)",
          opacity: 0,
          transition: {
            duration: 1,
            type: "spring",
            stiffness: 100,
            damping: 20,
            opacity: { duration: 0.2, delay: 0.8 },
          },
        }}
        transition={{
          duration: 1,
          type: "spring",
          stiffness: 100,
          damping: 20,
        }}
        className="relative aspect-video w-[min(100vw-1.5rem,80rem)] overflow-hidden rounded-xl"
      >
        <VideoPlayer style={{ width: "100%", height: "100%" }}>
          <VideoPlayerContent
            src={src}
            autoPlay
            slot="media"
            className="h-full w-full object-cover"
            style={{ width: "100%", height: "100%" }}
          />

          <button
            type="button"
            onClick={() => setShowVideoPopOver(false)}
            aria-label="Close video"
            className="absolute right-2 top-2 z-10 cursor-pointer rounded-full p-1 transition-colors hover:bg-white/10"
          >
            <Plus className="size-5 rotate-45 text-white" />
          </button>
          <VideoPlayerControlBar className="absolute bottom-0 left-1/2 flex w-full max-w-7xl -translate-x-1/2 items-center justify-center px-5 mix-blend-exclusion md:px-10 md:py-5">
            <VideoPlayerPlayButton className="h-4 bg-transparent" />
            <VideoPlayerTimeRange className="bg-transparent" />
            <VideoPlayerMuteButton className="size-4 bg-transparent" />
          </VideoPlayerControlBar>
        </VideoPlayer>
      </motion.div>
    </div>
  )
}

export default Skiper67
