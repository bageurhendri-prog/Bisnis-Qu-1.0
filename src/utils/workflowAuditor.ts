import { WorkflowConfig } from '../types/workflow';

export interface AuditIssue {
  id: string;
  severity: 'error' | 'warning' | 'info' | 'tip';
  title: string;
  description: string;
  recommendation: string;
  canAutoFix: boolean;
  fixAction?: (config: WorkflowConfig) => WorkflowConfig;
}

export function auditWorkflow(config: WorkflowConfig): AuditIssue[] {
  const issues: AuditIssue[] = [];

  // 1. upload-artifact v3 deprecation (High impact!)
  if (config.uploadArtifactVersion === 'v3') {
    issues.push({
      id: 'deprecate-upload-artifact',
      severity: 'error',
      title: 'actions/upload-artifact@v3 is Deprecated',
      description: 'GitHub Actions deprecated artifact v1–v3. Workflows using @v3 may fail or warn on current GitHub runners running on Node 20.',
      recommendation: 'Upgrade to actions/upload-artifact@v4 for faster multi-threaded uploads and long-term support.',
      canAutoFix: true,
      fixAction: (c) => ({ ...c, uploadArtifactVersion: 'v4' })
    });
  }

  // 2. checkout v3
  if (config.checkoutVersion === 'v3') {
    issues.push({
      id: 'deprecate-checkout',
      severity: 'warning',
      title: 'actions/checkout@v3 runs on legacy Node 16 runner',
      description: 'GitHub has migrated default runners to Node 20. actions/checkout@v4 provides faster Git fetch operations and official Node 20 runtime.',
      recommendation: 'Upgrade to actions/checkout@v4.',
      canAutoFix: true,
      fixAction: (c) => ({ ...c, checkoutVersion: 'v4' })
    });
  }

  // 3. setup-java v3
  if (config.setupJavaVersion === 'v3') {
    issues.push({
      id: 'deprecate-setup-java',
      severity: 'warning',
      title: 'actions/setup-java@v3 uses legacy runner environment',
      description: 'actions/setup-java@v4 features improved tool caching, JDK 21 support, and compatibility with modern Gradle 8.x daemon daemons.',
      recommendation: 'Upgrade to actions/setup-java@v4.',
      canAutoFix: true,
      fixAction: (c) => ({ ...c, setupJavaVersion: 'v4' })
    });
  }

  // 4. Concurrency cancel-in-progress
  if (!config.concurrencyGroup) {
    issues.push({
      id: 'missing-concurrency',
      severity: 'info',
      title: 'No Job Concurrency Cancelation',
      description: 'When pushing multiple commits in succession to the same branch, existing builds will continue running, consuming GitHub Actions minutes.',
      recommendation: 'Add concurrency group with cancel-in-progress: true to cancel outdated builds automatically.',
      canAutoFix: true,
      fixAction: (c) => ({ ...c, concurrencyGroup: true })
    });
  }

  // 5. Unsigned APK / Missing Keystore
  if (!config.enableKeystoreSigning) {
    issues.push({
      id: 'keystore-signing',
      severity: 'warning',
      title: 'APK Built Without Production Signing Key',
      description: 'By default, Flutter builds release APKs using default debug keys or unaligned signing unless android/key.properties and upload-keystore.jks are configured.',
      recommendation: 'Enable Keystore Injection step to decode base64 upload keystores from GitHub Secrets.',
      canAutoFix: true,
      fixAction: (c) => ({ ...c, enableKeystoreSigning: true })
    });
  }

  // 6. Missing Gradle Cache
  if (!config.cacheGradle) {
    issues.push({
      id: 'gradle-cache',
      severity: 'tip',
      title: 'Gradle Cache Not Enabled',
      description: 'Caching ~/.gradle/caches and ~/.gradle/wrapper between workflow runs can reduce Android build time from 8–10 minutes down to ~2–3 minutes.',
      recommendation: 'Enable Gradle caching via actions/cache@v4.',
      canAutoFix: true,
      fixAction: (c) => ({ ...c, cacheGradle: true })
    });
  }

  // 7. Missing Automated Tests / Quality Gates
  if (!config.runTests && !config.runAnalyze) {
    issues.push({
      id: 'test-gates',
      severity: 'tip',
      title: 'No Pre-build Lint or Test Gates',
      description: 'Building APKs without running flutter test and flutter analyze may compile broken logic or unformatted code into releases.',
      recommendation: 'Enable "flutter analyze" and "flutter test" steps before APK compilation.',
      canAutoFix: true,
      fixAction: (c) => ({ ...c, runAnalyze: true, runTests: true })
    });
  }

  // 8. Manual trigger (workflow_dispatch)
  if (!config.triggerWorkflowDispatch) {
    issues.push({
      id: 'workflow-dispatch',
      severity: 'tip',
      title: 'Workflow Cannot Be Triggered Manually',
      description: 'Without workflow_dispatch, developers cannot trigger an ad-hoc APK build from GitHub UI without pushing a commit.',
      recommendation: 'Enable workflow_dispatch trigger.',
      canAutoFix: true,
      fixAction: (c) => ({ ...c, triggerWorkflowDispatch: true })
    });
  }

  return issues;
}
