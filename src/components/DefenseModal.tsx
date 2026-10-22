import React, { useState, useEffect } from 'react';
import {
  Sparkles,
  Flame,
  CheckCircle2,
  AlertTriangle,
  X,
  RefreshCw,
  Copy,
  Check,
  ShieldCheck,
  FolderGit2,
  HelpCircle,
} from 'lucide-react';
import { Team, AuditRecord, DefenseEvaluation } from '../types';

interface DefenseModalProps {
  isOpen: boolean;
  onClose: () => void;
  teams: Team[];
  audits: AuditRecord[];
  initialTeamId?: string;
}

export const DefenseModal: React.FC<DefenseModalProps> = ({
  isOpen,
  onClose,
  teams,
  audits,
  initialTeamId,
}) => {
  const [selectedTeamId, setSelectedTeamId] = useState<string>(initialTeamId || teams[0]?.id || '');
  const [loading, setLoading] = useState(false);
  const [evaluation, setEvaluation] = useState<DefenseEvaluation | null>(null);
  const [evalSource, setEvalSource] = useState<string>('');
  const [error, setError] = useState<string>('');
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (initialTeamId) {
      setSelectedTeamId(initialTeamId);
    } else if (!selectedTeamId && teams.length > 0) {
      setSelectedTeamId(teams[0].id);
    }
  }, [initialTeamId, teams]);

  if (!isOpen) return null;

  const currentTeam = teams.find((t) => t.id === selectedTeamId) || teams[0];
  const teamAudits = audits.filter((a) => a.teamId === currentTeam?.id);

  const handleGenerate = async () => {
    if (!currentTeam) return;

    setLoading(true);
    setError('');
    setEvaluation(null);

    try {
      const response = await fetch('/api/generate-defense-questions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          teamName: currentTeam.name,
          repoName: currentTeam.repoName,
          section: currentTeam.section,
          members: currentTeam.members,
          audits: teamAudits,
          currentReadiness: currentTeam.readinessScore,
        }),
      });

      const json = await response.json();
      if (!response.ok || !json.success) {
        throw new Error(json.error || 'Failed to generate defense evaluation');
      }

      setEvaluation(json.evaluation);
      setEvalSource(json.source || 'advisor');
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'Error communicating with Gemini AI server');
    } finally {
      setLoading(false);
    }
  };

  const handleCopyQuestions = () => {
    if (!evaluation) return;
    const text = `PROMPT DEFENSE QUESTIONS FOR ${currentTeam?.name.toUpperCase()}:\n\n` +
      evaluation.defenseQuestions
        .map(
          (q, i) =>
            `${i + 1}. [${q.targetMember}] ${q.question}\n   Expected: ${q.expectedKeyAnswers}\n   Rationale: ${q.rationale}`
        )
        .join('\n\n') +
      `\n\nLive Demo Tests:\n` +
      evaluation.technicalRisksToInspectInLiveDemo.map((r) => `- ${r}`).join('\n');

    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-2xl w-full p-6 shadow-2xl text-slate-200 flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="flex items-start justify-between pb-3 border-b border-slate-800">
          <div className="flex items-center gap-2.5">
            <span className="p-2 rounded-xl bg-purple-500/10 text-purple-400">
              <Flame className="w-5 h-5 text-amber-300" />
            </span>
            <div>
              <h3 className="text-base font-bold text-white tracking-tight">
                AI Oral Presentation Defense Advisor
              </h3>
              <p className="text-xs text-slate-400">
                Synthesizes 8-week audit logs, commit histories, and recorded blockers to generate rigorous defense questions.
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Team Selector & Trigger */}
        <div className="py-4 border-b border-slate-800 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
          <div className="flex-1">
            <label className="block text-[11px] font-semibold uppercase tracking-wider text-slate-400 mb-1">
              Select Defending Team:
            </label>
            <select
              value={selectedTeamId}
              onChange={(e) => {
                setSelectedTeamId(e.target.value);
                setEvaluation(null);
              }}
              className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none focus:border-indigo-500 font-medium"
            >
              {teams.map((t) => (
                <option key={t.id} value={t.id}>
                  {t.name} ({t.section}) - Readiness: {t.readinessScore}%
                </option>
              ))}
            </select>
          </div>

          <button
            onClick={handleGenerate}
            disabled={loading}
            className="mt-4 sm:mt-5 flex items-center justify-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white text-xs font-bold shadow-md transition disabled:opacity-50 cursor-pointer"
          >
            {loading ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin" />
                <span>Analyzing 8-Week History...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4 text-amber-300" />
                <span>Generate Defense Evaluation</span>
              </>
            )}
          </button>
        </div>

        {/* Body content */}
        <div className="flex-1 overflow-y-auto py-3 space-y-4 pr-1">
          {error && (
            <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {!evaluation && !loading && (
            <div className="text-center py-10 space-y-3">
              <FolderGit2 className="w-10 h-10 text-slate-600 mx-auto" />
              <div className="text-xs text-slate-400 max-w-sm mx-auto">
                Click <strong>"Generate Defense Evaluation"</strong> above to cross-examine{' '}
                <span className="text-white font-medium">{currentTeam?.name}</span>'s git commits, memory fixes, and Kanban tickets across Weeks 1 to 8.
              </div>
            </div>
          )}

          {evaluation && (
            <div className="space-y-4">
              {/* Verdict & Executive Summary */}
              <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-mono uppercase tracking-wider text-slate-400 font-bold">
                      Faculty Readiness Assessment
                    </span>
                    {evalSource && (
                      <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-slate-800 text-slate-400 border border-slate-700">
                        {evalSource === 'gemini_ai' ? 'Gemini AI' : 'Local Advisor Engine'}
                      </span>
                    )}
                  </div>
                  <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                    {evaluation.readinessVerdict}
                  </span>
                </div>
                <p className="text-xs text-slate-300 leading-relaxed">
                  {evaluation.executiveSummary}
                </p>
                {evaluation.recommendedGradingAdjustment && (
                  <div className="text-[11px] text-amber-300/90 pt-1 font-mono">
                    <strong>Grading Note:</strong> {evaluation.recommendedGradingAdjustment}
                  </div>
                )}
              </div>

              {/* Defense Questions */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <h4 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
                    <HelpCircle className="w-3.5 h-3.5 text-purple-400" />
                    <span>Targeted Oral Defense Questions ({evaluation.defenseQuestions.length})</span>
                  </h4>
                  <button
                    onClick={handleCopyQuestions}
                    className="flex items-center gap-1 text-[11px] text-indigo-400 hover:text-indigo-300 font-medium"
                  >
                    {copied ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                    <span>{copied ? 'Copied!' : 'Copy for Panel'}</span>
                  </button>
                </div>

                <div className="space-y-3">
                  {evaluation.defenseQuestions.map((q, idx) => (
                    <div
                      key={idx}
                      className="p-3.5 rounded-xl bg-slate-950/80 border border-slate-800 space-y-2 text-xs"
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-indigo-400 text-[11px]">
                          Q{idx + 1}: Directed to {q.targetMember}
                        </span>
                      </div>
                      <p className="text-white font-medium text-xs leading-snug">
                        "{q.question}"
                      </p>
                      <div className="bg-slate-900/80 p-2.5 rounded-lg border border-slate-800/80 space-y-1 text-[11px]">
                        <div className="text-slate-400">
                          <strong className="text-slate-300">Why Ask This:</strong> {q.rationale}
                        </div>
                        <div className="text-emerald-400/90">
                          <strong>Proficient Answer Target:</strong> {q.expectedKeyAnswers}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Live Demo Risk Checklist */}
              {evaluation.technicalRisksToInspectInLiveDemo.length > 0 && (
                <div className="p-3.5 rounded-2xl bg-amber-500/10 border border-amber-500/20 space-y-2">
                  <h4 className="text-xs font-bold text-amber-300 uppercase tracking-wider flex items-center gap-1.5">
                    <AlertTriangle className="w-3.5 h-3.5 text-amber-400" />
                    <span>Things to Test Live During the Final App Presentation</span>
                  </h4>
                  <ul className="space-y-1 text-xs text-amber-200/90 list-disc list-inside">
                    {evaluation.technicalRisksToInspectInLiveDemo.map((risk, i) => (
                      <li key={i}>{risk}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
