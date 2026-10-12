import { SimulationStep, WorkflowConfig, ApkArtifact } from '../types/workflow';

export const SAMPLE_ARTIFACTS: ApkArtifact[] = [
  {
    fileName: 'bisnisqu-armeabi-v7a-release.apk',
    architecture: 'ARM 32-bit (v7a)',
    sizeBytes: 19420842,
    sizeDisplay: '18.52 MB',
    sha256: '9f83a21bb013df4598a02c91834f8a91176b5cf07c34ef51aa14a2bc1d89e211',
    minSdk: 21,
    targetSdk: 34,
    versionName: '1.0.0',
    versionCode: 1,
    packageId: 'com.bisnisqu.pos',
    permissions: ['android.permission.INTERNET', 'android.permission.BLUETOOTH', 'android.permission.BLUETOOTH_ADMIN', 'android.permission.BLUETOOTH_CONNECT', 'android.permission.ACCESS_FINE_LOCATION', 'android.permission.VIBRATE']
  },
  {
    fileName: 'bisnisqu-arm64-v8a-release.apk',
    architecture: 'ARM 64-bit (v8a) — Standard',
    sizeBytes: 22189408,
    sizeDisplay: '21.16 MB',
    sha256: '38a1b092ce448cf19924a0d9b56f84931bcfa7b3ee28e67f0d015949d211cc58',
    minSdk: 21,
    targetSdk: 34,
    versionName: '1.0.0',
    versionCode: 1,
    packageId: 'com.bisnisqu.pos',
    permissions: ['android.permission.INTERNET', 'android.permission.BLUETOOTH', 'android.permission.BLUETOOTH_ADMIN', 'android.permission.BLUETOOTH_CONNECT', 'android.permission.ACCESS_FINE_LOCATION', 'android.permission.VIBRATE']
  },
  {
    fileName: 'bisnisqu-x86_64-release.apk',
    architecture: 'x86_64 (Emulators & ChromeOS)',
    sizeBytes: 23908124,
    sizeDisplay: '22.80 MB',
    sha256: 'e5d32104a0cb598df004e45c7da179bb8c49e49129532454b6d91244e05b5f21',
    minSdk: 21,
    targetSdk: 34,
    versionName: '1.0.0',
    versionCode: 1,
    packageId: 'com.bisnisqu.pos',
    permissions: ['android.permission.INTERNET', 'android.permission.BLUETOOTH', 'android.permission.BLUETOOTH_ADMIN', 'android.permission.BLUETOOTH_CONNECT', 'android.permission.ACCESS_FINE_LOCATION', 'android.permission.VIBRATE']
  }
];

export const UNIVERSAL_ARTIFACT: ApkArtifact = {
  fileName: 'app-release.apk',
  architecture: 'Universal Release APK (All ABIs bundled)',
  sizeBytes: 58249112,
  sizeDisplay: '55.55 MB',
  sha256: '4b01e3899f36cd81267420eab45f6217e47a9821804bc63b89094e9f73a110cb',
  minSdk: 21,
  targetSdk: 34,
  versionName: '1.0.0',
  versionCode: 1,
  packageId: 'com.bisnisqu.pos',
  permissions: ['android.permission.INTERNET', 'android.permission.BLUETOOTH', 'android.permission.BLUETOOTH_ADMIN', 'android.permission.BLUETOOTH_CONNECT', 'android.permission.ACCESS_FINE_LOCATION', 'android.permission.VIBRATE']
};

export const APPBUNDLE_ARTIFACT: ApkArtifact = {
  fileName: 'bisnisqu-release.aab',
  architecture: 'Android App Bundle (Dynamic Delivery for Google Play)',
  sizeBytes: 28419200,
  sizeDisplay: '27.10 MB',
  sha256: '7c89ef1244ab98031e4599a02498721c4e76a39b2184e49811cb209489ef412a',
  minSdk: 21,
  targetSdk: 34,
  versionName: '1.0.0',
  versionCode: 1,
  packageId: 'com.bisnisqu.pos',
  permissions: ['android.permission.INTERNET', 'android.permission.BLUETOOTH', 'android.permission.BLUETOOTH_ADMIN', 'android.permission.BLUETOOTH_CONNECT', 'android.permission.ACCESS_FINE_LOCATION', 'android.permission.VIBRATE']
};

