import React, { useEffect, useRef } from 'react'
import { useSchedulingStore } from '@/store/useSchedulingStore'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { motion, AnimatePresence } from 'framer-motion'
import { Check, LogIn, LogOut, Play, PauseCircle } from 'lucide-react'

export function EventLog() {
  const { currentStep, maxStepReached, simulationResult, setStep } = useSchedulingStore()
  const scrollRef = useRef<HTMLDivElement>(null)
  
  if (!simulationResult) return null

  // Collect all events up to max step reached (so it doesn't disappear when scrubbing backwards)
  const allEvents = simulationResult.steps.slice(0, maxStepReached + 1).flatMap(s => s.events)
  const currentExplanation = simulationResult.steps[currentStep]?.explanation

  useEffect(() => {
    // Only auto-scroll if we are actually at the max step, otherwise let user read
    if (scrollRef.current && currentStep === maxStepReached) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight
    }
  }, [maxStepReached, currentStep, allEvents.length])

  const getEventIcon = (type: string) => {
    switch (type) {
      case 'ARRIVED': return <LogIn className="w-3 h-3 text-blue-500" />
      case 'STARTED': return <Play className="w-3 h-3 text-emerald-500" />
      case 'FINISHED': return <Check className="w-3 h-3 text-emerald-600" />
      case 'PREEMPTED': return <PauseCircle className="w-3 h-3 text-amber-500" />
      default: return <span className="w-3 h-3 inline-block rounded-full bg-slate-300" />
    }
  }

  return (
    <Card className="h-full flex flex-col">
      <CardHeader className="pb-2 border-b bg-slate-50/50">
        <CardTitle className="text-lg">Event Log</CardTitle>
      </CardHeader>
      <CardContent className="flex-1 p-0 flex flex-col min-h-[300px]">
        <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-3 max-h-[400px] custom-scrollbar">
          <AnimatePresence initial={false}>
            {allEvents.map((event, idx) => {
              const isActive = event.time === currentStep;
              return (
                <motion.div
                  key={`${event.time}-${idx}-${event.type}`}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className={`flex gap-3 text-sm p-2 rounded-md cursor-pointer transition-colors group ${isActive ? 'bg-indigo-100 ring-1 ring-indigo-300' : 'hover:bg-indigo-50'}`}
                  onClick={() => setStep(event.time)}
                  title={`Click to jump to Time ${event.time}`}
                >
                  <div className={`text-xs font-mono w-10 shrink-0 pt-0.5 transition-colors ${isActive ? 'text-indigo-700 font-bold' : 'text-slate-400 group-hover:text-indigo-500'}`}>
                    T={event.time}
                  </div>
                  <div className="flex-1">
                    <div className={`flex items-center gap-1.5 font-medium transition-colors ${isActive ? 'text-indigo-900' : 'text-slate-700 group-hover:text-indigo-700'}`}>
                      {getEventIcon(event.type)}
                      {event.type}
                    </div>
                    <div className={`text-xs mt-0.5 leading-relaxed transition-colors ${isActive ? 'text-indigo-800' : 'text-slate-500 group-hover:text-indigo-600/80'}`}>
                      {event.message}
                    </div>
                  </div>
                </motion.div>
              )
            })}
          </AnimatePresence>
        </div>
        
        {currentExplanation && (
          <div className="p-4 bg-blue-50 border-t border-blue-100 shrink-0">
            <h4 className="text-xs font-bold text-blue-600 uppercase tracking-wider mb-2">AI Explanation</h4>
            <div className="text-sm text-blue-900 whitespace-pre-wrap leading-relaxed">
              {currentExplanation.split('**').map((part, i) => 
                i % 2 === 1 ? <strong key={i} className="font-bold text-indigo-700">{part}</strong> : part
              )}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
