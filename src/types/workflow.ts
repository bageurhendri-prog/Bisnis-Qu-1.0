export type BuildTarget = 'split-apk' | 'universal-apk' | 'appbundle' | 'both-apk-aab';

export interface WorkflowConfig {
  workflowName: string;
  triggerPushMain: boolean;
  triggerPushMaster: boolean;
  triggerPrMain: boolean;
  triggerPrMaster: boolean;
  triggerTags: boolean;
  tagPattern: string;
  triggerWorkflowDispatch: boolean;
  
  // Runner
  runsOn: 'ubuntu-latest' | 'macos-latest' | 'windows-latest';
  concurrencyGroup: boolean;
  
  // Actions versions
  checkoutVersion: 'v3' | 'v4';
  setupJavaVersion: 'v3' | 'v4';
  flutterActionVersion: 'v2';
  uploadArtifactVersion: 'v3' | 'v4';
  
  // Java & Flutter
  javaVersion: '11' | '17' | '21';
  javaDistro: 'zulu' | 'temurin' | 'corretto';
  flutterChannel: 'stable' | 'beta' | 'master';
  flutterVersionPin: string; // e.g. '' (latest) or '3.29.0'
  cacheFlutter: boolean;
  cacheGradle: boolean;
  
  // Quality & Testing
  runPubGet: boolean;
  runClean: boolean;
  runAnalyze: boolean;
  runTests: boolean;
  dartFormatCheck: boolean;
  
  // Build
  buildTarget: BuildTarget;
  buildMode: 'release' | 'debug' | 'profile';
  obfuscate: boolean;
  splitDebugInfo: boolean;
  includeBuildNameNumber: boolean;
  buildNumberSource: 'github.run_number' | 'custom';
  customBuildNumber: string;
  buildName: string;
  
  // Signing
  enableKeystoreSigning: boolean;
  keystoreSecretName: string;
  keystorePasswordSecret: string;
  keyAliasSecret: string;
  keyPasswordSecret: string;
  
  // Artifacts & Releases
  artifactName: string;
  retentionDays: number;
  publishGitHubRelease: boolean;
}

export interface StepLogLine {
  text: string;
  type?: 'stdout' | 'stderr' | 'info' | 'success' | 'command' | 'group' | 'endgroup';
  timestamp: string;
}

export interface SimulationStep {
  id: string;
  name: string;
  commandSnippet: string;
  status: 'idle' | 'running' | 'success' | 'failed' | 'skipped';
  durationSeconds?: number;
  logs: StepLogLine[];
}

export interface ApkArtifact {
  fileName: string;
  architecture: string;
  sizeBytes: number;
  sizeDisplay: string;
  sha256: string;
  minSdk: number;
  targetSdk: number;
  versionName: string;
  versionCode: number;
  packageId: string;
  permissions: string[];
}
