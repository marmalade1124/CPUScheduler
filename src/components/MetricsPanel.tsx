import React from 'react'
import { useSchedulingStore } from '@/store/useSchedulingStore'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'

export function MetricsPanel() {
  const { currentStep, simulationResult } = useSchedulingStore()
  
  if (!simulationResult) return null

  const currentTime = simulationResult.steps[currentStep]?.time || 0
  const isFinished = currentStep === simulationResult.steps.length - 1
  
  // Only show processes that have completed up to currentTime
  const visibleProcesses = simulationResult.processes.filter(p => p.completionTime !== null && p.completionTime <= currentTime)
  
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Metrics & Analysis</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        
        <div className="rounded-md border overflow-hidden">
          <Table>
            <TableHeader className="bg-slate-50">
              <TableRow>
                <TableHead>Process</TableHead>
                <TableHead>Arrival</TableHead>
                <TableHead>Burst</TableHead>
                <TableHead>Completion</TableHead>
                <TableHead>Turnaround (TAT)</TableHead>
                <TableHead>Waiting (WT)</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {simulationResult.processes.map(p => {
                const completed = p.completionTime !== null && p.completionTime <= currentTime
                return (
                  <TableRow key={p.id} className={completed ? 'opacity-100' : 'opacity-40'}>
                    <TableCell className="font-medium">{p.id}</TableCell>
                    <TableCell>{p.arrivalTime}</TableCell>
                    <TableCell>{p.burstTime}</TableCell>
                    <TableCell>{completed ? p.completionTime : '-'}</TableCell>
                    <TableCell>{completed ? p.turnaroundTime : '-'}</TableCell>
                    <TableCell>{completed ? p.waitingTime : '-'}</TableCell>
                  </TableRow>
                )
              })}
            </TableBody>
          </Table>
        </div>

        {isFinished && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-4 border-t">
            <MetricCard label="Avg Turnaround" value={simulationResult.metrics.avgTurnaroundTime.toFixed(2)} />
            <MetricCard label="Avg Waiting" value={simulationResult.metrics.avgWaitingTime.toFixed(2)} />
            <MetricCard label="CPU Utilization" value={`${simulationResult.metrics.cpuUtilization.toFixed(1)}%`} />
            <MetricCard label="Context Switches" value={simulationResult.metrics.contextSwitches.toString()} />
          </div>
        )}

      </CardContent>
    </Card>
  )
}

function MetricCard({ label, value }: { label: string, value: string | number }) {
  return (
    <div className="bg-slate-50 p-4 rounded-lg border text-center">
      <div className="text-xs text-slate-500 font-semibold uppercase mb-1">{label}</div>
      <div className="text-xl font-bold text-slate-800">{value}</div>
    </div>
  )
}
