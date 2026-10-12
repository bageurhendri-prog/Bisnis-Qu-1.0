import React from 'react';
import { 
  GitBranch, 
  Cpu, 
  FolderGit2, 
  Coffee, 
  Box, 
  PackageCheck, 
  CheckCircle2, 
  ShieldCheck, 
  Hammer, 
  UploadCloud, 
  Tag, 
  ArrowRight,
  Sparkles,
  Zap
} from 'lucide-react';
import { WorkflowConfig } from '../types/workflow';

interface VisualPipelineGraphProps {
  config: WorkflowConfig;
  onUpdateConfig: (updater: (prev: WorkflowConfig) => WorkflowConfig) => void;
  onStepClick?: (stepName: string) => void;
}

export const VisualPipelineGraph: React.FC<VisualPipelineGraphProps> = ({
  config,
  onUpdateConfig,
}) => {
  return (
    <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-4 sm:p-5 relative overflow-hidden backdrop-blur">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <div className="h-2 w-2 rounded-full bg-cyan-400 animate-pulse" />
          <h2 className="text-xs font-semibold uppercase tracking-wider text-slate-300">
            Interactive Workflow Architecture (DAG)
          </h2>
          <span className="text-[11px] text-slate-500">· Click any module to toggle or customize</span>
        </div>
        <div className="flex items-center gap-2 text-[11px] text-slate-400">
          <span className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-emerald-400"></span> Active Step
          </span>
          <span className="flex items-center gap-1 text-slate-500">
            <span className="w-2 h-2 rounded-full bg-slate-700"></span> Optional / Off
          </span>
        </div>
      </div>

      {/* Horizontal Pipeline Visualizer */}
      <div className="flex items-center gap-2 overflow-x-auto pb-3 pt-1 no-scrollbar text-xs">
        {/* Module 1: Triggers */}
        <div className="flex-shrink-0 bg-slate-950/80 border border-slate-800 rounded-lg p-3 w-48 shadow-sm">
          <div className="flex items-center justify-between text-slate-400 mb-1.5 font-medium">
            <span className="flex items-center gap-1.5 text-cyan-400">
              <GitBranch className="w-3.5 h-3.5" /> Triggers
            </span>
            <span className="text-[10px] text-slate-500 font-mono">on:</span>
          </div>
          <div className="space-y-1 text-[11px]">
            {config.triggerPushMain && (
              <div className="text-slate-300 flex items-center justify-between">
                <span>push: main</span>
                <span className="text-emerald-400 text-[10px]">✓</span>
              </div>
            )}
            {config.triggerPrMain && (
              <div className="text-slate-300 flex items-center justify-between">
                <span>pull_request: main</span>
                <span className="text-emerald-400 text-[10px]">✓</span>
              </div>
            )}
            {config.triggerWorkflowDispatch && (
              <div className="text-slate-400 flex items-center justify-between">
                <span>workflow_dispatch</span>
                <span className="text-emerald-400 text-[10px]">✓</span>
              </div>
            )}
            {config.triggerTags && (
              <div className="text-cyan-300 flex items-center justify-between">
                <span>tag: {config.tagPattern}</span>
                <span className="text-cyan-400 text-[10px]">release</span>
              </div>
            )}
          </div>
        </div>

        <ArrowRight className="w-4 h-4 text-slate-700 flex-shrink-0" />

        {/* Module 2: Runner */}
        <div className="flex-shrink-0 bg-slate-950/80 border border-slate-800 rounded-lg p-3 w-40 shadow-sm">
          <div className="flex items-center justify-between text-slate-400 mb-1.5 font-medium">
            <span className="flex items-center gap-1.5 text-indigo-400">
              <Cpu className="w-3.5 h-3.5" /> Runner
            </span>
            <span className="text-[10px] text-slate-500 font-mono">job</span>
          </div>
          <div className="text-slate-200 font-mono text-[11px] truncate">
            {config.runsOn}
          </div>
          <div className="text-[10px] text-slate-400 mt-1">
            Ubuntu 24.04 (4 vCPU)
          </div>
          {config.concurrencyGroup && (
            <div className="mt-1 text-[10px] text-emerald-400 flex items-center gap-1">
              <Zap className="w-2.5 h-2.5" /> Auto-cancel stale runs
            </div>
          )}
        </div>

        <ArrowRight className="w-4 h-4 text-slate-700 flex-shrink-0" />

        {/* Module 3: Steps sequence */}
        <div className="flex items-center gap-2 flex-shrink-0">
          {/* Step: Checkout */}
          <div className="bg-slate-950/90 border border-slate-800 rounded-lg p-2.5 w-36 shadow-sm">
            <div className="flex items-center gap-1.5 text-slate-300 font-medium mb-1">
              <FolderGit2 className="w-3.5 h-3.5 text-blue-400" />
              <span>Checkout</span>
            </div>
            <div className="text-[10px] text-slate-400 font-mono truncate">
              checkout@{config.checkoutVersion}
            </div>
            <div className="text-[10px] text-slate-500 mt-0.5">~3 sec</div>
          </div>

          {/* Step: JDK */}
          <div className="bg-slate-950/90 border border-slate-800 rounded-lg p-2.5 w-36 shadow-sm">
            <div className="flex items-center gap-1.5 text-slate-300 font-medium mb-1">
              <Coffee className="w-3.5 h-3.5 text-amber-400" />
              <span>Setup JDK</span>
            </div>
            <div className="text-[10px] text-slate-400 font-mono">
              Java {config.javaVersion} ({config.javaDistro})
            </div>
            <div className="text-[10px] text-slate-500 mt-0.5">setup-java@{config.setupJavaVersion}</div>
          </div>

          {/* Step: Flutter */}
          <div className="bg-slate-950/90 border border-slate-800 rounded-lg p-2.5 w-36 shadow-sm">
            <div className="flex items-center gap-1.5 text-slate-300 font-medium mb-1">
              <Box className="w-3.5 h-3.5 text-cyan-400" />
              <span>Flutter SDK</span>
            </div>
            <div className="text-[10px] text-slate-400 font-mono">
              channel: {config.flutterChannel}
            </div>
            <div className="text-[10px] text-emerald-400 mt-0.5">cached toolchain</div>
          </div>

          {/* Step: Pub Get */}
          <div className="bg-slate-950/90 border border-slate-800 rounded-lg p-2.5 w-32 shadow-sm">
            <div className="flex items-center gap-1.5 text-slate-300 font-medium mb-1">
              <PackageCheck className="w-3.5 h-3.5 text-emerald-400" />
              <span>Pub Get</span>
            </div>
            <div className="text-[10px] text-slate-400 font-mono truncate">
              flutter pub get
            </div>
            <div className="text-[10px] text-slate-500 mt-0.5">~5 sec</div>
          </div>

          {/* Optional: Analyze & Tests */}
          <button
            onClick={() => onUpdateConfig(c => ({ ...c, runAnalyze: !c.runAnalyze, runTests: !c.runTests }))}
            className={`border rounded-lg p-2.5 w-36 text-left transition shadow-sm ${
              config.runAnalyze || config.runTests
                ? 'bg-slate-950 border-emerald-500/40 hover:border-emerald-500'
                : 'bg-slate-950/40 border-slate-800/80 opacity-60 hover:opacity-100 hover:border-slate-700'
            }`}
          >
            <div className="flex items-center gap-1.5 font-medium mb-1 text-slate-300">
              <CheckCircle2 className={`w-3.5 h-3.5 ${config.runAnalyze || config.runTests ? 'text-emerald-400' : 'text-slate-600'}`} />
              <span>Analyze & Test</span>
            </div>
            <div className="text-[10px] text-slate-400">
              {config.runAnalyze && config.runTests
                ? 'Lint + 18 tests'
                : config.runAnalyze
                ? 'flutter analyze'
                : config.runTests
                ? 'flutter test'
                : 'Click to enable'}
            </div>
            <div className="text-[10px] text-slate-500 mt-0.5">
              {config.runAnalyze || config.runTests ? 'Quality gate' : 'Disabled'}
            </div>
          </button>

          {/* Optional: Keystore */}
          <button
            onClick={() => onUpdateConfig(c => ({ ...c, enableKeystoreSigning: !c.enableKeystoreSigning }))}
            className={`border rounded-lg p-2.5 w-36 text-left transition shadow-sm ${
              config.enableKeystoreSigning
                ? 'bg-slate-950 border-purple-500/40 hover:border-purple-500'
                : 'bg-slate-950/40 border-slate-800/80 opacity-60 hover:opacity-100 hover:border-slate-700'
            }`}
          >
            <div className="flex items-center gap-1.5 font-medium mb-1 text-slate-300">
              <ShieldCheck className={`w-3.5 h-3.5 ${config.enableKeystoreSigning ? 'text-purple-400' : 'text-slate-600'}`} />
              <span>Keystore Sign</span>
            </div>
            <div className="text-[10px] text-slate-400 truncate">
              {config.enableKeystoreSigning ? 'Base64 -> key.prop' : 'Click to enable'}
            </div>
            <div className="text-[10px] text-slate-500 mt-0.5">
              {config.enableKeystoreSigning ? 'Release key' : 'Debug key default'}
            </div>
          </button>

          {/* Step: Build */}
          <div className="bg-slate-950 border border-cyan-500/50 rounded-lg p-2.5 w-44 shadow-sm shadow-cyan-950">
            <div className="flex items-center gap-1.5 text-cyan-300 font-semibold mb-1">
              <Hammer className="w-3.5 h-3.5 text-cyan-400" />
              <span>Build Target</span>
            </div>
            <div className="text-[10px] text-cyan-200 font-mono font-medium truncate">
              {config.buildTarget === 'split-apk' && 'flutter build apk --split-per-abi'}
              {config.buildTarget === 'universal-apk' && 'flutter build apk --release'}
              {config.buildTarget === 'appbundle' && 'flutter build appbundle'}
              {config.buildTarget === 'both-apk-aab' && 'build apk & appbundle'}
            </div>
            <div className="text-[10px] text-slate-400 mt-0.5">
              {config.buildTarget === 'split-apk' ? '3 separate ABIs (~20MB ea)' : 'Single bundle'}
            </div>
          </div>

          {/* Step: Upload Artifacts */}
          <div className="bg-slate-950 border border-slate-800 rounded-lg p-2.5 w-36 shadow-sm">
            <div className="flex items-center gap-1.5 text-slate-300 font-medium mb-1">
              <UploadCloud className="w-3.5 h-3.5 text-blue-400" />
              <span>Upload Artifacts</span>
            </div>
            <div className="text-[10px] text-slate-400 font-mono truncate">
              {config.artifactName || 'release-apks'}
            </div>
            <div className="text-[10px] text-slate-500 mt-0.5">upload-artifact@{config.uploadArtifactVersion}</div>
          </div>

          {/* Optional: GitHub Release */}
          {config.publishGitHubRelease && (
            <div className="bg-slate-950 border border-amber-500/40 rounded-lg p-2.5 w-36 shadow-sm">
              <div className="flex items-center gap-1.5 text-amber-300 font-medium mb-1">
                <Tag className="w-3.5 h-3.5 text-amber-400" />
                <span>GitHub Release</span>
              </div>
              <div className="text-[10px] text-slate-400 font-mono truncate">
                action-gh-release@v2
              </div>
              <div className="text-[10px] text-emerald-400 mt-0.5">Attach APKs to tag</div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
