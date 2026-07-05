import { AlgorithmType, Process, ProcessState, ReadyQueueItem, SimulationEvent, SimulationResult, SimulationStep } from "../types"

export function simulateScheduling(
  processes: Process[],
  algorithm: AlgorithmType,
  timeQuantum: number = 2
): SimulationResult {
  // Initialize state
  let time = 0
  let completedCount = 0
  let currentRunning: string | null = null
  let quantumRemaining = timeQuantum
  let contextSwitches = 0

  const state: ProcessState[] = processes.map((p) => ({
    ...p,
    remainingTime: p.burstTime,
    startTime: null,
    completionTime: null,
    turnaroundTime: null,
    waitingTime: null,
    responseTime: null,
  }))

  const readyQueue: string[] = [] // store process IDs
  const steps: SimulationStep[] = []
  
  // Helper to get process
  const getProcess = (id: string) => state.find((p) => p.id === id)!

  // Sort processes by arrival time initially
  state.sort((a, b) => a.arrivalTime - b.arrivalTime)

  while (completedCount < processes.length) {
    const events: SimulationEvent[] = []
    let explanation = ""
    let explanationDetails = [] // Collect multiple points

    // 1. Check for newly arrived processes at current time
    const newlyArrived = state.filter((p) => p.arrivalTime === time)
    for (const p of newlyArrived) {
      readyQueue.push(p.id)
      events.push({
        time,
        type: "ARRIVED",
        processId: p.id,
        message: `${p.id} arrived and joined the ready queue.`
      })
      explanationDetails.push(`**${p.id}** arrived at time ${time}.`)
    }

    // 2. Process currently running process (if any)
    let preempted = false
    let preemptedBy = null

    if (currentRunning) {
      const runningProc = getProcess(currentRunning)
      if (runningProc.remainingTime === 0) {
        runningProc.completionTime = time
        runningProc.turnaroundTime = time - runningProc.arrivalTime
        runningProc.waitingTime = runningProc.turnaroundTime - runningProc.burstTime
        completedCount++
        events.push({
          time,
          type: "FINISHED",
          processId: runningProc.id,
          message: `${runningProc.id} finished execution.`
        })
        explanationDetails.push(`**${runningProc.id}** completed its execution! \n• Turnaround Time = Completion Time (${time}) - Arrival Time (${runningProc.arrivalTime}) = **${runningProc.turnaroundTime}** \n• Waiting Time = Turnaround Time (${runningProc.turnaroundTime}) - Burst Time (${runningProc.burstTime}) = **${runningProc.waitingTime}**`)
        currentRunning = null
      } else {
        // Preemption logic based on algorithm
        if (algorithm === "RoundRobin") {
          if (quantumRemaining === 0) {
            preempted = true
            events.push({
              time,
              type: "PREEMPTED",
              processId: runningProc.id,
              message: `Time quantum expired for ${runningProc.id}. Preempted.`
            })
            explanationDetails.push(`**${runningProc.id}**'s time quantum (${timeQuantum}) expired. It is preempted and moved to the back of the queue.`)
          }
        } else if (algorithm === "SRTF" || algorithm === "Priority_Preemptive") {
          // Check if any process in ready queue has shorter remaining time / higher priority
          if (readyQueue.length > 0) {
            const nextCandidate = selectNextProcess(readyQueue, state, algorithm)
            if (nextCandidate !== currentRunning) {
              const candidateProc = getProcess(nextCandidate)
              if (algorithm === "SRTF" && candidateProc.remainingTime < runningProc.remainingTime) {
                preempted = true
                preemptedBy = candidateProc.id
                events.push({ time, type: "PREEMPTED", processId: runningProc.id, message: `${candidateProc.id} has shorter remaining time (${candidateProc.remainingTime} < ${runningProc.remainingTime}). Preempted ${runningProc.id}.` })
                explanationDetails.push(`**${candidateProc.id}** arrived with a shorter remaining time (**${candidateProc.remainingTime}**) than **${runningProc.id}** (**${runningProc.remainingTime}**). Therefore, **${runningProc.id}** is preempted.`)
              } else if (algorithm === "Priority_Preemptive" && (candidateProc.priority ?? Infinity) < (runningProc.priority ?? Infinity)) {
                preempted = true
                preemptedBy = candidateProc.id
                events.push({ time, type: "PREEMPTED", processId: runningProc.id, message: `${candidateProc.id} has higher priority (${candidateProc.priority} < ${runningProc.priority}). Preempted ${runningProc.id}.` })
                explanationDetails.push(`**${candidateProc.id}** arrived with a higher priority (**${candidateProc.priority}**) than **${runningProc.id}** (**${runningProc.priority}**). Therefore, **${runningProc.id}** is preempted.`)
              }
            }
          }
        }
        
        if (preempted) {
          readyQueue.push(runningProc.id)
          currentRunning = null
        }
      }
    }

    // 3. Select next process to run if CPU is free
    if (!currentRunning && readyQueue.length > 0) {
      const nextProcId = selectNextProcess(readyQueue, state, algorithm)
      // Remove from ready queue
      readyQueue.splice(readyQueue.indexOf(nextProcId), 1)
      
      const nextProc = getProcess(nextProcId)
      if (nextProc.startTime === null) {
        nextProc.startTime = time
        nextProc.responseTime = time - nextProc.arrivalTime
      }
      
      currentRunning = nextProcId
      quantumRemaining = timeQuantum
      contextSwitches++ 
      
      events.push({
        time,
        type: "STARTED",
        processId: nextProcId,
        message: `CPU allocated to ${nextProcId}.`
      })

      // Generate intelligent selection explanation
      if (algorithm === "FCFS") {
        explanationDetails.push(`CPU is allocated to **${nextProcId}** because it was the first to arrive in the queue.`)
      } else if (algorithm === "SJF" || algorithm === "SRTF") {
        explanationDetails.push(`CPU is allocated to **${nextProcId}** because it has the shortest burst time (**${nextProc.remainingTime}**) among available processes.`)
      } else if (algorithm === "Priority_NonPreemptive" || algorithm === "Priority_Preemptive") {
        explanationDetails.push(`CPU is allocated to **${nextProcId}** because it has the highest priority (**${nextProc.priority}**) among available processes.`)
      } else if (algorithm === "RoundRobin") {
        explanationDetails.push(`CPU is allocated to **${nextProcId}** as it is next in the Ready Queue. Time Quantum resets to **${timeQuantum}**.`)
      }
    } else if (!currentRunning && readyQueue.length === 0 && completedCount < processes.length) {
      if (events.length === 0) {
        events.push({
          time,
          type: "IDLE",
          processId: null,
          message: "CPU is idle."
        })
      }
      explanationDetails.push("CPU is idle because the Ready Queue is empty and no processes have arrived yet.")
    } else if (currentRunning) {
      // Intelligent continuation explanation
      if (algorithm === "RoundRobin") {
        explanationDetails.push(`**${currentRunning}** continues execution (Time Quantum remaining: **${quantumRemaining}**).`)
      } else if (algorithm === "SRTF" || algorithm === "Priority_Preemptive") {
        const runningProc = getProcess(currentRunning)
        const condition = algorithm === "SRTF" ? `shortest remaining time (**${runningProc.remainingTime}**)` : `highest priority (**${runningProc.priority}**)`
        explanationDetails.push(`**${currentRunning}** continues execution because it still has the ${condition} among available processes.`)
      } else {
        explanationDetails.push(`**${currentRunning}** continues execution (${algorithm} is Non-Preemptive).`)
      }
    }

    explanation = explanationDetails.join("\n\n")

    // Capture state at THIS time unit (after decisions, before advancing time)
    const queueState: ReadyQueueItem[] = readyQueue.map(id => {
      const p = getProcess(id)
      return { processId: p.id, remainingTime: p.remainingTime, priority: p.priority }
    })

    steps.push({
      time,
      runningProcess: currentRunning,
      readyQueue: queueState,
      completedProcesses: state.filter(p => p.completionTime !== null).map(p => p.id),
      events: [...events],
      explanation
    })

    // 4. Advance time and reduce remaining time for running process
    time++
    if (currentRunning) {
      const runningProc = getProcess(currentRunning)
      runningProc.remainingTime--
      quantumRemaining--
    }
  }

  // Calculate metrics
  let totalWaitingTime = 0
  let totalTurnaroundTime = 0
  let totalResponseTime = 0
  
  state.forEach(p => {
    totalWaitingTime += p.waitingTime || 0
    totalTurnaroundTime += p.turnaroundTime || 0
    totalResponseTime += p.responseTime || 0
  })

  const n = state.length
  const totalTime = time - 1
  // Calculate idle time
  const idleTime = steps.filter(s => s.runningProcess === null).length
  // Correct context switches (count transitions)
  let actualContextSwitches = 0
  for(let i=1; i<steps.length; i++) {
    if (steps[i].runningProcess !== steps[i-1].runningProcess && steps[i].runningProcess !== null) {
        actualContextSwitches++
    }
  }

  return {
    steps,
    processes: state,
    metrics: {
      avgWaitingTime: totalWaitingTime / n,
      avgTurnaroundTime: totalTurnaroundTime / n,
      avgResponseTime: totalResponseTime / n,
      cpuUtilization: ((totalTime - idleTime) / totalTime) * 100,
      throughput: n / totalTime,
      contextSwitches: actualContextSwitches,
      totalTime,
      idleTime
    }
  }
}

function selectNextProcess(readyQueue: string[], state: ProcessState[], algorithm: AlgorithmType): string {
  if (readyQueue.length === 1) return readyQueue[0]
  
  const available = readyQueue.map(id => state.find(p => p.id === id)!)
  
  switch (algorithm) {
    case "FCFS":
    case "RoundRobin":
      // First in ready queue
      return readyQueue[0]
      
    case "SJF":
    case "SRTF":
      // Shortest remaining time. Tie breaker: arrival time, then original index
      available.sort((a, b) => {
        if (a.remainingTime === b.remainingTime) return a.arrivalTime - b.arrivalTime
        return a.remainingTime - b.remainingTime
      })
      return available[0].id
      
    case "Priority_NonPreemptive":
    case "Priority_Preemptive":
      // Lower number = higher priority
      available.sort((a, b) => {
        const pA = a.priority ?? Infinity
        const pB = b.priority ?? Infinity
        if (pA === pB) return a.arrivalTime - b.arrivalTime
        return pA - pB
      })
      return available[0].id
  }
}
