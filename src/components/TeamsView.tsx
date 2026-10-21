import React from 'react';
import {
  ExternalLink,
  Users,
  GitCommit,
  AlertCircle,
  FolderGit2,
  Calendar,
  Sparkles,
  ChevronRight,
  ShieldCheck,
  CheckCircle2,
  Edit2,
  Trash2,
  Layers,
} from 'lucide-react';
import { Team } from '../types';

interface TeamsViewProps {
  teams: Team[];
  onSelectTeam: (team: Team) => void;
  onOpenDefenseForTeam: (team: Team) => void;
  onOpenKanbanForTeam: (teamId: string) => void;
  onOpenAddTeam?: () => void;
  onEditTeam?: (team: Team) => void;
  onDeleteTeam?: (team: Team) => void;
}

export const TeamsView: React.FC<TeamsViewProps> = ({
  teams,
  onSelectTeam,
  onOpenDefenseForTeam,
  onOpenKanbanForTeam,
  onOpenAddTeam,
  onEditTeam,
  onDeleteTeam,
}) => {
  if (teams.length === 0) {
    return (
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-12 text-center">
        <FolderGit2 className="w-12 h-12 text-slate-600 mx-auto mb-3" />
        <h3 className="text-base font-semibold text-slate-200">No teams match your filter criteria</h3>
        <p className="text-xs text-slate-400 mt-1 max-w-sm mx-auto mb-4">
          Try clearing search filters or changing the class section in the top bar.
        </p>
        {onOpenAddTeam && (
          <button
            onClick={onOpenAddTeam}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold shadow-md transition"
          >
            <Users className="w-4 h-4" />
            <span>+ Register New Team</span>
          </button>
        )}
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-base font-bold text-white tracking-tight">
            Mobile Development Repositories & Teams ({teams.length})
          </h2>
          <p className="text-xs text-slate-400">
            Real-time presentation readiness, GitHub commits, and Kanban board progress across all student groups.
          </p>
        </div>

        {onOpenAddTeam && (
          <button
            onClick={onOpenAddTeam}
            className="self-start sm:self-auto flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold shadow-sm transition active:scale-95"
          >
            <Users className="w-3.5 h-3.5" />
            <span>+ Add Team & Students</span>
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {teams.map((team) => {
          const totalTickets = team.totalTickets || 1;
          const donePercent = Math.round((team.kanbanCounts.done / totalTickets) * 100);

          return (
            <div
              key={team.id}
              className="bg-slate-900 border border-slate-800 rounded-2xl p-5 hover:border-slate-700 transition flex flex-col justify-between shadow-sm group hover:shadow-md"
            >
              <div>
                {/* Header: Status Pill & Section */}
                <div className="flex items-start justify-between gap-2 mb-2.5">
                  <span
                    className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold ${
                      team.healthStatus === 'on_track'
                        ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30'
                        : team.healthStatus === 'needs_attention'
                        ? 'bg-amber-500/15 text-amber-400 border border-amber-500/30'
                        : 'bg-rose-500/15 text-rose-400 border border-rose-500/30'
                    }`}
                  >
                    <span
                      className={`w-1.5 h-1.5 rounded-full ${
                        team.healthStatus === 'on_track'
                          ? 'bg-emerald-400'
                          : team.healthStatus === 'needs_attention'
                          ? 'bg-amber-400'
                          : 'bg-rose-400'
                      }`}
                    />
                    {team.healthStatus === 'on_track'
                      ? 'On Track'
                      : team.healthStatus === 'needs_attention'
                      ? 'Needs Attention'
                      : 'Blocked / Delayed'}
                  </span>

                  <div className="flex items-center gap-1.5">
                    <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700/60">
                      {team.section}
                    </span>
                    {onEditTeam && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onEditTeam(team);
                        }}
                        className="p-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition border border-slate-700"
                        title="Edit Team, Repository & Members"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                    )}
                    {onDeleteTeam && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onDeleteTeam(team);
                        }}
                        className="p-1 rounded-lg bg-slate-800 hover:bg-rose-900/40 text-slate-400 hover:text-rose-400 transition border border-slate-700"
                        title="Delete Team"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                </div>

                {/* Team & App Title */}
                <h3 className="text-base font-bold text-white group-hover:text-indigo-300 transition line-clamp-1">
                  {team.name}
                </h3>
                <p className="text-xs text-slate-400 mt-1 line-clamp-2">
                  {team.appDescription}
                </p>

                {/* GitHub Repository & Live Kanban Link */}
                <div className="mt-3 flex flex-wrap items-center gap-2">
                  <a
                    href={team.githubRepoUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1 text-xs font-mono text-indigo-400 hover:text-indigo-300 hover:underline truncate max-w-full"
                    title="Open GitHub Repository"
                  >
                    <FolderGit2 className="w-3.5 h-3.5 shrink-0" />
                    <span className="truncate">{team.repoName}</span>
                    <ExternalLink className="w-3 h-3 shrink-0 opacity-70" />
                  </a>

                  {team.kanbanUrl && (
                    <a
                      href={team.kanbanUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-1 text-[11px] font-medium text-emerald-400 hover:text-emerald-300 hover:underline bg-emerald-500/10 px-2 py-0.5 rounded-md border border-emerald-500/20"
                      title="Open Team GitHub Projects / Kanban Board"
                    >
                      <Layers className="w-3 h-3 shrink-0" />
                      <span>Live Kanban</span>
                      <ExternalLink className="w-2.5 h-2.5 opacity-70" />
                    </a>
                  )}
                </div>

                {/* Members List */}
                <div className="mt-4 pt-3 border-t border-slate-800">
                  <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
                    <span className="flex items-center gap-1 font-medium">
                      <Users className="w-3.5 h-3.5 text-slate-400" />
                      Team Members ({team.members.length})
                    </span>
                    <span className="text-[10px] text-slate-500 font-mono">
                      Weeks: {team.weeksLogged.map((w) => `W${w}`).join(', ')}
                    </span>
                  </div>
                  <div className="space-y-1.5">
                    {team.members.map((m, idx) => (
                      <div
                        key={idx}
                        className="flex items-center justify-between text-xs bg-slate-950/40 px-2.5 py-1.5 rounded-lg border border-slate-800/80"
                      >
                        <div className="truncate flex items-center gap-1.5">
                          <span className="w-5 h-5 rounded-full bg-slate-800 text-slate-300 flex items-center justify-center text-[10px] font-bold">
                            {m.name.charAt(0)}
                          </span>
                          <span className="font-medium text-slate-200 truncate">{m.name}</span>
                        </div>
                        {m.githubUsername && (
                          <span className="text-[11px] font-mono text-slate-400 hover:text-indigo-300 hover:underline shrink-0 flex items-center gap-1">
                            <a
                              href={`https://github.com/${m.githubUsername.replace('@', '')}`}
                              target="_blank"
                              rel="noreferrer"
                            >
                              @{m.githubUsername.replace('@', '')}
                            </a>
                            {m.hasAcceptedOrg && (
                              <span title="Verified Org Member">
                                <ShieldCheck className="w-3 h-3 text-emerald-400" />
                              </span>
                            )}
                          </span>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Mini Kanban Velocity */}
                <div className="mt-4 pt-3 border-t border-slate-800">
                  <div className="flex items-center justify-between text-xs mb-1.5">
                    <span className="text-slate-400 font-medium">Kanban Progress</span>
                    <span className="font-mono text-slate-200 font-bold">
                      {team.kanbanCounts.done} / {team.totalTickets} Done ({donePercent}%)
                    </span>
                  </div>
                  <div className="flex gap-1 h-2 rounded-full overflow-hidden bg-slate-800">
                    <div
                      className="bg-emerald-500"
                      style={{ width: `${(team.kanbanCounts.done / totalTickets) * 100}%` }}
                      title={`Done: ${team.kanbanCounts.done}`}
                    />
                    <div
                      className="bg-blue-500"
                      style={{ width: `${(team.kanbanCounts.inProgress / totalTickets) * 100}%` }}
                      title={`In Progress: ${team.kanbanCounts.inProgress}`}
                    />
                    <div
                      className="bg-slate-600"
                      style={{ width: `${(team.kanbanCounts.backlog / totalTickets) * 100}%` }}
                      title={`Backlog: ${team.kanbanCounts.backlog}`}
                    />
                  </div>
                  <div className="mt-1 flex items-center justify-between text-[10px] text-slate-500">
                    <span className="text-emerald-400">Done ({team.kanbanCounts.done})</span>
                    <span className="text-blue-400">Coding ({team.kanbanCounts.inProgress})</span>
                    <span className="text-slate-400">Backlog ({team.kanbanCounts.backlog})</span>
                  </div>
                </div>

                {/* Technical Blockers Notice if any */}
                {team.unresolvedBlockers.length > 0 && (
                  <div className="mt-3 p-2 rounded-xl bg-amber-500/10 border border-amber-500/20 text-xs text-amber-200">
                    <div className="flex items-start gap-1.5">
                      <AlertCircle className="w-3.5 h-3.5 text-amber-400 shrink-0 mt-0.5" />
                      <div className="text-[11px] line-clamp-2">
                        <span className="font-semibold text-amber-300">Logged Challenge: </span>
                        {team.unresolvedBlockers[0]}
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Bottom Actions */}
              <div className="mt-5 pt-3 border-t border-slate-800 flex items-center justify-between gap-2">
                <div className="flex items-center gap-1.5">
                  <div className="text-center">
                    <div className="text-xs text-slate-400 font-medium">Readiness</div>
                    <div className="text-sm font-bold text-white">{team.readinessScore}%</div>
                  </div>
                </div>

                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => onOpenKanbanForTeam(team.id)}
                    className="px-2.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold border border-slate-700 transition"
                    title="View Team Kanban Board"
                  >
                    Kanban
                  </button>

                  <button
                    onClick={() => onOpenDefenseForTeam(team)}
                    className="p-1.5 rounded-lg bg-purple-600/20 hover:bg-purple-600/30 text-purple-300 border border-purple-500/30 transition"
                    title="Generate Oral Defense Questions (Gemini AI)"
                  >
                    <Sparkles className="w-4 h-4 text-purple-300" />
                  </button>

                  <button
                    onClick={() => onSelectTeam(team)}
                    className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold shadow-sm transition"
                  >
                    <span>Details</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
