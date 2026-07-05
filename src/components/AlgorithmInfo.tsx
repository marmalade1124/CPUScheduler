import React from 'react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Info } from 'lucide-react'
import { AlgorithmType } from '@/types'
import { useSchedulingStore } from '@/store/useSchedulingStore'
import { Button } from '@/components/ui/button'

const ALGORITHM_DETAILS: Record<AlgorithmType, { title: string, type: string, description: string, solve: string[] }> = {
  FCFS: {
    title: "First Come First Serve (FCFS)",
    type: "Non-Preemptive",
    description: "Processes are dispatched according to their arrival time. The process that arrives first gets the CPU first. Once a process starts, it runs to completion.",
    solve: [
      "Sort all processes purely by Arrival Time.",
      "Execute the first process until its Burst Time is 0.",
      "Move to the next process in the queue.",
      "Note: This algorithm often suffers from the Convoy Effect, where short processes get stuck waiting behind a very long process."
    ]
  },
  SJF: {
    title: "Shortest Job First (SJF)",
    type: "Non-Preemptive",
    description: "The CPU is allocated to the process with the smallest Burst Time among all processes currently in the Ready Queue.",
    solve: [
      "Look at the current time and determine which processes have already arrived.",
      "Among the available processes, pick the one with the lowest Burst Time.",
      "Execute it until completion.",
      "When finished, re-evaluate the Ready Queue and pick the next shortest job."
    ]
  },
  SRTF: {
    title: "Shortest Remaining Time First (SRTF)",
    type: "Preemptive",
    description: "A preemptive version of SJF. If a new process arrives with a Burst Time shorter than what is remaining of the currently executing process, the current process is interrupted (preempted).",
    solve: [
      "Execute the process with the shortest Burst Time.",
      "Every time a new process arrives, compare its Burst Time to the Remaining Time of the currently running process.",
      "If the new process is shorter, preempt the current process and switch the CPU to the new one.",
      "Continue this check at every arrival interval."
    ]
  },
  Priority_NonPreemptive: {
    title: "Priority Scheduling",
    type: "Non-Preemptive",
    description: "Each process is assigned a priority value. The CPU is given to the process with the highest priority (in this visualizer, a lower number = higher priority).",
    solve: [
      "Among all arrived processes, execute the one with the highest priority until completion.",
      "If there is a tie, fall back to FCFS (earliest arrival)."
    ]
  },
  Priority_Preemptive: {
    title: "Priority Scheduling",
    type: "Preemptive",
    description: "Each process is assigned a priority value. The CPU is given to the process with the highest priority (in this visualizer, a lower number = higher priority).",
    solve: [
      "Execute the highest priority process.",
      "Every time a new process arrives, check its priority against the currently running process.",
      "If the new process has a higher priority, preempt the current process immediately."
    ]
  },
  RoundRobin: {
    title: "Round Robin (RR)",
    type: "Preemptive",
    description: "Designed specifically for time-sharing systems. Each process gets a small unit of CPU time (called a Time Quantum). After this time elapses, the process is preempted and added to the end of the Ready Queue.",
    solve: [
      "Execute the first process in the queue for exactly Q time units (the Time Quantum).",
      "If the process finishes before Q expires, release the CPU immediately and move to the next process.",
      "If the process does not finish within Q, pause it, add it to the back of the Ready Queue, and switch to the next process in line.",
      "Crucial Rule: If a process finishes its quantum at the exact same time a new process arrives, the newly arrived process joins the queue before the preempted process is sent to the back."
    ]
  }
}

export function AlgorithmInfo() {
  const { algorithm } = useSchedulingStore()
  const info = ALGORITHM_DETAILS[algorithm]

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="ghost" size="icon" className="h-6 w-6 rounded-full text-indigo-500 hover:text-indigo-700 hover:bg-indigo-50">
          <Info className="h-4 w-4" />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="text-xl text-indigo-900 flex items-center gap-2">
            <Info className="w-5 h-5 text-indigo-600" />
            {info.title}
          </DialogTitle>
        </DialogHeader>
        <div className="space-y-4 pt-4">
          <div>
            <span className={`text-xs font-bold px-2 py-1 rounded ${info.type === 'Preemptive' ? 'bg-amber-100 text-amber-700' : 'bg-emerald-100 text-emerald-700'}`}>
              {info.type}
            </span>
          </div>
          <p className="text-sm text-slate-700 leading-relaxed">
            {info.description}
          </p>
          <div className="bg-slate-50 p-4 rounded-lg border border-slate-100">
            <h4 className="text-sm font-bold text-slate-900 mb-2 uppercase tracking-wide">How to solve</h4>
            <ol className="list-decimal list-inside space-y-2 text-sm text-slate-700">
              {info.solve.map((step, i) => (
                <li key={i} className="leading-relaxed">
                  {step.includes(':') ? (
                    <>
                      <strong className="text-slate-900">{step.split(':')[0]}:</strong>
                      {step.split(':')[1]}
                    </>
                  ) : (
                    step
                  )}
                </li>
              ))}
            </ol>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
