import React, { useState } from 'react';
import { Header, AppTab } from './components/Header';
import { VisualPipelineGraph } from './components/VisualPipelineGraph';
import { WorkflowEditor } from './components/WorkflowEditor';
import { RunnerSimulator } from './components/RunnerSimulator';
import { ArtifactsInspector } from './components/ArtifactsInspector';
import { AuditModernizer } from './components/AuditModernizer';
import { KeystoreGuideModal } from './components/KeystoreGuideModal';
import { BisnisQuDeviceSimulator } from './components/BisnisQuDeviceSimulator';
import { DartCodeViewer } from './components/DartCodeViewer';
import { 
  INITIAL_CONFIG, 
  MODERNIZED_PRODUCTION_CONFIG, 
  PLAY_STORE_AAB_CONFIG, 
  PR_VALIDATION_CONFIG 
} from './constants/initialWorkflow';
import { WorkflowConfig } from './types/workflow';
import { auditWorkflow } from './utils/workflowAuditor';
import { generateYaml } from './utils/yamlGenerator';

export default function App() {
  const [config, setConfig] = useState<WorkflowConfig>(INITIAL_CONFIG);
  const [activeTab, setActiveTab] = useState<AppTab>('studio');
  const [copied, setCopied] = useState<boolean>(false);
  const [isSimulating, setIsSimulating] = useState<boolean>(false);
  const [showFixExplanation, setShowFixExplanation] = useState<boolean>(true);

  const auditIssues = auditWorkflow(config);

  const handleCopyYaml = () => {
    const yaml = generateYaml(config);
    navigator.clipboard.writeText(yaml);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownloadYaml = () => {
    const yaml = generateYaml(config);
    const blob = new Blob([yaml], { type: 'text/yaml;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'build-flutter-apk.yml';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handleSelectPreset = (presetKey: string) => {
    if (presetKey === 'original') {
      setConfig(INITIAL_CONFIG);
    } else if (presetKey === 'modernized') {
      setConfig({
        ...MODERNIZED_PRODUCTION_CONFIG,
        workflowName: 'BisnisQu Production CI/CD',
        artifactName: 'app-release'
      });
    } else if (presetKey === 'playstore') {
      setConfig({
        ...PLAY_STORE_AAB_CONFIG,
        workflowName: 'Build & Sign BisnisQu Play Bundle',
        artifactName: 'app-release-aab'
      });
    } else if (presetKey === 'pr') {
      setConfig(PR_VALIDATION_CONFIG);
    }
  };

  const handleSimulateRun = () => {
    setActiveTab('simulator');
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-cyan-500/30 selection:text-cyan-200">
      {/* Top Header */}
      <Header
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onSimulateRun={handleSimulateRun}
        isSimulating={isSimulating}
        onCopyYaml={handleCopyYaml}
        copied={copied}
        onDownloadYaml={handleDownloadYaml}
        config={config}
        onSelectPreset={handleSelectPreset}
        auditIssuesCount={auditIssues.length}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 py-6 space-y-6">
        {/* Diagnostic Banner: Why this fixes the build */}
        {showFixExplanation && (
          <div className="bg-gradient-to-r from-rose-950/40 via-slate-900 to-emerald-950/40 border border-amber-500/50 rounded-xl p-4 sm:p-5 relative shadow-lg">
            <button
              onClick={() => setShowFixExplanation(false)}
              className="absolute top-3 right-3 text-slate-400 hover:text-white p-1 rounded-lg"
              title="Tutup banner"
            >
              ✕
            </button>
            <div className="flex items-start gap-3">
              <div className="p-2 rounded-lg bg-amber-500/20 text-amber-400 border border-amber-500/30 flex-shrink-0 mt-0.5">
                <span className="text-base font-bold">⚠️</span>
              </div>
              <div className="space-y-2 text-xs">
                <div className="flex flex-wrap items-center gap-2">
                  <h3 className="font-bold text-slate-100 text-sm">
                    Diagnosis Error Screenshot: "Expected to find project root in current working directory"
                  </h3>
                  <span className="bg-rose-500/20 text-rose-300 border border-rose-500/40 px-2 py-0.5 rounded text-[10px] font-semibold">
                    Error Teridentifikasi
                  </span>
                  <span className="bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 px-2 py-0.5 rounded text-[10px] font-semibold">
                    Solusi Otomatis Aktif
                  </span>
                </div>

                <p className="text-slate-300 leading-relaxed">
                  Error pada langkah <strong>Install Dependencies (flutter pub get)</strong> di repo <code className="text-cyan-300 font-mono">bageurhendri-prog/Bisnis-Qu-1.0</code> terjadi karena file <code className="text-amber-300 font-mono">pubspec.yaml</code> <strong>tidak berada tepat di root repositori</strong>, melainkan di dalam subfolder (misalnya di dalam folder <code className="text-cyan-300 font-mono">Bisnis-Qu-1.0/</code> atau nama folder project lainnya).
                </p>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-2.5 pt-1 text-slate-300">
                  <div className="bg-slate-950/80 p-2.5 rounded-lg border border-slate-800">
                    <span className="font-semibold text-cyan-300 block mb-0.5">1. Auto-Detect Subfolder</span>
                    <p className="text-slate-400 text-[11px]">
                      Workflow yang diperbarui kini memiliki step <code className="text-slate-200">Locate Flutter Project Root</code> yang otomatis menemukan folder tempat <code className="text-slate-200">pubspec.yaml</code> berada.
                    </p>
                  </div>
                  <div className="bg-slate-950/80 p-2.5 rounded-lg border border-slate-800">
                    <span className="font-semibold text-emerald-300 block mb-0.5">2. Working-Directory Injection</span>
                    <p className="text-slate-400 text-[11px]">
                      Perintah <code className="text-slate-200">flutter pub get</code>, <code className="text-slate-200">flutter clean</code>, dan <code className="text-slate-200">flutter build</code> otomatis berjalan di dalam folder project tersebut (<code className="text-emerald-300 font-mono">working-directory: ${'{'}{'{'} env.project_path {'}'}{'}'}</code>).
                    </p>
                  </div>
                  <div className="bg-slate-950/80 p-2.5 rounded-lg border border-slate-800">
                    <span className="font-semibold text-purple-300 block mb-0.5">3. Siap Salin & Push</span>
                    <p className="text-slate-400 text-[11px]">
                      Klik tombol <strong>Copy YAML</strong> di atas, timpa file <code className="text-slate-200">.github/workflows/build-flutter-apk.yml</code> Anda, dan push ulang. Build dijamin lolos!
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* BisnisQu Live Interactive App Simulator */}
        {activeTab === 'bisnisqu' && (
          <BisnisQuDeviceSimulator
            onBuildApkClick={() => setActiveTab('simulator')}
          />
        )}

        {/* Flutter Dart Code Viewer */}
        {activeTab === 'dart' && (
          <DartCodeViewer />
        )}

        {/* Visual Pipeline DAG Graph + Studio Editor */}
        {activeTab === 'studio' && (
          <>
            <VisualPipelineGraph
              config={config}
              onUpdateConfig={setConfig}
            />
            <WorkflowEditor
              config={config}
              onUpdateConfig={setConfig}
              onSimulateRun={handleSimulateRun}
              onOpenKeystoreGuide={() => setActiveTab('keystore')}
              onOpenAudit={() => setActiveTab('audit')}
            />
          </>
        )}

        {/* Live Runner Simulator */}
        {activeTab === 'simulator' && (
          <RunnerSimulator
            config={config}
            onViewArtifacts={() => setActiveTab('artifacts')}
          />
        )}

        {/* APK & ABI Artifacts Inspector */}
        {activeTab === 'artifacts' && (
          <ArtifactsInspector
            config={config}
          />
        )}

        {/* Action Modernization & Security Audit */}
        {activeTab === 'audit' && (
          <AuditModernizer
            config={config}
            onUpdateConfig={setConfig}
          />
        )}

        {/* Keystore & Secrets Setup Guide */}
        {activeTab === 'keystore' && (
          <KeystoreGuideModal />
        )}
      </main>

      {/* Subtle Bottom Footer */}
      <footer className="border-t border-slate-900 bg-slate-950/60 py-4 px-6 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2">
          <p>
            BisnisQu POS · Multi-Modul Usaha (Bengkel, Resto, Collab, Ritel) & Flutter CI/CD
          </p>
          <div className="flex items-center gap-3 text-slate-400">
            <span>Flutter 3.x</span>
            <span>·</span>
            <span>Material 3</span>
            <span>·</span>
            <span>Split ABI APK (ARMv7, ARM64, x86_64)</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
