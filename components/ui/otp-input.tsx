"use client"

import * as React from "react"
import { cn } from "@/lib/utils"

interface OTPInputProps {
  length?: number
  value: string
  onChange: (value: string) => void
  onComplete?: (value: string) => void
  className?: string
  disabled?: boolean
  error?: boolean
  autoFocus?: boolean
}

const OTPInput = React.forwardRef<HTMLDivElement, OTPInputProps>(
  ({ 
    length = 6, 
    value, 
    onChange, 
    onComplete, 
    className, 
    disabled = false, 
    error = false,
    autoFocus = true 
  }, ref) => {
    const inputRefs = React.useRef<(HTMLInputElement | null)[]>([])
    const [activeIndex, setActiveIndex] = React.useState(0)

    // Initialize input refs array
    React.useEffect(() => {
      inputRefs.current = inputRefs.current.slice(0, length)
    }, [length])

    // Auto-focus first input
    React.useEffect(() => {
      if (autoFocus && inputRefs.current[0]) {
        inputRefs.current[0].focus()
      }
    }, [autoFocus])

    // Call onComplete when OTP is fully entered
    React.useEffect(() => {
      if (value.length === length && onComplete) {
        onComplete(value)
      }
    }, [value, length, onComplete])

    const handleChange = (index: number, digit: string) => {
      if (disabled) return

      // Only allow single digits
      const newDigit = digit.replace(/\D/g, '').slice(-1)
      
      const newValue = value.split('')
      newValue[index] = newDigit
      
      // Remove empty trailing elements
      while (newValue.length > 0 && newValue[newValue.length - 1] === '') {
        newValue.pop()
      }
      
      const updatedValue = newValue.join('').slice(0, length)
      onChange(updatedValue)

      // Move to next input if digit was entered
      if (newDigit && index < length - 1) {
        const nextInput = inputRefs.current[index + 1]
        if (nextInput) {
          nextInput.focus()
          setActiveIndex(index + 1)
        }
      }
    }

    const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
      if (disabled) return

      if (e.key === 'Backspace') {
        e.preventDefault()
        
        if (value[index]) {
          // Clear current digit
          const newValue = value.split('')
          newValue[index] = ''
          onChange(newValue.join('').replace(/\s+$/, ''))
        } else if (index > 0) {
          // Move to previous input and clear it
          const prevInput = inputRefs.current[index - 1]
          if (prevInput) {
            prevInput.focus()
            setActiveIndex(index - 1)
            const newValue = value.split('')
            newValue[index - 1] = ''
            onChange(newValue.join('').replace(/\s+$/, ''))
          }
        }
      } else if (e.key === 'ArrowLeft' && index > 0) {
        e.preventDefault()
        const prevInput = inputRefs.current[index - 1]
        if (prevInput) {
          prevInput.focus()
          setActiveIndex(index - 1)
        }
      } else if (e.key === 'ArrowRight' && index < length - 1) {
        e.preventDefault()
        const nextInput = inputRefs.current[index + 1]
        if (nextInput) {
          nextInput.focus()
          setActiveIndex(index + 1)
        }
      } else if (e.key === 'Enter') {
        e.preventDefault()
        if (value.length === length && onComplete) {
          onComplete(value)
        }
      }
    }

    const handleFocus = (index: number) => {
      setActiveIndex(index)
    }

    const handlePaste = (e: React.ClipboardEvent) => {
      e.preventDefault()
      const pastedData = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, length)
      onChange(pastedData)
      
      // Focus the next empty input or the last input
      const nextIndex = Math.min(pastedData.length, length - 1)
      const nextInput = inputRefs.current[nextIndex]
      if (nextInput) {
        nextInput.focus()
        setActiveIndex(nextIndex)
      }
    }

    return (
      <div
        ref={ref}
        className={cn(
          "flex items-center gap-3 p-4 rounded-xl bg-gradient-to-r from-blue-50/50 via-indigo-50/30 to-purple-50/50 border border-blue-100/50 shadow-sm",
          "dark:from-blue-950/20 dark:via-indigo-950/20 dark:to-purple-950/20 dark:border-blue-800/30",
          className
        )}
        onPaste={handlePaste}
      >
        {Array.from({ length }, (_, index) => (
          <input
            key={index}
            ref={(el) => {
              inputRefs.current[index] = el
            }}
            type="text"
            inputMode="numeric"
            pattern="[0-9]*"
            maxLength={1}
            value={value[index] || ''}
            onChange={(e) => handleChange(index, e.target.value)}
            onKeyDown={(e) => handleKeyDown(index, e)}
            onFocus={() => handleFocus(index)}
            disabled={disabled}
            className={cn(
              "flex h-12 w-12 items-center justify-center rounded-lg border text-center text-lg font-medium transition-all duration-200",
              "border-slate-200 bg-white text-slate-700 shadow-sm hover:shadow-md",
              "focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:ring-offset-2",
              "disabled:cursor-not-allowed disabled:opacity-50 disabled:bg-slate-50",
              error && "border-red-300 focus:ring-red-500 focus:border-red-500 bg-red-50 text-red-700",
              activeIndex === index && !error && "ring-2 ring-blue-500 ring-offset-2 border-blue-500",
              value[index] && !error && "border-blue-400 bg-blue-50 text-blue-800 shadow-sm",
              "dark:border-slate-600 dark:bg-slate-800 dark:text-slate-200",
              "dark:focus:ring-blue-400 dark:focus:border-blue-400",
              error && "dark:border-red-500 dark:bg-red-900/20 dark:text-red-400",
              value[index] && !error && "dark:border-blue-500 dark:bg-blue-900/20 dark:text-blue-300",
              className
            )}
            aria-label={`Digit ${index + 1}`}
          />
        ))}
      </div>
    )
  }
)

OTPInput.displayName = "OTPInput"

export { OTPInput }
