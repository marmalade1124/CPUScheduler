import React from 'react'
import { useSchedulingStore } from '@/store/useSchedulingStore'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { motion, AnimatePresence } from 'framer-motion'
import { Cpu, CheckCircle2 } from 'lucide-react'

export function CpuState() {
  const { currentStep, simulationResult } = useSchedulingStore()
  
  if (!simulationResult) return null

  const stepState = simulationResult.steps[currentStep]
  const runningProcess = stepState?.runningProcess
  const completedProcesses = stepState?.completedProcesses || []

  // To find remaining time of running process, we can look at the simulationResult processes
  // But wait, the exact remaining time at THIS step might be different if it's mid-execution.
  // Actually, we need to know the state of the process at this exact time.
  // Wait, our engine step doesn't store remainingTime of running process explicitly,
  // but it's just the previous remainingTime - (time - startTime), etc.
  // We can just find the process in `processes` and calculate, or better yet, we can approximate
  // or use the original burst time minus how much time it has executed up to this step.
  // Actually, let's just display the ID for now.

  return (
    <Card className="h-full">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg flex items-center gap-2">
          <Cpu className="w-5 h-5 text-blue-500" /> CPU State
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        
        <div className="bg-slate-900 text-white p-6 rounded-xl relative overflow-hidden h-32 flex items-center justify-center">
          {/* Subtle pulse animation for background if running */}
          {runningProcess && (
            <motion.div 
              className="absolute inset-0 bg-blue-500/20"
              animate={{ opacity: [0.3, 0.6, 0.3] }}
              transition={{ repeat: Infinity, duration: 2 }}
            />
          )}
          
          <AnimatePresence mode="wait">
            {runningProcess ? (
              <motion.div
                key={runningProcess}
                initial={{ scale: 0.5, opacity: 0, y: 20 }}
                animate={{ scale: 1, opacity: 1, y: 0 }}
                exit={{ scale: 1.5, opacity: 0 }}
                transition={{ type: "spring" }}
                className="relative z-10 text-center"
              >
                <div className="text-sm text-slate-400 mb-1 uppercase tracking-widest font-semibold">Running</div>
                <div className="text-4xl font-black drop-shadow-md">{runningProcess}</div>
              </motion.div>
            ) : (
              <motion.div
                key="idle"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="relative z-10 text-slate-500 text-center"
              >
                <div className="text-2xl font-bold italic mb-1">IDLE</div>
                <div className="text-sm">Waiting for process...</div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <div>
          <h4 className="text-xs font-semibold text-slate-500 uppercase mb-2">Completed Jobs</h4>
          <div className="flex flex-wrap gap-2">
            {completedProcesses.length === 0 ? (
              <span className="text-sm text-slate-400 italic">None yet</span>
            ) : (
              completedProcesses.map(pid => (
                <motion.div
                  key={pid}
                  initial={{ opacity: 0, scale: 0 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="flex items-center gap-1 bg-emerald-50 text-emerald-700 px-2 py-1 rounded-md text-xs font-bold border border-emerald-200"
                >
                  <CheckCircle2 className="w-3 h-3" />
                  {pid}
                </motion.div>
              ))
            )}
          </div>
        </div>

      </CardContent>
    </Card>
  )
}
