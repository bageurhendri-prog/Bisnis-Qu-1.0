import React from 'react';
import { 
  Play, 
  Copy, 
  Download, 
  Check, 
  Sparkles, 
  Key, 
  Layers, 
  Terminal, 
  Package, 
  ShieldAlert, 
  FileCode2,
  RefreshCw,
  Smartphone,
  Code2
} from 'lucide-react';
import { WorkflowConfig } from '../types/workflow';

export type AppTab = 'bisnisqu' | 'dart' | 'studio' | 'simulator' | 'artifacts' | 'audit' | 'keystore';

interface HeaderProps {
  activeTab: AppTab;
  setActiveTab: (tab: AppTab) => void;
  onSimulateRun: () => void;
  isSimulating: boolean;
  onCopyYaml: () => void;
  copied: boolean;
  onDownloadYaml: () => void;
  config: WorkflowConfig;
  onSelectPreset: (presetKey: string) => void;
  auditIssuesCount: number;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  setActiveTab,
  onSimulateRun,
  isSimulating,
  onCopyYaml,
  copied,
  onDownloadYaml,
  onSelectPreset,
  auditIssuesCount,
}) => {
  return (
    <header className="border-b border-slate-800 bg-slate-950/80 backdrop-blur sticky top-0 z-40">
      {/* Top Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 flex flex-wrap items-center justify-between gap-4">
        {/* Brand & Repository File Breadcrumb */}
        <div className="flex items-center gap-3">
          <div className="h-9 w-9 rounded-lg bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400 shadow-sm shadow-cyan-500/20">
            <svg viewBox="0 0 24 24" className="w-5 h-5 fill-current" aria-label="Flutter Logo">
              <path d="M14.314 0L2.3 12 6 15.7 21.686 0h-7.372zm.028 11.285L6.786 18.843 14.342 24h7.358l-5.696-5.686 5.67-5.698-7.332-1.331z" />
            </svg>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-sm font-semibold text-slate-100 tracking-tight">BisnisQu · Flutter CI/CD</h1>
              <span className="text-slate-600">/</span>
              <span className="text-xs font-mono text-cyan-400 bg-cyan-950/60 px-2 py-0.5 rounded border border-cyan-800/40">
                .github/workflows/build-flutter-apk.yml
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              Flutter App Simulation · Dart Source · Split APK CI/CD Pipeline
            </p>
          </div>
        </div>

        {/* Action Controls & Presets */}
        <div className="flex items-center gap-2.5 flex-wrap">
          {/* Preset Selector */}
          <div className="flex items-center gap-1.5 bg-slate-900 border border-slate-800 rounded-lg p-1 text-xs">
            <span className="text-slate-400 px-2 hidden sm:inline">CI Preset:</span>
            <button
              onClick={() => onSelectPreset('original')}
              className="px-2.5 py-1 rounded text-slate-300 hover:text-white hover:bg-slate-800 transition"
              title="Reset to the original workflow you provided"
            >
              Original YAML
            </button>
            <button
              onClick={() => onSelectPreset('modernized')}
              className="px-2.5 py-1 rounded bg-cyan-500/10 text-cyan-300 border border-cyan-500/30 hover:bg-cyan-500/20 transition flex items-center gap-1"
              title="Modernized Actions v4 + Gradle cache + Tests + Signing"
            >
              <Sparkles className="w-3 h-3" />
              Production v4
            </button>
            <button
              onClick={() => onSelectPreset('playstore')}
              className="px-2.5 py-1 rounded text-slate-300 hover:text-white hover:bg-slate-800 transition hidden md:inline"
              title="Google Play App Bundle (.aab) with Keystore signing"
            >
              Play Store AAB
            </button>
          </div>

          {/* Simulate Run Button */}
          <button
            onClick={onSimulateRun}
            disabled={isSimulating}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition shadow-sm ${
              isSimulating
                ? 'bg-amber-500/20 border border-amber-500/40 text-amber-300 cursor-wait'
                : 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-emerald-900/30'
            }`}
          >
            {isSimulating ? (
              <>
                <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                <span>Running Simulation...</span>
              </>
            ) : (
              <>
                <Play className="w-3.5 h-3.5 fill-current" />
                <span>Build BisnisQu APK</span>
              </>
            )}
          </button>

          {/* Copy YAML */}
          <button
            onClick={onCopyYaml}
            className="px-2.5 py-1.5 rounded-lg border border-slate-700 bg-slate-900 hover:bg-slate-800 text-slate-200 text-xs font-medium flex items-center gap-1.5 transition"
            title="Copy YAML to clipboard"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5 text-slate-400" />}
            <span className="hidden sm:inline">{copied ? 'Copied!' : 'Copy YAML'}</span>
          </button>

          {/* Download .yml */}
          <button
            onClick={onDownloadYaml}
            className="p-1.5 rounded-lg border border-slate-700 bg-slate-900 hover:bg-slate-800 text-slate-300 transition"
            title="Download build-flutter-apk.yml"
          >
            <Download className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Main Tabs Navigation */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 flex items-center gap-1 overflow-x-auto no-scrollbar border-t border-slate-900 text-xs font-medium">
        <button
          onClick={() => setActiveTab('bisnisqu')}
          className={`flex items-center gap-2 px-3.5 py-2.5 border-b-2 transition whitespace-nowrap ${
            activeTab === 'bisnisqu'
              ? 'border-blue-400 text-blue-300 bg-blue-950/20'
              : 'border-transparent text-slate-400 hover:text-slate-200 hover:border-slate-700'
          }`}
        >
          <Smartphone className="w-3.5 h-3.5" />
          <span>BisnisQu App Simulator</span>
          <span className="text-[10px] bg-blue-500/20 text-blue-300 border border-blue-500/40 px-1.5 py-0.2 rounded-full">
            Live UI
          </span>
        </button>

        <button
          onClick={() => setActiveTab('dart')}
          className={`flex items-center gap-2 px-3.5 py-2.5 border-b-2 transition whitespace-nowrap ${
            activeTab === 'dart'
              ? 'border-cyan-400 text-cyan-300 bg-cyan-950/20'
              : 'border-transparent text-slate-400 hover:text-slate-200 hover:border-slate-700'
          }`}
        >
          <Code2 className="w-3.5 h-3.5" />
          <span>Flutter Dart Code</span>
        </button>

        <button
          onClick={() => setActiveTab('studio')}
          className={`flex items-center gap-2 px-3.5 py-2.5 border-b-2 transition whitespace-nowrap ${
            activeTab === 'studio'
              ? 'border-cyan-400 text-cyan-300 bg-cyan-950/20'
              : 'border-transparent text-slate-400 hover:text-slate-200 hover:border-slate-700'
          }`}
        >
          <FileCode2 className="w-3.5 h-3.5" />
          <span>Workflow CI/CD</span>
        </button>

        <button
          onClick={() => setActiveTab('simulator')}
          className={`flex items-center gap-2 px-3.5 py-2.5 border-b-2 transition whitespace-nowrap ${
            activeTab === 'simulator'
              ? 'border-emerald-400 text-emerald-300 bg-emerald-950/20'
              : 'border-transparent text-slate-400 hover:text-slate-200 hover:border-slate-700'
          }`}
        >
          <Terminal className="w-3.5 h-3.5" />
          <span>Live Runner Simulation</span>
          {isSimulating && (
            <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping" />
          )}
        </button>

        <button
          onClick={() => setActiveTab('artifacts')}
          className={`flex items-center gap-2 px-3.5 py-2.5 border-b-2 transition whitespace-nowrap ${
            activeTab === 'artifacts'
              ? 'border-indigo-400 text-indigo-300 bg-indigo-950/20'
              : 'border-transparent text-slate-400 hover:text-slate-200 hover:border-slate-700'
          }`}
        >
          <Package className="w-3.5 h-3.5" />
          <span>APK & ABI Artifacts</span>
          <span className="text-[10px] bg-slate-800 text-slate-400 px-1.5 py-0.2 rounded-full">3 ABIs</span>
        </button>

        <button
          onClick={() => setActiveTab('audit')}
          className={`flex items-center gap-2 px-3.5 py-2.5 border-b-2 transition whitespace-nowrap ${
            activeTab === 'audit'
              ? 'border-amber-400 text-amber-300 bg-amber-950/20'
              : 'border-transparent text-slate-400 hover:text-slate-200 hover:border-slate-700'
          }`}
        >
          <ShieldAlert className="w-3.5 h-3.5" />
          <span>Modernization & Audit</span>
          {auditIssuesCount > 0 && (
            <span className="text-[10px] bg-amber-500/20 text-amber-300 border border-amber-500/40 px-1.5 py-0.2 rounded-full">
              {auditIssuesCount} tips
            </span>
          )}
        </button>

        <button
          onClick={() => setActiveTab('keystore')}
          className={`flex items-center gap-2 px-3.5 py-2.5 border-b-2 transition whitespace-nowrap ${
            activeTab === 'keystore'
              ? 'border-purple-400 text-purple-300 bg-purple-950/20'
              : 'border-transparent text-slate-400 hover:text-slate-200 hover:border-slate-700'
          }`}
        >
          <Key className="w-3.5 h-3.5" />
          <span>Keystore & Signing Guide</span>
        </button>
      </div>
    </header>
  );
};

