"use client"

import React, { useEffect, useState } from "react"
import { Check } from "lucide-react"
import { cn } from "@/lib/utils"

interface CustomStepperProps {
  steps: string[]
  activeStep: number
  loading?: boolean
  handleStepClick?: (step: number) => void
  className?: string
}

const CustomStepper = ({ steps, activeStep, loading = false, handleStepClick, className }: CustomStepperProps) => {
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const checkScreenSize = () => {
      setIsMobile(window.innerWidth < 768)
    }

    // Initial check
    checkScreenSize()

    // Add event listener for resize
    window.addEventListener("resize", checkScreenSize)

    // Cleanup
    return () => window.removeEventListener("resize", checkScreenSize)
  }, [])

  const visibleSteps = isMobile
    ? [
      // Always show first step
      steps[0],
      // Show active step and one before/after if they exist
      ...(activeStep > 0 && activeStep < steps.length - 1 ? [steps[activeStep]] : []),
      // Always show last step
      steps[steps.length - 1],
    ]
    : steps

  const getStepIndex = (step: string) => {
    return steps.findIndex((s) => s === step)
  }

  return (
    <div className={cn("w-full mb-6 relative", className)}>
      <div className="flex items-center justify-between w-full">
        {steps.map((label, idx) => {
          const isActive = idx === activeStep;
          const isCompleted = idx < activeStep;
          const isLast = idx === steps.length - 1;

          return (
            <React.Fragment key={label}>
              <div
                className={cn(
                  "flex items-center",
                  handleStepClick ? "cursor-pointer" : ""
                )}
                onClick={() => handleStepClick?.(idx)}
              >
                <div
                  className={cn(
                    "w-8 h-8 flex items-center justify-center rounded-full border-2 transition-all duration-300",
                    isCompleted
                      ? "bg-white border-blue-500 text-blue-500"
                      : isActive
                        ? "bg-white border-blue-500 text-blue-500"
                        : "bg-white border-gray-300 text-gray-400"
                  )}
                >
                  {isCompleted ? (
                    <span className="font-bold text-blue-500">{idx + 1}</span>
                  ) : (
                    <span className="font-bold">{idx + 1}</span>
                  )}
                </div>
                <span
                  className={cn(
                    "ml-2 font-medium heading-text",
                    isActive
                      ? "text-blue-600"
                      : isCompleted
                        ? "text-gray-800 dark:text-gray-100"
                        : "text-gray-500"
                  )}
                >
                  {label}
                </span>
              </div>
              {!isLast && (
                <div
                  className={cn(
                    "flex-1 h-0.5 mx-2",
                    idx < activeStep
                      ? "bg-blue-500"
                      : "bg-gray-200"
                  )}
                  style={{ minWidth: 40 }}
                />
              )}
            </React.Fragment>
          );
        })}
      </div>
    </div>
  )
}

export default CustomStepper
