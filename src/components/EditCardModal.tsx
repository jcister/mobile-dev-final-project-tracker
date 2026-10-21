import React, { useState, useEffect } from 'react';
import { X, Save, Trash2, AlertTriangle, ExternalLink, GitCommit } from 'lucide-react';
import { KanbanCard, Team } from '../types';

interface EditCardModalProps {
  isOpen: boolean;
  onClose: () => void;
  card: KanbanCard | null;
  teams: Team[];
  onSaveCard: (updatedCard: KanbanCard) => void;
  onDeleteCard: (cardId: string) => void;
}

export const EditCardModal: React.FC<EditCardModalProps> = ({
  isOpen,
  onClose,
  card,
  teams,
  onSaveCard,
  onDeleteCard,
}) => {
  const [title, setTitle] = useState('');
  const [ticketNumber, setTicketNumber] = useState('');
  const [teamId, setTeamId] = useState('');
  const [status, setStatus] = useState<'backlog' | 'in_progress' | 'review' | 'done'>('in_progress');
  const [assignee, setAssignee] = useState('');
  const [assigneeGithub, setAssigneeGithub] = useState('');
  const [weekNumber, setWeekNumber] = useState(8);
  const [summary, setSummary] = useState('');
  const [blockers, setBlockers] = useState('');
  const [commitUrl, setCommitUrl] = useState('');
  const [priority, setPriority] = useState<'high' | 'medium' | 'low'>('medium');
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  useEffect(() => {
    if (card) {
      setTitle(card.title || '');
      setTicketNumber(card.ticketNumber || '');
      setTeamId(card.teamId || '');
      setStatus(card.status || 'in_progress');
      setAssignee(card.assignee || '');
      setAssigneeGithub(card.assigneeGithub || '');
      setWeekNumber(card.weekNumber || 8);
      setSummary(card.summary || '');
      setBlockers(card.blockers || '');
      setCommitUrl(card.commitUrl || '');
      setPriority(card.priority || 'medium');
      setShowDeleteConfirm(false);
    }
  }, [card]);

  if (!isOpen || !card) return null;

  const currentTeam = teams.find((t) => t.id === teamId);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    const hasBlocker = Boolean(
      blockers.trim() &&
        !blockers.toLowerCase().includes('none') &&
        !blockers.toLowerCase().includes('not yet applicable')
    );

    const updated: KanbanCard = {
      ...card,
      title: title.trim(),
      ticketNumber: ticketNumber.trim() || 'Issue #',
      teamId,
      status,
      assignee: assignee.trim() || 'Team Developer',
      assigneeGithub: assigneeGithub.trim().replace(/^@/, ''),
      weekNumber,
      summary: summary.trim(),
      blockers: blockers.trim(),
      hasBlocker,
      commitUrl: commitUrl.trim() || undefined,
      priority,
      updatedAt: 'Updated just now',
    };

    onSaveCard(updated);
    onClose();
  };

  const handleDelete = () => {
    onDeleteCard(card.id);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-lg w-full p-6 shadow-2xl text-slate-200 animate-in fade-in zoom-in-95">
        <div className="flex items-start justify-between pb-3 border-b border-slate-800">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-[11px] font-bold px-2 py-0.5 rounded bg-blue-500/15 text-blue-400 border border-blue-500/30">
                Edit Kanban Ticket
              </span>
              <span className="text-xs font-mono px-2 py-0.5 rounded bg-slate-800 text-slate-400">
                {ticketNumber || card.ticketNumber}
              </span>
            </div>
            <h3 className="text-base font-bold text-white tracking-tight line-clamp-1">
              {title || card.title}
            </h3>
          </div>

          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {showDeleteConfirm ? (
          <div className="py-6 space-y-4 text-center">
            <div className="w-12 h-12 rounded-full bg-rose-500/15 border border-rose-500/30 text-rose-400 flex items-center justify-center mx-auto">
              <AlertTriangle className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-base font-bold text-white">Delete Kanban Ticket?</h4>
              <p className="text-xs text-slate-400 mt-1 max-w-xs mx-auto">
                Are you sure you want to delete <strong className="text-white">{card.title}</strong>? This ticket will be removed from the Kanban columns.
              </p>
            </div>
            <div className="flex items-center justify-center gap-2.5 pt-2">
              <button
                type="button"
                onClick={() => setShowDeleteConfirm(false)}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-400 hover:text-white hover:bg-slate-800"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleDelete}
                className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-semibold shadow-md"
              >
                Yes, Delete Ticket
              </button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="mt-4 space-y-3.5 max-h-[75vh] overflow-y-auto pr-1">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Feature / Deliverable Title *
              </label>
              <input
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. SQLite Offline Order Cache"
                className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none focus:border-indigo-500"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Assigned Team
                </label>
                <select
                  value={teamId}
                  onChange={(e) => setTeamId(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none focus:border-indigo-500"
                >
                  {teams.map((t) => (
                    <option key={t.id} value={t.id}>
                      {t.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Kanban Column Status
                </label>
                <select
                  value={status}
                  onChange={(e) =>
                    setStatus(e.target.value as 'backlog' | 'in_progress' | 'review' | 'done')
                  }
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none focus:border-indigo-500 font-medium"
                >
                  <option value="backlog">Backlog / Planning</option>
                  <option value="in_progress">In Progress (Coding)</option>
                  <option value="review">Review & Testing</option>
                  <option value="done">Done (Merged)</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Ticket #
                </label>
                <input
                  type="text"
                  value={ticketNumber}
                  onChange={(e) => setTicketNumber(e.target.value)}
                  placeholder="Issue #4"
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Week #
                </label>
                <input
                  type="number"
                  min="1"
                  max="16"
                  value={weekNumber}
                  onChange={(e) => setWeekNumber(parseInt(e.target.value, 10) || 1)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Priority
                </label>
                <select
                  value={priority}
                  onChange={(e) => setPriority(e.target.value as 'high' | 'medium' | 'low')}
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none focus:border-indigo-500"
                >
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Assigned Student
                </label>
                {currentTeam && currentTeam.members.length > 0 ? (
                  <select
                    value={assignee}
                    onChange={(e) => {
                      const selected = e.target.value;
                      setAssignee(selected);
                      const m = currentTeam.members.find((mem) => mem.name === selected);
                      if (m && m.githubUsername) setAssigneeGithub(m.githubUsername);
                    }}
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none focus:border-indigo-500"
                  >
                    <option value="">-- Select Member or Custom --</option>
                    {currentTeam.members.map((m, idx) => (
                      <option key={idx} value={m.name}>
                        {m.name}
                      </option>
                    ))}
                  </select>
                ) : (
                  <input
                    type="text"
                    value={assignee}
                    onChange={(e) => setAssignee(e.target.value)}
                    placeholder="Student Name"
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white"
                  />
                )}
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  GitHub Username
                </label>
                <input
                  type="text"
                  value={assigneeGithub}
                  onChange={(e) => setAssigneeGithub(e.target.value)}
                  placeholder="octocat"
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs font-mono text-white focus:outline-none focus:border-indigo-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                GitHub Commit URL or Hash
              </label>
              <input
                type="text"
                value={commitUrl}
                onChange={(e) => setCommitUrl(e.target.value)}
                placeholder="https://github.com/.../commit/... or commit SHA"
                className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs font-mono text-white focus:outline-none focus:border-indigo-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Implementation Summary / Notes
              </label>
              <textarea
                rows={2}
                value={summary}
                onChange={(e) => setSummary(e.target.value)}
                placeholder="What was built or modified in this ticket..."
                className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none focus:border-indigo-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Blockers / Impediments (Optional)
              </label>
              <input
                type="text"
                value={blockers}
                onChange={(e) => setBlockers(e.target.value)}
                placeholder="Leave blank or type 'None' if resolved"
                className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none focus:border-indigo-500"
              />
            </div>

            <div className="pt-3 border-t border-slate-800 flex items-center justify-between gap-3">
              <button
                type="button"
                onClick={() => setShowDeleteConfirm(true)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/30 text-xs font-semibold transition"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Delete Ticket</span>
              </button>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-400 hover:text-white hover:bg-slate-800"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold shadow-md transition"
                >
                  <Save className="w-3.5 h-3.5" />
                  <span>Update Ticket</span>
                </button>
              </div>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
