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
          <div className="bg-gradient-to-r from-emerald-950/60 to-slate-900 border border-emerald-500/40 rounded-xl p-4 sm:p-5 relative shadow-lg">
            <button
              onClick={() => setShowFixExplanation(false)}
              className="absolute top-3 right-3 text-slate-400 hover:text-white p-1 rounded-lg"
              title="Tutup banner"
            >
              ✕
            </button>
            <div className="flex items-start gap-3">
              <div className="p-2 rounded-lg bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex-shrink-0 mt-0.5">
                <span className="text-base font-bold">✓</span>
              </div>
              <div className="space-y-2 text-xs">
                <div className="flex items-center gap-2">
                  <h3 className="font-bold text-slate-100 text-sm">
                    Workflow Diperbarui! Mengapa Workflow Baru Ini Berjalan Sukses?
                  </h3>
                  <span className="bg-emerald-500/20 text-emerald-300 px-2 py-0.5 rounded text-[10px] font-semibold">
                    Fixed & Tested
                  </span>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-2.5 pt-1 text-slate-300">
                  <div className="bg-slate-950/60 p-2.5 rounded-lg border border-slate-800">
                    <span className="font-semibold text-emerald-300 block mb-0.5">1. Branch "master" & "main"</span>
                    <p className="text-slate-400 text-[11px]">
                      Jika branch repo Anda bernama <code className="text-slate-200">master</code>, workflow lama hanya mendengar <code className="text-slate-200">main</code> sehingga GitHub tidak pernah menjalankan aksi.
                    </p>
                  </div>
                  <div className="bg-slate-950/60 p-2.5 rounded-lg border border-slate-800">
                    <span className="font-semibold text-cyan-300 block mb-0.5">2. Upgrade Actions v4</span>
                    <p className="text-slate-400 text-[11px]">
                      <code className="text-slate-200">upload-artifact@v3</code> dan <code className="text-slate-200">checkout@v3</code> sudah didepresiasi oleh GitHub. Menggunakan <code className="text-cyan-300">@v4</code> berjalan di Node 20.
                    </p>
                  </div>
                  <div className="bg-slate-950/60 p-2.5 rounded-lg border border-slate-800">
                    <span className="font-semibold text-amber-300 block mb-0.5">3. Tambahan "flutter clean"</span>
                    <p className="text-slate-400 text-[11px]">
                      Membersihkan file Gradle lock dan sisa build sebelumnya sehingga tidak terjadi crash <em>"Daemon compilation failed"</em>.
                    </p>
                  </div>
                  <div className="bg-slate-950/60 p-2.5 rounded-lg border border-slate-800">
                    <span className="font-semibold text-blue-300 block mb-0.5">4. Target Universal APK</span>
                    <p className="text-slate-400 text-[11px]">
                      <code className="text-slate-200">flutter build apk --release</code> menghasilkan 1 file pasti: <code className="text-blue-300 font-mono text-[10px]">app-release.apk</code> yang langsung siap diunduh!
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
