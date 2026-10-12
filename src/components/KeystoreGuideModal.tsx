import React, { useState } from 'react';
import { Key, Copy, Check, ShieldCheck, Terminal, FileCode2, ExternalLink } from 'lucide-react';

export const KeystoreGuideModal: React.FC = () => {
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(id);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const keytoolCmd = `keytool -genkey -v -keystore upload-keystore.jks -keyalg RSA -keysize 2048 -validity 10000 -alias upload`;

  const base64MacCmd = `base64 -i upload-keystore.jks | pbcopy`;
  const base64LinuxCmd = `base64 -w 0 upload-keystore.jks | xclip -selection clipboard`;

  const gradleSnippet = `android {
    ...
    signingConfigs {
        release {
            def keystorePropertiesFile = rootProject.file('key.properties')
            def keystoreProperties = new Properties()
            if (keystorePropertiesFile.exists()) {
                keystoreProperties.load(new FileInputStream(keystorePropertiesFile))
                keyAlias = keystoreProperties['keyAlias']
                keyPassword = keystoreProperties['keyPassword']
                storeFile = keystoreProperties['storeFile'] ? file(keystoreProperties['storeFile']) : null
                storePassword = keystoreProperties['storePassword']
            }
        }
    }
    buildTypes {
        release {
            signingConfig = signingConfigs.release
            minifyEnabled true
            shrinkResources true
            proguardFiles getDefaultProguardFile('proguard-android.txt'), 'proguard-rules.pro'
        }
    }
}`;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 backdrop-blur">
        <div className="flex items-center gap-2">
          <span className="p-1.5 rounded-lg bg-purple-500/10 text-purple-400 border border-purple-500/30">
            <Key className="w-4 h-4" />
          </span>
          <h2 className="text-sm font-semibold text-slate-100">
            Android Keystore & GitHub Secrets Setup Guide
          </h2>
        </div>
        <p className="text-xs text-slate-400 mt-1 max-w-2xl leading-relaxed">
          Follow these 4 simple steps to safely sign your Flutter APKs and Google Play App Bundles inside GitHub Actions without exposing your keystore or passwords in Git.
        </p>
      </div>

      {/* Step 1: Generate Keystore */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-5 space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="w-5 h-5 rounded-full bg-cyan-950 border border-cyan-800 text-cyan-400 text-xs flex items-center justify-center font-bold">
              1
            </span>
            <h3 className="text-xs font-semibold text-slate-200">
              Generate Android Upload Keystore (Terminal)
            </h3>
          </div>
          <button
            onClick={() => copyToClipboard(keytoolCmd, 'keytool')}
            className="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded text-xs flex items-center gap-1 transition"
          >
            {copiedKey === 'keytool' ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
            <span>Copy Command</span>
          </button>
        </div>

        <p className="text-xs text-slate-400">
          Run this in your terminal to create your release keystore file <code className="text-slate-200">upload-keystore.jks</code>:
        </p>

        <div className="bg-slate-950 rounded-lg p-3 font-mono text-xs text-cyan-300 border border-slate-800 overflow-x-auto">
          {keytoolCmd}
        </div>
      </div>

      {/* Step 2: Convert to Base64 */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-5 space-y-3">
        <div className="flex items-center gap-2">
          <span className="w-5 h-5 rounded-full bg-cyan-950 border border-cyan-800 text-cyan-400 text-xs flex items-center justify-center font-bold">
            2
          </span>
          <h3 className="text-xs font-semibold text-slate-200">
            Convert Keystore to Base64 String
          </h3>
        </div>

        <p className="text-xs text-slate-400">
          GitHub Secrets accepts plain text. Encode the binary <code className="text-slate-200">.jks</code> file into Base64:
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
          <div className="bg-slate-950 p-3 rounded-lg border border-slate-800 flex items-center justify-between">
            <div>
              <span className="text-[11px] text-slate-400 block font-medium">macOS (Terminal):</span>
              <code className="text-cyan-300 font-mono text-xs">{base64MacCmd}</code>
            </div>
            <button
              onClick={() => copyToClipboard(base64MacCmd, 'b64mac')}
              className="p-1.5 hover:bg-slate-800 rounded text-slate-400 transition"
            >
              {copiedKey === 'b64mac' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
            </button>
          </div>

          <div className="bg-slate-950 p-3 rounded-lg border border-slate-800 flex items-center justify-between">
            <div>
              <span className="text-[11px] text-slate-400 block font-medium">Linux / Ubuntu:</span>
              <code className="text-cyan-300 font-mono text-xs">{base64LinuxCmd}</code>
            </div>
            <button
              onClick={() => copyToClipboard(base64LinuxCmd, 'b64linux')}
              className="p-1.5 hover:bg-slate-800 rounded text-slate-400 transition"
            >
              {copiedKey === 'b64linux' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Step 3: Add to GitHub Secrets */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-5 space-y-3">
        <div className="flex items-center gap-2">
          <span className="w-5 h-5 rounded-full bg-cyan-950 border border-cyan-800 text-cyan-400 text-xs flex items-center justify-center font-bold">
            3
          </span>
          <h3 className="text-xs font-semibold text-slate-200">
            Add Secrets to GitHub Repository
          </h3>
        </div>

        <p className="text-xs text-slate-400">
          Go to your GitHub repo <strong className="text-slate-200">Settings &gt; Secrets and variables &gt; Actions</strong> and create:
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
          <div className="bg-slate-950 p-2.5 rounded-lg border border-slate-800">
            <span className="font-mono text-cyan-400 font-semibold">KEYSTORE_BASE64</span>
            <p className="text-[11px] text-slate-400 mt-0.5">The full base64 string copied from Step 2</p>
          </div>
          <div className="bg-slate-950 p-2.5 rounded-lg border border-slate-800">
            <span className="font-mono text-cyan-400 font-semibold">KEYSTORE_PASSWORD</span>
            <p className="text-[11px] text-slate-400 mt-0.5">Password used when creating the keystore</p>
          </div>
          <div className="bg-slate-950 p-2.5 rounded-lg border border-slate-800">
            <span className="font-mono text-cyan-400 font-semibold">KEY_ALIAS</span>
            <p className="text-[11px] text-slate-400 mt-0.5">Key alias name (e.g. <code className="text-slate-300">upload</code>)</p>
          </div>
          <div className="bg-slate-950 p-2.5 rounded-lg border border-slate-800">
            <span className="font-mono text-cyan-400 font-semibold">KEY_PASSWORD</span>
            <p className="text-[11px] text-slate-400 mt-0.5">Password for the specific key alias</p>
          </div>
        </div>
      </div>

      {/* Step 4: Configure android/app/build.gradle */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-5 space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="w-5 h-5 rounded-full bg-cyan-950 border border-cyan-800 text-cyan-400 text-xs flex items-center justify-center font-bold">
              4
            </span>
            <h3 className="text-xs font-semibold text-slate-200">
              Update <code className="text-cyan-400">android/app/build.gradle</code>
            </h3>
          </div>
          <button
            onClick={() => copyToClipboard(gradleSnippet, 'gradle')}
            className="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded text-xs flex items-center gap-1 transition"
          >
            {copiedKey === 'gradle' ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
            <span>Copy Gradle Config</span>
          </button>
        </div>

        <p className="text-xs text-slate-400">
          Add the signing config inside <code className="text-slate-200">android/app/build.gradle</code> so Gradle picks up the decoded <code className="text-slate-200">key.properties</code>:
        </p>

        <pre className="bg-slate-950 rounded-lg p-3 font-mono text-xs text-slate-300 border border-slate-800 overflow-x-auto leading-relaxed select-text">
          {gradleSnippet}
        </pre>
      </div>
    </div>
  );
};
