import React from 'react';
import {
  CheckCircle2,
  AlertTriangle,
  XCircle,
  TrendingUp,
  FileText,
  FormInput,
  FolderGit2,
  ShieldAlert,
} from 'lucide-react';
import { Team, AuditRecord } from '../types';

interface OverviewCardsProps {
  teams: Team[];
  audits: AuditRecord[];
  onFilterStatus?: (status: string) => void;
  onOpenIngestion: () => void;
}

export const OverviewCards: React.FC<OverviewCardsProps> = ({
  teams,
  audits,
  onOpenIngestion,
}) => {
  const totalTeams = teams.length;
  const onTrackTeams = teams.filter((t) => t.healthStatus === 'on_track');
  const needsAttentionTeams = teams.filter((t) => t.healthStatus === 'needs_attention');
  const blockedTeams = teams.filter((t) => t.healthStatus === 'blocked');

  const avgReadiness = totalTeams > 0
    ? Math.round(teams.reduce((acc, t) => acc + t.readinessScore, 0) / totalTeams)
    : 0;

  // Kanban totals across all filtered teams
  const totalBacklog = teams.reduce((acc, t) => acc + t.kanbanCounts.backlog, 0);
  const totalInProgress = teams.reduce((acc, t) => acc + t.kanbanCounts.inProgress, 0);
  const totalDone = teams.reduce((acc, t) => acc + t.kanbanCounts.done, 0);
  const totalTickets = totalBacklog + totalInProgress + totalDone;
  const donePercent = totalTickets > 0 ? Math.round((totalDone / totalTickets) * 100) : 0;

  // Document (W1-4) vs Form (W5-8) metrics
  const docAuditsCount = audits.filter((a) => a.sourceType === 'document' || a.weekNumber <= 4).length;
  const formAuditsCount = audits.filter((a) => a.sourceType === 'google_form' || a.weekNumber > 4).length;

  return (
    <div className="space-y-4">
      {/* Top Banner Alert for Blockers / Unmerged Work */}
      {blockedTeams.length > 0 && (
        <div className="bg-amber-500/10 border border-amber-500/30 rounded-2xl p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-amber-200">
          <div className="flex items-start gap-3">
            <div className="p-2 rounded-xl bg-amber-500/20 text-amber-400 shrink-0">
              <ShieldAlert className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-semibold text-sm text-amber-100 flex items-center gap-2">
                <span>Professor Alert: {blockedTeams.length} Team(s) Require Immediate Academic Follow-up</span>
              </h4>
              <p className="text-xs text-amber-300/80 mt-0.5">
                {blockedTeams.map((t) => `${t.name} (${t.healthReason})`).join(' • ')}
              </p>
            </div>
          </div>
          <button
            onClick={onOpenIngestion}
            className="px-3 py-1.5 rounded-lg bg-amber-500/20 hover:bg-amber-500/30 text-amber-200 text-xs font-semibold border border-amber-500/40 transition shrink-0"
          >
            Review Ingested Data
          </button>
        </div>
      )}

      {/* Metric Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Presentation Readiness Index */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-sm hover:border-slate-700 transition">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
              Avg Presentation Readiness
            </span>
            <span className="p-2 rounded-xl bg-indigo-500/10 text-indigo-400">
              <TrendingUp className="w-4 h-4" />
            </span>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-white tracking-tight">{avgReadiness}%</span>
            <span className="text-xs font-medium text-emerald-400">
              {avgReadiness >= 75 ? 'Defense Ready' : avgReadiness >= 50 ? 'Pacing OK' : 'Behind Pace'}
            </span>
          </div>
          <div className="mt-3 w-full bg-slate-800 rounded-full h-2 overflow-hidden">
            <div
              className={`h-full rounded-full transition-all duration-700 ${
                avgReadiness >= 75
                  ? 'bg-gradient-to-r from-emerald-500 to-teal-400'
                  : 'bg-gradient-to-r from-amber-500 to-indigo-500'
              }`}
              style={{ width: `${avgReadiness}%` }}
            />
          </div>
          <p className="mt-2 text-[11px] text-slate-400">
            Calculated across MVP features, commits, and audits
          </p>
        </div>

        {/* Card 2: Team Health Breakdown */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-sm hover:border-slate-700 transition">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
              Team Project Health
            </span>
            <span className="text-xs font-mono text-slate-400">{totalTeams} Teams</span>
          </div>
          <div className="mt-3 grid grid-cols-3 gap-2 text-center">
            <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-xl p-2">
              <div className="flex items-center justify-center gap-1 text-emerald-400 text-lg font-bold">
                <CheckCircle2 className="w-4 h-4" />
                <span>{onTrackTeams.length}</span>
              </div>
              <span className="text-[10px] text-slate-400 font-medium uppercase">On Track</span>
            </div>
            <div className="bg-amber-500/10 border border-amber-500/20 rounded-xl p-2">
              <div className="flex items-center justify-center gap-1 text-amber-400 text-lg font-bold">
                <AlertTriangle className="w-4 h-4" />
                <span>{needsAttentionTeams.length}</span>
              </div>
              <span className="text-[10px] text-slate-400 font-medium uppercase">At Risk</span>
            </div>
            <div className="bg-rose-500/10 border border-rose-500/20 rounded-xl p-2">
              <div className="flex items-center justify-center gap-1 text-rose-400 text-lg font-bold">
                <XCircle className="w-4 h-4" />
                <span>{blockedTeams.length}</span>
              </div>
              <span className="text-[10px] text-slate-400 font-medium uppercase">Blocked</span>
            </div>
          </div>
          <p className="mt-2 text-[11px] text-slate-400">
            {Math.round((onTrackTeams.length / (totalTeams || 1)) * 100)}% of teams on schedule for defense
          </p>
        </div>

        {/* Card 3: Kanban Velocity */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-sm hover:border-slate-700 transition">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
              Kanban Ticket Velocity
            </span>
            <span className="p-2 rounded-xl bg-purple-500/10 text-purple-400">
              <FolderGit2 className="w-4 h-4" />
            </span>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-white tracking-tight">{donePercent}%</span>
            <span className="text-xs text-slate-400">({totalDone} of {totalTickets} tickets done)</span>
          </div>
          <div className="mt-3 flex gap-1 h-2 rounded-full overflow-hidden bg-slate-800">
            <div
              className="bg-emerald-500 transition-all duration-500"
              style={{ width: `${(totalDone / (totalTickets || 1)) * 100}%` }}
              title={`Done: ${totalDone}`}
            />
            <div
              className="bg-blue-500 transition-all duration-500"
              style={{ width: `${(totalInProgress / (totalTickets || 1)) * 100}%` }}
              title={`In Progress: ${totalInProgress}`}
            />
            <div
              className="bg-slate-600 transition-all duration-500"
              style={{ width: `${(totalBacklog / (totalTickets || 1)) * 100}%` }}
              title={`Backlog: ${totalBacklog}`}
            />
          </div>
          <div className="mt-2 flex items-center justify-between text-[11px] text-slate-400">
            <span className="text-emerald-400 font-medium">Done: {totalDone}</span>
            <span className="text-blue-400 font-medium">Coding: {totalInProgress}</span>
            <span className="text-slate-400">Backlog: {totalBacklog}</span>
          </div>
        </div>

        {/* Card 4: Historical Unification Health */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-sm hover:border-slate-700 transition">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
              Unified Data Records
            </span>
            <span className="text-xs font-mono px-2 py-0.5 rounded bg-indigo-500/20 text-indigo-300">
              W1 – W8
            </span>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-white tracking-tight">{audits.length}</span>
            <span className="text-xs font-medium text-slate-400">Total Audit Logs</span>
          </div>
          <div className="mt-3 grid grid-cols-2 gap-2 text-xs">
            <div className="flex items-center gap-1.5 text-slate-300 bg-slate-800/60 p-1.5 rounded-lg border border-slate-800">
              <FileText className="w-3.5 h-3.5 text-amber-400 shrink-0" />
              <div className="truncate">
                <span className="font-semibold text-white">{docAuditsCount}</span>
                <span className="text-[10px] text-slate-400 ml-1">Docs (W1-4)</span>
              </div>
            </div>
            <div className="flex items-center gap-1.5 text-slate-300 bg-slate-800/60 p-1.5 rounded-lg border border-slate-800">
              <FormInput className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
              <div className="truncate">
                <span className="font-semibold text-white">{formAuditsCount}</span>
                <span className="text-[10px] text-slate-400 ml-1">Forms (W5-8)</span>
              </div>
            </div>
          </div>
          <p className="mt-2 text-[11px] text-slate-400">
            Unifies pre-Kanban documents with modern Google Forms
          </p>
        </div>
      </div>
    </div>
  );
};
