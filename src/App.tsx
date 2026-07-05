import React from 'react'
import { InputPanel } from './components/InputPanel'
import { SimulatorPanel } from './components/SimulatorPanel'
import { QuizPanel } from './components/QuizPanel'
import { WelcomeTutorial } from './components/WelcomeTutorial'
import { Toaster } from './components/ui/sonner'
import { TooltipProvider } from './components/ui/tooltip'
import { useSchedulingStore } from './store/useSchedulingStore'
import { Cpu, LayoutDashboard, GraduationCap } from 'lucide-react'

function App() {
  const { appMode, setAppMode } = useSchedulingStore()

  return (
    <TooltipProvider delayDuration={300}>
      <WelcomeTutorial />
      <div className="flex flex-col h-screen bg-slate-50 text-slate-900 overflow-hidden font-sans">
        
        {/* Global Header */}
        <header className="h-14 bg-white border-b border-slate-200 flex items-center justify-between px-4 lg:px-6 shrink-0 z-30 shadow-sm">
          <div className="flex items-center gap-2 text-indigo-700 font-bold text-lg tracking-tight">
            <Cpu className="w-6 h-6" />
            <span className="hidden sm:inline">CPU Scheduling Visualizer</span>
            <span className="sm:hidden">CPU Visualizer</span>
          </div>
          
          <nav className="flex items-center gap-1 bg-slate-100 p-1 rounded-lg">
            <button 
              onClick={() => setAppMode('visualizer')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-sm font-semibold transition-all ${appMode === 'visualizer' ? 'bg-white text-indigo-700 shadow-sm' : 'text-slate-500 hover:text-slate-700 hover:bg-slate-200/50'}`}
            >
              <LayoutDashboard className="w-4 h-4" />
              <span className="hidden sm:inline">Visualizer</span>
            </button>
            <button 
              onClick={() => setAppMode('quiz')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-sm font-semibold transition-all ${appMode === 'quiz' ? 'bg-white text-indigo-700 shadow-sm' : 'text-slate-500 hover:text-slate-700 hover:bg-slate-200/50'}`}
            >
              <GraduationCap className="w-4 h-4" />
              <span className="hidden sm:inline">Practice Quiz</span>
              <span className="sm:hidden">Quiz</span>
            </button>
          </nav>
        </header>

        {/* Main Content Area */}
        {appMode === 'visualizer' ? (
          <div className="flex flex-col md:flex-row flex-1 overflow-y-auto md:overflow-hidden relative">
            <div className="w-full md:w-[320px] lg:w-[360px] shrink-0 border-r border-b md:border-b-0 border-slate-200 h-auto md:h-full z-20 shadow-md md:shadow-none bg-white md:bg-transparent overflow-visible md:overflow-hidden">
              <InputPanel />
            </div>
            <div className="flex-1 bg-slate-50 h-auto md:h-full overflow-visible md:overflow-hidden relative flex flex-col min-h-[600px] md:min-h-0">
              <SimulatorPanel />
            </div>
          </div>
        ) : (
          <div className="flex-1 overflow-hidden">
            <QuizPanel />
          </div>
        )}
      </div>
      <Toaster position="bottom-right" richColors />
    </TooltipProvider>
  )
}

export default App
