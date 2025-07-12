import React, { forwardRef } from "react"
import { cn } from "@/utils/cn"

const Button = forwardRef(({ className, variant = "default", size = "default", children, ...props }, ref) => {
  const variants = {
    default: "pixel-button",
    secondary: "bg-gray-500 border-4 border-gray-700 text-white font-pixel text-xs px-4 py-2 hover:bg-gray-400 active:translate-y-1 transition-all duration-100",
    danger: "bg-game-error border-4 border-red-700 text-white font-pixel text-xs px-4 py-2 hover:bg-red-500 active:translate-y-1 transition-all duration-100"
  }
  
  const sizes = {
    default: "px-4 py-2 text-xs",
    sm: "px-3 py-1 text-[10px]",
    lg: "px-6 py-3 text-sm"
  }

  const baseClasses = "font-pixel transition-all duration-100 active:translate-y-1"
  const variantClasses = variants[variant] || variants.default
  const sizeClasses = sizes[size] || sizes.default
  
  return (
    <button
      ref={ref}
      className={cn(baseClasses, variantClasses, sizeClasses, className)}
      {...props}
    >
      {children}
    </button>
  )
})

Button.displayName = "Button"

export default Button