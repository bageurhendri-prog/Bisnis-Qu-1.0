import React, { useState } from 'react';
import { 
  Package, 
  Download, 
  ShieldCheck, 
  Smartphone, 
  Layers, 
  Cpu, 
  HelpCircle, 
  FileCheck2, 
  Sparkles,
  Check,
  HardDrive
} from 'lucide-react';
import { SAMPLE_ARTIFACTS, UNIVERSAL_ARTIFACT, APPBUNDLE_ARTIFACT } from '../utils/simulationLogs';
import { ApkArtifact, WorkflowConfig } from '../types/workflow';

interface ArtifactsInspectorProps {
  config: WorkflowConfig;
}

export const ArtifactsInspector: React.FC<ArtifactsInspectorProps> = ({ config }) => {
  const [downloadedArtifact, setDownloadedArtifact] = useState<string | null>(null);

  const isSplit = config.buildTarget === 'split-apk';
  const isAab = config.buildTarget === 'appbundle';
  const isUniversal = config.buildTarget === 'universal-apk';

  const artifacts: ApkArtifact[] = isSplit 
    ? SAMPLE_ARTIFACTS 
    : isAab 
    ? [APPBUNDLE_ARTIFACT] 
    : [UNIVERSAL_ARTIFACT];

  const handleDownloadMock = (artifact: ApkArtifact) => {
    // Generate a downloadable package summary file representing the artifact
    const manifest = {
      package: artifact.packageId,
      fileName: artifact.fileName,
      architecture: artifact.architecture,
      sizeBytes: artifact.sizeBytes,
      sha256: artifact.sha256,
      minSdkVersion: artifact.minSdk,
      targetSdkVersion: artifact.targetSdk,
      versionName: artifact.versionName,
      versionCode: artifact.versionCode,
      permissions: artifact.permissions,
      generatedBy: 'Flutter GitHub Actions CI/CD'
    };

    const blob = new Blob([JSON.stringify(manifest, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = artifact.fileName.replace('.apk', '-info.json');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    setDownloadedArtifact(artifact.fileName);
    setTimeout(() => setDownloadedArtifact(null), 2500);
  };

  return (
    <div className="space-y-6">
      {/* Overview Banner */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 backdrop-blur">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="p-1.5 rounded-lg bg-blue-500/10 text-blue-400 border border-blue-500/30">
                <Package className="w-4 h-4" />
              </span>
              <h2 className="text-sm font-semibold text-slate-100">
                Artifact Analysis & ABI Architecture Drilldown
              </h2>
            </div>
            <p className="text-xs text-slate-400 mt-1 max-w-2xl">
              Artifacts configured to upload to GitHub Actions artifact storage at{' '}
              <code className="text-cyan-400 font-mono">
                {isAab ? 'build/app/outputs/bundle/release/*.aab' : 'build/app/outputs/flutter-apk/*.apk'}
              </code>.
            </p>
          </div>

          <div className="text-right">
            <span className="text-[11px] text-slate-400 block">Total Built Size</span>
            <span className="text-lg font-bold text-slate-100 font-mono">
              {isSplit ? '62.48 MB (3 files)' : isAab ? '27.10 MB (1 file)' : '55.55 MB (1 file)'}
            </span>
          </div>
        </div>

        {/* ABI Savings Explainer */}
        {isSplit && (
          <div className="mt-4 pt-4 border-t border-slate-800 grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
            <div className="bg-slate-950/60 p-3 rounded-lg border border-slate-800/80">
              <span className="text-emerald-400 font-semibold block mb-0.5">~62% Bandwidth Savings</span>
              <p className="text-slate-400 text-[11px]">
                Users only download their device's native C++ engine (21MB) instead of all three combined (55MB).
              </p>
            </div>
            <div className="bg-slate-950/60 p-3 rounded-lg border border-slate-800/80">
              <span className="text-cyan-400 font-semibold block mb-0.5">ARM64 vs ARMv7 Compatibility</span>
              <p className="text-slate-400 text-[11px]">
                Separates modern 64-bit chipsets from legacy 32-bit hardware without sacrificing performance.
              </p>
            </div>
            <div className="bg-slate-950/60 p-3 rounded-lg border border-slate-800/80">
              <span className="text-purple-400 font-semibold block mb-0.5">Faster CI Artifact Upload</span>
              <p className="text-slate-400 text-[11px]">
                Targeted binaries upload cleanly to actions/upload-artifact@v4 and distribute smoothly.
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Artifact Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {artifacts.map((artifact) => (
          <div
            key={artifact.fileName}
            className="bg-slate-900/90 border border-slate-800 hover:border-slate-700 rounded-xl p-4 transition shadow-md flex flex-col justify-between"
          >
            <div>
              <div className="flex items-start justify-between gap-2 mb-3">
                <div>
                  <div className="flex items-center gap-1.5">
                    <Smartphone className="w-3.5 h-3.5 text-cyan-400" />
                    <h3 className="text-xs font-semibold text-slate-200 font-mono">
                      {artifact.fileName}
                    </h3>
                  </div>
                  <span className="text-[11px] text-slate-400 mt-0.5 block">
                    {artifact.architecture}
                  </span>
                </div>
                <span className="text-xs font-mono font-bold text-slate-100 bg-slate-950 px-2 py-0.5 rounded border border-slate-800">
                  {artifact.sizeDisplay}
                </span>
              </div>

              {/* Metadata Details */}
              <div className="space-y-2 text-xs py-2 border-t border-b border-slate-800/80 font-mono text-slate-400">
                <div className="flex justify-between">
                  <span className="text-slate-500">Package:</span>
                  <span className="text-slate-300">{artifact.packageId}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Version:</span>
                  <span className="text-slate-300">v{artifact.versionName} ({artifact.versionCode})</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Min / Target SDK:</span>
                  <span className="text-slate-300">API {artifact.minSdk} / API {artifact.targetSdk}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Sign State:</span>
                  <span className={config.enableKeystoreSigning ? 'text-emerald-400' : 'text-amber-400'}>
                    {config.enableKeystoreSigning ? 'Release (v2/v3 scheme)' : 'Debug Key Default'}
                  </span>
                </div>
              </div>

              {/* Permissions */}
              <div className="mt-3">
                <span className="text-[10px] text-slate-500 uppercase tracking-wider block mb-1">
                  Permissions Included
                </span>
                <div className="flex flex-wrap gap-1">
                  {artifact.permissions.map(perm => (
                    <span key={perm} className="text-[10px] bg-slate-950 text-slate-400 px-1.5 py-0.5 rounded border border-slate-800">
                      {perm.replace('android.permission.', '')}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Download CTA */}
            <div className="mt-4 pt-3 border-t border-slate-800 flex items-center justify-between">
              <span className="text-[10px] text-slate-500 font-mono truncate max-w-[150px]">
                SHA: {artifact.sha256.substring(0, 10)}...
              </span>
              <button
                onClick={() => handleDownloadMock(artifact)}
                className="px-3 py-1 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded text-xs font-medium transition flex items-center gap-1.5"
                title="Download artifact manifest"
              >
                {downloadedArtifact === artifact.fileName ? (
                  <>
                    <Check className="w-3 h-3 text-emerald-400" />
                    <span>Saved!</span>
                  </>
                ) : (
                  <>
                    <Download className="w-3 h-3" />
                    <span>Metadata</span>
                  </>
                )}
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Comparison table */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-lg">
        <h3 className="text-xs font-semibold text-slate-200 mb-3 flex items-center gap-2">
          <HardDrive className="w-4 h-4 text-slate-400" />
          <span>Flutter Android Packaging Guide (Split APK vs AAB vs Universal)</span>
        </h3>

        <div className="overflow-x-auto text-xs">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-800 text-slate-400 text-[11px]">
                <th className="py-2 pr-4 font-semibold">Format / Option</th>
                <th className="py-2 pr-4 font-semibold">Flutter Command</th>
                <th className="py-2 pr-4 font-semibold">Avg. Size</th>
                <th className="py-2 pr-4 font-semibold">Best Used For</th>
                <th className="py-2 font-semibold">Google Play Requirement</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 text-slate-300">
              <tr>
                <td className="py-2.5 pr-4 font-medium text-cyan-300">Split per ABI (Current)</td>
                <td className="py-2.5 pr-4 font-mono text-[11px] text-slate-400">flutter build apk --split-per-abi</td>
                <td className="py-2.5 pr-4 font-mono">18–22 MB each</td>
                <td className="py-2.5 pr-4">Direct testing, GitHub Releases, Firebase App Distribution</td>
                <td className="py-2.5 text-amber-400">Not accepted for new store apps</td>
              </tr>
              <tr>
                <td className="py-2.5 pr-4 font-medium text-purple-300">Android App Bundle</td>
                <td className="py-2.5 pr-4 font-mono text-[11px] text-slate-400">flutter build appbundle</td>
                <td className="py-2.5 pr-4 font-mono">25–30 MB bundle</td>
                <td className="py-2.5 pr-4">Google Play Store production releases</td>
                <td className="py-2.5 text-emerald-400">Mandatory on Google Play</td>
              </tr>
              <tr>
                <td className="py-2.5 pr-4 font-medium text-slate-300">Universal APK</td>
                <td className="py-2.5 pr-4 font-mono text-[11px] text-slate-400">flutter build apk</td>
                <td className="py-2.5 pr-4 font-mono">55–65 MB</td>
                <td className="py-2.5 pr-4">Simple one-file testing when architecture is unknown</td>
                <td className="py-2.5 text-slate-500">Deprecated for Play Store</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
