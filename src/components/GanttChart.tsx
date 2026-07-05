import React, { useMemo } from 'react'
import { useSchedulingStore } from '@/store/useSchedulingStore'
import { motion, AnimatePresence } from 'framer-motion'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

interface Block {
  id: string
  start: number
  end: number
  processId: string | null
}

const colorMap: Record<string, string> = {
  P1: "bg-blue-500",
  P2: "bg-emerald-500",
  P3: "bg-amber-500",
  P4: "bg-purple-500",
  P5: "bg-pink-500",
  P6: "bg-indigo-500",
  IDLE: "bg-slate-200",
}

export function GanttChart() {
  const { currentStep, simulationResult } = useSchedulingStore()

  const blocks = useMemo(() => {
    if (!simulationResult) return []
    const visibleSteps = simulationResult.steps.slice(0, currentStep + 1)
    if (visibleSteps.length === 0) return []

    const computedBlocks: Block[] = []
    let currentBlock: Block | null = null

    visibleSteps.forEach((step, i) => {
      const pid = step.runningProcess || 'IDLE'
      if (!currentBlock) {
        currentBlock = { id: `block-${i}`, start: step.time, end: step.time + 1, processId: pid }
      } else if (currentBlock.processId === pid) {
        currentBlock.end = step.time + 1
      } else {
        computedBlocks.push(currentBlock)
        currentBlock = { id: `block-${i}`, start: step.time, end: step.time + 1, processId: pid }
      }
    })
    
    if (currentBlock) {
      computedBlocks.push(currentBlock)
    }
    return computedBlocks
  }, [simulationResult, currentStep])

  if (!simulationResult) return null
  const totalTime = simulationResult.metrics.totalTime || 1 // Avoid div by 0

  return (
    <Card className="shadow-sm border-slate-200">
      <CardHeader className="bg-slate-50/50 border-b pb-4">
        <CardTitle className="text-lg flex items-center gap-2">
          Gantt Chart
        </CardTitle>
      </CardHeader>
      <CardContent className="p-6 overflow-x-auto custom-scrollbar">
        <div className="min-w-[600px] pb-6 pt-2">
          <div className="relative h-16 bg-white rounded-lg border shadow-inner flex overflow-hidden">
            <AnimatePresence>
              {blocks.map((block) => {
                const width = ((block.end - block.start) / totalTime) * 100
                const isIdle = block.processId === 'IDLE'
                return (
                  <motion.div
                    key={block.id}
                    initial={{ opacity: 0, scaleX: 0 }}
                    animate={{ opacity: 1, scaleX: 1 }}
                    transition={{ duration: 0.3, ease: "easeOut" }}
                    style={{ width: `${width}%`, transformOrigin: "left" }}
                    className={`h-full border-r last:border-r-0 flex flex-col justify-center items-center text-white text-xs font-bold ${
                      isIdle ? colorMap.IDLE : (colorMap[block.processId!] || "bg-slate-800")
                    }`}
                  >
                    {!isIdle && <span className="drop-shadow-sm">{block.processId}</span>}
                  </motion.div>
                )
              })}
            </AnimatePresence>
          </div>
          
          {/* Time axis markers */}
          <div className="relative h-4 mt-1 text-xs text-slate-400">
            <div className="absolute left-0 transform -translate-x-1/2">0</div>
            {blocks.map(block => (
              <div 
                key={`marker-${block.id}`} 
                className="absolute transform -translate-x-1/2 transition-all duration-300"
                style={{ left: `${(block.end / totalTime) * 100}%` }}
              >
                {block.end}
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
