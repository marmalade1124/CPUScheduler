import React from 'react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { useSchedulingStore } from '@/store/useSchedulingStore'
import { Play, Cpu, CheckCircle2, GraduationCap } from 'lucide-react'

export function WelcomeTutorial() {
  const { hasSeenTutorial, setHasSeenTutorial } = useSchedulingStore()

  return (
    <Dialog open={!hasSeenTutorial} onOpenChange={(open) => !open && setHasSeenTutorial(true)}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <div className="mx-auto w-12 h-12 bg-indigo-100 text-indigo-600 rounded-full flex items-center justify-center mb-4">
            <Cpu className="w-6 h-6" />
          </div>
          <DialogTitle className="text-center text-2xl font-bold text-slate-800">
            Welcome to CPU Scheduler
          </DialogTitle>
          <DialogDescription className="text-center text-slate-500 pt-2">
            An interactive visualizer to help you understand Operating System scheduling algorithms.
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-4 py-4">
          <div className="flex items-start gap-3">
            <div className="bg-emerald-100 p-2 rounded-lg text-emerald-600 shrink-0">
              <CheckCircle2 className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-semibold text-slate-800 text-sm">Configure Processes</h4>
              <p className="text-sm text-slate-500 mt-1">Use the left panel to add processes, randomize inputs, and select algorithms like FCFS, SJF, or Round Robin.</p>
            </div>
          </div>
          
          <div className="flex items-start gap-3">
            <div className="bg-blue-100 p-2 rounded-lg text-blue-600 shrink-0">
              <Play className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-semibold text-slate-800 text-sm">Watch the Simulation</h4>
              <p className="text-sm text-slate-500 mt-1">Click "Solve Scheduling" to watch the timeline animate step-by-step. Use the Spacebar to play/pause the movie mode.</p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="bg-amber-100 p-2 rounded-lg text-amber-600 shrink-0">
              <GraduationCap className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-semibold text-slate-800 text-sm">Practice Mode</h4>
              <p className="text-sm text-slate-500 mt-1">Ready to test your skills? Switch to Quiz Mode using the top navigation bar to solve auto-generated problems.</p>
            </div>
          </div>
        </div>

        <DialogFooter className="sm:justify-center">
          <Button type="button" size="lg" className="w-full bg-indigo-600 hover:bg-indigo-700 font-bold" onClick={() => setHasSeenTutorial(true)}>
            Get Started
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
