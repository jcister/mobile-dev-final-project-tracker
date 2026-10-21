import React, { useState } from 'react';
import {
  AlertTriangle,
  CheckCircle2,
  ExternalLink,
  GitCommit,
  FolderGit2,
  User,
  Sparkles,
  MessageSquare,
  ShieldAlert,
  ArrowRight,
} from 'lucide-react';
import { Team, AuditRecord } from '../types';

interface BlockersViewProps {
  teams: Team[];
  audits: AuditRecord[];
  onOpenTeam: (team: Team) => void;
  onOpenDefense: (team: Team) => void;
}

export const BlockersView: React.FC<BlockersViewProps> = ({
  teams,
  audits,
  onOpenTeam,
  onOpenDefense,
}) => {
  const [resolvedIds, setResolvedIds] = useState<Set<string>>(new Set());
  const [notes, setNotes] = useState<{ [id: string]: string }>({});
  const [activeNoteId, setActiveNoteId] = useState<string | null>(null);
  const [tempNoteText, setTempNoteText] = useState('');

  // Extract all audits that contain meaningful blockers
  const blockerAudits = audits.filter(
    (a) =>
      a.blockers &&
      !a.blockers.toLowerCase().includes('none') &&
      !a.blockers.toLowerCase().includes('not yet applicable') &&
      !a.blockers.toLowerCase().includes('no problems faced')
  );

  const toggleResolved = (id: string) => {
    setResolvedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const handleSaveNote = (id: string) => {
    setNotes((prev) => ({ ...prev, [id]: tempNoteText }));
    setActiveNoteId(null);
    setTempNoteText('');
  };

  return (
    <div className="space-y-4">
      {/* View Header */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3 shadow-sm">
        <div>
          <h2 className="text-base font-bold text-white tracking-tight flex items-center gap-2">
            <span className="p-1 rounded-lg bg-amber-500/10 text-amber-400">
              <ShieldAlert className="w-5 h-5" />
            </span>
            <span>Technical Blockers & Risk Radar</span>
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Real-time feed of reported architecture pitfalls, device memory crashes, database sync roadblocks, and emulator issues needing faculty coaching.
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs font-mono">
          <span className="px-2.5 py-1 rounded-lg bg-amber-500/10 text-amber-300 border border-amber-500/20">
            {blockerAudits.length - resolvedIds.size} Active Challenges
          </span>
          <span className="px-2.5 py-1 rounded-lg bg-emerald-500/10 text-emerald-300 border border-emerald-500/20">
            {resolvedIds.size} Faculty Coached
          </span>
        </div>
      </div>

      {/* Blockers Cards List */}
      <div className="space-y-3">
        {blockerAudits.map((item) => {
          const isResolved = resolvedIds.has(item.id);
          const team = teams.find((t) => t.id === item.teamId);

          return (
            <div
              key={item.id}
              className={`rounded-2xl border transition p-4 sm:p-5 shadow-sm ${
                isResolved
                  ? 'bg-slate-950/40 border-slate-800/80 opacity-70'
                  : 'bg-slate-900 border-amber-500/30 hover:border-amber-500/50'
              }`}
            >
              <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-2 pb-3 border-b border-slate-800">
                <div className="flex flex-wrap items-center gap-2">
                  <span
                    className={`text-[10px] font-mono font-bold uppercase px-2 py-0.5 rounded ${
                      isResolved
                        ? 'bg-emerald-500/20 text-emerald-300'
                        : 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                    }`}
                  >
                    {isResolved ? 'Coached / Resolved' : 'Active Roadblock'}
                  </span>
                  <span className="text-xs font-bold text-white">
                    {item.teamName}
                  </span>
                  <span className="text-xs font-mono text-slate-400 px-2 py-0.5 rounded bg-slate-800">
                    Week {item.weekNumber}
                  </span>
                  <span className="text-xs font-mono text-slate-400 px-2 py-0.5 rounded bg-slate-800">
                    {item.section}
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => toggleResolved(item.id)}
                    className={`flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-semibold transition ${
                      isResolved
                        ? 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                        : 'bg-emerald-600/90 hover:bg-emerald-600 text-white shadow-sm'
                    }`}
                  >
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>{isResolved ? 'Mark Active' : 'Mark Resolved'}</span>
                  </button>

                  {team && (
                    <button
                      onClick={() => onOpenDefense(team)}
                      className="p-1 rounded-lg bg-purple-600/20 hover:bg-purple-600/30 text-purple-300 border border-purple-500/30"
                      title="Generate Oral Defense probe questions for this blocker"
                    >
                      <Sparkles className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>

              {/* Main Content */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mt-3">
                {/* Left 2 Cols: Blocker Description & Work Context */}
                <div className="lg:col-span-2 space-y-2">
                  <div>
                    <span className="text-[11px] font-semibold text-amber-400 uppercase tracking-wider">
                      Reported Technical Roadblock
                    </span>
                    <div className="mt-1 p-3 rounded-xl bg-amber-500/10 border border-amber-500/20 text-xs text-amber-200 leading-relaxed font-mono">
                      {item.blockers}
                    </div>
                  </div>

                  <div>
                    <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                      Task Context: {item.assignedFeature}
                    </span>
                    <p className="mt-0.5 text-xs text-slate-300 bg-slate-950/60 p-2.5 rounded-xl border border-slate-800">
                      {item.summary}
                    </p>
                  </div>
                </div>

                {/* Right Col: Student Details & Direct Links */}
                <div className="space-y-2 text-xs bg-slate-950/40 p-3 rounded-xl border border-slate-800/80">
                  <div className="flex items-center justify-between">
                    <span className="text-slate-500 font-medium">Author</span>
                    <span className="text-white font-semibold truncate">{item.studentName}</span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-slate-500 font-medium">GitHub ID</span>
                    <span className="text-indigo-400 font-mono">@{item.githubUsername || 'unlinked'}</span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-slate-500 font-medium">Ticket</span>
                    <span className="text-slate-300 font-mono">{item.ticketNumber}</span>
                  </div>

                  {item.commitUrl && (
                    <div className="pt-2 border-t border-slate-800">
                      <a
                        href={item.commitUrl.startsWith('http') ? item.commitUrl : `https://github.com/UIC-CCS-MOBILE-DEVELOPMENT-2026-2027`}
                        target="_blank"
                        rel="noreferrer"
                        className="flex items-center justify-center gap-1.5 w-full py-1.5 rounded-lg bg-indigo-600/20 hover:bg-indigo-600/30 text-indigo-300 border border-indigo-500/30 font-semibold"
                      >
                        <GitCommit className="w-3.5 h-3.5" />
                        <span>Inspect Commit on GitHub</span>
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    </div>
                  )}

                  {team && (
                    <div>
                      <button
                        onClick={() => onOpenTeam(team)}
                        className="flex items-center justify-center gap-1 w-full py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 font-medium"
                      >
                        <span>Open Team Dossier</span>
                        <ArrowRight className="w-3 h-3" />
                      </button>
                    </div>
                  )}
                </div>
              </div>

              {/* Faculty Advising Note */}
              <div className="mt-3 pt-3 border-t border-slate-800 flex items-center justify-between">
                {activeNoteId === item.id ? (
                  <div className="flex items-center gap-2 w-full">
                    <input
                      type="text"
                      value={tempNoteText}
                      onChange={(e) => setTempNoteText(e.target.value)}
                      placeholder="Add instructor guidance or laboratory advice for this team..."
                      className="flex-1 px-3 py-1.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none focus:border-indigo-500"
                    />
                    <button
                      onClick={() => handleSaveNote(item.id)}
                      className="px-3 py-1.5 rounded-lg bg-indigo-600 text-white text-xs font-semibold"
                    >
                      Save Note
                    </button>
                    <button
                      onClick={() => setActiveNoteId(null)}
                      className="px-2 py-1.5 text-xs text-slate-400 hover:text-slate-200"
                    >
                      Cancel
                    </button>
                  </div>
                ) : (
                  <div className="flex items-center justify-between w-full text-xs">
                    <div className="flex items-center gap-2 text-slate-400">
                      <MessageSquare className="w-3.5 h-3.5 text-indigo-400" />
                      {notes[item.id] ? (
                        <span className="text-indigo-300 font-medium">Instructor Note: {notes[item.id]}</span>
                      ) : (
                        <span className="italic text-slate-500">No instructor feedback recorded.</span>
                      )}
                    </div>
                    <button
                      onClick={() => {
                        setActiveNoteId(item.id);
                        setTempNoteText(notes[item.id] || '');
                      }}
                      className="text-indigo-400 hover:text-indigo-300 font-medium hover:underline text-xs"
                    >
                      {notes[item.id] ? 'Edit Note' : '+ Add Advice'}
                    </button>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
