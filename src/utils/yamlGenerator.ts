import { WorkflowConfig } from '../types/workflow';

export function generateYaml(config: WorkflowConfig): string {
  const lines: string[] = [];

  lines.push(`name: ${config.workflowName || 'Build Flutter APK'}`);
  lines.push('');
  lines.push('on:');

  const pushBranches: string[] = [];
  if (config.triggerPushMain) pushBranches.push('main');
  if (config.triggerPushMaster) pushBranches.push('master');

  if (pushBranches.length > 0 || config.triggerTags) {
    lines.push('  push:');
    if (pushBranches.length === 1) {
      lines.push('    branches:');
      lines.push(`      - ${pushBranches[0]}`);
    } else if (pushBranches.length > 1) {
      lines.push(`    branches: [ "main", "master" ]`);
    }
    if (config.triggerTags) {
      lines.push('    tags:');
      lines.push(`      - '${config.tagPattern || 'v*'}'`);
    }
  }

  const prBranches: string[] = [];
  if (config.triggerPrMain) prBranches.push('main');
  if (config.triggerPrMaster) prBranches.push('master');

  if (prBranches.length > 0) {
    lines.push('  pull_request:');
    if (prBranches.length === 1) {
      lines.push('    branches:');
      lines.push(`      - ${prBranches[0]}`);
    } else {
      lines.push(`    branches: [ "main", "master" ]`);
    }
  }

  if (config.triggerWorkflowDispatch) {
    lines.push('  workflow_dispatch:');
  }

  if (config.concurrencyGroup) {
    lines.push('');
    lines.push('concurrency:');
    lines.push('  group: ${{ github.workflow }}-${{ github.ref }}');
    lines.push('  cancel-in-progress: true');
  }

  lines.push('');
  lines.push('jobs:');
  lines.push('  build:');
  lines.push(`    runs-on: ${config.runsOn}`);
  lines.push('');
  lines.push('    steps:');

  // 1. Checkout
  lines.push('      - name: Checkout Repository');
  lines.push(`        uses: actions/checkout@${config.checkoutVersion}`);
  lines.push('');

  // 2. Setup Java
  lines.push(`      - name: Set up Java (JDK ${config.javaVersion})`);
  lines.push(`        uses: actions/setup-java@${config.setupJavaVersion}`);
  lines.push('        with:');
  lines.push(`          distribution: '${config.javaDistro}'`);
  lines.push(`          java-version: '${config.javaVersion}'`);
  lines.push('');

  // 3. Setup Flutter
  lines.push('      - name: Set up Flutter');
  lines.push(`        uses: subosito/flutter-action@${config.flutterActionVersion}`);
  lines.push('        with:');
  lines.push(`          channel: '${config.flutterChannel}'`);
  if (config.flutterVersionPin.trim()) {
    lines.push(`          flutter-version: '${config.flutterVersionPin.trim()}'`);
  }
  lines.push(`          cache: ${config.cacheFlutter}`);
  lines.push('');

  // 4. Gradle Cache (optional optimization)
  if (config.cacheGradle) {
    lines.push('      - name: Cache Gradle Packages');
    lines.push('        uses: actions/cache@v4');
    lines.push('        with:');
    lines.push('          path: |');
    lines.push('            ~/.gradle/caches');
    lines.push('            ~/.gradle/wrapper');
    lines.push('          key: ${{ runner.os }}-gradle-${{ hashFiles(\'**/*.gradle*\', \'**/gradle-wrapper.properties\') }}');
    lines.push('          restore-keys: |');
    lines.push('            ${{ runner.os }}-gradle-');
    lines.push('');
  }

  // 5. Install Dependencies
  if (config.runPubGet) {
    lines.push('      - name: Install Dependencies');
    lines.push('        run: flutter pub get');
    lines.push('');
  }

  // 6. Clean Project (if enabled)
  if (config.runClean) {
    lines.push('      - name: Clean Project');
    lines.push('        run: flutter clean');
    lines.push('');
  }

  // 6. Dart format check
  if (config.dartFormatCheck) {
    lines.push('      - name: Verify Code Formatting');
    lines.push('        run: dart format --output=none --set-exit-if-changed .');
    lines.push('');
  }

  // 7. Flutter Analyze
  if (config.runAnalyze) {
    lines.push('      - name: Analyze Project Code');
    lines.push('        run: flutter analyze');
    lines.push('');
  }

  // 8. Flutter Test
  if (config.runTests) {
    lines.push('      - name: Run Unit & Widget Tests');
    lines.push('        run: flutter test');
    lines.push('');
  }

  // 9. Android Keystore Signing
  if (config.enableKeystoreSigning) {
    lines.push('      - name: Setup Android Keystore');
    lines.push('        env:');
    lines.push(`          KEYSTORE_BASE64: \${{ secrets.${config.keystoreSecretName} }}`);
    lines.push(`          KEYSTORE_PASSWORD: \${{ secrets.${config.keystorePasswordSecret} }}`);
    lines.push(`          KEY_ALIAS: \${{ secrets.${config.keyAliasSecret} }}`);
    lines.push(`          KEY_PASSWORD: \${{ secrets.${config.keyPasswordSecret} }}`);
    lines.push('        run: |');
    lines.push('          echo "$KEYSTORE_BASE64" | base64 --decode > android/app/upload-keystore.jks');
    lines.push('          cat <<EOF > android/key.properties');
    lines.push('          storePassword=$KEYSTORE_PASSWORD');
    lines.push('          keyPassword=$KEY_PASSWORD');
    lines.push('          keyAlias=$KEY_ALIAS');
    lines.push('          storeFile=upload-keystore.jks');
    lines.push('          EOF');
    lines.push('');
  }

  // 10. Build command
  const buildFlags: string[] = [];
  if (config.buildMode !== 'release') {
    buildFlags.push(`--${config.buildMode}`);
  }

  if (config.buildTarget === 'split-apk') {
    buildFlags.push('--split-per-abi');
  }

  if (config.obfuscate) {
    buildFlags.push('--obfuscate');
    if (config.splitDebugInfo) {
      buildFlags.push('--split-debug-info=build/app/outputs/symbols');
    }
  }

  if (config.includeBuildNameNumber) {
    if (config.buildName) {
      buildFlags.push(`--build-name=${config.buildName}`);
    }
    if (config.buildNumberSource === 'github.run_number') {
      buildFlags.push('--build-number=${{ github.run_number }}');
    } else if (config.customBuildNumber) {
      buildFlags.push(`--build-number=${config.customBuildNumber}`);
    }
  }

  const flagStr = buildFlags.length > 0 ? ' ' + buildFlags.join(' ') : '';

  if (config.buildTarget === 'appbundle') {
    lines.push('      - name: Build App Bundle (AAB)');
    lines.push(`        run: flutter build appbundle${flagStr}`);
    lines.push('');
  } else if (config.buildTarget === 'both-apk-aab') {
    lines.push('      - name: Build APK (Split ABI)');
    lines.push(`        run: flutter build apk --split-per-abi${flagStr.replace('--split-per-abi', '')}`);
    lines.push('');
    lines.push('      - name: Build App Bundle (AAB)');
    lines.push(`        run: flutter build appbundle${flagStr.replace('--split-per-abi', '')}`);
    lines.push('');
  } else if (config.buildTarget === 'universal-apk') {
    lines.push('      - name: Build Release APK');
    lines.push(`        run: flutter build apk --release${flagStr.replace('--release', '')}`);
    lines.push('');
  } else {
    lines.push('      - name: Build APK (Release)');
    lines.push(`        run: flutter build apk${flagStr}`);
    lines.push('');
  }

  // 11. Upload Artifacts
  let artifactPath = 'build/app/outputs/flutter-apk/*.apk';
  if (config.buildTarget === 'universal-apk') {
    artifactPath = 'build/app/outputs/flutter-apk/app-release.apk';
  } else if (config.buildTarget === 'appbundle') {
    artifactPath = 'build/app/outputs/bundle/release/*.aab';
  } else if (config.buildTarget === 'both-apk-aab') {
    artifactPath = 'build/app/outputs/**/*.*';
  }

  lines.push('      - name: Upload APK Artifact');
  lines.push(`        uses: actions/upload-artifact@${config.uploadArtifactVersion}`);
  lines.push('        with:');
  lines.push(`          name: ${config.artifactName || 'app-release'}`);
  lines.push(`          path: ${artifactPath}`);
  if (config.retentionDays && config.retentionDays !== 90) {
    lines.push(`          retention-days: ${config.retentionDays}`);
  }

  // 12. GitHub Release (optional)
  if (config.publishGitHubRelease) {
    lines.push('');
    lines.push('      - name: Publish GitHub Release');
    lines.push('        if: startsWith(github.ref, \'refs/tags/\')');
    lines.push('        uses: softprops/action-gh-release@v2');
    lines.push('        with:');
    lines.push('          files: |');
    if (config.buildTarget === 'appbundle') {
      lines.push('            build/app/outputs/bundle/release/*.aab');
    } else {
      lines.push('            build/app/outputs/flutter-apk/*.apk');
    }
    lines.push('          generate_release_notes: true');
    lines.push('        env:');
    lines.push('          GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}');
  }

  return lines.join('\n') + '\n';
}
