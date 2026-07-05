export type AlgorithmType =
  | "FCFS"
  | "SJF"
  | "SRTF"
  | "Priority_NonPreemptive"
  | "Priority_Preemptive"
  | "RoundRobin"

export interface Process {
  id: string // e.g. "P1"
  arrivalTime: number
  burstTime: number
  priority?: number
}

export interface ProcessState extends Process {
  remainingTime: number
  startTime: number | null
  completionTime: number | null
  turnaroundTime: number | null
  waitingTime: number | null
  responseTime: number | null
}

export interface SimulationEvent {
  time: number
  type: "ARRIVED" | "STARTED" | "FINISHED" | "PREEMPTED" | "IDLE" | "CONTINUED"
  processId: string | null
  message: string
}

export interface ReadyQueueItem {
  processId: string
  remainingTime: number
  priority?: number
}

export interface SimulationStep {
  time: number
  runningProcess: string | null
  readyQueue: ReadyQueueItem[]
  completedProcesses: string[]
  events: SimulationEvent[]
  explanation: string
}

export interface SimulationResult {
  steps: SimulationStep[]
  processes: ProcessState[]
  metrics: {
    avgWaitingTime: number
    avgTurnaroundTime: number
    avgResponseTime: number
    cpuUtilization: number
    throughput: number
    contextSwitches: number
    totalTime: number
    idleTime: number
  }
}
