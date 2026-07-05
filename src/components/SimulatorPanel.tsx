import React from 'react'
import { useSchedulingStore } from '@/store/useSchedulingStore'
import { SimulationControls } from './SimulationControls'
import { ReadyQueue } from './ReadyQueue'
import { CpuState } from './CpuState'
import { GanttChart } from './GanttChart'
import { EventLog } from './EventLog'
import { MetricsPanel } from './MetricsPanel'
import { motion } from 'framer-motion'
import { Activity } from 'lucide-react'

export function SimulatorPanel() {
  const { isSimulating, simulationResult } = useSchedulingStore()

  if (!isSimulating || !simulationResult) {
    return (
      <div className="h-full flex items-center justify-center bg-gradient-to-br from-slate-50 to-indigo-50/50 p-6">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-md w-full bg-white/80 backdrop-blur-sm p-10 rounded-3xl shadow-[0_20px_50px_-12px_rgba(0,0,0,0.1)] border border-white/50 text-center space-y-6"
        >
          <div className="w-20 h-20 mx-auto bg-indigo-100 text-indigo-600 rounded-2xl flex items-center justify-center shadow-inner">
            <Activity className="w-10 h-10" />
          </div>
          <div>
            <h2 className="text-3xl font-extrabold text-slate-800 tracking-tight mb-2">Ready to Simulate</h2>
            <p className="text-slate-500 text-sm leading-relaxed">
              Configure your processes in the left panel, choose a scheduling algorithm, and click <strong className="text-indigo-600 font-semibold">Solve Scheduling</strong> to watch the visualization unfold step-by-step.
            </p>
          </div>
          <div className="pt-4 border-t border-slate-100 flex justify-center gap-4 text-xs font-semibold text-slate-400">
            <span className="flex items-center gap-1"><kbd className="bg-slate-100 px-1.5 py-0.5 rounded border border-slate-200 shadow-sm text-slate-500">Space</kbd> Auto-play</span>
            <span className="flex items-center gap-1"><kbd className="bg-slate-100 px-1.5 py-0.5 rounded border border-slate-200 shadow-sm text-slate-500">←</kbd> <kbd className="bg-slate-100 px-1.5 py-0.5 rounded border border-slate-200 shadow-sm text-slate-500">→</kbd> Step</span>
          </div>
        </motion.div>
      </div>
    )
  }

  return (
    <div className="h-full flex flex-col bg-slate-50/50 relative">
      <div className="p-6 border-b bg-white/80 backdrop-blur-md sticky top-0 z-20 shadow-sm flex-shrink-0">
        <div className="max-w-6xl mx-auto space-y-6">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-2xl font-extrabold tracking-tight text-slate-800">Timeline Simulation</h2>
              <p className="text-xs text-slate-500 font-medium mt-1 uppercase tracking-wider">Step-by-step Execution</p>
            </div>
            <SimulationControls />
          </div>
          <GanttChart />
        </div>
      </div>
      
      <div className="flex-1 overflow-visible md:overflow-y-auto p-6">
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-2 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <CpuState />
              <ReadyQueue />
            </div>
            <MetricsPanel />
          </div>
          <div className="md:col-span-1">
            <EventLog />
          </div>
        </div>
      </div>
    </div>
  )
}
