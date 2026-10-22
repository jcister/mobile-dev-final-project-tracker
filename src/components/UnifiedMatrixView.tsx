import React, { useMemo, useRef, useState } from 'react';
import * as Tooltip from '@radix-ui/react-tooltip';
import {
  ExternalLink,
  GitCommit,
  User,
  X,
  ShieldCheck,
  Plus,
  Rows3,
  Rows4,
} from 'lucide-react';
import { Team, AuditRecord } from '../types';
import { StatusChip, TONE_DOT, TONE_LABEL, toneOf } from './matrix/StatusChip';
import { ColumnMenu, ColumnDef } from './matrix/ColumnMenu';
import { useLocalStorage } from '../hooks/useLocalStorage';

interface UnifiedMatrixViewProps {
  teams: Team[];
  audits: AuditRecord[];
  onOpenTeam: (team: Team) => void;
  onOpenAddAudit?: (prefill: { teamId?: string; studentName?: string; weekNumber?: number }) => void;
  onOpenAddTeam?: () => void;
  isAdmin?: boolean;
}

const WEEKS = [
  { num: 1, label: 'W1', title: 'Ideation' },
  { num: 2, label: 'W2', title: 'Wireframes' },
  { num: 3, label: 'W3', title: 'Architecture' },
  { num: 4, label: 'W4', title: 'Scaffolding' },
  { num: 5, label: 'W5', title: 'Initial Code' },
  { num: 6, label: 'W6', title: 'Backend / DB' },
  { num: 7, label: 'W7', title: 'UI Features' },
  { num: 8, label: 'W8', title: 'Final MVP' },
];

const COLUMNS: ColumnDef[] = [
  { key: 'meta', label: 'Readiness / Section' },
  ...WEEKS.map((w) => ({
    key: `w${w.num}`,
    label: `${w.label} · ${w.title}`,
    group: w.num <= 4 ? 'Weeks 1–4' : 'Weeks 5–8',
  })),
];

