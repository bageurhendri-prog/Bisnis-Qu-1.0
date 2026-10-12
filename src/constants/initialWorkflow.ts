import { WorkflowConfig } from '../types/workflow';

export const USER_ORIGINAL_YAML = `name: Build Flutter APK

on:
  push:
    branches: [ "main", "master" ]
  pull_request:
    branches: [ "main", "master" ]

jobs:
  build:
    runs-on: ubuntu-latest

    steps:
      - name: Checkout Repository
        uses: actions/checkout@v4

      - name: Locate Flutter Project Root
        id: locate-project
        run: |
          if [ -f "pubspec.yaml" ]; then
            echo "project_path=." >> $GITHUB_ENV
            echo "Project root found at repository root."
          else
            FOUND_DIR=$(find . -not -path '*/.*' -name "pubspec.yaml" -exec dirname {} \; | head -n 1)
            if [ -n "$FOUND_DIR" ]; then
              echo "project_path=$FOUND_DIR" >> $GITHUB_ENV
              echo "Project root found in subdirectory: $FOUND_DIR"
            else
              echo "ERROR: Could not find pubspec.yaml in repository!"
              exit 1
            fi
          fi

      - name: Set up Java (JDK 17)
        uses: actions/setup-java@v4
        with:
          distribution: 'zulu'
          java-version: '17'

      - name: Set up Flutter
        uses: subosito/flutter-action@v2
        with:
          channel: 'stable'
          cache: true

      - name: Install Dependencies
        working-directory: \${{ env.project_path }}
        run: flutter pub get

      - name: Clean Project
        working-directory: \${{ env.project_path }}
        run: flutter clean

      - name: Build Release APK
        working-directory: \${{ env.project_path }}
        run: flutter build apk --release

      - name: Upload APK Artifact
        uses: actions/upload-artifact@v4
        with:
          name: app-release
          path: \${{ env.project_path }}/build/app/outputs/flutter-apk/*.apk
`;

export const INITIAL_CONFIG: WorkflowConfig = {
  workflowName: 'Build Flutter APK',
  triggerPushMain: true,
  triggerPushMaster: true,
  triggerPrMain: true,
  triggerPrMaster: true,
  triggerTags: false,
  tagPattern: 'v*',
  triggerWorkflowDispatch: true,
  runsOn: 'ubuntu-latest',
  concurrencyGroup: false,

  // User's updated v4 versions in YAML
  checkoutVersion: 'v4',
  setupJavaVersion: 'v4',
  flutterActionVersion: 'v2',
  uploadArtifactVersion: 'v4',

  javaVersion: '17',
  javaDistro: 'zulu',
  flutterChannel: 'stable',
  flutterVersionPin: '',
  cacheFlutter: true,
  cacheGradle: false,

  runPubGet: true,
  runClean: true,
  runAnalyze: false,
  runTests: false,
  dartFormatCheck: false,

  // Project directory auto-detection to fix "Expected to find project root in current working directory"
  autoDetectProjectDir: true,
  workingDirectory: '',

  buildTarget: 'universal-apk',
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

  artifactName: 'app-release',
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
