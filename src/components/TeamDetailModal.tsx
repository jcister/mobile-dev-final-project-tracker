import React from 'react';
import {
  X,
  ExternalLink,
  GitCommit,
  FolderGit2,
  Users,
  CheckCircle2,
  AlertTriangle,
  Sparkles,
  ShieldCheck,
  Calendar,
  Layers,
  Edit2,
  Trash2,
} from 'lucide-react';
import { Team, AuditRecord } from '../types';

interface TeamDetailModalProps {
  team: Team | null;
  onClose: () => void;
  audits: AuditRecord[];
  onOpenDefense: (team: Team) => void;
  onOpenKanban: (teamId: string) => void;
  onEditTeam?: (team: Team) => void;
  onDeleteTeam?: (team: Team) => void;
  isAdmin?: boolean;
}

export const TeamDetailModal: React.FC<TeamDetailModalProps> = ({
  team,
  onClose,
  audits,
  onOpenDefense,
  onOpenKanban,
  onEditTeam,
  onDeleteTeam,
  isAdmin = false,
}) => {
  if (!team) return null;

  const teamAudits = audits
    .filter((a) => a.teamId === team.id)
    .sort((a, b) => a.weekNumber - b.weekNumber);

  const checklistItems = [
    { label: 'W1: Ideation & Problem Statement Approved', done: team.mvpChecklist.ideationApproved },
    { label: 'W2: High-Fidelity UI Wireframes in Figma', done: team.mvpChecklist.wireframesDone },
    { label: 'W3: System Architecture & ERD Planning', done: team.mvpChecklist.architectureDesigned },
    { label: 'W4: Project Scaffolding & Setup Verified', done: team.mvpChecklist.initialRepoSetup },
    { label: 'W5-6: Core Backend / DB Connection Working', done: team.mvpChecklist.coreBackendOrDb },
    { label: 'W7: Primary Interactive Screens Built', done: team.mvpChecklist.primaryScreensWorking },
    { label: 'W8: Final MVP Packaging & Demo Ready', done: team.mvpChecklist.packagingAndTesting },
  ];

  return (
    <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-3xl w-full p-6 shadow-2xl text-slate-200 flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="flex items-start justify-between pb-4 border-b border-slate-800">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span
                className={`text-[11px] font-semibold px-2.5 py-0.5 rounded-full ${
                  team.healthStatus === 'on_track'
                    ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30'
                    : team.healthStatus === 'needs_attention'
                    ? 'bg-amber-500/15 text-amber-400 border border-amber-500/30'
                    : 'bg-rose-500/15 text-rose-400 border border-rose-500/30'
                }`}
              >
                {team.healthStatus === 'on_track'
                  ? 'On Track for Presentation'
                  : team.healthStatus === 'needs_attention'
                  ? 'Needs Attention'
                  : 'Blocked / Action Required'}
              </span>
              <span className="text-xs font-mono px-2 py-0.5 rounded bg-slate-800 text-slate-400">
                {team.section}
              </span>
            </div>
            <h3 className="text-lg font-bold text-white tracking-tight">{team.name}</h3>
            <p className="text-xs text-slate-400 mt-0.5">{team.appDescription}</p>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Action Bar */}
        <div className="py-3 border-b border-slate-800 flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex flex-wrap items-center gap-2">
            <a
              href={team.githubRepoUrl}
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-indigo-300 font-mono border border-slate-700 transition"
              title="Open GitHub Repository"
            >
              <FolderGit2 className="w-3.5 h-3.5 text-indigo-400" />
              <span>{team.repoName}</span>
              <ExternalLink className="w-3 h-3 opacity-70" />
            </a>

            {team.kanbanUrl && (
              <a
                href={team.kanbanUrl}
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 font-medium transition"
                title="Open Team's GitHub Projects Kanban Board"
              >
                <Layers className="w-3.5 h-3.5 text-emerald-400" />
                <span>GitHub Kanban Board</span>
                <ExternalLink className="w-2.5 h-2.5 opacity-70" />
              </a>
            )}

            {isAdmin && (
              <button
                onClick={() => {
                  onClose();
                  onOpenKanban(team.id);
                }}
                className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-indigo-600/20 hover:bg-indigo-600/30 text-indigo-300 border border-indigo-500/30 font-semibold"
              >
                <Layers className="w-3.5 h-3.5" />
                <span>Internal Kanban</span>
              </button>
            )}
          </div>

          {isAdmin && (
            <div className="flex items-center gap-2">
              {onEditTeam && (
                <button
                  onClick={() => {
                    onClose();
                    onEditTeam(team);
                  }}
                  className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 font-semibold transition"
                  title="Edit Team, Repository, and Members"
                >
                  <Edit2 className="w-3.5 h-3.5 text-indigo-400" />
                  <span>Edit Team</span>
                </button>
              )}

              {onDeleteTeam && (
                <button
                  onClick={() => {
                    onClose();
                    onDeleteTeam(team);
                  }}
                  className="p-1.5 rounded-xl bg-slate-800 hover:bg-rose-950/40 text-slate-400 hover:text-rose-400 border border-slate-700 transition"
                  title="Delete Team from Tracker"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              )}

              <button
                onClick={() => {
                  onClose();
                  onOpenDefense(team);
                }}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-bold shadow-sm"
              >
                <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                <span>AI Defense Advisor</span>
              </button>
            </div>
          )}
        </div>

        {/* Scrollable details */}
        <div className="flex-1 overflow-y-auto py-4 space-y-4 pr-1">
          {/* Readiness & Kanban distribution */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800">
              <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                Presentation Readiness Score
              </span>
              <div className="mt-2 flex items-baseline gap-2">
                <span className="text-3xl font-extrabold text-white">{team.readinessScore}%</span>
                <span className="text-xs text-slate-400 font-medium">
                  Status: {team.healthReason}
                </span>
              </div>
              <div className="mt-3 w-full bg-slate-800 rounded-full h-2 overflow-hidden">
                <div
                  className="bg-emerald-500 h-full rounded-full transition-all"
                  style={{ width: `${team.readinessScore}%` }}
                />
              </div>
            </div>

            <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800">
              <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                Kanban Deliverables
              </span>
              <div className="mt-2 flex items-baseline gap-2">
                <span className="text-3xl font-extrabold text-white">{team.kanbanCounts.done}</span>
                <span className="text-xs text-slate-400">
                  of {team.totalTickets} total tickets completed
                </span>
              </div>
              <div className="mt-3 grid grid-cols-3 gap-2 text-center text-xs">
                <div className="bg-emerald-500/10 p-1.5 rounded-lg text-emerald-400 font-bold">
                  {team.kanbanCounts.done} Done
                </div>
                <div className="bg-blue-500/10 p-1.5 rounded-lg text-blue-400 font-bold">
                  {team.kanbanCounts.inProgress} Coding
                </div>
                <div className="bg-slate-800/80 p-1.5 rounded-lg text-slate-300 font-bold">
                  {team.kanbanCounts.backlog} Backlog
                </div>
              </div>
            </div>
          </div>

          {/* MVP Milestone Progression Checklist */}
          <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-2.5">
              Mobile App MVP Milestone Checklist
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
              {checklistItems.map((item, idx) => (
                <div
                  key={idx}
                  className={`flex items-center gap-2 p-2 rounded-xl border ${
                    item.done
                      ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-300'
                      : 'bg-slate-900 border-slate-800/80 text-slate-500'
                  }`}
                >
                  <CheckCircle2
                    className={`w-4 h-4 shrink-0 ${item.done ? 'text-emerald-400' : 'text-slate-600'}`}
                  />
                  <span className="font-medium truncate">{item.label}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Members Roster */}
          <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-2.5 flex items-center gap-1.5">
              <Users className="w-3.5 h-3.5 text-indigo-400" />
              <span>Assigned Student Engineers ({team.members.length})</span>
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
              {team.members.map((m, idx) => (
                <div
                  key={idx}
                  className="p-3 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-between"
                >
                  <div className="truncate">
                    <div className="font-semibold text-white truncate">{m.name}</div>
                    <div className="text-[11px] text-slate-400">{m.email}</div>
                  </div>
                  {m.githubUsername && (
                    <span className="text-xs font-mono text-indigo-400 hover:underline flex items-center gap-1 shrink-0 ml-2">
                      <a
                        href={`https://github.com/${m.githubUsername.replace('@', '')}`}
                        target="_blank"
                        rel="noreferrer"
                        className="hover:underline"
                      >
                        @{m.githubUsername.replace('@', '')}
                      </a>
                      <span title="Verified Org Member">
                        <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                      </span>
                    </span>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Chronological Audit Timeline (Weeks 1 to 8) */}
          <div className="space-y-2">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5 text-indigo-400" />
              <span>Chronological Progress Audits (Weeks 1 to 8)</span>
            </h4>
            <div className="space-y-2.5">
              {teamAudits.map((a) => (
                <div
                  key={a.id}
                  className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 space-y-2 text-xs"
                >
                  <div className="flex items-center justify-between text-[11px]">
                    <div className="flex items-center gap-2">
                      <span
                        className={`font-mono font-bold px-2 py-0.5 rounded text-[10px] uppercase ${
                          a.sourceType === 'document'
                            ? 'bg-amber-500/20 text-amber-300'
                            : 'bg-emerald-500/20 text-emerald-300'
                        }`}
                      >
                        {a.sourceType === 'document' ? 'Document (W1-4)' : 'Form (W5-8)'}
                      </span>
                      <span className="font-bold text-white">{a.weekLabel}</span>
                    </div>
                    <span className="font-mono text-indigo-400 font-bold">{a.ticketStatus}</span>
                  </div>

                  <div className="font-medium text-slate-200">
                    <span className="text-indigo-400 font-mono text-[11px]">[{a.ticketNumber}]</span>{' '}
                    {a.assignedFeature}
                  </div>

                  <p className="text-slate-300 text-[11px] bg-slate-900/60 p-2.5 rounded-lg border border-slate-800/80">
                    {a.summary}
                  </p>

                  {a.blockers && !a.blockers.toLowerCase().includes('none') && (
                    <div className="p-2 rounded-lg bg-amber-500/10 border border-amber-500/20 text-amber-300 text-[11px]">
                      <strong>Blocker:</strong> {a.blockers}
                    </div>
                  )}

                  <div className="flex items-center justify-between pt-1 text-[11px] text-slate-400">
                    <span>Submitted by {a.studentName}</span>
                    {a.commitUrl && (
                      <a
                        href={a.commitUrl.startsWith('http') ? a.commitUrl : `https://github.com/UIC-CCS-MOBILE-DEVELOPMENT-2026-2027`}
                        target="_blank"
                        rel="noreferrer"
                        className="text-indigo-400 hover:underline flex items-center gap-1 font-mono"
                      >
                        <GitCommit className="w-3 h-3" />
                        <span>Key Commit</span>
                        <ExternalLink className="w-2.5 h-2.5" />
                      </a>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
