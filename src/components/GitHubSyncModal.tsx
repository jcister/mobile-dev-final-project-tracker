import React, { useState } from 'react';
import {
  FolderGit2,
  RefreshCw,
  CheckCircle2,
  AlertTriangle,
  ExternalLink,
  Key,
  Sparkles,
  Link2,
  HelpCircle,
  X,
  Layers,
  ArrowRight,
  ShieldCheck,
} from 'lucide-react';
import { Team, KanbanCard } from '../types';
import { GITHUB_ORG_NAME, normalizeTeam } from '../data/defaultData';

interface GitHubSyncModalProps {
  isOpen: boolean;
  onClose: () => void;
  teams: Team[];
  onApplySyncedCards: (cards: KanbanCard[], teamId?: string) => void;
}

export const GitHubSyncModal: React.FC<GitHubSyncModalProps> = ({
  isOpen,
  onClose,
  teams,
  onApplySyncedCards,
}) => {
  const [boardUrl, setBoardUrl] = useState('');
  const [selectedTeamId, setSelectedTeamId] = useState(teams[0]?.id || '');
  const [token, setToken] = useState(() => {
    return sessionStorage.getItem('github_pat_token') || '';
  });
  const [isSyncing, setIsSyncing] = useState(false);
  const [syncStatus, setSyncStatus] = useState<{
    type: 'success' | 'error' | 'info';
    message: string;
    details?: string[];
  } | null>(null);

  if (!isOpen) return null;

  const handleSaveToken = (val: string) => {
    setToken(val);
    sessionStorage.setItem('github_pat_token', val);
  };

  // Sync a single URL
  const handleSyncUrl = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!boardUrl.trim()) return;

    setIsSyncing(true);
    setSyncStatus(null);

    try {
      const response = await fetch('/api/github/sync-url', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          url: boardUrl.trim(),
          token: token.trim() || undefined,
          teamId: selectedTeamId || undefined,
        }),
      });

      const json = await response.json();
      if (!response.ok || !json.success) {
        throw new Error(json.error || json.details || 'Failed to sync with GitHub API');
      }

      if (json.cards && json.cards.length > 0) {
        onApplySyncedCards(json.cards, json.teamId || selectedTeamId);
        setSyncStatus({
          type: 'success',
          message: `Successfully synchronized ${json.cards.length} live issues & tickets from GitHub repository "${json.repo}"!`,
          details: [
            `Latest commit: ${json.latestCommit || 'Verified'}`,
            `Synced at: ${new Date(json.syncedAt).toLocaleTimeString()}`,
          ],
        });
      } else {
        setSyncStatus({
          type: 'info',
          message: `Connected to repository "${json.repo}", but no open/closed issues or Kanban tickets were found yet.`,
        });
      }
    } catch (err: any) {
      console.error(err);
      setSyncStatus({
        type: 'error',
        message: err.message || 'Error communicating with GitHub API',
      });
    } finally {
      setIsSyncing(false);
    }
  };

  // 1-Click Sync Entire Org
  const handleSyncOrg = async () => {
    setIsSyncing(true);
    setSyncStatus(null);

    try {
      const response = await fetch('/api/github/sync-org', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          orgName: GITHUB_ORG_NAME,
          token: token.trim() || undefined,
        }),
      });

      const json = await response.json();
      if (!response.ok || !json.success) {
        throw new Error(json.error || json.details || 'Failed to sync with GitHub Organization');
      }

      if (json.cards && json.cards.length > 0) {
        // Map cards to team IDs using repo names
        const cardsWithTeamIds = json.cards.map((c: any) => {
          const { teamId } = normalizeTeam(c.teamRepo);
          return {
            ...c,
            teamId,
          };
        });

        onApplySyncedCards(cardsWithTeamIds);
        setSyncStatus({
          type: 'success',
          message: `Successfully scanned ${json.reposProcessed} team repositories and imported ${json.totalCards} live issues into your Kanban boards!`,
          details: json.details?.map(
            (d: any) => `${d.repoName}: ${d.issuesCount} tickets (${d.closedIssues} closed/done)`
          ),
        });
      } else {
        setSyncStatus({
          type: 'info',
          message: `Scanned organization ${GITHUB_ORG_NAME}, but no issues or kanban cards were detected in public repositories.`,
        });
      }
    } catch (err: any) {
      console.error(err);
      setSyncStatus({
        type: 'error',
        message: err.message || 'Failed to synchronize with GitHub organization',
      });
    } finally {
      setIsSyncing(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-2xl w-full p-6 shadow-2xl text-slate-200 flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="flex items-start justify-between pb-4 border-b border-slate-800">
          <div>
            <div className="flex items-center gap-2">
              <span className="p-1.5 rounded-xl bg-indigo-500/10 text-indigo-400">
                <FolderGit2 className="w-5 h-5" />
              </span>
              <h3 className="text-base font-bold text-white tracking-tight">
                Live GitHub Kanban & Repository Sync
              </h3>
            </div>
            <p className="text-xs text-slate-400 mt-1">
              Connect your team Kanban boards and repository issues directly to reflect live student ticket updates, commit merges, and closed tasks.
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto py-4 space-y-5 pr-1">
          {/* Quick 1-Click Sync Org Banner */}
          <div className="bg-gradient-to-r from-indigo-900/40 via-purple-900/30 to-slate-900 border border-indigo-500/30 rounded-2xl p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-sm">
            <div>
              <div className="flex items-center gap-1.5 text-indigo-300 font-bold text-xs">
                <Sparkles className="w-4 h-4 text-amber-300" />
                <span>1-Click Sync Official Organization</span>
              </div>
              <p className="text-xs text-slate-300 mt-0.5">
                Scan all student repositories in <strong className="text-white font-mono">{GITHUB_ORG_NAME}</strong> and auto-populate all boards.
              </p>
            </div>
            <button
              type="button"
              onClick={handleSyncOrg}
              disabled={isSyncing}
              className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold shadow-md transition disabled:opacity-50 flex items-center gap-2 shrink-0 cursor-pointer"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isSyncing ? 'animate-spin' : ''}`} />
              <span>{isSyncing ? 'Syncing...' : 'Sync All Repos'}</span>
            </button>
          </div>

          {/* Form: Paste Specific Link */}
          <form onSubmit={handleSyncUrl} className="space-y-3.5 bg-slate-950 p-4 rounded-2xl border border-slate-800">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
              <Link2 className="w-3.5 h-3.5 text-indigo-400" />
              <span>Link Specific Team Repository or Kanban Board</span>
            </h4>

            <div>
              <label className="block text-xs font-medium text-slate-400 mb-1">
                GitHub Board / Repo / Issues URL
              </label>
              <input
                type="url"
                required
                value={boardUrl}
                onChange={(e) => setBoardUrl(e.target.value)}
                placeholder="e.g. https://github.com/UIC-CCS-MOBILE-DEVELOPMENT-2026-2027/LearnLuau-Olpenado-Palencia"
                className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700/80 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 font-mono"
              />
              <div className="flex flex-wrap gap-2 mt-1.5">
                <span className="text-[10px] text-slate-400">Quick test sample:</span>
                <button
                  type="button"
                  onClick={() =>
                    setBoardUrl(
                      'https://github.com/UIC-CCS-MOBILE-DEVELOPMENT-2026-2027/LearnLuau-Olpenado-Palencia'
                    )
                  }
                  className="text-[10px] font-mono text-indigo-400 hover:underline"
                >
                  LearnLuau-Olpenado-Palencia (Live Public Repo)
                </button>
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-400 mb-1">
                Assign to Team:
              </label>
              <select
                value={selectedTeamId}
                onChange={(e) => setSelectedTeamId(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700/80 text-xs text-white focus:outline-none focus:border-indigo-500 font-medium"
              >
                {teams.map((t) => (
                  <option key={t.id} value={t.id}>
                    {t.name} ({t.repoName})
                  </option>
                ))}
              </select>
            </div>

            <div className="flex items-center justify-end pt-1">
              <button
                type="submit"
                disabled={isSyncing || !boardUrl.trim()}
                className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold shadow-sm transition disabled:opacity-50 cursor-pointer"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${isSyncing ? 'animate-spin' : ''}`} />
                <span>Fetch Live Kanban Tickets</span>
              </button>
            </div>
          </form>

          {/* Sync Result Feedback */}
          {syncStatus && (
            <div
              className={`p-4 rounded-2xl border text-xs space-y-2 ${
                syncStatus.type === 'success'
                  ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-200'
                  : syncStatus.type === 'error'
                  ? 'bg-rose-500/10 border-rose-500/30 text-rose-200'
                  : 'bg-indigo-500/10 border-indigo-500/30 text-indigo-200'
              }`}
            >
              <div className="flex items-center gap-2 font-bold">
                {syncStatus.type === 'success' ? (
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                ) : syncStatus.type === 'error' ? (
                  <AlertTriangle className="w-4 h-4 text-rose-400" />
                ) : (
                  <Sparkles className="w-4 h-4 text-indigo-400" />
                )}
                <span>{syncStatus.message}</span>
              </div>
              {syncStatus.details && syncStatus.details.length > 0 && (
                <ul className="list-disc list-inside space-y-0.5 text-[11px] opacity-90 font-mono">
                  {syncStatus.details.map((d, idx) => (
                    <li key={idx}>{d}</li>
                  ))}
                </ul>
              )}
            </div>
          )}

          {/* Optional GitHub Token Box */}
          <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-300">
                <Key className="w-3.5 h-3.5 text-amber-400" />
                <span>Private Repositories & Rate Limits (Optional)</span>
              </div>
              <span className="text-[10px] text-slate-500 font-mono">Stored in Session</span>
            </div>
            <p className="text-[11px] text-slate-400 leading-relaxed">
              If student repositories are set to <strong>Private</strong> in your organization, paste a GitHub Personal Access Token (classic `repo` scope or fine-grained token) to allow fetching private issues. This also raises the GitHub rate limit from 60 to 5,000 requests/hour.
            </p>
            <input
              type="password"
              value={token}
              onChange={(e) => handleSaveToken(e.target.value)}
              placeholder="ghp_xxxxxxxxxxxxxxxxxxxx"
              className="w-full px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-700/80 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-indigo-500 font-mono"
            />
          </div>

          {/* Professor Recommendation & Architecture Guide */}
          <div className="bg-slate-900 p-4 rounded-2xl border border-slate-800 space-y-2 text-xs">
            <h4 className="font-bold text-white flex items-center gap-1.5">
              <HelpCircle className="w-3.5 h-3.5 text-indigo-400" />
              <span>How GitHub Kanban Works & Professor Recommendations</span>
            </h4>
            <div className="space-y-1.5 text-slate-400 text-[11px] leading-relaxed">
              <p>
                <strong className="text-slate-200">1. Issue-Linked Kanban (Recommended):</strong> Each student team repository has an Issues section. When students create issues with titles like "Authentication UI #1" and commit with message "Fixes #1", GitHub automatically marks the ticket as <strong>Closed / Done</strong>. Our sync reads this directly!
              </p>
              <p>
                <strong className="text-slate-200">2. Real-Time Presentation Check:</strong> Just before team presentation defense, click <strong>"Sync All Repos"</strong> to inspect whether students actually merged their code into GitHub as claimed on their Google Forms.
              </p>
              <p>
                <strong className="text-slate-200">3. Label Mapping:</strong> Issues labeled with <code className="text-indigo-300 bg-slate-800 px-1 py-0.5 rounded">in-progress</code>, <code className="text-indigo-300 bg-slate-800 px-1 py-0.5 rounded">review</code>, or <code className="text-indigo-300 bg-slate-800 px-1 py-0.5 rounded">bug</code> map automatically to their corresponding Kanban columns.
              </p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="pt-3 border-t border-slate-800 flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold transition"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
