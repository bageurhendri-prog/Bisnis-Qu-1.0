import React, { useState, useEffect, useRef } from 'react';
import { 
  Play, 
  RotateCcw, 
  CheckCircle2, 
  XCircle, 
  Clock, 
  Terminal, 
  ChevronRight, 
  Copy, 
  Check, 
  Search, 
  Download, 
  ExternalLink, 
  AlertTriangle,
  Zap,
  PackageCheck
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { SimulationStep, WorkflowConfig } from '../types/workflow';
import { buildSimulationSteps } from '../utils/simulationLogs';

interface RunnerSimulatorProps {
  config: WorkflowConfig;
  onViewArtifacts: () => void;
}

export const RunnerSimulator: React.FC<RunnerSimulatorProps> = ({
  config,
  onViewArtifacts,
}) => {
  const [steps, setSteps] = useState<SimulationStep[]>(() => buildSimulationSteps(config));
  const [currentStepIndex, setCurrentStepIndex] = useState<number>(-1);
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [isCompleted, setIsCompleted] = useState<boolean>(false);
  const [hasFailed, setHasFailed] = useState<boolean>(false);
  const [simulateFailure, setSimulateFailure] = useState<boolean>(false);
  const [selectedStepId, setSelectedStepId] = useState<string>('build-app');
  const [speedMultiplier, setSpeedMultiplier] = useState<number>(3); // 1 = 1x, 3 = 3x, 999 = instant
  const [searchFilter, setSearchFilter] = useState<string>('');
  const [autoScroll, setAutoScroll] = useState<boolean>(true);
  const [copiedLogs, setCopiedLogs] = useState<boolean>(false);
  const [elapsedTime, setElapsedTime] = useState<number>(0);

  const terminalEndRef = useRef<HTMLDivElement>(null);
  const timerRef = useRef<any>(null);

  // Sync steps when config changes if not running
  useEffect(() => {
    if (!isRunning && !isCompleted) {
      const newSteps = buildSimulationSteps(config);
      setSteps(newSteps);
      if (newSteps.length > 0 && !selectedStepId) {
        setSelectedStepId(newSteps[0].id);
      }
    }
  }, [config, isRunning, isCompleted]);

  // Handle timer
  useEffect(() => {
    if (isRunning) {
      timerRef.current = setInterval(() => {
        setElapsedTime(prev => prev + 1);
      }, 1000 / (speedMultiplier === 999 ? 10 : speedMultiplier));
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isRunning, speedMultiplier]);

  // Handle step progression
  useEffect(() => {
    if (!isRunning) return;

    if (currentStepIndex === -1) {
      // Start first step
      setCurrentStepIndex(0);
      return;
    }

    if (currentStepIndex >= steps.length) {
      // Completed all steps
      setIsRunning(false);
      setIsCompleted(true);
      confetti({
        particleCount: 80,
        spread: 60,
        origin: { y: 0.6 }
      });
      return;
    }

    const currentStep = steps[currentStepIndex];
    setSelectedStepId(currentStep.id);

    // Update status to running
    setSteps(prev => prev.map((s, idx) => 
      idx === currentStepIndex ? { ...s, status: 'running' } : s
    ));

    // Check failure simulation on the build step
    if (simulateFailure && currentStep.id === 'build-app') {
      const stepDuration = speedMultiplier === 999 ? 100 : 2000;
      const timeout = setTimeout(() => {
        setSteps(prev => prev.map((s, idx) => 
          idx === currentStepIndex 
            ? { 
                ...s, 
                status: 'failed',
                logs: [
                  ...s.logs,
                  { text: 'FAILURE: Build failed with an exception.', type: 'stderr', timestamp: '01:22' },
                  { text: '* What went wrong:', type: 'stderr', timestamp: '01:22' },
                  { text: 'Execution failed for task \':app:signReleaseBundle\'. Keystore was not supplied.', type: 'stderr', timestamp: '01:23' },
                  { text: 'Fix: Configure android/key.properties or enable Keystore Signing step in settings.', type: 'info', timestamp: '01:23' }
                ]
              } 
            : s
        ));
        setIsRunning(false);
        setHasFailed(true);
      }, stepDuration);
      return () => clearTimeout(timeout);
    }

    const duration = speedMultiplier === 999 
      ? 50 
      : Math.max(300, ((currentStep.durationSeconds || 3) * 1000) / speedMultiplier);

    const timeout = setTimeout(() => {
      setSteps(prev => prev.map((s, idx) => 
        idx === currentStepIndex ? { ...s, status: 'success' } : s
      ));
      setCurrentStepIndex(prev => prev + 1);
    }, duration);

    return () => clearTimeout(timeout);
  }, [isRunning, currentStepIndex, steps.length, speedMultiplier, simulateFailure]);

  // Auto scroll
  useEffect(() => {
    if (autoScroll && terminalEndRef.current) {
      terminalEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [steps, selectedStepId, autoScroll]);

  const handleStartRun = () => {
    const resetSteps = buildSimulationSteps(config);
    setSteps(resetSteps);
    setCurrentStepIndex(-1);
    setIsCompleted(false);
    setHasFailed(false);
    setElapsedTime(0);
    setIsRunning(true);
  };

  const handleReset = () => {
    setIsRunning(false);
    setIsCompleted(false);
    setHasFailed(false);
    setCurrentStepIndex(-1);
    setElapsedTime(0);
    setSteps(buildSimulationSteps(config));
  };

  const selectedStep = steps.find(s => s.id === selectedStepId) || steps[0];

  const handleCopyLogs = () => {
    if (!selectedStep) return;
    const text = selectedStep.logs.map(l => `[${l.timestamp}] ${l.text}`).join('\n');
    navigator.clipboard.writeText(text);
    setCopiedLogs(true);
    setTimeout(() => setCopiedLogs(false), 2000);
  };

  const filteredLogs = (selectedStep?.logs || []).filter(l => 
    !searchFilter || l.text.toLowerCase().includes(searchFilter.toLowerCase())
  );

  return (
    <div className="space-y-4">
      {/* Workflow Run Header */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 sm:p-5 flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-sm font-semibold text-slate-100">
              Run #42: {config.workflowName || 'Build Flutter APK'}
            </h2>
            <span className="text-xs font-mono text-cyan-400 bg-cyan-950/60 px-2 py-0.5 rounded border border-cyan-800/40">
              main
            </span>
            <span className="text-xs text-slate-400 font-mono">commit d8f49b2</span>
          </div>
          <div className="flex items-center gap-3 text-xs text-slate-400 mt-1">
            <span>Workflow: <code className="text-slate-300">build-flutter-apk.yml</code></span>
            <span>·</span>
            <span>Runner: <code className="text-slate-300">ubuntu-24.04 (ubuntu-latest)</code></span>
            <span>·</span>
            <span className="flex items-center gap-1">
              <Clock className="w-3 h-3 text-slate-400" />
              <span>Elapsed: {Math.floor(elapsedTime / 60).toString().padStart(2, '0')}:{(elapsedTime % 60).toString().padStart(2, '0')}</span>
            </span>
          </div>
        </div>

        {/* Controls */}
        <div className="flex items-center gap-2 flex-wrap">
          {/* Speed Selector */}
          <div className="flex items-center bg-slate-950 border border-slate-800 rounded-lg p-0.5 text-xs">
            <button
              onClick={() => setSpeedMultiplier(1)}
              className={`px-2 py-1 rounded ${speedMultiplier === 1 ? 'bg-slate-800 text-white' : 'text-slate-400 hover:text-slate-200'}`}
              title="Real-time speed"
            >
              1x
            </button>
            <button
              onClick={() => setSpeedMultiplier(3)}
              className={`px-2 py-1 rounded ${speedMultiplier === 3 ? 'bg-slate-800 text-white' : 'text-slate-400 hover:text-slate-200'}`}
              title="3x Speed (Fast)"
            >
              3x
            </button>
            <button
              onClick={() => setSpeedMultiplier(999)}
              className={`px-2 py-1 rounded ${speedMultiplier === 999 ? 'bg-slate-800 text-cyan-300' : 'text-slate-400 hover:text-slate-200'}`}
              title="Instant completion"
            >
              Instant
            </button>
          </div>

          {/* Failure Debug Toggle */}
          <button
            onClick={() => setSimulateFailure(!simulateFailure)}
            className={`px-2.5 py-1.5 rounded-lg border text-xs font-medium transition flex items-center gap-1 ${
              simulateFailure
                ? 'bg-rose-950/40 border-rose-500/50 text-rose-300'
                : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-slate-200'
            }`}
            title="Toggle simulating a build failure to test error diagnosis"
          >
            <AlertTriangle className="w-3 h-3" />
            <span>{simulateFailure ? 'Fail Simulation ON' : 'Test Fail Mode'}</span>
          </button>

          {/* Start / Re-run */}
          {!isRunning ? (
            <button
              onClick={handleStartRun}
              className="px-4 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-xs font-semibold shadow-md shadow-emerald-950 transition flex items-center gap-1.5"
            >
              <Play className="w-3.5 h-3.5 fill-current" />
              <span>{isCompleted || hasFailed ? 'Re-run Workflow' : 'Start Simulation'}</span>
            </button>
          ) : (
            <button
              onClick={handleReset}
              className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg text-xs font-medium transition flex items-center gap-1.5"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset</span>
            </button>
          )}

          {isCompleted && (
            <button
              onClick={onViewArtifacts}
              className="px-3 py-1.5 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-xs font-semibold shadow-md shadow-blue-950 transition flex items-center gap-1.5"
            >
              <PackageCheck className="w-3.5 h-3.5" />
              <span>Inspect APKs</span>
            </button>
          )}
        </div>
      </div>

      {/* Main Console Split View */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        {/* Left: Step Checklist (4 cols) */}
        <div className="lg:col-span-4 bg-slate-900/90 border border-slate-800 rounded-xl p-3 divide-y divide-slate-800/60 shadow-lg">
          <div className="pb-2 px-2 flex items-center justify-between text-xs font-semibold text-slate-300">
            <span>Job Steps ({steps.length})</span>
            <span className="text-[11px] text-slate-500">
              {steps.filter(s => s.status === 'success').length}/{steps.length} Passed
            </span>
          </div>

          <div className="pt-2 space-y-1">
            {steps.map((step, idx) => {
              const isSelected = selectedStepId === step.id;
              return (
                <button
                  key={step.id}
                  onClick={() => setSelectedStepId(step.id)}
                  className={`w-full text-left p-2.5 rounded-lg text-xs transition flex items-center justify-between gap-2 ${
                    isSelected
                      ? 'bg-slate-800 text-white ring-1 ring-slate-700'
                      : 'hover:bg-slate-950/60 text-slate-300'
                  }`}
                >
                  <div className="flex items-center gap-2.5 truncate">
                    {/* Status Icon */}
                    {step.status === 'success' && (
                      <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                    )}
                    {step.status === 'running' && (
                      <div className="w-4 h-4 border-2 border-amber-400 border-t-transparent rounded-full animate-spin flex-shrink-0" />
                    )}
                    {step.status === 'failed' && (
                      <XCircle className="w-4 h-4 text-rose-400 flex-shrink-0" />
                    )}
                    {step.status === 'idle' && (
                      <div className="w-4 h-4 rounded-full border border-slate-600 flex-shrink-0" />
                    )}

                    <div className="truncate">
                      <div className="font-medium truncate">{step.name}</div>
                      <div className="text-[10px] text-slate-500 font-mono truncate">
                        {step.commandSnippet}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-1.5 flex-shrink-0">
                    {step.durationSeconds && (
                      <span className="text-[10px] text-slate-500">
                        {step.durationSeconds}s
                      </span>
                    )}
                    <ChevronRight className={`w-3.5 h-3.5 text-slate-600 ${isSelected ? 'text-cyan-400' : ''}`} />
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Right: Real-time Terminal Log Output (8 cols) */}
        <div className="lg:col-span-8 bg-slate-950 border border-slate-800 rounded-xl overflow-hidden shadow-xl flex flex-col h-[580px]">
          {/* Terminal Title Bar */}
          <div className="bg-slate-900 border-b border-slate-800 px-4 py-2 flex items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-2 truncate">
              <Terminal className="w-3.5 h-3.5 text-slate-400" />
              <span className="font-medium text-slate-200 truncate">
                {selectedStep?.name || 'Workflow Logs'}
              </span>
              <span className="text-[10px] bg-slate-800 text-slate-400 px-2 py-0.5 rounded font-mono truncate">
                {selectedStep?.commandSnippet}
              </span>
            </div>

            <div className="flex items-center gap-2 flex-shrink-0">
              {/* Search filter */}
              <div className="relative">
                <Search className="w-3 h-3 text-slate-500 absolute left-2 top-2" />
                <input
                  type="text"
                  placeholder="Filter logs..."
                  value={searchFilter}
                  onChange={(e) => setSearchFilter(e.target.value)}
                  className="bg-slate-950 border border-slate-700 rounded pl-6 pr-2 py-1 text-slate-200 text-xs w-32 focus:w-44 transition-all"
                />
              </div>

              {/* Auto scroll toggle */}
              <button
                onClick={() => setAutoScroll(!autoScroll)}
                className={`p-1 rounded text-xs transition ${autoScroll ? 'text-cyan-400 bg-cyan-950/40' : 'text-slate-500'}`}
                title="Toggle Auto Scroll"
              >
                <Zap className="w-3.5 h-3.5" />
              </button>

              {/* Copy logs */}
              <button
                onClick={handleCopyLogs}
                className="p-1 rounded hover:bg-slate-800 text-slate-400 hover:text-slate-200 transition"
                title="Copy step logs"
              >
                {copiedLogs ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              </button>
            </div>
          </div>

          {/* Terminal Body */}
          <div className="p-4 flex-1 overflow-y-auto font-mono text-xs leading-relaxed text-slate-300 select-text">
            {selectedStep?.status === 'idle' ? (
              <div className="h-full flex flex-col items-center justify-center text-slate-500 space-y-2">
                <Clock className="w-8 h-8 opacity-40" />
                <p>Step is waiting in queue...</p>
                <button
                  onClick={handleStartRun}
                  className="px-3 py-1 bg-slate-900 border border-slate-700 hover:bg-slate-800 text-slate-300 rounded text-xs transition"
                >
                  Start Simulation
                </button>
              </div>
            ) : filteredLogs.length === 0 ? (
              <div className="text-slate-500 italic p-4 text-center">
                {searchFilter ? 'No log lines matched the search filter.' : 'No output recorded yet.'}
              </div>
            ) : (
              filteredLogs.map((log, i) => {
                let colorClass = 'text-slate-300';
                if (log.type === 'command') colorClass = 'text-cyan-400 font-semibold';
                else if (log.type === 'stdout') colorClass = 'text-slate-300';
                else if (log.type === 'stderr') colorClass = 'text-rose-400 font-medium';
                else if (log.type === 'success') colorClass = 'text-emerald-400 font-semibold';
                else if (log.type === 'info') colorClass = 'text-slate-400';

                return (
                  <div key={i} className="flex hover:bg-slate-900/60 px-1 py-0.5 rounded gap-3">
                    <span className="text-slate-600 select-none text-[11px] flex-shrink-0">
                      {log.timestamp}
                    </span>
                    <span className={`whitespace-pre-wrap break-all ${colorClass}`}>
                      {log.text}
                    </span>
                  </div>
                );
              })
            )}
            <div ref={terminalEndRef} />
          </div>

          {/* Terminal Footer Status */}
          <div className="bg-slate-900 border-t border-slate-800 px-4 py-2 flex items-center justify-between text-[11px] text-slate-400">
            <div className="flex items-center gap-2">
              <span className={`w-2 h-2 rounded-full ${
                selectedStep?.status === 'success' 
                  ? 'bg-emerald-400' 
                  : selectedStep?.status === 'running' 
                  ? 'bg-amber-400 animate-ping' 
                  : selectedStep?.status === 'failed' 
                  ? 'bg-rose-500' 
                  : 'bg-slate-600'
              }`} />
              <span className="capitalize">{selectedStep?.status || 'idle'}</span>
            </div>
            <div>
              {isCompleted ? (
                <span className="text-emerald-400 font-medium">✓ Pipeline Completed Successfully</span>
              ) : hasFailed ? (
                <span className="text-rose-400 font-medium">✗ Job Failed</span>
              ) : isRunning ? (
                <span className="text-amber-400">Executing Step {currentStepIndex + 1} of {steps.length}...</span>
              ) : (
                <span>Ready to execute</span>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