export const UnifiedMatrixView: React.FC<UnifiedMatrixViewProps> = ({
  teams,
  audits,
  onOpenTeam,
  onOpenAddAudit,
  onOpenAddTeam,
  isAdmin = false,
}) => {
  const [viewMode, setViewMode] = useLocalStorage<'team' | 'student'>('matrix.view.v1', 'team');
  const [hidden, setHidden] = useLocalStorage<Record<string, boolean>>('matrix.cols.v1', {});
  const [density, setDensity] = useLocalStorage<'comfortable' | 'compact'>('matrix.density.v1', 'comfortable');
  const [selectedAudit, setSelectedAudit] = useState<AuditRecord | null>(null);
  const [selectedAuditsGroup, setSelectedAuditsGroup] = useState<AuditRecord[]>([]);
  const scrollRef = useRef<HTMLDivElement>(null);
  const [highlightWeek, setHighlightWeek] = useState<number | null>(null);

  const compact = density === 'compact';
  const visibleWeeks = WEEKS.filter((w) => !hidden[`w${w.num}`]);
  const docWeeks = visibleWeeks.filter((w) => w.num <= 4).length;
  const formWeeks = visibleWeeks.filter((w) => w.num > 4).length;
  const showMeta = !hidden['meta'];
  const cellW = compact ? 84 : 156;
  const firstColW = 224;
  const metaColW = 88;
  const tableWidth = firstColW + (showMeta ? metaColW : 0) + visibleWeeks.length * cellW;
  const cellPad = compact ? 'p-1' : 'p-1.5';

  const allStudents = useMemo(() => {
    const map = new Map<
      string,
      { name: string; studentId: string; githubUsername: string; section: string; teamName: string; teamId: string }
    >();
    audits.forEach((a) => {
      if (a.studentName && !map.has(a.studentName)) {
        map.set(a.studentName, {
          name: a.studentName,
          studentId: a.studentId,
          githubUsername: a.githubUsername,
          section: a.section,
          teamName: a.teamName,
          teamId: a.teamId,
        });
      }
    });
    return Array.from(map.values()).sort((a, b) => a.name.localeCompare(b.name));
  }, [audits]);

  const openGroup = (group: AuditRecord[], current: AuditRecord) => {
    setSelectedAuditsGroup(group);
    setSelectedAudit(current);
  };
  const closeDrawer = () => {
    setSelectedAudit(null);
    setSelectedAuditsGroup([]);
  };

  const jumpToWeek = (num: number) => {
    const box = scrollRef.current;
    const el = box?.querySelector<HTMLElement>(`[data-week="${num}"]`);
    if (!box || !el) return;

    // Scroll only the matrix box, leaving room for the sticky Team (+ meta) columns.
    const boxRect = box.getBoundingClientRect();
    const elRect = el.getBoundingClientRect();
    const stickyW = firstColW + (showMeta ? metaColW : 0);
    const target = box.scrollLeft + (elRect.left - boxRect.left) - stickyW - 8;
    box.scrollTo({ left: Math.max(0, target), behavior: 'smooth' });

    // Make sure the matrix itself is on screen, then flash the column.
    box.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    setHighlightWeek(num);
    window.setTimeout(() => setHighlightWeek((cur) => (cur === num ? null : cur)), 1400);
  };

  const renderEmptyCell = (prefill: { teamId?: string; studentName?: string; weekNumber: number }, label: string) =>
    isAdmin && onOpenAddAudit ? (
      <button
        type="button"
        onClick={() => onOpenAddAudit(prefill)}
        title={`Log ${label} · Week ${prefill.weekNumber}`}
        className="w-full h-8 rounded-lg border border-dashed border-slate-800 text-slate-600 hover:border-indigo-500/50 hover:text-indigo-300 flex items-center justify-center transition"
      >
        <Plus className="w-3.5 h-3.5" />
      </button>
    ) : (
      <div className="w-full h-8 rounded-lg border border-dashed border-slate-800/70 flex items-center justify-center select-none">
        <span className="w-1.5 h-1.5 rounded-full bg-slate-700" />
      </div>
    );

  const stickyFirst = 'sticky left-0 z-20 bg-slate-900 shadow-[1px_0_0_0_#1e293b]';

  return (
    <Tooltip.Provider>
      <div className="space-y-3">
        {/* Disclosure & Quick Action Links Banner */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-3 sm:p-4 text-xs text-slate-300 space-y-2.5">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-2.5">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="font-semibold text-white text-sm">Grading & Milestone Disclosure</span>
                <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-indigo-500/15 text-indigo-300 border border-indigo-500/30">
                  Academic Policy
                </span>
              </div>
              <p className="text-slate-400 text-[11px] leading-relaxed">
                <strong className="text-amber-300 font-medium">Weeks 1–4 (Midterm):</strong> Sourced from individual progress report submissions in Google Classroom; counted towards your midterm grade.{' '}
                <strong className="text-emerald-300 font-medium">Weeks 5–8 (Final Term):</strong> Recorded exclusively for the final term via weekly Google Form audits and active GitHub Kanban boards.
              </p>
            </div>

            {/* Quick Links for Students */}
            <div className="flex flex-wrap items-center gap-2 shrink-0">
              <a
                href="https://docs.google.com/forms/d/1UpePK5pjkXIr67T3zpSHIVKRHRYucYzVKEcHJGAxSvE/edit"
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-600/90 hover:bg-emerald-600 text-white font-medium text-xs shadow-sm transition active:scale-95"
                title="Fill out or update your progress report form"
              >
                <ExternalLink className="w-3.5 h-3.5" />
                <span>Submit / Update Form</span>
              </a>

              <a
                href="https://github.com/UIC-CCS-MOBILE-DEVELOPMENT-2026-2027"
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white border border-slate-700 font-medium text-xs transition active:scale-95"
                title="Open GitHub Organization for Mobile Dev Projects"
              >
                <GitCommit className="w-3.5 h-3.5 text-indigo-400" />
                <span>GitHub Org</span>
                <ExternalLink className="w-3 h-3 text-slate-400" />
              </a>
            </div>
          </div>
        </div>

        {/* Toolbar */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-3 sm:p-4 flex flex-col lg:flex-row lg:items-center justify-between gap-3">
          <div className="min-w-0">
            <h2 className="text-base font-bold text-white tracking-tight">Weeks 1–8 Progress Matrix</h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Midterm Reports (Weeks 1–4) &amp; Final Term Google Form Kanban Audits (Weeks 5–8).
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <div className="flex items-center bg-slate-950 p-1 rounded-lg border border-slate-800 text-xs">
              {(['team', 'student'] as const).map((m) => (
                <button
                  key={m}
                  onClick={() => setViewMode(m)}
                  className={`px-3 py-1.5 rounded-md font-semibold transition ${
                    viewMode === m ? 'bg-indigo-500 text-white' : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  {m === 'team' ? `Teams (${teams.length})` : `Students (${allStudents.length})`}
                </button>
              ))}
            </div>

            <div className="flex items-center bg-slate-950 p-1 rounded-lg border border-slate-800">
              <button
                title="Comfortable density"
                onClick={() => setDensity('comfortable')}
                className={`p-1.5 rounded-md transition ${
                  !compact ? 'bg-slate-800 text-white' : 'text-slate-500 hover:text-slate-200'
                }`}
              >
                <Rows3 className="w-4 h-4" />
              </button>
              <button
                title="Compact density"
                onClick={() => setDensity('compact')}
                className={`p-1.5 rounded-md transition ${
                  compact ? 'bg-slate-800 text-white' : 'text-slate-500 hover:text-slate-200'
                }`}
              >
                <Rows4 className="w-4 h-4" />
              </button>
            </div>

            <ColumnMenu columns={COLUMNS} hidden={hidden} onChange={setHidden} />

            {isAdmin && onOpenAddAudit && (
              <button
                onClick={() => onOpenAddAudit({})}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-700 text-xs font-semibold transition"
              >
                <Plus className="w-3.5 h-3.5 text-indigo-400" />
                Log Audit
              </button>
            )}
            {isAdmin && onOpenAddTeam && (
              <button
                onClick={onOpenAddTeam}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-indigo-500 hover:bg-indigo-400 text-white text-xs font-semibold transition"
              >
                <Plus className="w-3.5 h-3.5" />
                Add Team
              </button>
            )}
          </div>
        </div>

        {/* Legend + week jump */}
        <div className="flex flex-wrap items-center justify-between gap-2 px-1 text-[11px] text-slate-400">
          <div className="flex items-center gap-4">
            {(['ok', 'wip', 'warn', 'none'] as const).map((t) => (
              <span key={t} className="flex items-center gap-1.5">
                <span className={`w-2 h-2 rounded-full ${TONE_DOT[t]}`} />
                {TONE_LABEL[t]}
              </span>
            ))}
          </div>
          <div className="flex items-center gap-1">
            <span className="mr-1 text-slate-500">Jump to</span>
            {visibleWeeks.map((w) => (
              <button
                key={w.num}
                onClick={() => jumpToWeek(w.num)}
                className="px-1.5 py-0.5 rounded bg-slate-900 border border-slate-800 text-slate-300 hover:text-white hover:border-slate-600 font-mono"
              >
                {w.label}
              </button>
            ))}
          </div>
        </div>

        {/* Matrix: its own scroll container so both scrollbars are always on-screen */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden">
          <div
            ref={scrollRef}
            className="matrix-scroll overflow-auto max-h-[calc(100vh-17rem)] min-h-[16rem]"
          >
            <table
              className="text-left text-xs border-separate border-spacing-0"
              style={{ tableLayout: 'fixed', width: tableWidth, minWidth: '100%' }}
            >
              <colgroup>
                <col style={{ width: firstColW }} />
                {showMeta && <col style={{ width: metaColW }} />}
                {visibleWeeks.map((w) => (
                  <col key={w.num} style={{ width: cellW }} />
                ))}
              </colgroup>
              <thead className="sticky top-0 z-30">
                <tr className="bg-slate-950 text-[10px] uppercase tracking-wider text-slate-500">
                  <th
                    rowSpan={2}
                    className={`sticky left-0 z-40 bg-slate-950 p-3 w-56 min-w-[14rem] border-b border-slate-800 shadow-[1px_0_0_0_#1e293b] text-slate-300 normal-case text-xs`}
                  >
                    {viewMode === 'team' ? 'Team' : 'Student'}
                  </th>
                  {showMeta && (
                    <th rowSpan={2} className="p-2 text-center border-b border-slate-800 min-w-[84px] normal-case text-xs text-slate-300">
                      {viewMode === 'team' ? 'Readiness' : 'Section'}
                    </th>
                  )}
                  {docWeeks > 0 && (
                    <th colSpan={docWeeks} className="p-1.5 text-center border-b border-l border-slate-800 bg-slate-950">
                      Documents · W1–4
                    </th>
                  )}
                  {formWeeks > 0 && (
                    <th colSpan={formWeeks} className="p-1.5 text-center border-b border-l border-slate-800 bg-slate-950">
                      Forms &amp; Kanban · W5–8
                    </th>
                  )}
                </tr>
                <tr className="bg-slate-950 text-slate-300 text-[11px]">
                  {visibleWeeks.map((w) => (
                    <th
                      key={w.num}
                      data-week={w.num}
                      className={`${cellPad} text-center border-b border-slate-800 transition-colors duration-300 ${
                        highlightWeek === w.num ? 'bg-indigo-500/30 text-white' : ''
                      } ${
                        w.num === 5 || w.num === visibleWeeks[0]?.num ? 'border-l' : ''
                      } font-semibold`}
                    >
                      <span className="font-mono">{w.label}</span>
                      {!compact && <span className="block text-[10px] font-normal text-slate-500">{w.title}</span>}
                    </th>
                  ))}
                </tr>
              </thead>

              <tbody>
                {viewMode === 'team'
                  ? teams.map((team) => (
                      <tr key={team.id} className="group">
                        <td className={`${stickyFirst} p-3 border-b border-slate-800 group-hover:bg-slate-800`}>
                          <button
                            onClick={() => onOpenTeam(team)}
                            className="font-semibold text-white hover:text-indigo-300 transition text-left text-xs line-clamp-1"
                          >
                            {team.name}
                          </button>
                          <div className="flex items-center gap-2 mt-0.5 text-[11px] text-slate-400">
                            <span className="font-mono">{team.section}</span>
                            <span>· {team.members.length} members</span>
                          </div>
                        </td>

                        {showMeta && (
                          <td className="p-2 border-b border-slate-800 group-hover:bg-slate-800/40">
                            <div className="flex flex-col items-center gap-1">
                              <span className={`font-semibold text-[11px] ${team.readinessScore < 60 ? 'text-amber-400' : 'text-slate-200'}`}>
                                {team.readinessScore}%
                              </span>
                              <span className="w-12 h-1 rounded-full bg-slate-800 overflow-hidden">
                                <span
                                  className="block h-full bg-indigo-400"
                                  style={{ width: `${Math.min(100, Math.max(0, team.readinessScore))}%` }}
                                />
                              </span>
                            </div>
                          </td>
                        )}

                        {visibleWeeks.map((w) => {
                          const weekAudits = audits.filter((a) => a.teamId === team.id && a.weekNumber === w.num);
                          return (
                            <td
                              key={w.num}
                              className={`${cellPad} border-b border-slate-800 align-middle group-hover:bg-slate-800/40 ${
                                w.num === 5 ? 'border-l border-l-slate-800' : ''
                              }`}
                            >
                              {weekAudits.length > 0 ? (
                                <StatusChip audits={weekAudits} compact={compact} onSelect={openGroup} />
                              ) : (
                                renderEmptyCell({ teamId: team.id, weekNumber: w.num }, team.name)
                              )}
                            </td>
                          );
                        })}
                      </tr>
                    ))
                  : allStudents.map((st) => (
                      <tr key={st.name} className="group">
                        <td className={`${stickyFirst} p-3 border-b border-slate-800 group-hover:bg-slate-800`}>
                          <div className="font-semibold text-white text-xs">{st.name}</div>
                          <div className="text-[11px] text-indigo-300 truncate mt-0.5">{st.teamName}</div>
                          <div className="flex items-center gap-2 mt-0.5 text-[10px] text-slate-500 font-mono">
                            <span>{st.studentId}</span>
                            {st.githubUsername && <span>@{st.githubUsername.replace('@', '')}</span>}
                          </div>
                        </td>

                        {showMeta && (
                          <td className="p-2 text-center border-b border-slate-800 text-[11px] text-slate-400 font-mono group-hover:bg-slate-800/40">
                            {st.section}
                          </td>
                        )}

                        {visibleWeeks.map((w) => {
                          const audit = audits.find((a) => a.studentName === st.name && a.weekNumber === w.num);
                          return (
                            <td
                              key={w.num}
                              className={`${cellPad} border-b border-slate-800 align-middle group-hover:bg-slate-800/40 ${
                                w.num === 5 ? 'border-l border-l-slate-800' : ''
                              }`}
                            >
                              {audit ? (
                                <StatusChip audits={[audit]} compact={compact} onSelect={openGroup} />
                              ) : (
                                renderEmptyCell(
                                  { teamId: st.teamId, studentName: st.name, weekNumber: w.num },
                                  st.name
                                )
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

        {/* Drawer: individual report inspection */}
        {selectedAudit && (
          <div
            className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4"
            onClick={closeDrawer}
          >
            <div
              className="bg-slate-900 border border-slate-800 rounded-2xl max-w-xl w-full max-h-[90vh] overflow-y-auto p-6 shadow-2xl text-slate-200 space-y-4"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-start justify-between pb-3 border-b border-slate-800">
                <div>
                  <div className="flex items-center gap-2 text-[11px] font-mono text-slate-400">
                    <span className="px-2 py-0.5 rounded bg-slate-800 border border-slate-700 text-slate-300 uppercase">
                      {selectedAudit.sourceType === 'document' ? 'Document report' : 'Form audit'}
                    </span>
                    <span>Week {selectedAudit.weekNumber}</span>
                  </div>
                  <h3 className="text-base font-bold text-white mt-1">
                    {selectedAudit.assignedFeature || 'Progress Report'}
                  </h3>
                </div>
                <button
                  onClick={closeDrawer}
                  className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800"
                  aria-label="Close"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {selectedAuditsGroup.length > 1 && (
                <div className="bg-slate-950 p-2.5 rounded-xl border border-slate-800">
                  <div className="text-[11px] text-slate-400 mb-2">
                    {selectedAuditsGroup.length} team members reported this week — pick an author:
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {selectedAuditsGroup.map((sub, idx) => {
                      const isCurrent = sub.id ? sub.id === selectedAudit.id : sub.studentName === selectedAudit.studentName;
                      return (
                        <button
                          key={sub.id || idx}
                          type="button"
                          onClick={() => setSelectedAudit(sub)}
                          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition border ${
                            isCurrent
                              ? 'bg-indigo-500 border-indigo-500 text-white'
                              : 'bg-slate-900 border-slate-800 text-slate-300 hover:bg-slate-800'
                          }`}
                        >
                          <User className="w-3.5 h-3.5" />
                          {sub.studentName}
                          <span className={`w-1.5 h-1.5 rounded-full ${TONE_DOT[toneOf(sub)]}`} />
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              <div className="grid grid-cols-2 gap-3 text-xs">
                <div className="bg-slate-950 p-2.5 rounded-xl border border-slate-800">
                  <span className="text-slate-500 text-[10px] uppercase font-bold">Author</span>
                  <div className="text-white font-medium mt-0.5">{selectedAudit.studentName}</div>
                  <div className="text-slate-400 text-[11px] truncate">{selectedAudit.studentEmail}</div>
                </div>
                <div className="bg-slate-950 p-2.5 rounded-xl border border-slate-800">
                  <span className="text-slate-500 text-[10px] uppercase font-bold">Team</span>
                  <div className="text-indigo-300 font-medium mt-0.5 truncate">{selectedAudit.teamName}</div>
                  <div className="text-slate-400 text-[11px] font-mono">{selectedAudit.section}</div>
                </div>
                <div className="bg-slate-950 p-2.5 rounded-xl border border-slate-800">
                  <span className="text-slate-500 text-[10px] uppercase font-bold">Kanban status</span>
                  <div className="mt-0.5 flex items-center gap-1.5 font-semibold text-white">
                    <span className={`w-2 h-2 rounded-full ${TONE_DOT[toneOf(selectedAudit)]}`} />
                    {selectedAudit.ticketStatus}
                  </div>
                  <div className="text-slate-400 text-[11px] font-mono">{selectedAudit.ticketNumber}</div>
                </div>
                <div className="bg-slate-950 p-2.5 rounded-xl border border-slate-800">
                  <span className="text-slate-500 text-[10px] uppercase font-bold">GitHub</span>
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

              <div>
                <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">
                  Summary of work accomplished
                </h4>
                <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 text-xs text-slate-200 whitespace-pre-wrap leading-relaxed">
                  {selectedAudit.summary || 'No detailed accomplishments logged.'}
                </div>
              </div>

              <div>
                <h4 className="text-xs font-semibold text-amber-400 uppercase tracking-wider mb-1">
                  Roadblocks &amp; blockers
                </h4>
                <div className="bg-amber-500/10 border border-amber-500/20 p-3 rounded-xl text-xs text-amber-200 whitespace-pre-wrap leading-relaxed">
                  {selectedAudit.blockers || 'No blockers reported for this milestone.'}
                </div>
              </div>

              {selectedAudit.commitUrl && (
                <div className="pt-1">
                  <a
                    href={
                      selectedAudit.commitUrl.startsWith('http')
                        ? selectedAudit.commitUrl
                        : `https://github.com/UIC-CCS-MOBILE-DEVELOPMENT-2026-2027`
                    }
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-2 px-3 py-2 rounded-lg bg-indigo-500 hover:bg-indigo-400 text-white text-xs font-semibold transition"
                  >
                    <GitCommit className="w-4 h-4" />
                    <span>Inspect key commit on GitHub</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </Tooltip.Provider>
  );
};