export function buildSimulationSteps(config: WorkflowConfig): SimulationStep[] {
  const steps: SimulationStep[] = [];

  // Step 1: Set up job
  steps.push({
    id: 'setup-runner',
    name: 'Set up runner environment',
    commandSnippet: 'Runner: Linux ubuntu-latest (GitHub-hosted, 4 vCPUs, 16 GB RAM)',
    status: 'idle',
    durationSeconds: 2,
    logs: [
      { text: 'Operating System: Ubuntu 24.04 LTS (x86_64)', type: 'info', timestamp: '00:01' },
      { text: 'Runner Image: ubuntu-24.04', type: 'info', timestamp: '00:01' },
      { text: 'Virtual Environment: /opt/hostedtoolcache', type: 'info', timestamp: '00:01' },
      { text: 'Included Software: Git 2.45.2, Python 3.12, Docker 26.1.4', type: 'info', timestamp: '00:02' },
      { text: 'Provisioning complete.', type: 'success', timestamp: '00:02' }
    ]
  });

  // Step 2: Checkout repository
  steps.push({
    id: 'checkout',
    name: 'Checkout Repository',
    commandSnippet: `actions/checkout@${config.checkoutVersion}`,
    status: 'idle',
    durationSeconds: 3,
    logs: [
      { text: `Syncing repository: user/bisnisqu`, type: 'info', timestamp: '00:02' },
      { text: 'Getting Git credentials for github.com', type: 'info', timestamp: '00:02' },
      { text: 'git init "/home/runner/work/bisnisqu/bisnisqu"', type: 'command', timestamp: '00:03' },
      { text: 'git remote add origin https://github.com/user/bisnisqu', type: 'command', timestamp: '00:03' },
      { text: 'Fetching the repository (depth 1)...', type: 'info', timestamp: '00:04' },
      { text: 'From https://github.com/user/bisnisqu', type: 'stdout', timestamp: '00:04' },
      { text: ' * [new branch]      main       -> origin/main', type: 'stdout', timestamp: '00:04' },
      { text: 'Checking out branch ref: refs/heads/main (commit d8f49b2)', type: 'success', timestamp: '00:05' }
    ]
  });

  // Step 3: Setup Java
  steps.push({
    id: 'setup-java',
    name: `Setup Java (JDK ${config.javaVersion})`,
    commandSnippet: `actions/setup-java@${config.setupJavaVersion} (distro: ${config.javaDistro}, version: ${config.javaVersion})`,
    status: 'idle',
    durationSeconds: 4,
    logs: [
      { text: `Locating Java JDK ${config.javaVersion} (${config.javaDistro}) in tool cache...`, type: 'info', timestamp: '00:05' },
      { text: `Downloading Zulu OpenJDK ${config.javaVersion}.0.9+9...`, type: 'info', timestamp: '00:06' },
      { text: `Extracting Java to /opt/hostedtoolcache/Java_Zulu_jdk/${config.javaVersion}.0.9-9/x64`, type: 'info', timestamp: '00:07' },
      { text: `Exporting JAVA_HOME=/opt/hostedtoolcache/Java_Zulu_jdk/${config.javaVersion}.0.9-9/x64`, type: 'command', timestamp: '00:08' },
      { text: `openjdk version "${config.javaVersion}.0.9" 2026-01-16`, type: 'stdout', timestamp: '00:08' },
      { text: 'OpenJDK Runtime Environment Zulu (build 17.0.9+9-CA)', type: 'stdout', timestamp: '00:09' },
      { text: 'Java setup successfully completed.', type: 'success', timestamp: '00:09' }
    ]
  });

  // Step 4: Setup Flutter
  steps.push({
    id: 'setup-flutter',
    name: 'Setup Flutter',
    commandSnippet: `subosito/flutter-action@v2 (channel: ${config.flutterChannel}, cache: ${config.cacheFlutter})`,
    status: 'idle',
    durationSeconds: 6,
    logs: [
      { text: `Resolving Flutter version on channel "${config.flutterChannel}"...`, type: 'info', timestamp: '00:09' },
      { text: 'Cache found in GitHub Actions tool cache: Flutter 3.29.0-stable (Dart 3.7.0)', type: 'success', timestamp: '00:11' },
      { text: 'Setting up Flutter PATH=/opt/hostedtoolcache/flutter/3.29.0-x64/bin', type: 'command', timestamp: '00:12' },
      { text: 'Flutter 3.29.0 • channel stable • https://github.com/flutter/flutter.git', type: 'stdout', timestamp: '00:13' },
      { text: 'Framework • revision 35b371b8 • 2026-02-14', type: 'stdout', timestamp: '00:14' },
      { text: 'Engine • revision e672b006', type: 'stdout', timestamp: '00:14' },
      { text: 'Tools • Dart 3.7.0 • DevTools 2.42.2', type: 'stdout', timestamp: '00:15' },
      { text: 'Flutter environment initialized.', type: 'success', timestamp: '00:15' }
    ]
  });

  // Optional: Cache Gradle
  if (config.cacheGradle) {
    steps.push({
      id: 'cache-gradle',
      name: 'Cache Gradle Packages',
      commandSnippet: 'actions/cache@v4 (~/.gradle/caches, ~/.gradle/wrapper)',
      status: 'idle',
      durationSeconds: 2,
      logs: [
        { text: 'Checking Gradle cache key: Linux-gradle-a4f78b12e...', type: 'info', timestamp: '00:15' },
        { text: 'Cache restored from key: Linux-gradle-a4f78b12e (Size: 142.8 MB)', type: 'success', timestamp: '00:17' }
      ]
    });
  }

  // Step: Pub get
  if (config.runPubGet) {
    steps.push({
      id: 'pub-get',
      name: 'Install Dependencies',
      commandSnippet: 'flutter pub get',
      status: 'idle',
      durationSeconds: 5,
      logs: [
        { text: '$ flutter pub get', type: 'command', timestamp: '00:17' },
        { text: 'Resolving dependencies...', type: 'info', timestamp: '00:18' },
        { text: 'Got dependencies!', type: 'stdout', timestamp: '00:20' },
        { text: '+ flutter_bloc 8.1.6', type: 'stdout', timestamp: '00:21' },
        { text: '+ http 1.2.2', type: 'stdout', timestamp: '00:21' },
        { text: '+ path_provider 2.1.4', type: 'stdout', timestamp: '00:21' },
        { text: '+ shared_preferences 2.3.2', type: 'stdout', timestamp: '00:22' },
        { text: '42 packages total up to date.', type: 'success', timestamp: '00:22' }
      ]
    });
  }

  // Step: Clean Project (flutter clean)
  if (config.runClean) {
    steps.push({
      id: 'flutter-clean',
      name: 'Clean Project',
      commandSnippet: 'flutter clean',
      status: 'idle',
      durationSeconds: 3,
      logs: [
        { text: '$ flutter clean', type: 'command', timestamp: '00:22' },
        { text: 'Deleting "build/" directory...', type: 'info', timestamp: '00:23' },
        { text: 'Deleting ".dart_tool/" directory...', type: 'info', timestamp: '00:23' },
        { text: 'Cleaning stale Gradle build cache and locked daemon files...', type: 'info', timestamp: '00:24' },
        { text: 'Project cleaned successfully.', type: 'success', timestamp: '00:25' }
      ]
    });
  }

  // Step: Dart Format
  if (config.dartFormatCheck) {
    steps.push({
      id: 'dart-format',
      name: 'Verify Code Formatting',
      commandSnippet: 'dart format --output=none --set-exit-if-changed .',
      status: 'idle',
      durationSeconds: 2,
      logs: [
        { text: '$ dart format --output=none --set-exit-if-changed .', type: 'command', timestamp: '00:22' },
        { text: 'Formatted 38 files (0 changed). All files adhere to Dart style guidelines.', type: 'success', timestamp: '00:24' }
      ]
    });
  }

  // Step: Flutter Analyze
  if (config.runAnalyze) {
    steps.push({
      id: 'flutter-analyze',
      name: 'Analyze Project Code',
      commandSnippet: 'flutter analyze',
      status: 'idle',
      durationSeconds: 4,
      logs: [
        { text: '$ flutter analyze', type: 'command', timestamp: '00:24' },
        { text: 'Analyzing flutter-app...', type: 'info', timestamp: '00:25' },
        { text: 'No issues found! (ran in 3.4s)', type: 'success', timestamp: '00:28' }
      ]
    });
  }

  // Step: Flutter Test
  if (config.runTests) {
    steps.push({
      id: 'flutter-test',
      name: 'Run Unit & Widget Tests',
      commandSnippet: 'flutter test',
      status: 'idle',
      durationSeconds: 5,
      logs: [
        { text: '$ flutter test', type: 'command', timestamp: '00:28' },
        { text: '00:01 +0: loading test/widget_test.dart', type: 'info', timestamp: '00:29' },
        { text: '00:02 +12: test/auth_repository_test.dart passed', type: 'stdout', timestamp: '00:30' },
        { text: '00:03 +18: test/widget_test.dart passed', type: 'stdout', timestamp: '00:32' },
        { text: 'All tests passed! (18 tests total, 0 failed)', type: 'success', timestamp: '00:33' }
      ]
    });
  }

  // Step: Keystore decode
  if (config.enableKeystoreSigning) {
    steps.push({
      id: 'setup-keystore',
      name: 'Setup Android Keystore',
      commandSnippet: 'Decoding Base64 Keystore into android/app/upload-keystore.jks & writing key.properties',
      status: 'idle',
      durationSeconds: 2,
      logs: [
        { text: 'Reading secret KEYSTORE_BASE64 from GitHub Secrets', type: 'info', timestamp: '00:33' },
        { text: 'Decoding 4,096 bytes base64 payload...', type: 'info', timestamp: '00:34' },
        { text: 'Wrote android/app/upload-keystore.jks (SHA-256 certificate verified)', type: 'success', timestamp: '00:34' },
        { text: 'Configured android/key.properties with keyAlias & passwords.', type: 'success', timestamp: '00:35' }
      ]
    });
  }

  // Step: Build APK / App Bundle
  const isSplit = config.buildTarget === 'split-apk';
  const isAab = config.buildTarget === 'appbundle';
  const isBoth = config.buildTarget === 'both-apk-aab';

  let buildCmd = 'flutter build apk --split-per-abi';
  if (isAab) buildCmd = 'flutter build appbundle';
  else if (isBoth) buildCmd = 'flutter build apk --split-per-abi && flutter build appbundle';
  else if (config.buildTarget === 'universal-apk') buildCmd = 'flutter build apk';

  if (config.obfuscate) buildCmd += ' --obfuscate --split-debug-info=...';
  if (config.includeBuildNameNumber) buildCmd += ' --build-name=1.0.0 --build-number=42';

  const buildLogs: SimulationStep['logs'] = [
    { text: `$ ${buildCmd}`, type: 'command', timestamp: '00:35' },
    { text: 'Running Gradle task \'assembleRelease\'...', type: 'info', timestamp: '00:36' },
    { text: 'Starting a Gradle Daemon, 1 incompatible Daemon could not be reused', type: 'stdout', timestamp: '00:38' },
    { text: '> Task :app:preBuild UP-TO-DATE', type: 'stdout', timestamp: '00:40' },
    { text: '> Task :app:preReleaseBuild UP-TO-DATE', type: 'stdout', timestamp: '00:41' },
    { text: '> Task :app:compileReleaseRenderscript NO-SOURCE', type: 'stdout', timestamp: '00:42' },
    { text: '> Task :app:compileReleaseAidl NO-SOURCE', type: 'stdout', timestamp: '00:43' },
    { text: '> Task :app:compileReleaseKotlin (compiling 24 Kotlin sources)', type: 'stdout', timestamp: '00:46' },
    { text: '> Task :app:compileReleaseJavaWithJavac', type: 'stdout', timestamp: '00:49' },
    { text: '> Task :app:mergeReleaseShaders UP-TO-DATE', type: 'stdout', timestamp: '00:51' },
    { text: '> Task :app:compileReleaseShaders NO-SOURCE', type: 'stdout', timestamp: '00:52' },
    { text: '> Task :app:generateReleaseAssets UP-TO-DATE', type: 'stdout', timestamp: '00:54' },
    { text: '> Task :app:mergeReleaseAssets', type: 'stdout', timestamp: '00:57' },
    { text: '> Task :app:compressReleaseAssets', type: 'stdout', timestamp: '01:00' },
    { text: '> Task :app:processReleaseJavaRes NO-SOURCE', type: 'stdout', timestamp: '01:02' },
    { text: '> Task :app:mergeReleaseJavaResource UP-TO-DATE', type: 'stdout', timestamp: '01:04' },
    { text: '> Task :app:checkReleaseDuplicateClasses UP-TO-DATE', type: 'stdout', timestamp: '01:06' },
    { text: '> Task :app:dexBuilderRelease (D8 dexing)', type: 'stdout', timestamp: '01:10' },
    { text: '> Task :app:mergeExtDexRelease', type: 'stdout', timestamp: '01:14' },
    { text: '> Task :app:mergeDexRelease', type: 'stdout', timestamp: '01:18' }
  ];

  if (isSplit) {
    buildLogs.push(
      { text: '> Task :app:stripReleaseDebugSymbols (splitting ABI libraries)', type: 'info', timestamp: '01:21' },
      { text: '> Task :app:packageRelease (armeabi-v7a, arm64-v8a, x86_64)', type: 'stdout', timestamp: '01:25' },
      { text: '✓ Built build/app/outputs/flutter-apk/bisnisqu-armeabi-v7a-release.apk (18.5MB)', type: 'success', timestamp: '01:28' },
      { text: '✓ Built build/app/outputs/flutter-apk/bisnisqu-arm64-v8a-release.apk (21.2MB)', type: 'success', timestamp: '01:30' },
      { text: '✓ Built build/app/outputs/flutter-apk/bisnisqu-x86_64-release.apk (22.8MB)', type: 'success', timestamp: '01:32' }
    );
  } else if (isAab) {
    buildLogs.push(
      { text: '> Task :app:bundleRelease (packaging Android App Bundle)', type: 'stdout', timestamp: '01:25' },
      { text: '✓ Built build/app/outputs/bundle/release/app-release.aab (27.1MB)', type: 'success', timestamp: '01:30' }
    );
  } else if (isBoth) {
    buildLogs.push(
      { text: '✓ Built 3 split APKs (armeabi-v7a, arm64-v8a, x86_64)', type: 'success', timestamp: '01:28' },
      { text: '✓ Built build/app/outputs/bundle/release/app-release.aab (27.1MB)', type: 'success', timestamp: '01:34' }
    );
  } else {
    buildLogs.push(
      { text: '> Task :app:packageRelease (Universal all-in-one APK)', type: 'stdout', timestamp: '01:25' },
      { text: '✓ Built build/app/outputs/flutter-apk/app-release.apk (55.6MB)', type: 'success', timestamp: '01:29' }
    );
  }

  steps.push({
    id: 'build-app',
    name: isAab ? 'Build App Bundle (AAB)' : 'Build APK (Release)',
    commandSnippet: buildCmd,
    status: 'idle',
    durationSeconds: 12,
    logs: buildLogs
  });

  // Upload artifacts
  const artifactPath = isAab
    ? 'build/app/outputs/bundle/release/*.aab'
    : config.buildTarget === 'universal-apk'
    ? 'build/app/outputs/flutter-apk/app-release.apk'
    : 'build/app/outputs/flutter-apk/*.apk';

  steps.push({
    id: 'upload-artifact',
    name: 'Upload APK Artifact',
    commandSnippet: `actions/upload-artifact@${config.uploadArtifactVersion} (name: ${config.artifactName || 'app-release'}, path: ${artifactPath})`,
    status: 'idle',
    durationSeconds: 4,
    logs: [
      { text: `Uploading artifact "${config.artifactName || 'release-apks'}"...`, type: 'info', timestamp: '01:32' },
      { text: `Scanning directory ${artifactPath}`, type: 'info', timestamp: '01:33' },
      { text: `Compressing artifacts using zip stream...`, type: 'info', timestamp: '01:34' },
      { text: `Uploaded artifact "${config.artifactName || 'release-apks'}" (${isSplit ? '62.48 MB' : isAab ? '27.10 MB' : '55.55 MB'} total in zip)`, type: 'success', timestamp: '01:36' },
      { text: `Artifact download link ready in GitHub Actions Summary tab.`, type: 'success', timestamp: '01:36' }
    ]
  });

  // GitHub Release if configured
  if (config.publishGitHubRelease) {
    steps.push({
      id: 'publish-release',
      name: 'Publish GitHub Release',
      commandSnippet: 'softprops/action-gh-release@v2',
      status: 'idle',
      durationSeconds: 3,
      logs: [
        { text: 'Detected tag push ref: refs/tags/v1.0.0', type: 'info', timestamp: '01:36' },
        { text: 'Drafting GitHub Release for tag v1.0.0', type: 'info', timestamp: '01:37' },
        { text: 'Attaching built release binaries...', type: 'info', timestamp: '01:38' },
        { text: 'GitHub Release published: https://github.com/user/flutter-app/releases/tag/v1.0.0', type: 'success', timestamp: '01:39' }
      ]
    });
  }

  return steps;
}
