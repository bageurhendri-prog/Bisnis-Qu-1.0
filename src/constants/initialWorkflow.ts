import { WorkflowConfig } from '../types/workflow';

export const USER_ORIGINAL_YAML = `name: Build Flutter APK

on:
  push:
    branches:
      - main
  pull_request:
    branches:
      - main

jobs:
  build:
    runs-on: ubuntu-latest

    steps:
      - name: Checkout Repository
        uses: actions/checkout@v3

      - name: Setup Java (JDK 17)
        uses: actions/setup-java@v3
        with:
          distribution: 'zulu'
          java-version: '17'

      - name: Setup Flutter
        uses: subosito/flutter-action@v2
        with:
          channel: 'stable'
          cache: true

      - name: Install Dependencies
        run: flutter pub get

      - name: Build APK (Release)
        run: flutter build apk --split-per-abi

      - name: Upload APK Artifacts
        uses: actions/upload-artifact@v3
        with:
          name: release-apks
          path: build/app/outputs/flutter-apk/*.apk
`;

export const INITIAL_CONFIG: WorkflowConfig = {
  workflowName: 'Build Flutter APK',
  triggerPushMain: true,
  triggerPrMain: true,
  triggerTags: false,
  tagPattern: 'v*',
  triggerWorkflowDispatch: true,
  runsOn: 'ubuntu-latest',
  concurrencyGroup: false,

  // User's current versions in YAML
  checkoutVersion: 'v3',
  setupJavaVersion: 'v3',
  flutterActionVersion: 'v2',
  uploadArtifactVersion: 'v3',

  javaVersion: '17',
  javaDistro: 'zulu',
  flutterChannel: 'stable',
  flutterVersionPin: '',
  cacheFlutter: true,
  cacheGradle: false,

  runPubGet: true,
  runAnalyze: false,
  runTests: false,
  dartFormatCheck: false,

  buildTarget: 'split-apk',
  buildMode: 'release',
  obfuscate: false,
  splitDebugInfo: false,
  includeBuildNameNumber: false,
  buildNumberSource: 'github.run_number',
  customBuildNumber: '1',
  buildName: '1.0.0',

  enableKeystoreSigning: false,
  keystoreSecretName: 'KEYSTORE_BASE64',
  keystorePasswordSecret: 'KEYSTORE_PASSWORD',
  keyAliasSecret: 'KEY_ALIAS',
  keyPasswordSecret: 'KEY_PASSWORD',

  artifactName: 'release-apks',
  retentionDays: 14,
  publishGitHubRelease: false,
};

export const MODERNIZED_PRODUCTION_CONFIG: WorkflowConfig = {
  ...INITIAL_CONFIG,
  workflowName: 'Flutter Production CI/CD',
  concurrencyGroup: true,
  checkoutVersion: 'v4',
  setupJavaVersion: 'v4',
  uploadArtifactVersion: 'v4',
  cacheGradle: true,
  runAnalyze: true,
  runTests: true,
  includeBuildNameNumber: true,
  enableKeystoreSigning: true,
  triggerTags: true,
  publishGitHubRelease: true,
};

export const PLAY_STORE_AAB_CONFIG: WorkflowConfig = {
  ...INITIAL_CONFIG,
  workflowName: 'Build & Sign Google Play App Bundle',
  concurrencyGroup: true,
  checkoutVersion: 'v4',
  setupJavaVersion: 'v4',
  uploadArtifactVersion: 'v4',
  buildTarget: 'appbundle',
  runAnalyze: true,
  runTests: true,
  includeBuildNameNumber: true,
  enableKeystoreSigning: true,
  artifactName: 'release-aab',
};

export const PR_VALIDATION_CONFIG: WorkflowConfig = {
  ...INITIAL_CONFIG,
  workflowName: 'PR Quality Gate & Build Check',
  triggerPushMain: false,
  triggerPrMain: true,
  triggerWorkflowDispatch: true,
  checkoutVersion: 'v4',
  setupJavaVersion: 'v4',
  uploadArtifactVersion: 'v4',
  dartFormatCheck: true,
  runAnalyze: true,
  runTests: true,
  buildTarget: 'split-apk',
};
