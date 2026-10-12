import React, { useState } from 'react';
import { Copy, Check, Download, FileCode, Layers, Info } from 'lucide-react';
import { BISNISQU_DART_CODE, BISNISQU_POS_DART_CODE, PUBSPEC_YAML } from '../constants/bisnisquData';

export const DartCodeViewer: React.FC = () => {
  const [activeFile, setActiveFile] = useState<'pos' | 'dashboard' | 'pubspec'>('pos');
  const [copied, setCopied] = useState(false);

  const getContent = () => {
    switch (activeFile) {
      case 'pos':
        return BISNISQU_POS_DART_CODE;
      case 'dashboard':
        return BISNISQU_DART_CODE;
      case 'pubspec':
        return PUBSPEC_YAML;
    }
  };

  const getFileName = () => {
    switch (activeFile) {
      case 'pos':
        return 'lib/pages/pos_page.dart';
      case 'dashboard':
        return 'lib/pages/dashboard_page.dart';
      case 'pubspec':
        return 'pubspec.yaml';
    }
  };

  const currentContent = getContent();
  const currentFileName = getFileName();

  const handleCopy = () => {
    navigator.clipboard.writeText(currentContent);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    const filename = activeFile === 'pos' ? 'pos_page.dart' : activeFile === 'dashboard' ? 'dashboard_page.dart' : 'pubspec.yaml';
    const blob = new Blob([currentContent], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-4">
      {/* Top Banner */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-lg bg-cyan-500/10 text-cyan-400 border border-cyan-500/30">
              <FileCode className="w-4 h-4" />
            </span>
            <h2 className="text-sm font-semibold text-slate-100">
              BisnisQu Flutter Architecture & Source Code
            </h2>
          </div>
          <p className="text-xs text-slate-400 mt-1 max-w-2xl">
            Clean Flutter Material 3 widget implementation featuring stateful POS cashier cart and dashboard navigation.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {/* File Switcher */}
          <div className="flex items-center bg-slate-950 border border-slate-800 rounded-lg p-0.5 text-xs">
            <button
              onClick={() => setActiveFile('pos')}
              className={`px-3 py-1 rounded transition ${activeFile === 'pos' ? 'bg-slate-800 text-cyan-300 font-semibold' : 'text-slate-400 hover:text-slate-200'}`}
            >
              pos_page.dart (Current)
            </button>
            <button
              onClick={() => setActiveFile('dashboard')}
              className={`px-3 py-1 rounded transition ${activeFile === 'dashboard' ? 'bg-slate-800 text-cyan-300 font-semibold' : 'text-slate-400 hover:text-slate-200'}`}
            >
              dashboard_page.dart
            </button>
            <button
              onClick={() => setActiveFile('pubspec')}
              className={`px-3 py-1 rounded transition ${activeFile === 'pubspec' ? 'bg-slate-800 text-cyan-300 font-semibold' : 'text-slate-400 hover:text-slate-200'}`}
            >
              pubspec.yaml
            </button>
          </div>

          <button
            onClick={handleCopy}
            className="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg text-xs flex items-center gap-1.5 transition"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5 text-slate-400" />}
            <span>{copied ? 'Copied' : 'Copy'}</span>
          </button>

          <button
            onClick={handleDownload}
            className="p-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg transition"
            title="Download file"
          >
            <Download className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Code Container */}
      <div className="bg-slate-950 border border-slate-800 rounded-xl overflow-hidden shadow-xl">
        {/* Window Bar */}
        <div className="bg-slate-900/90 border-b border-slate-800 px-4 py-2.5 flex items-center justify-between text-xs">
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-rose-500/80 inline-block" />
              <span className="w-2.5 h-2.5 rounded-full bg-amber-500/80 inline-block" />
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500/80 inline-block" />
            </div>
            <span className="text-slate-400 font-mono text-[11px] ml-2">
              {currentFileName}
            </span>
            <span className="text-[10px] bg-slate-800 text-slate-400 px-1.5 py-0.2 rounded font-mono">
              {activeFile === 'pubspec' ? 'YAML' : 'Dart'}
            </span>
          </div>

          <span className="text-slate-500 text-[11px]">
            {activeFile === 'pos' ? 'StatefulWidget (Cart & Total)' : activeFile === 'dashboard' ? 'StatelessWidget (Grid Modules)' : 'Dependencies'}
          </span>
        </div>

        {/* Code Content */}
        <div className="p-4 overflow-x-auto max-h-[620px] overflow-y-auto font-mono text-xs leading-relaxed text-slate-300">
          <pre className="select-text">
            {currentContent.split('\n').map((line, idx) => {
              let lineContent: React.ReactNode = line;

              if (line.trim().startsWith('//')) {
                lineContent = <span className="text-slate-500 italic">{line}</span>;
              } else if (line.includes('class ') || line.includes('import ') || line.includes('return ') || line.includes('const ') || line.includes('final ')) {
                lineContent = <span className="text-purple-400 font-medium">{line}</span>;
              } else if (line.includes('Widget build') || line.includes('_addToCart') || line.includes('_removeFromCart') || line.includes('setState') || line.includes('_totalPrice')) {
                lineContent = <span className="text-cyan-300 font-semibold">{line}</span>;
              } else if (line.includes('Icons.') || line.includes('Colors.')) {
                lineContent = <span className="text-amber-300">{line}</span>;
              }

              return (
                <div key={idx} className="flex hover:bg-slate-900/60 px-2 py-0.5 rounded -mx-2">
                  <span className="w-8 flex-shrink-0 text-slate-600 select-none text-right pr-3 text-[11px]">
                    {idx + 1}
                  </span>
                  <span className="flex-1 whitespace-pre">{lineContent}</span>
                </div>
              );
            })}
          </pre>
        </div>

        {/* Flutter Architecture Explanation Footer */}
        <div className="bg-slate-900/60 border-t border-slate-800/80 p-4 grid grid-cols-1 md:grid-cols-4 gap-3 text-xs">
          <div className="bg-slate-950 p-3 rounded-lg border border-slate-800/80">
            <span className="font-semibold text-cyan-300 block mb-1">Stateful Cart Map</span>
            <p className="text-slate-400 text-[11px]">
              <code className="text-slate-300">Map&lt;String, int&gt; _cart</code> maps product ID to quantity, enabling instant O(1) item lookups.
            </p>
          </div>
          <div className="bg-slate-950 p-3 rounded-lg border border-slate-800/80">
            <span className="font-semibold text-orange-300 block mb-1">_totalItemCount & _totalPrice</span>
            <p className="text-slate-400 text-[11px]">
              Reactive getters using <code className="text-slate-300">fold</code> and <code className="text-slate-300">forEach</code> for instantaneous price updates.
            </p>
          </div>
          <div className="bg-slate-950 p-3 rounded-lg border border-slate-800/80">
            <span className="font-semibold text-emerald-300 block mb-1">Dynamic Bottom Bar</span>
            <p className="text-slate-400 text-[11px]">
              Checkout bar only renders when <code className="text-slate-300">_totalItemCount &gt; 0</code> to keep the screen distraction-free.
            </p>
          </div>
          <div className="bg-slate-950 p-3 rounded-lg border border-slate-800/80">
            <span className="font-semibold text-purple-300 block mb-1">Multi-Modul Reusability</span>
            <p className="text-slate-400 text-[11px]">
              Accepts <code className="text-slate-300">moduleTitle</code> dynamically so it works seamlessly for Ritel, Resto, Bengkel, and Collab!
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
