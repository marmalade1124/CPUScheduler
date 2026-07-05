import React from 'react'
import { useSchedulingStore } from '@/store/useSchedulingStore'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Play, Plus, Trash2, Shuffle } from 'lucide-react'
import { AlgorithmType } from '@/types'
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip'
import { toast } from 'sonner'
import { AlgorithmInfo } from './AlgorithmInfo'

export function InputPanel() {
  const { processes, algorithm, timeQuantum, setAlgorithm, setTimeQuantum, addProcess, removeProcess, updateProcess, runSimulation } = useSchedulingStore()

  const handleAddProcess = () => {
    const id = `P${processes.length + 1}`
    addProcess({ id, arrivalTime: processes.length, burstTime: Math.floor(Math.random() * 8) + 2, priority: Math.floor(Math.random() * 5) + 1 })
    toast.success(`Process ${id} added`)
  }

  const handleRandomize = () => {
    // Basic randomize implementation
    const count = Math.floor(Math.random() * 3) + 3 // 3 to 5 processes
    useSchedulingStore.getState().setProcesses(
      Array.from({ length: count }).map((_, i) => ({
        id: `P${i + 1}`,
        arrivalTime: Math.floor(Math.random() * 5),
        burstTime: Math.floor(Math.random() * 10) + 1,
        priority: Math.floor(Math.random() * 5) + 1
      }))
    )
    toast.success("Generated random processes")
  }

  const handleRunSimulation = () => {
    if (processes.length === 0) {
      toast.error("Add at least one process to simulate")
      return
    }
    const hasZeroBurst = processes.some(p => p.burstTime <= 0)
    if (hasZeroBurst) {
      toast.error("Burst time must be greater than 0")
      return
    }
    
    runSimulation()
    toast.success("Simulation started")
  }

  return (
    <Card className="h-full border-r border-none rounded-none shadow-none bg-slate-50/50 flex flex-col">
      <CardHeader className="flex-shrink-0">
        <CardTitle className="text-xl font-bold flex items-center gap-2">
          ⚙️ CPU Simulator
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6 flex-1 overflow-y-auto custom-scrollbar">
        
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <label className="text-sm font-semibold text-slate-700">Algorithm</label>
            <AlgorithmInfo />
          </div>
          <Select value={algorithm} onValueChange={(val) => setAlgorithm(val as AlgorithmType)}>
            <SelectTrigger className="bg-white">
              <SelectValue placeholder="Select Algorithm" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="FCFS">First Come First Serve</SelectItem>
              <SelectItem value="SJF">Shortest Job First (Non-Preemptive)</SelectItem>
              <SelectItem value="SRTF">Shortest Remaining Time (Preemptive)</SelectItem>
              <SelectItem value="Priority_NonPreemptive">Priority (Non-Preemptive)</SelectItem>
              <SelectItem value="Priority_Preemptive">Priority (Preemptive)</SelectItem>
              <SelectItem value="RoundRobin">Round Robin</SelectItem>
            </SelectContent>
          </Select>

          {algorithm === 'RoundRobin' && (
            <div className="pt-2 animate-in fade-in slide-in-from-top-2">
              <label className="text-sm font-semibold text-slate-700">Time Quantum</label>
              <Input 
                type="number" 
                min={1} 
                value={timeQuantum} 
                onChange={(e) => setTimeQuantum(parseInt(e.target.value) || 1)}
                className="mt-1 bg-white"
              />
            </div>
          )}
        </div>

        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <label className="text-sm font-semibold text-slate-700">Processes</label>
            <div className="flex gap-1">
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="ghost" size="icon" onClick={handleRandomize} className="h-8 w-8 hover:bg-slate-200">
                    <Shuffle className="w-4 h-4 text-slate-600" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Random Example</TooltipContent>
              </Tooltip>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="ghost" size="icon" onClick={handleAddProcess} className="h-8 w-8 hover:bg-slate-200">
                    <Plus className="w-4 h-4 text-slate-600" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Add Process</TooltipContent>
              </Tooltip>
            </div>
          </div>

          
          <div className="space-y-2">
            {processes.map((p, i) => (
              <div key={p.id} className="bg-white p-3 rounded-xl shadow-sm border border-slate-200 space-y-2 relative group hover:border-indigo-200 transition-colors">
                <div className="flex justify-between items-center mb-1">
                  <span className="font-bold text-sm text-slate-700">{p.id}</span>
                  <Button variant="ghost" size="icon" className="h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-50" onClick={() => removeProcess(p.id)}>
                    <Trash2 className="w-3 h-3 text-red-500" />
                  </Button>
                </div>
                <div className="grid grid-cols-2 gap-3 text-xs">
                  <div>
                    <label className="text-slate-500 font-medium">Arrival</label>
                    <Input 
                      type="number" min={0} 
                      className="h-8 text-xs mt-1" 
                      value={p.arrivalTime} 
                      onChange={(e) => updateProcess(p.id, { arrivalTime: parseInt(e.target.value) || 0 })} 
                    />
                  </div>
                  <div>
                    <label className="text-slate-500 font-medium">Burst</label>
                    <Input 
                      type="number" min={1} 
                      className="h-8 text-xs mt-1" 
                      value={p.burstTime} 
                      onChange={(e) => updateProcess(p.id, { burstTime: Math.max(1, parseInt(e.target.value) || 1) })} 
                    />
                  </div>
                  {(algorithm.includes('Priority')) && (
                    <div className="col-span-2">
                      <label className="text-slate-500 font-medium">Priority</label>
                      <Input 
                        type="number" min={1} 
                        className="h-8 text-xs mt-1" 
                        value={p.priority || 1} 
                        onChange={(e) => updateProcess(p.id, { priority: parseInt(e.target.value) || 1 })} 
                      />
                    </div>
                  )}
                </div>
              </div>
            ))}
            {processes.length === 0 && (
              <div className="text-center py-4 text-slate-400 text-sm italic border-2 border-dashed rounded-xl">
                No processes. Add some to begin.
              </div>
            )}
          </div>
        </div>
      </CardContent>
      <div className="p-4 border-t bg-slate-50/50 flex-shrink-0">
        <Button className="w-full shadow-md bg-indigo-600 hover:bg-indigo-700 transition-all text-white font-bold" size="lg" onClick={handleRunSimulation}>
          <Play className="w-4 h-4 mr-2" />
          Solve Scheduling
        </Button>
      </div>
    </Card>
  )
}
