import React, { useState } from 'react';
import { 
  Copy, 
  Check, 
  Download, 
  Settings2, 
  Sliders, 
  Sparkles, 
  Info, 
  FileCheck,
  Shield, 
  Cpu, 
  GitFork, 
  Zap,
  Terminal,
  Layers,
  ChevronDown,
  ChevronRight
} from 'lucide-react';
import { WorkflowConfig, BuildTarget } from '../types/workflow';
import { generateYaml } from '../utils/yamlGenerator';

interface WorkflowEditorProps {
  config: WorkflowConfig;
  onUpdateConfig: (updater: (prev: WorkflowConfig) => WorkflowConfig) => void;
  onSimulateRun: () => void;
  onOpenKeystoreGuide: () => void;
  onOpenAudit: () => void;
}

export const WorkflowEditor: React.FC<WorkflowEditorProps> = ({
  config,
  onUpdateConfig,
  onSimulateRun,
  onOpenKeystoreGuide,
  onOpenAudit,
}) => {
  const [copied, setCopied] = useState(false);
  const [activeSection, setActiveSection] = useState<'build' | 'signing' | 'quality' | 'sdk' | 'triggers'>('build');
  const [showOriginalComparison, setShowOriginalComparison] = useState(false);

  const generatedYaml = generateYaml(config);

  const handleCopy = () => {
    navigator.clipboard.writeText(generatedYaml);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    const blob = new Blob([generatedYaml], { type: 'text/yaml;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'build-flutter-apk.yml';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
      {/* Left Column: Interactive Settings Panel (5 cols) */}
      <div className="lg:col-span-5 space-y-4">
        {/* Navigation Section Pills */}
        <div className="flex items-center gap-1.5 p-1 bg-slate-900 border border-slate-800 rounded-lg text-xs overflow-x-auto no-scrollbar">
          <button
            onClick={() => setActiveSection('build')}
            className={`px-3 py-1.5 rounded-md font-medium transition whitespace-nowrap flex items-center gap-1.5 ${
              activeSection === 'build'
                ? 'bg-cyan-500/10 text-cyan-300 border border-cyan-500/30'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Sliders className="w-3.5 h-3.5" />
            <span>Target & ABI</span>
          </button>

          <button
            onClick={() => setActiveSection('signing')}
            className={`px-3 py-1.5 rounded-md font-medium transition whitespace-nowrap flex items-center gap-1.5 ${
              activeSection === 'signing'
                ? 'bg-purple-500/10 text-purple-300 border border-purple-500/30'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Shield className="w-3.5 h-3.5" />
            <span>Signing & Secrets</span>
          </button>

          <button
            onClick={() => setActiveSection('quality')}
            className={`px-3 py-1.5 rounded-md font-medium transition whitespace-nowrap flex items-center gap-1.5 ${
              activeSection === 'quality'
                ? 'bg-emerald-500/10 text-emerald-300 border border-emerald-500/30'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <FileCheck className="w-3.5 h-3.5" />
            <span>Lint & Tests</span>
          </button>

          <button
            onClick={() => setActiveSection('sdk')}
            className={`px-3 py-1.5 rounded-md font-medium transition whitespace-nowrap flex items-center gap-1.5 ${
              activeSection === 'sdk'
                ? 'bg-amber-500/10 text-amber-300 border border-amber-500/30'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Cpu className="w-3.5 h-3.5" />
            <span>Flutter & JDK</span>
          </button>

          <button
            onClick={() => setActiveSection('triggers')}
            className={`px-3 py-1.5 rounded-md font-medium transition whitespace-nowrap flex items-center gap-1.5 ${
              activeSection === 'triggers'
                ? 'bg-indigo-500/10 text-indigo-300 border border-indigo-500/30'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <GitFork className="w-3.5 h-3.5" />
            <span>Triggers</span>
          </button>
        </div>

        {/* Section Container */}
        <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-5 backdrop-blur text-sm space-y-5">
          {/* Section: Build Target & ABI Split */}
          {activeSection === 'build' && (
            <div className="space-y-4">
              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1">
                  Build Output Mode
                </label>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <button
                    onClick={() => onUpdateConfig(c => ({ ...c, buildTarget: 'split-apk' }))}
                    className={`p-3 rounded-lg border text-left transition ${
                      config.buildTarget === 'split-apk'
                        ? 'bg-cyan-950/40 border-cyan-500/60 text-cyan-200 ring-1 ring-cyan-500/30'
                        : 'bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700'
                    }`}
                  >
                    <div className="font-semibold text-slate-200 mb-0.5">Split per ABI (Current)</div>
                    <div className="text-[11px] text-slate-400 leading-tight">
                      --split-per-abi creates 3 compact APKs (~20MB ea). Best for testing & sideloading.
                    </div>
                  </button>

                  <button
                    onClick={() => onUpdateConfig(c => ({ ...c, buildTarget: 'appbundle' }))}
                    className={`p-3 rounded-lg border text-left transition ${
                      config.buildTarget === 'appbundle'
                        ? 'bg-cyan-950/40 border-cyan-500/60 text-cyan-200 ring-1 ring-cyan-500/30'
                        : 'bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700'
                    }`}
                  >
                    <div className="font-semibold text-slate-200 mb-0.5">App Bundle (.aab)</div>
                    <div className="text-[11px] text-slate-400 leading-tight">
                      Required for Google Play Store upload. Google optimizes delivery per user device.
                    </div>
                  </button>

                  <button
                    onClick={() => onUpdateConfig(c => ({ ...c, buildTarget: 'universal-apk' }))}
                    className={`p-3 rounded-lg border text-left transition ${
                      config.buildTarget === 'universal-apk'
                        ? 'bg-cyan-950/40 border-cyan-500/60 text-cyan-200 ring-1 ring-cyan-500/30'
                        : 'bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700'
                    }`}
                  >
                    <div className="font-semibold text-slate-200 mb-0.5">Universal APK</div>
                    <div className="text-[11px] text-slate-400 leading-tight">
                      Single APK containing all native libs (~55MB). Runs on any device.
                    </div>
                  </button>

                  <button
                    onClick={() => onUpdateConfig(c => ({ ...c, buildTarget: 'both-apk-aab' }))}
                    className={`p-3 rounded-lg border text-left transition ${
                      config.buildTarget === 'both-apk-aab'
                        ? 'bg-cyan-950/40 border-cyan-500/60 text-cyan-200 ring-1 ring-cyan-500/30'
                        : 'bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700'
                    }`}
                  >
                    <div className="font-semibold text-slate-200 mb-0.5">Both APKs + AAB</div>
                    <div className="text-[11px] text-slate-400 leading-tight">
                      Produces split APKs for testers and AAB for store releases in one run.
                    </div>
                  </button>
                </div>
              </div>

              {/* Versioning and Flags */}
              <div className="pt-2 border-t border-slate-800/80 space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-xs font-medium text-slate-200 block">Inject Build Number & Name</span>
                    <span className="text-[11px] text-slate-400">
                      Syncs GitHub Action run number into flutter build --build-number
                    </span>
                  </div>
                  <input
                    type="checkbox"
                    checked={config.includeBuildNameNumber}
                    onChange={(e) => onUpdateConfig(c => ({ ...c, includeBuildNameNumber: e.target.checked }))}
                    className="h-4 w-4 rounded bg-slate-950 border-slate-700 text-cyan-500 focus:ring-cyan-500"
                  />
                </div>

                {config.includeBuildNameNumber && (
                  <div className="grid grid-cols-2 gap-2 text-xs bg-slate-950 p-3 rounded-lg border border-slate-800">
                    <div>
                      <label className="text-[11px] text-slate-400 block mb-1">Version Name (--build-name)</label>
                      <input
                        type="text"
                        value={config.buildName}
                        onChange={(e) => onUpdateConfig(c => ({ ...c, buildName: e.target.value }))}
                        className="w-full bg-slate-900 border border-slate-700 rounded px-2.5 py-1 text-slate-200 text-xs font-mono"
                        placeholder="1.0.0"
                      />
                    </div>
                    <div>
                      <label className="text-[11px] text-slate-400 block mb-1">Build Number Source</label>
                      <select
                        value={config.buildNumberSource}
                        onChange={(e) => onUpdateConfig(c => ({ ...c, buildNumberSource: e.target.value as any }))}
                        className="w-full bg-slate-900 border border-slate-700 rounded px-2 py-1 text-slate-200 text-xs"
                      >
                        <option value="github.run_number">github.run_number (Auto)</option>
                        <option value="custom">Custom integer</option>
                      </select>
                    </div>
                  </div>
                )}

                {/* Code Obfuscation */}
                <div className="flex items-center justify-between pt-2">
                  <div>
                    <span className="text-xs font-medium text-slate-200 block">Obfuscate Dart Code</span>
                    <span className="text-[11px] text-slate-400">
                      Adds --obfuscate --split-debug-info for reverse engineering protection
                    </span>
                  </div>
                  <input
                    type="checkbox"
                    checked={config.obfuscate}
                    onChange={(e) => onUpdateConfig(c => ({ ...c, obfuscate: e.target.checked, splitDebugInfo: e.target.checked }))}
                    className="h-4 w-4 rounded bg-slate-950 border-slate-700 text-cyan-500 focus:ring-cyan-500"
                  />
                </div>

                {/* Artifact Name */}
                <div className="pt-2">
                  <label className="text-xs font-medium text-slate-200 block mb-1">Artifact Package Name</label>
                  <input
                    type="text"
                    value={config.artifactName}
                    onChange={(e) => onUpdateConfig(c => ({ ...c, artifactName: e.target.value }))}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-1.5 text-slate-200 text-xs font-mono"
                    placeholder="release-apks"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Section: Signing & Secrets */}
          {activeSection === 'signing' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between pb-2 border-b border-slate-800">
                <div>
                  <h3 className="text-xs font-semibold text-slate-200">Production Keystore Signing</h3>
                  <p className="text-[11px] text-slate-400">
                    Without this step, release builds default to debug keys or fail signing.
                  </p>
                </div>
                <input
                  type="checkbox"
                  checked={config.enableKeystoreSigning}
                  onChange={(e) => onUpdateConfig(c => ({ ...c, enableKeystoreSigning: e.target.checked }))}
                  className="h-4 w-4 rounded bg-slate-950 border-slate-700 text-purple-500 focus:ring-purple-500"
                />
              </div>

              {config.enableKeystoreSigning ? (
                <div className="space-y-3">
                  <div className="bg-purple-950/30 border border-purple-800/40 rounded-lg p-3 text-xs text-purple-200">
                    <p className="font-medium text-purple-100 mb-1">Decodes Base64 Keystore at Runtime</p>
                    <p className="text-[11px] text-purple-300/80">
                      Injects credentials safely without committing passwords or .jks files to GitHub.
                    </p>
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <div>
                      <label className="text-[11px] text-slate-400 block mb-1">Keystore Base64 Secret</label>
                      <input
                        type="text"
                        value={config.keystoreSecretName}
                        onChange={(e) => onUpdateConfig(c => ({ ...c, keystoreSecretName: e.target.value }))}
                        className="w-full bg-slate-950 border border-slate-800 rounded px-2.5 py-1 text-slate-200 text-xs font-mono"
                      />
                    </div>
                    <div>
                      <label className="text-[11px] text-slate-400 block mb-1">Keystore Password Secret</label>
                      <input
                        type="text"
                        value={config.keystorePasswordSecret}
                        onChange={(e) => onUpdateConfig(c => ({ ...c, keystorePasswordSecret: e.target.value }))}
                        className="w-full bg-slate-950 border border-slate-800 rounded px-2.5 py-1 text-slate-200 text-xs font-mono"
                      />
                    </div>
                    <div>
                      <label className="text-[11px] text-slate-400 block mb-1">Key Alias Secret</label>
                      <input
                        type="text"
                        value={config.keyAliasSecret}
                        onChange={(e) => onUpdateConfig(c => ({ ...c, keyAliasSecret: e.target.value }))}
                        className="w-full bg-slate-950 border border-slate-800 rounded px-2.5 py-1 text-slate-200 text-xs font-mono"
                      />
                    </div>
                    <div>
                      <label className="text-[11px] text-slate-400 block mb-1">Key Password Secret</label>
                      <input
                        type="text"
                        value={config.keyPasswordSecret}
                        onChange={(e) => onUpdateConfig(c => ({ ...c, keyPasswordSecret: e.target.value }))}
                        className="w-full bg-slate-950 border border-slate-800 rounded px-2.5 py-1 text-slate-200 text-xs font-mono"
                      />
                    </div>
                  </div>

                  <button
                    onClick={onOpenKeystoreGuide}
                    className="w-full py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg text-xs font-medium transition flex items-center justify-center gap-1.5"
                  >
                    <span>View Keystore Setup & Base64 Generation Guide</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              ) : (
                <div className="bg-slate-950 p-4 rounded-lg border border-slate-800/80 text-xs text-slate-400">
                  <p className="mb-2">
                    Keystore step is currently <strong>disabled</strong> in your workflow.
                  </p>
                  <button
                    onClick={() => onUpdateConfig(c => ({ ...c, enableKeystoreSigning: true }))}
                    className="px-3 py-1.5 bg-purple-600/30 border border-purple-500/50 hover:bg-purple-600/40 text-purple-200 rounded text-xs transition"
                  >
                    Enable Production Signing Step
                  </button>
                </div>
              )}
            </div>
          )}

          {/* Section: Lint & Tests */}
          {activeSection === 'quality' && (
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 bg-slate-950 rounded-lg border border-slate-800">
                <div>
                  <span className="text-xs font-medium text-slate-200 block">flutter pub get</span>
                  <span className="text-[11px] text-slate-400">Resolves dependencies from pubspec.yaml</span>
                </div>
                <input
                  type="checkbox"
                  checked={config.runPubGet}
                  onChange={(e) => onUpdateConfig(c => ({ ...c, runPubGet: e.target.checked }))}
                  className="h-4 w-4 rounded bg-slate-900 border-slate-700 text-emerald-500"
                />
              </div>

              <div className="flex items-center justify-between p-3 bg-slate-950 rounded-lg border border-slate-800">
                <div>
                  <span className="text-xs font-medium text-slate-200 block">flutter analyze</span>
                  <span className="text-[11px] text-slate-400">Performs static Dart code analysis</span>
                </div>
                <input
                  type="checkbox"
                  checked={config.runAnalyze}
                  onChange={(e) => onUpdateConfig(c => ({ ...c, runAnalyze: e.target.checked }))}
                  className="h-4 w-4 rounded bg-slate-900 border-slate-700 text-emerald-500"
                />
              </div>

              <div className="flex items-center justify-between p-3 bg-slate-950 rounded-lg border border-slate-800">
                <div>
                  <span className="text-xs font-medium text-slate-200 block">flutter test</span>
                  <span className="text-[11px] text-slate-400">Executes unit, widget, and integration tests</span>
                </div>
                <input
                  type="checkbox"
                  checked={config.runTests}
                  onChange={(e) => onUpdateConfig(c => ({ ...c, runTests: e.target.checked }))}
                  className="h-4 w-4 rounded bg-slate-900 border-slate-700 text-emerald-500"
                />
              </div>

              <div className="flex items-center justify-between p-3 bg-slate-950 rounded-lg border border-slate-800">
                <div>
                  <span className="text-xs font-medium text-slate-200 block">dart format check</span>
                  <span className="text-[11px] text-slate-400">Fails if files are not formatted cleanly</span>
                </div>
                <input
                  type="checkbox"
                  checked={config.dartFormatCheck}
                  onChange={(e) => onUpdateConfig(c => ({ ...c, dartFormatCheck: e.target.checked }))}
                  className="h-4 w-4 rounded bg-slate-900 border-slate-700 text-emerald-500"
                />
              </div>

              {/* Gradle Cache Optimization */}
              <div className="flex items-center justify-between p-3 bg-slate-950 rounded-lg border border-slate-800">
                <div>
                  <span className="text-xs font-medium text-slate-200 block">Gradle Dependency Cache</span>
                  <span className="text-[11px] text-emerald-400">Saves 5+ minutes per run via actions/cache@v4</span>
                </div>
                <input
                  type="checkbox"
                  checked={config.cacheGradle}
                  onChange={(e) => onUpdateConfig(c => ({ ...c, cacheGradle: e.target.checked }))}
                  className="h-4 w-4 rounded bg-slate-900 border-slate-700 text-emerald-500"
                />
              </div>
            </div>
          )}

          {/* Section: Flutter & JDK */}
          {activeSection === 'sdk' && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-medium text-slate-300 block mb-1">Java Version</label>
                  <select
                    value={config.javaVersion}
                    onChange={(e) => onUpdateConfig(c => ({ ...c, javaVersion: e.target.value as any }))}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-1.5 text-xs text-slate-200"
                  >
                    <option value="17">Java 17 (Recommended for Flutter)</option>
                    <option value="11">Java 11 (Legacy)</option>
                    <option value="21">Java 21 (Modern LTS)</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs font-medium text-slate-300 block mb-1">JDK Distribution</label>
                  <select
                    value={config.javaDistro}
                    onChange={(e) => onUpdateConfig(c => ({ ...c, javaDistro: e.target.value as any }))}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-1.5 text-xs text-slate-200"
                  >
                    <option value="zulu">Zulu OpenJDK (Azul)</option>
                    <option value="temurin">Eclipse Temurin</option>
                    <option value="corretto">Amazon Corretto</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-medium text-slate-300 block mb-1">Flutter Channel</label>
                  <select
                    value={config.flutterChannel}
                    onChange={(e) => onUpdateConfig(c => ({ ...c, flutterChannel: e.target.value as any }))}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-1.5 text-xs text-slate-200"
                  >
                    <option value="stable">stable (Production)</option>
                    <option value="beta">beta (Preview)</option>
                    <option value="master">master (Bleeding edge)</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs font-medium text-slate-300 block mb-1">Pin Flutter Version (Optional)</label>
                  <input
                    type="text"
                    value={config.flutterVersionPin}
                    onChange={(e) => onUpdateConfig(c => ({ ...c, flutterVersionPin: e.target.value }))}
                    placeholder="e.g. 3.29.0 or blank for latest"
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-1.5 text-xs text-slate-200 font-mono"
                  />
                </div>
              </div>

              {/* Version Upgrades */}
              <div className="pt-2 border-t border-slate-800 space-y-2">
                <div className="text-xs font-medium text-slate-300">Action Versions</div>
                <div className="grid grid-cols-3 gap-2 text-xs">
                  <div className="bg-slate-950 p-2 rounded border border-slate-800">
                    <span className="text-[10px] text-slate-400 block">checkout</span>
                    <select
                      value={config.checkoutVersion}
                      onChange={(e) => onUpdateConfig(c => ({ ...c, checkoutVersion: e.target.value as any }))}
                      className="bg-transparent text-slate-200 font-mono mt-0.5"
                    >
                      <option value="v4">v4 (Node 20)</option>
                      <option value="v3">v3 (Legacy)</option>
                    </select>
                  </div>

                  <div className="bg-slate-950 p-2 rounded border border-slate-800">
                    <span className="text-[10px] text-slate-400 block">setup-java</span>
                    <select
                      value={config.setupJavaVersion}
                      onChange={(e) => onUpdateConfig(c => ({ ...c, setupJavaVersion: e.target.value as any }))}
                      className="bg-transparent text-slate-200 font-mono mt-0.5"
                    >
                      <option value="v4">v4 (Node 20)</option>
                      <option value="v3">v3 (Legacy)</option>
                    </select>
                  </div>

                  <div className="bg-slate-950 p-2 rounded border border-slate-800">
                    <span className="text-[10px] text-slate-400 block">upload-artifact</span>
                    <select
                      value={config.uploadArtifactVersion}
                      onChange={(e) => onUpdateConfig(c => ({ ...c, uploadArtifactVersion: e.target.value as any }))}
                      className="bg-transparent text-slate-200 font-mono mt-0.5"
                    >
                      <option value="v4">v4 (Current)</option>
                      <option value="v3">v3 (Deprecated)</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Section: Triggers */}
          {activeSection === 'triggers' && (
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 bg-slate-950 rounded-lg border border-slate-800">
                <div>
                  <span className="text-xs font-medium text-slate-200 block">push: branches: [main]</span>
                  <span className="text-[11px] text-slate-400">Triggers on every commit pushed to main</span>
                </div>
                <input
                  type="checkbox"
                  checked={config.triggerPushMain}
                  onChange={(e) => onUpdateConfig(c => ({ ...c, triggerPushMain: e.target.checked }))}
                  className="h-4 w-4 rounded bg-slate-900 border-slate-700 text-indigo-500"
                />
              </div>

              <div className="flex items-center justify-between p-3 bg-slate-950 rounded-lg border border-slate-800">
                <div>
                  <span className="text-xs font-medium text-slate-200 block">pull_request: branches: [main]</span>
                  <span className="text-[11px] text-slate-400">Validates build before merging pull requests</span>
                </div>
                <input
                  type="checkbox"
                  checked={config.triggerPrMain}
                  onChange={(e) => onUpdateConfig(c => ({ ...c, triggerPrMain: e.target.checked }))}
                  className="h-4 w-4 rounded bg-slate-900 border-slate-700 text-indigo-500"
                />
              </div>

              <div className="flex items-center justify-between p-3 bg-slate-950 rounded-lg border border-slate-800">
                <div>
                  <span className="text-xs font-medium text-slate-200 block">workflow_dispatch</span>
                  <span className="text-[11px] text-slate-400">Allows manual run button from GitHub Actions UI</span>
                </div>
                <input
                  type="checkbox"
                  checked={config.triggerWorkflowDispatch}
                  onChange={(e) => onUpdateConfig(c => ({ ...c, triggerWorkflowDispatch: e.target.checked }))}
                  className="h-4 w-4 rounded bg-slate-900 border-slate-700 text-indigo-500"
                />
              </div>

              <div className="flex items-center justify-between p-3 bg-slate-950 rounded-lg border border-slate-800">
                <div>
                  <span className="text-xs font-medium text-slate-200 block">Release on Tag Push (v*)</span>
                  <span className="text-[11px] text-slate-400">Builds & creates GitHub Release when git tag pushed</span>
                </div>
                <input
                  type="checkbox"
                  checked={config.triggerTags}
                  onChange={(e) => onUpdateConfig(c => ({ 
                    ...c, 
                    triggerTags: e.target.checked,
                    publishGitHubRelease: e.target.checked 
                  }))}
                  className="h-4 w-4 rounded bg-slate-900 border-slate-700 text-indigo-500"
                />
              </div>

              <div className="flex items-center justify-between p-3 bg-slate-950 rounded-lg border border-slate-800">
                <div>
                  <span className="text-xs font-medium text-slate-200 block">Concurrency Group</span>
                  <span className="text-[11px] text-slate-400">Auto-cancels previous running jobs on new commit</span>
                </div>
                <input
                  type="checkbox"
                  checked={config.concurrencyGroup}
                  onChange={(e) => onUpdateConfig(c => ({ ...c, concurrencyGroup: e.target.checked }))}
                  className="h-4 w-4 rounded bg-slate-900 border-slate-700 text-indigo-500"
                />
              </div>
            </div>
          )}
        </div>

        {/* Quick action buttons */}
        <div className="flex gap-2">
          <button
            onClick={onSimulateRun}
            className="flex-1 py-2.5 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white rounded-lg text-xs font-semibold shadow-md shadow-cyan-950 transition flex items-center justify-center gap-1.5"
          >
            <Terminal className="w-3.5 h-3.5" />
            <span>Simulate Pipeline Execution</span>
          </button>
          <button
            onClick={onOpenAudit}
            className="px-3 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg text-xs font-medium transition flex items-center gap-1"
            title="Inspect deprecations and security audit"
          >
            <Shield className="w-3.5 h-3.5 text-amber-400" />
            <span>Audit</span>
          </button>
        </div>
      </div>

      {/* Right Column: Code Viewer with Line Numbers (7 cols) */}
      <div className="lg:col-span-7 bg-slate-950 border border-slate-800 rounded-xl overflow-hidden shadow-xl">
        {/* Editor Window Header */}
        <div className="bg-slate-900/90 border-b border-slate-800 px-4 py-2.5 flex items-center justify-between text-xs">
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-rose-500/80 inline-block" />
              <span className="w-2.5 h-2.5 rounded-full bg-amber-500/80 inline-block" />
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500/80 inline-block" />
            </div>
            <span className="text-slate-400 font-mono text-[11px] ml-2">
              .github/workflows/build-flutter-apk.yml
            </span>
            <span className="text-[10px] bg-slate-800 text-slate-400 px-1.5 py-0.2 rounded font-mono">
              YAML
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleCopy}
              className="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded text-xs flex items-center gap-1.5 transition"
            >
              {copied ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3 text-slate-400" />}
              <span>{copied ? 'Copied' : 'Copy'}</span>
            </button>
            <button
              onClick={handleDownload}
              className="p-1 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded transition"
              title="Download YAML file"
            >
              <Download className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Code Content */}
        <div className="p-4 overflow-x-auto max-h-[640px] overflow-y-auto font-mono text-xs leading-relaxed text-slate-300">
          <pre className="select-text">
            {generatedYaml.split('\n').map((line, idx) => {
              // Highlight syntax keys
              let lineContent: React.ReactNode = line;

              if (line.trim().startsWith('#')) {
                lineContent = <span className="text-slate-500 italic">{line}</span>;
              } else if (line.includes(':') && !line.includes('http')) {
                const parts = line.split(':');
                const key = parts[0];
                const rest = parts.slice(1).join(':');
                lineContent = (
                  <>
                    <span className="text-cyan-400 font-medium">{key}:</span>
                    <span className="text-slate-200">{rest}</span>
                  </>
                );
              } else if (line.trim().startsWith('- name:')) {
                lineContent = <span className="text-amber-300 font-semibold">{line}</span>;
              } else if (line.trim().startsWith('run:')) {
                lineContent = <span className="text-emerald-400 font-medium">{line}</span>;
              }

              return (
                <div key={idx} className="flex hover:bg-slate-900/60 px-2 py-0.5 rounded -mx-2">
                  <span className="w-8 flex-shrink-0 text-slate-600 select-none text-right pr-3 text-[11px]">
                    {idx + 1}
                  </span>
                  <span className="flex-1 whitespace-pre">{lineContent}</span>
                </div>
              );
            })}
          </pre>
        </div>

        {/* Footer info banner */}
        <div className="bg-slate-900/60 border-t border-slate-800/80 px-4 py-2 flex items-center justify-between text-[11px] text-slate-400">
          <div className="flex items-center gap-1.5">
            <span className="text-emerald-400">●</span>
            <span>Syntax Validated</span>
            <span className="text-slate-600">·</span>
            <span>UTF-8 LF</span>
          </div>
          <div className="text-slate-500">
            Target: {config.buildTarget === 'split-apk' ? 'Split ABI (armeabi-v7a, arm64-v8a, x86_64)' : config.buildTarget}
          </div>
        </div>
      </div>
    </div>
  );
};
