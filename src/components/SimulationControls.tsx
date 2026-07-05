import React, { useEffect, useCallback } from 'react'
import { useSchedulingStore } from '@/store/useSchedulingStore'
import { Button } from '@/components/ui/button'
import { ChevronLeft, ChevronRight, RotateCcw, FastForward, Play, Pause } from 'lucide-react'

export function SimulationControls() {
  const { currentStep, simulationResult, isPlaying, nextStep, prevStep, setStep, togglePlay, setIsPlaying } = useSchedulingStore()
  
  const totalSteps = simulationResult?.steps.length || 0

  // Keyboard shortcuts
  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if (e.code === 'Space') {
      e.preventDefault()
      togglePlay()
    } else if (e.code === 'ArrowRight') {
      nextStep()
    } else if (e.code === 'ArrowLeft') {
      prevStep()
    }
  }, [togglePlay, nextStep, prevStep])

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [handleKeyDown])

  // Auto-play interval
  useEffect(() => {
    let interval: ReturnType<typeof setInterval>
    if (isPlaying) {
      interval = setInterval(() => {
        nextStep()
      }, 1000) // 1 second per step
    }
    return () => clearInterval(interval)
  }, [isPlaying, nextStep])

  if (!simulationResult) return null

  return (
    <div className="flex items-center gap-2 bg-white px-3 py-1.5 rounded-xl border border-slate-200 shadow-sm">
      <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-500 hover:text-slate-900" onClick={() => setStep(0)} disabled={currentStep === 0} title="Restart">
        <RotateCcw className="w-4 h-4" />
      </Button>
      
      <Button variant="outline" size="sm" className="h-8 gap-1 text-slate-600" onClick={prevStep} disabled={currentStep === 0}>
        <ChevronLeft className="w-4 h-4" /> Prev
      </Button>
      
      <Button 
        variant={isPlaying ? "default" : "secondary"} 
        size="sm" 
        className={`h-8 w-24 gap-1 font-bold ${isPlaying ? 'bg-indigo-600 hover:bg-indigo-700 text-white' : ''}`}
        onClick={togglePlay}
      >
        {isPlaying ? (
          <><Pause className="w-4 h-4" /> Pause</>
        ) : (
          <><Play className="w-4 h-4" /> Play</>
        )}
      </Button>

      <Button variant="outline" size="sm" className="h-8 gap-1 text-slate-600" onClick={nextStep} disabled={currentStep === totalSteps - 1}>
        Next <ChevronRight className="w-4 h-4" />
      </Button>
      
      <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-500 hover:text-slate-900" onClick={() => setStep(totalSteps - 1)} disabled={currentStep === totalSteps - 1} title="Skip to End">
        <FastForward className="w-4 h-4" />
      </Button>
    </div>
  )
}
