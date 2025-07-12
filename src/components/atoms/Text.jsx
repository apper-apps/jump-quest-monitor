import React, { forwardRef } from "react"
import { cn } from "@/utils/cn"

const Text = forwardRef(({ className, variant = "body", children, ...props }, ref) => {
  const variants = {
    display: "font-pixel text-lg text-white drop-shadow-lg",
    title: "font-pixel text-base text-white drop-shadow-md",
    body: "font-pixel text-xs text-white drop-shadow-sm",
    caption: "font-pixel text-[10px] text-white drop-shadow-sm",
    score: "font-pixel text-sm text-game-gold drop-shadow-lg"
  }

  return (
    <span
      ref={ref}
      className={cn(variants[variant], className)}
      {...props}
    >
      {children}
    </span>
  )
})

Text.displayName = "Text"

export default Text