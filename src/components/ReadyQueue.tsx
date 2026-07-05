import React from 'react'
import { useSchedulingStore } from '@/store/useSchedulingStore'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { motion, AnimatePresence } from 'framer-motion'

export function ReadyQueue() {
  const { currentStep, simulationResult } = useSchedulingStore()
  
  if (!simulationResult) return null

  const stepState = simulationResult.steps[currentStep]
  const readyQueue = stepState?.readyQueue || []

  return (
    <Card className="h-full">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg flex items-center justify-between">
          <span>Ready Queue</span>
          <span className="text-sm font-normal text-slate-500 bg-slate-100 px-2 py-0.5 rounded-full">
            {readyQueue.length} Waiting
          </span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col gap-2 min-h-[160px] p-2 bg-slate-50 rounded-md border border-dashed border-slate-300 overflow-y-auto max-h-[250px] custom-scrollbar">
          <AnimatePresence mode="popLayout">
            {readyQueue.map((item, index) => (
              <motion.div
                key={item.processId}
                layout
                initial={{ opacity: 0, x: -20, scale: 0.9 }}
                animate={{ opacity: 1, x: 0, scale: 1 }}
                exit={{ opacity: 0, x: 20, scale: 0.9 }}
                transition={{ type: "spring", stiffness: 300, damping: 25 }}
                className="bg-white border rounded-md p-3 shadow-sm flex items-center justify-between"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center font-bold text-slate-700">
                    {item.processId}
                  </div>
                  <div className="flex flex-col">
                    <span className="text-xs font-semibold text-slate-500">Remaining</span>
                    <span className="font-mono">{item.remainingTime}</span>
                  </div>
                </div>
                {item.priority !== undefined && (
                  <div className="text-right">
                    <span className="text-[10px] uppercase text-slate-400 font-bold block">Priority</span>
                    <span className="text-sm font-medium">{item.priority}</span>
                  </div>
                )}
              </motion.div>
            ))}
            
            {readyQueue.length === 0 && (
              <motion.div 
                initial={{ opacity: 0 }} 
                animate={{ opacity: 1 }} 
                className="text-center text-slate-400 py-8 text-sm italic h-full flex items-center justify-center"
              >
                Queue is empty
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </CardContent>
    </Card>
  )
}
