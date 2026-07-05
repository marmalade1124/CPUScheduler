import React, { useState, useEffect } from 'react'
import { useSchedulingStore } from '@/store/useSchedulingStore'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { RefreshCw, Send, CheckCircle2, XCircle } from 'lucide-react'
import { SimulatorPanel } from './SimulatorPanel'

export function QuizPanel() {
  const { quizState, generateQuiz, submitQuiz } = useSchedulingStore()
  const [turnaround, setTurnaround] = useState('')
  const [waiting, setWaiting] = useState('')

  useEffect(() => {
    if (!quizState) {
      generateQuiz()
    }
  }, [quizState, generateQuiz])

  if (!quizState) return null

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    submitQuiz(turnaround, waiting)
  }

  const formatAlgorithm = (algo: string, tq?: number) => {
    if (algo === 'RoundRobin') return `Round Robin (Quantum: ${tq})`
    if (algo === 'Priority_Preemptive') return 'Priority (Preemptive)'
    if (algo === 'Priority_NonPreemptive') return 'Priority (Non-Preemptive)'
    if (algo === 'SRTF') return 'SRTF (Preemptive SJF)'
    return algo
  }

  return (
    <div className="h-full flex flex-col bg-slate-50/50 relative overflow-y-auto custom-scrollbar">
      <div className="p-6 max-w-4xl mx-auto w-full space-y-6">
        <div className="flex justify-between items-end">
          <div>
            <h2 className="text-2xl font-extrabold tracking-tight text-slate-800">Practice Quiz</h2>
            <p className="text-sm text-slate-500 mt-1">Calculate the metrics for the generated scenario.</p>
          </div>
          <Button variant="outline" onClick={() => { setTurnaround(''); setWaiting(''); generateQuiz() }}>
            <RefreshCw className="w-4 h-4 mr-2" />
            New Problem
          </Button>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {/* Problem Statement */}
          <Card className="shadow-sm border-slate-200">
            <CardHeader className="bg-slate-100/50 border-b pb-4">
              <CardTitle className="text-lg text-indigo-900 flex items-center gap-2">
                Problem Definition
              </CardTitle>
              <CardDescription className="text-slate-600 font-medium pt-1">
                Algorithm: <strong className="text-slate-900">{formatAlgorithm(quizState.targetAlgorithm, quizState.targetTimeQuantum)}</strong>
              </CardDescription>
            </CardHeader>
            <CardContent className="p-0">
              <table className="w-full text-sm text-left">
                <thead className="bg-slate-50 text-slate-500 border-b">
                  <tr>
                    <th className="px-4 py-3 font-medium">Process</th>
                    <th className="px-4 py-3 font-medium">Arrival</th>
                    <th className="px-4 py-3 font-medium">Burst</th>
                    {quizState.targetAlgorithm.includes('Priority') && <th className="px-4 py-3 font-medium">Priority</th>}
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {quizState.generatedProcesses.map(p => (
                    <tr key={p.id} className="hover:bg-slate-50/50">
                      <td className="px-4 py-3 font-bold text-slate-700">{p.id}</td>
                      <td className="px-4 py-3 text-slate-600">{p.arrivalTime}</td>
                      <td className="px-4 py-3 text-slate-600">{p.burstTime}</td>
                      {quizState.targetAlgorithm.includes('Priority') && <td className="px-4 py-3 text-slate-600">{p.priority}</td>}
                    </tr>
                  ))}
                </tbody>
              </table>
            </CardContent>
          </Card>

          {/* Submission Form */}
          <Card className="shadow-sm border-slate-200">
            <CardHeader className="bg-slate-100/50 border-b pb-4">
              <CardTitle className="text-lg">Your Answer</CardTitle>
              <CardDescription>Enter your calculated averages (2 decimal places).</CardDescription>
            </CardHeader>
            <CardContent className="p-6">
              {!quizState.isRevealed ? (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label className="text-sm font-semibold text-slate-700 block mb-1">Average Turnaround Time</label>
                    <Input 
                      type="number" step="0.01" required
                      value={turnaround} onChange={e => setTurnaround(e.target.value)}
                      placeholder="e.g. 5.25"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-semibold text-slate-700 block mb-1">Average Waiting Time</label>
                    <Input 
                      type="number" step="0.01" required
                      value={waiting} onChange={e => setWaiting(e.target.value)}
                      placeholder="e.g. 2.50"
                    />
                  </div>
                  <Button type="submit" className="w-full bg-indigo-600 hover:bg-indigo-700">
                    <Send className="w-4 h-4 mr-2" /> Submit Answer
                  </Button>
                </form>
              ) : (
                <div className={`p-6 rounded-xl border flex flex-col items-center text-center space-y-3 ${quizState.isCorrect ? 'bg-emerald-50 border-emerald-200 text-emerald-800' : 'bg-red-50 border-red-200 text-red-800'}`}>
                  {quizState.isCorrect ? <CheckCircle2 className="w-12 h-12 text-emerald-500" /> : <XCircle className="w-12 h-12 text-red-500" />}
                  <h3 className="text-xl font-bold">{quizState.isCorrect ? 'Correct!' : 'Incorrect'}</h3>
                  <p className="text-sm opacity-80">Scroll down to see the step-by-step solution and correct Gantt chart.</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      {quizState.isRevealed && (
        <div className="flex-1 mt-8 border-t-4 border-slate-200 pt-8 animate-in slide-in-from-bottom-8 duration-500 pb-20">
          <div className="max-w-6xl mx-auto px-6 mb-4">
             <h3 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
               🔍 Solution Breakdown
             </h3>
          </div>
          {/* We reuse the SimulatorPanel UI to show the solution */}
          <div className="h-[800px] border rounded-xl overflow-hidden shadow-sm mx-6 bg-white relative">
            <SimulatorPanel />
          </div>
        </div>
      )}
    </div>
  )
}
