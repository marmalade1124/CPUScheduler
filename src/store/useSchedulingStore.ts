import { create } from 'zustand'
import { AlgorithmType, Process, SimulationResult } from '../types'
import { simulateScheduling } from '../simulator/engine'

export type AppMode = 'visualizer' | 'quiz'

interface QuizState {
  targetAlgorithm: AlgorithmType
  targetTimeQuantum?: number
  generatedProcesses: Process[]
  userAnswerTurnaround: string
  userAnswerWaiting: string
  isRevealed: boolean
  isCorrect: boolean | null
}

interface SchedulingState {
  processes: Process[]
  algorithm: AlgorithmType
  timeQuantum: number
  isSimulating: boolean
  simulationResult: SimulationResult | null
  currentStep: number
  maxStepReached: number
  isPlaying: boolean
  appMode: AppMode
  quizState: QuizState | null
  hasSeenTutorial: boolean
  
  // Actions
  setProcesses: (processes: Process[]) => void
  addProcess: (process: Process) => void
  updateProcess: (id: string, process: Partial<Process>) => void
  removeProcess: (id: string) => void
  setAlgorithm: (algo: AlgorithmType) => void
  setTimeQuantum: (tq: number) => void
  
  runSimulation: () => void
  resetSimulation: () => void
  nextStep: () => void
  prevStep: () => void
  setStep: (step: number) => void
  togglePlay: () => void
  setIsPlaying: (playing: boolean) => void
  
  setAppMode: (mode: AppMode) => void
  generateQuiz: () => void
  submitQuiz: (turnaround: string, waiting: string) => void
  setHasSeenTutorial: (seen: boolean) => void
}

const defaultProcesses: Process[] = [
  { id: 'P1', arrivalTime: 0, burstTime: 8, priority: 3 },
  { id: 'P2', arrivalTime: 1, burstTime: 4, priority: 1 },
  { id: 'P3', arrivalTime: 2, burstTime: 9, priority: 4 },
  { id: 'P4', arrivalTime: 3, burstTime: 5, priority: 2 },
]

