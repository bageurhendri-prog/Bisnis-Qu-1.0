import React from 'react';
import { 
  ShieldAlert, 
  AlertTriangle, 
  Info, 
  Sparkles, 
  CheckCircle2, 
  ArrowUpRight, 
  Zap, 
  Check 
} from 'lucide-react';
import { auditWorkflow } from '../utils/workflowAuditor';
import { WorkflowConfig } from '../types/workflow';

interface AuditModernizerProps {
  config: WorkflowConfig;
  onUpdateConfig: (updater: (prev: WorkflowConfig) => WorkflowConfig) => void;
}

export const AuditModernizer: React.FC<AuditModernizerProps> = ({
  config,
  onUpdateConfig,
}) => {
  const issues = auditWorkflow(config);

  const handleApplyAllFixes = () => {
    onUpdateConfig(current => {
      let updated = { ...current };
      for (const issue of issues) {
        if (issue.fixAction) {
          updated = issue.fixAction(updated);
        }
      }
      return updated;
    });
  };

  const errorCount = issues.filter(i => i.severity === 'error').length;
  const warningCount = issues.filter(i => i.severity === 'warning').length;

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-lg bg-amber-500/10 text-amber-400 border border-amber-500/30">
              <ShieldAlert className="w-4 h-4" />
            </span>
            <h2 className="text-sm font-semibold text-slate-100">
              Workflow Modernization & Security Audit
            </h2>
          </div>
          <p className="text-xs text-slate-400 mt-1 max-w-2xl">
            Audit results for your Flutter GitHub Actions workflow. Evaluates Action runtime versioning (Node 20 compliance), security signing, and build caching.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="text-right text-xs">
            <span className="text-slate-400 block">Issues Found</span>
            <span className="font-mono font-semibold text-slate-200">
              {errorCount} critical · {warningCount} warnings
            </span>
          </div>

          {issues.length > 0 && (
            <button
              onClick={handleApplyAllFixes}
              className="px-3.5 py-2 bg-gradient-to-r from-cyan-600 to-emerald-600 hover:from-cyan-500 hover:to-emerald-500 text-white rounded-lg text-xs font-semibold shadow-md shadow-cyan-950 transition flex items-center gap-1.5"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Apply All Recommended Modernizations</span>
            </button>
          )}
        </div>
      </div>

      {/* Issues list */}
      {issues.length === 0 ? (
        <div className="bg-emerald-950/20 border border-emerald-500/30 rounded-xl p-8 text-center space-y-3">
          <div className="w-12 h-12 bg-emerald-500/10 text-emerald-400 rounded-full flex items-center justify-center mx-auto border border-emerald-500/30">
            <CheckCircle2 className="w-6 h-6" />
          </div>
          <h3 className="text-sm font-semibold text-emerald-200">
            Clean Pipeline! All Modern Standards Met
          </h3>
          <p className="text-xs text-slate-400 max-w-md mx-auto">
            Your workflow uses actions v4, proper caching, quality gates, and concurrency control. It is fully ready for modern GitHub Actions runners.
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {issues.map((issue) => {
            let badgeBg = 'bg-slate-800 text-slate-300';
            let borderClass = 'border-slate-800';

            if (issue.severity === 'error') {
              badgeBg = 'bg-rose-950/50 text-rose-300 border border-rose-800/60';
              borderClass = 'border-rose-900/40 bg-slate-900/90';
            } else if (issue.severity === 'warning') {
              badgeBg = 'bg-amber-950/50 text-amber-300 border border-amber-800/60';
              borderClass = 'border-amber-900/40 bg-slate-900/90';
            } else if (issue.severity === 'info') {
              badgeBg = 'bg-blue-950/50 text-blue-300 border border-blue-800/60';
              borderClass = 'border-slate-800 bg-slate-900/90';
            } else {
              badgeBg = 'bg-emerald-950/50 text-emerald-300 border border-emerald-800/60';
              borderClass = 'border-slate-800 bg-slate-900/90';
            }

            return (
              <div
                key={issue.id}
                className={`border rounded-xl p-4 transition shadow-sm ${borderClass}`}
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className={`text-[10px] uppercase font-semibold px-2 py-0.5 rounded ${badgeBg}`}>
                        {issue.severity}
                      </span>
                      <h3 className="text-xs font-semibold text-slate-200">
                        {issue.title}
                      </h3>
                    </div>

                    <p className="text-xs text-slate-400 leading-relaxed">
                      {issue.description}
                    </p>

                    <div className="flex items-center gap-1.5 text-xs text-cyan-300 pt-1 font-medium">
                      <span>Recommendation:</span>
                      <span className="text-slate-300 font-normal">{issue.recommendation}</span>
                    </div>
                  </div>

                  {issue.canAutoFix && issue.fixAction && (
                    <button
                      onClick={() => onUpdateConfig(c => issue.fixAction!(c))}
                      className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg text-xs font-medium transition flex-shrink-0 flex items-center gap-1"
                    >
                      <Zap className="w-3 h-3 text-amber-400" />
                      <span>Auto-Fix</span>
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
