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
  const [config, setConfig] = useState<WorkflowConfig>({
    ...INITIAL_CONFIG,
    workflowName: 'Build BisnisQu APK',
    artifactName: 'bisnisqu-release-apks'
  });
  const [activeTab, setActiveTab] = useState<AppTab>('bisnisqu');
  const [copied, setCopied] = useState<boolean>(false);
  const [isSimulating, setIsSimulating] = useState<boolean>(false);

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
      setConfig({
        ...INITIAL_CONFIG,
        workflowName: 'Build BisnisQu APK',
        artifactName: 'bisnisqu-release-apks'
      });
    } else if (presetKey === 'modernized') {
      setConfig({
        ...MODERNIZED_PRODUCTION_CONFIG,
        workflowName: 'BisnisQu Production CI/CD',
        artifactName: 'bisnisqu-release-apks'
      });
    } else if (presetKey === 'playstore') {
      setConfig({
        ...PLAY_STORE_AAB_CONFIG,
        workflowName: 'Build & Sign BisnisQu Play Bundle',
        artifactName: 'bisnisqu-release-aab'
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