export const useSchedulingStore = create<SchedulingState>((set, get) => ({
  processes: defaultProcesses,
  algorithm: 'FCFS',
  timeQuantum: 2,
  isSimulating: false,
  simulationResult: null,
  currentStep: 0,
  maxStepReached: 0,
  isPlaying: false,
  appMode: 'visualizer',
  quizState: null,
  hasSeenTutorial: localStorage.getItem('hasSeenTutorial') === 'true',

  setProcesses: (processes) => set({ processes, isSimulating: false, simulationResult: null, isPlaying: false }),
  addProcess: (process) => set((state) => ({ 
    processes: [...state.processes, process],
    isSimulating: false, 
    simulationResult: null,
    isPlaying: false
  })),
  updateProcess: (id, process) => set((state) => ({
    processes: state.processes.map(p => p.id === id ? { ...p, ...process } : p),
    isSimulating: false,
    simulationResult: null,
    isPlaying: false
  })),
  removeProcess: (id) => set((state) => ({
    processes: state.processes.filter(p => p.id !== id),
    isSimulating: false,
    simulationResult: null,
    isPlaying: false
  })),
  setAlgorithm: (algorithm) => set({ algorithm, isSimulating: false, simulationResult: null, isPlaying: false }),
  setTimeQuantum: (timeQuantum) => set({ timeQuantum, isSimulating: false, simulationResult: null, isPlaying: false }),
  
  runSimulation: () => {
    const { processes, algorithm, timeQuantum } = get()
    if (processes.length === 0) return
    const result = simulateScheduling(processes, algorithm, timeQuantum)
    set({
      isSimulating: true,
      simulationResult: result,
      currentStep: 0,
      maxStepReached: 0,
      isPlaying: false
    })
  },
  resetSimulation: () => set({
    isSimulating: false,
    simulationResult: null,
    currentStep: 0,
    maxStepReached: 0,
    isPlaying: false
  }),
  nextStep: () => set((state) => {
    if (!state.simulationResult) return {}
    const next = Math.min(state.currentStep + 1, state.simulationResult.steps.length - 1)
    if (next === state.currentStep) return { isPlaying: false } // Auto-stop at end
    return { currentStep: next, maxStepReached: Math.max(state.maxStepReached, next) }
  }),
  prevStep: () => set((state) => ({
    currentStep: Math.max(state.currentStep - 1, 0),
    isPlaying: false // Manual override stops auto-play
  })),
  setStep: (step) => set((state) => {
    if (!state.simulationResult) return {}
    const newStep = Math.max(0, Math.min(step, state.simulationResult.steps.length - 1))
    return {
      currentStep: newStep,
      maxStepReached: Math.max(state.maxStepReached, newStep),
      isPlaying: false
    }
  }),
  togglePlay: () => set((state) => {
    // If at end, restart
    if (state.simulationResult && state.currentStep >= state.simulationResult.steps.length - 1) {
      return { isPlaying: true, currentStep: 0, maxStepReached: state.simulationResult.steps.length - 1 }
    }
    return { isPlaying: !state.isPlaying }
  }),
  setIsPlaying: (playing) => set({ isPlaying: playing }),

  setAppMode: (mode) => set({ 
    appMode: mode, 
    isSimulating: false, 
    simulationResult: null,
    isPlaying: false 
  }),
  
  generateQuiz: () => {
    const algos: AlgorithmType[] = ['FCFS', 'SJF', 'SRTF', 'Priority_NonPreemptive', 'Priority_Preemptive', 'RoundRobin']
    const randomAlgo = algos[Math.floor(Math.random() * algos.length)]
    
    const numProcesses = Math.floor(Math.random() * 3) + 3 // 3 to 5
    const generatedProcesses = Array.from({ length: numProcesses }).map((_, i) => ({
      id: `P${i + 1}`,
      arrivalTime: Math.floor(Math.random() * 5),
      burstTime: Math.floor(Math.random() * 8) + 2,
      priority: Math.floor(Math.random() * 5) + 1
    }))
    
    set({
      quizState: {
        targetAlgorithm: randomAlgo,
        targetTimeQuantum: randomAlgo === 'RoundRobin' ? Math.floor(Math.random() * 3) + 2 : undefined,
        generatedProcesses,
        userAnswerTurnaround: '',
        userAnswerWaiting: '',
        isRevealed: false,
        isCorrect: null
      },
      processes: generatedProcesses,
      algorithm: randomAlgo,
      timeQuantum: randomAlgo === 'RoundRobin' ? 2 : get().timeQuantum,
      isSimulating: false,
      simulationResult: null
    })
  },

  submitQuiz: (turnaround, waiting) => {
    const { processes, algorithm, timeQuantum, quizState } = get()
    if (!quizState) return
    
    // Run real simulation to get answers
    const result = simulateScheduling(processes, algorithm, quizState.targetTimeQuantum || timeQuantum)
    
    const actualAvgTurnaround = result.metrics.avgTurnaroundTime.toFixed(2)
    const actualAvgWaiting = result.metrics.avgWaitingTime.toFixed(2)
    
    // Check if user answer is within 0.05 tolerance to account for rounding differences
    const userTA = parseFloat(turnaround)
    const userWA = parseFloat(waiting)
    
    const taCorrect = !isNaN(userTA) && Math.abs(userTA - result.metrics.avgTurnaroundTime) < 0.05
    const waCorrect = !isNaN(userWA) && Math.abs(userWA - result.metrics.avgWaitingTime) < 0.05
    const isCorrect = taCorrect && waCorrect
    
    set({
      quizState: {
        ...quizState,
        userAnswerTurnaround: turnaround,
        userAnswerWaiting: waiting,
        isRevealed: true,
        isCorrect
      },
      isSimulating: true,
      simulationResult: result,
      currentStep: 0,
      maxStepReached: result.steps.length - 1, // Reveal everything immediately in quiz mode
      isPlaying: false
    })
  },

  setHasSeenTutorial: (seen) => {
    localStorage.setItem('hasSeenTutorial', String(seen))
    set({ hasSeenTutorial: seen })
  }
}))
