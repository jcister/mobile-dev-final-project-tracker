import React, { useState } from 'react';
import {
  FileText,
  FormInput,
  CheckCircle2,
  Clock,
  AlertTriangle,
  XCircle,
  ExternalLink,
  GitCommit,
  User,
  FolderGit2,
  HelpCircle,
  X,
  ChevronRight,
  ShieldCheck,
  Plus,
} from 'lucide-react';
import { Team, AuditRecord } from '../types';

interface UnifiedMatrixViewProps {
  teams: Team[];
  audits: AuditRecord[];
  onOpenTeam: (team: Team) => void;
  onOpenAddAudit?: (prefill: { teamId?: string; studentName?: string; weekNumber?: number }) => void;
  onOpenAddTeam?: () => void;
}

export const UnifiedMatrixView: React.FC<UnifiedMatrixViewProps> = ({
  teams,
  audits,
  onOpenTeam,
  onOpenAddAudit,
  onOpenAddTeam,
}) => {
  const [viewMode, setViewMode] = useState<'team' | 'student'>('team');
  const [selectedAudit, setSelectedAudit] = useState<AuditRecord | null>(null);

  const weeks = [
    { num: 1, label: 'W1: Ideation', era: 'doc', eraLabel: 'Document Report (PDF/Doc)' },
    { num: 2, label: 'W2: Wireframes', era: 'doc', eraLabel: 'Document Report (PDF/Doc)' },
    { num: 3, label: 'W3: Architecture', era: 'doc', eraLabel: 'Document Report (PDF/Doc)' },
    { num: 4, label: 'W4: Scaffolding', era: 'doc', eraLabel: 'Document Report (PDF/Doc)' },
    { num: 5, label: 'W5: Initial Code', era: 'form', eraLabel: 'Google Form + Kanban' },
    { num: 6, label: 'W6: Backend / DB', era: 'form', eraLabel: 'Google Form + Kanban' },
    { num: 7, label: 'W7: UI Features', era: 'form', eraLabel: 'Google Form + Kanban' },
    { num: 8, label: 'W8: Final MVP', era: 'form', eraLabel: 'Google Form + Kanban' },
  ];

  // Group unique students for the student view
  const allStudents = React.useMemo(() => {
    const map = new Map<string, {
      name: string;
      studentId: string;
      email: string;
      githubUsername: string;
      section: string;
      teamName: string;
      teamId: string;
    }>();

    audits.forEach((a) => {
      if (a.studentName && !map.has(a.studentName)) {
        map.set(a.studentName, {
          name: a.studentName,
          studentId: a.studentId,
          email: a.studentEmail,
          githubUsername: a.githubUsername,
          section: a.section,
          teamName: a.teamName,
          teamId: a.teamId,
        });
      }
    });

    return Array.from(map.values()).sort((a, b) => a.name.localeCompare(b.name));
  }, [audits]);

  const getTeamAuditForWeek = (teamId: string, weekNum: number): AuditRecord[] => {
    return audits.filter((a) => a.teamId === teamId && a.weekNumber === weekNum);
  };

  const getStudentAuditForWeek = (studentName: string, weekNum: number): AuditRecord | undefined => {
    return audits.find((a) => a.studentName === studentName && a.weekNumber === weekNum);
  };

  return (
    <div className="space-y-4">
      {/* Top Controls & Legend */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3 shadow-sm">
        <div>
          <h2 className="text-base font-bold text-white tracking-tight flex items-center gap-2">
            <span>Unified Weeks 1–8 Progression Matrix</span>
            <span className="text-xs font-normal text-indigo-400 bg-indigo-500/10 px-2 py-0.5 rounded border border-indigo-500/20">
              Cross-Platform Unification
            </span>
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Synchronizes pre-Kanban document format reports (Weeks 1–4) with Google Form audit responses & Kanban tickets (Weeks 5–8).
          </p>
        </div>

        {/* View Mode Toggle & Action Buttons */}
        <div className="flex flex-wrap items-center gap-2">
          <div className="flex items-center bg-slate-950 p-1 rounded-xl border border-slate-800 text-xs">
            <button
              onClick={() => setViewMode('team')}
              className={`px-3 py-1.5 rounded-lg font-semibold transition ${
                viewMode === 'team'
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Group by Team ({teams.length})
            </button>
            <button
              onClick={() => setViewMode('student')}
              className={`px-3 py-1.5 rounded-lg font-semibold transition ${
                viewMode === 'student'
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              All Students ({allStudents.length})
            </button>
          </div>

          {onOpenAddAudit && (
            <button
              onClick={() => onOpenAddAudit({})}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-semibold transition"
            >
              <Plus className="w-3.5 h-3.5 text-indigo-400" />
              <span>Log Audit</span>
            </button>
          )}

          {onOpenAddTeam && (
            <button
              onClick={onOpenAddTeam}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold shadow-sm transition"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Team</span>
            </button>
          )}
        </div>
      </div>

      {/* Eras Guide & Status Legend */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
        <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-3 flex items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-lg bg-amber-500/10 text-amber-400">
              <FileText className="w-4 h-4" />
            </span>
            <div>
              <span className="font-semibold text-slate-200">Weeks 1–4: Document Reports Era</span>
              <p className="text-[11px] text-slate-400">PDF / Formatted progress reports before Kanban board creation</p>
            </div>
          </div>
        </div>

        <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-3 flex items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-lg bg-emerald-500/10 text-emerald-400">
              <FormInput className="w-4 h-4" />
            </span>
            <div>
              <span className="font-semibold text-slate-200">Weeks 5–8: Google Forms & Kanban Era</span>
              <p className="text-[11px] text-slate-400">Weekly audit forms mapped with live GitHub issues & Git commits</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Matrix Table */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              {/* Header row 1: Eras */}
              <tr className="bg-slate-950/80 border-b border-slate-800 text-[11px] text-slate-400">
                <th className="p-3 w-64 border-r border-slate-800" rowSpan={2}>
                  {viewMode === 'team' ? 'Team & Repository' : 'Student & Team'}
                </th>
                <th className="p-2 text-center border-r border-slate-800" rowSpan={2}>
                  Readiness
                </th>
                <th colSpan={4} className="p-2 text-center font-bold text-amber-400 bg-amber-500/5 border-r border-slate-800">
                  <div className="flex items-center justify-center gap-1">
                    <FileText className="w-3 h-3" />
                    <span>Weeks 1–4: Document Format Reports (Pre-Kanban)</span>
                  </div>
                </th>
                <th colSpan={4} className="p-2 text-center font-bold text-emerald-400 bg-emerald-500/5">
                  <div className="flex items-center justify-center gap-1">
                    <FormInput className="w-3 h-3" />
                    <span>Weeks 5–8: Google Forms & GitHub Kanban Audits</span>
                  </div>
                </th>
              </tr>

              {/* Header row 2: Weeks */}
              <tr className="bg-slate-950 border-b border-slate-800 text-slate-300 font-mono text-[11px]">
                {weeks.map((w) => (
                  <th
                    key={w.num}
                    className={`p-2 text-center min-w-[110px] border-r border-slate-800/80 ${
                      w.num <= 4 ? 'bg-amber-500/5' : 'bg-emerald-500/5'
                    }`}
                  >
                    <div>{w.label}</div>
                  </th>
                ))}
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-800">
              {viewMode === 'team'
                ? teams.map((team) => (
                    <tr key={team.id} className="hover:bg-slate-800/40 transition">
                      {/* Team Info Cell */}
                      <td className="p-3 border-r border-slate-800">
                        <div className="flex items-start justify-between gap-1">
                          <div>
                            <button
                              onClick={() => onOpenTeam(team)}
                              className="font-bold text-white hover:text-indigo-300 transition text-left text-xs line-clamp-1"
                            >
                              {team.name}
                            </button>
                            <div className="flex items-center gap-2 mt-0.5 text-[11px] text-slate-400">
                              <span className="font-mono text-[10px] px-1.5 py-0.2 rounded bg-slate-800 text-slate-300">
                                {team.section}
                              </span>
                              <span>{team.members.length} members</span>
                            </div>
                          </div>
                        </div>
                      </td>

                      {/* Readiness Score Cell */}
                      <td className="p-2 text-center border-r border-slate-800">
                        <span
                          className={`inline-block px-2 py-0.5 rounded-full font-bold text-[11px] ${
                            team.readinessScore >= 80
                              ? 'bg-emerald-500/15 text-emerald-400'
                              : team.readinessScore >= 60
                              ? 'bg-amber-500/15 text-amber-400'
                              : 'bg-rose-500/15 text-rose-400'
                          }`}
                        >
                          {team.readinessScore}%
                        </span>
                      </td>

                      {/* 8 Weeks Cells */}
                      {weeks.map((w) => {
                        const weekAudits = getTeamAuditForWeek(team.id, w.num);
                        const hasAudit = weekAudits.length > 0;
                        const latest = weekAudits[0];

                        let statusColor = 'bg-slate-900 border-slate-800 text-slate-500';
                        if (hasAudit) {
                          const anyDone = weekAudits.some((a) => a.ticketStatus === 'Done');
                          const anyInProgress = weekAudits.some((a) => a.ticketStatus === 'In Progress');
                          const anyBlocker = weekAudits.some((a) => a.blockers && !a.blockers.toLowerCase().includes('none'));

                          if (anyBlocker && !anyDone) {
                            statusColor = 'bg-rose-950/40 border-rose-800/80 text-rose-300 hover:bg-rose-900/50';
                          } else if (anyDone) {
                            statusColor = 'bg-emerald-950/40 border-emerald-800/80 text-emerald-300 hover:bg-emerald-900/50';
                          } else if (anyInProgress) {
                            statusColor = 'bg-blue-950/40 border-blue-800/80 text-blue-300 hover:bg-blue-900/50';
                          } else {
                            statusColor = 'bg-amber-950/30 border-amber-800/60 text-amber-300 hover:bg-amber-900/40';
                          }
                        }

                        return (
                          <td
                            key={w.num}
                            className={`p-1.5 border-r border-slate-800/80 ${
                              w.num <= 4 ? 'bg-amber-500/[0.02]' : 'bg-emerald-500/[0.02]'
                            }`}
                          >
                            {hasAudit ? (
                              <button
                                onClick={() => setSelectedAudit(latest)}
                                className={`w-full text-left p-2 rounded-xl border transition shadow-sm ${statusColor}`}
                              >
                                <div className="flex items-center justify-between text-[10px] mb-1 font-mono">
                                  <span className="font-semibold uppercase truncate">
                                    {latest.ticketStatus}
                                  </span>
                                  <span className="text-[9px] opacity-75">
                                    {w.num <= 4 ? '[DOC]' : '[FORM]'}
                                  </span>
                                </div>
                                <div className="text-[11px] font-medium line-clamp-2 text-slate-200">
                                  {latest.assignedFeature || latest.summary}
                                </div>
                                {weekAudits.length > 1 && (
                                  <div className="text-[9px] opacity-75 mt-0.5">
                                    +{weekAudits.length - 1} more submission
                                  </div>
                                )}
                              </button>
                            ) : (
                              <button
                                type="button"
                                onClick={() =>
                                  onOpenAddAudit?.({
                                    teamId: team.id,
                                    weekNumber: w.num,
                                  })
                                }
                                className={`w-full h-14 border border-dashed rounded-xl flex flex-col items-center justify-center p-1 text-center transition cursor-pointer group ${
                                  w.num <= 4
                                    ? 'border-amber-500/30 bg-amber-500/[0.03] text-amber-400/80 hover:border-amber-500/60 hover:bg-amber-500/[0.08]'
                                    : 'border-slate-800/70 text-slate-600 hover:border-slate-700 hover:text-slate-300 hover:bg-slate-800/40'
                                }`}
                                title={`Click to log progress audit for ${team.name} - Week ${w.num}`}
                              >
                                <span className="text-[10px] font-medium group-hover:underline">
                                  {w.num <= 4 ? 'Pending Doc Upload' : 'No Form Audit'}
                                </span>
                                <span className="text-[9px] text-slate-500 font-mono mt-0.5">
                                  {w.num <= 4 ? '+ Log Doc' : '+ Log Audit'}
                                </span>
                              </button>
                            )}
                          </td>
                        );
                      })}
                    </tr>
                  ))
                : allStudents.map((st) => (
                    <tr key={st.name} className="hover:bg-slate-800/40 transition">
                      {/* Student Info Cell */}
                      <td className="p-3 border-r border-slate-800">
                        <div className="font-bold text-white text-xs">{st.name}</div>
                        <div className="text-[11px] text-indigo-400 truncate mt-0.5 font-medium">
                          {st.teamName}
                        </div>
                        <div className="flex items-center gap-2 mt-0.5 text-[10px] text-slate-400 font-mono">
                          <span>{st.studentId}</span>
                          {st.githubUsername && <span>@{st.githubUsername.replace('@', '')}</span>}
                        </div>
                      </td>

                      {/* Section */}
                      <td className="p-2 text-center border-r border-slate-800 text-[11px] text-slate-400 font-mono">
                        {st.section}
                      </td>

                      {/* 8 Weeks Cells */}
                      {weeks.map((w) => {
                        const audit = getStudentAuditForWeek(st.name, w.num);

                        let statusColor = 'bg-slate-900 border-slate-800 text-slate-500';
                        if (audit) {
                          if (audit.ticketStatus === 'Done') {
                            statusColor = 'bg-emerald-950/40 border-emerald-800/80 text-emerald-300 hover:bg-emerald-900/50';
                          } else if (audit.ticketStatus === 'In Progress') {
                            statusColor = 'bg-blue-950/40 border-blue-800/80 text-blue-300 hover:bg-blue-900/50';
                          } else {
                            statusColor = 'bg-amber-950/30 border-amber-800/60 text-amber-300 hover:bg-amber-900/40';
                          }
                        }

                        return (
                          <td
                            key={w.num}
                            className={`p-1.5 border-r border-slate-800/80 ${
                              w.num <= 4 ? 'bg-amber-500/[0.02]' : 'bg-emerald-500/[0.02]'
                            }`}
                          >
                            {audit ? (
                              <button
                                onClick={() => setSelectedAudit(audit)}
                                className={`w-full text-left p-2 rounded-xl border transition shadow-sm ${statusColor}`}
                              >
                                <div className="flex items-center justify-between text-[10px] mb-0.5 font-mono">
                                  <span className="font-semibold uppercase truncate">
                                    {audit.ticketStatus}
                                  </span>
                                  <span className="text-[9px] opacity-75">
                                    {w.num <= 4 ? '[DOC]' : '[FORM]'}
                                  </span>
                                </div>
                                <div className="text-[11px] font-medium line-clamp-2 text-slate-200">
                                  {audit.assignedFeature}
                                </div>
                              </button>
                            ) : (
                              <button
                                type="button"
                                onClick={() =>
                                  onOpenAddAudit?.({
                                    teamId: st.teamId,
                                    studentName: st.name,
                                    weekNumber: w.num,
                                  })
                                }
                                className={`w-full h-12 border border-dashed rounded-xl flex flex-col items-center justify-center text-center p-1 transition cursor-pointer group ${
                                  w.num <= 4
                                    ? 'border-amber-500/20 bg-amber-500/[0.02] text-amber-500/60 hover:border-amber-500/50 hover:bg-amber-500/[0.06] hover:text-amber-400'
                                    : 'border-slate-800/70 text-slate-600 hover:border-slate-700 hover:text-slate-300 hover:bg-slate-800/40'
                                }`}
                                title={`Click to log progress audit for ${st.name} - Week ${w.num}`}
                              >
                                <span className="text-[9px] font-mono group-hover:underline">
                                  {w.num <= 4 ? '+ Log Doc' : '+ Log Audit'}
                                </span>
                              </button>
                            )}
                          </td>
                        );
                      })}
                    </tr>
                  ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Flyout Drawer for Individual Audit Inspection */}
      {selectedAudit && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-xl w-full p-6 shadow-2xl text-slate-200 space-y-4">
            <div className="flex items-start justify-between pb-3 border-b border-slate-800">
              <div>
                <div className="flex items-center gap-2">
                  <span
                    className={`text-[10px] font-mono font-bold uppercase px-2 py-0.5 rounded ${
                      selectedAudit.sourceType === 'document'
                        ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                        : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                    }`}
                  >
                    {selectedAudit.sourceType === 'document' ? 'Document Report (W1-4)' : 'Google Form Audit (W5-8)'}
                  </span>
                  <span className="text-xs font-mono text-slate-400">
                    Week {selectedAudit.weekNumber}
                  </span>
                </div>
                <h3 className="text-base font-bold text-white mt-1">
                  {selectedAudit.assignedFeature || 'Progress Report'}
                </h3>
              </div>
              <button
                onClick={() => setSelectedAudit(null)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="bg-slate-950 p-2.5 rounded-xl border border-slate-800">
                <span className="text-slate-500 text-[10px] uppercase font-bold">Student Author</span>
                <div className="text-white font-medium mt-0.5">{selectedAudit.studentName}</div>
                <div className="text-slate-400 text-[11px]">{selectedAudit.studentEmail}</div>
              </div>
              <div className="bg-slate-950 p-2.5 rounded-xl border border-slate-800">
                <span className="text-slate-500 text-[10px] uppercase font-bold">App & Team</span>
                <div className="text-indigo-400 font-medium mt-0.5 truncate">{selectedAudit.teamName}</div>
                <div className="text-slate-400 text-[11px] font-mono">{selectedAudit.section}</div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="bg-slate-950 p-2.5 rounded-xl border border-slate-800">
                <span className="text-slate-500 text-[10px] uppercase font-bold">Kanban Status</span>
                <div className="text-emerald-400 font-bold mt-0.5">{selectedAudit.ticketStatus}</div>
                <div className="text-slate-400 text-[11px] font-mono">{selectedAudit.ticketNumber}</div>
              </div>
              <div className="bg-slate-950 p-2.5 rounded-xl border border-slate-800">
                <span className="text-slate-500 text-[10px] uppercase font-bold">GitHub Verification</span>
                <div className="text-slate-200 mt-0.5 flex items-center gap-1 font-mono">
                  <span>@{selectedAudit.githubUsername || 'unverified'}</span>
                  {selectedAudit.orgInviteAccepted && (
                    <span title="Verified Org Member">
                      <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* Accomplishments */}
            <div>
              <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">
                Summary of Work Accomplished
              </h4>
              <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 text-xs text-slate-200 whitespace-pre-wrap leading-relaxed">
                {selectedAudit.summary || 'No detailed accomplishments logged.'}
              </div>
            </div>

            {/* Blockers */}
            <div>
              <h4 className="text-xs font-semibold text-amber-400 uppercase tracking-wider mb-1">
                Technical Roadblocks & Blockers
              </h4>
              <div className="bg-amber-500/10 border border-amber-500/20 p-3 rounded-xl text-xs text-amber-200 whitespace-pre-wrap leading-relaxed">
                {selectedAudit.blockers || 'No blockers reported for this milestone.'}
              </div>
            </div>

            {/* Direct Commit Link */}
            {selectedAudit.commitUrl && (
              <div className="pt-2">
                <a
                  href={selectedAudit.commitUrl.startsWith('http') ? selectedAudit.commitUrl : `https://github.com/UIC-CCS-MOBILE-DEVELOPMENT-2026-2027`}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-2 px-3 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold shadow-sm transition"
                >
                  <GitCommit className="w-4 h-4" />
                  <span>Inspect Key Git Commit on GitHub</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
