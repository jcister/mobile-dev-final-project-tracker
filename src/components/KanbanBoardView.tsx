import React, { useState } from 'react';
import {
  ExternalLink,
  GitCommit,
  AlertTriangle,
  Plus,
  Filter,
  CheckCircle2,
  Clock,
  ArrowRight,
  ArrowLeft,
  Search,
  RefreshCw,
  Edit2,
  Trash2,
  Layers,
  Settings,
} from 'lucide-react';
import { KanbanCard, Team } from '../types';
import { EditCardModal } from './EditCardModal';

interface KanbanBoardViewProps {
  cards: KanbanCard[];
  teams: Team[];
  selectedTeamId: string;
  onSelectTeamId: (id: string) => void;
  onMoveCard: (cardId: string, newStatus: 'backlog' | 'in_progress' | 'review' | 'done') => void;
  onAddCard: (card: Omit<KanbanCard, 'id' | 'updatedAt'>) => void;
  onEditCard?: (card: KanbanCard) => void;
  onDeleteCard?: (cardId: string) => void;
  onOpenGitHubSync?: () => void;
  onEditTeam?: (team: Team) => void;
}

export const KanbanBoardView: React.FC<KanbanBoardViewProps> = ({
  cards,
  teams,
  selectedTeamId,
  onSelectTeamId,
  onMoveCard,
  onAddCard,
  onEditCard,
  onDeleteCard,
  onOpenGitHubSync,
  onEditTeam,
}) => {
  const [filterQuery, setFilterQuery] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingCard, setEditingCard] = useState<KanbanCard | null>(null);
  const [newTitle, setNewTitle] = useState('');
  const [newTicketNo, setNewTicketNo] = useState('Issue #');
  const [newAssignee, setNewAssignee] = useState('');
  const [newStatus, setNewStatus] = useState<'backlog' | 'in_progress' | 'review' | 'done'>('in_progress');
  const [newSummary, setNewSummary] = useState('');
  const [newWeek, setNewWeek] = useState(8);

  // Filter cards by selected team and search query
  const filteredCards = cards.filter((c) => {
    const matchesTeam = selectedTeamId === 'ALL' || c.teamId === selectedTeamId;
    const matchesSearch =
      filterQuery === '' ||
      c.title.toLowerCase().includes(filterQuery.toLowerCase()) ||
      c.assignee.toLowerCase().includes(filterQuery.toLowerCase()) ||
      c.ticketNumber.toLowerCase().includes(filterQuery.toLowerCase()) ||
      c.summary.toLowerCase().includes(filterQuery.toLowerCase());
    return matchesTeam && matchesSearch;
  });

  const columns: {
    id: 'backlog' | 'in_progress' | 'review' | 'done';
    title: string;
    color: string;
    badgeBg: string;
    border: string;
  }[] = [
    {
      id: 'backlog',
      title: 'Backlog / Planning',
      color: 'text-slate-300',
      badgeBg: 'bg-slate-700/60 text-slate-300',
      border: 'border-slate-800',
    },
    {
      id: 'in_progress',
      title: 'In Progress (Active Coding)',
      color: 'text-blue-400',
      badgeBg: 'bg-blue-500/20 text-blue-300',
      border: 'border-blue-900/40',
    },
    {
      id: 'review',
      title: 'Code Review & QA',
      color: 'text-purple-400',
      badgeBg: 'bg-purple-500/20 text-purple-300',
      border: 'border-purple-900/40',
    },
    {
      id: 'done',
      title: 'Done (Merged & Verified)',
      color: 'text-emerald-400',
      badgeBg: 'bg-emerald-500/20 text-emerald-300',
      border: 'border-emerald-900/40',
    },
  ];

  const handleCreateCard = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    const targetTeam = selectedTeamId !== 'ALL' ? selectedTeamId : teams[0]?.id || 'custom-team';
    onAddCard({
      teamId: targetTeam,
      title: newTitle.trim(),
      ticketNumber: newTicketNo.trim() || 'Issue #',
      status: newStatus,
      assignee: newAssignee.trim() || 'Team Developer',
      assigneeGithub: '',
      weekNumber: newWeek,
      summary: newSummary.trim() || 'Instructor assigned milestone.',
      hasBlocker: false,
    });

    setNewTitle('');
    setNewTicketNo('Issue #');
    setNewAssignee('');
    setNewSummary('');
    setShowAddModal(false);
  };

  return (
    <div className="space-y-4">
      {/* Kanban Header Controls */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-2">
          {/* Team Filter Dropdown */}
          <div className="flex items-center gap-1.5 bg-slate-950/60 px-3 py-1.5 rounded-xl border border-slate-800 text-xs">
            <Filter className="w-3.5 h-3.5 text-slate-400" />
            <span className="text-slate-400 font-medium">Board:</span>
            <select
              value={selectedTeamId}
              onChange={(e) => onSelectTeamId(e.target.value)}
              className="bg-transparent text-white font-medium focus:outline-none cursor-pointer pr-2"
            >
              <option value="ALL" className="bg-slate-900 text-slate-200">
                All Repositories ({teams.length} Teams)
              </option>
              {teams.map((t) => (
                <option key={t.id} value={t.id} className="bg-slate-900 text-slate-200">
                  {t.name}
                </option>
              ))}
            </select>
          </div>

          {/* Quick Search */}
          <div className="relative flex-1 sm:w-56">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={filterQuery}
              onChange={(e) => setFilterQuery(e.target.value)}
              placeholder="Filter ticket or student..."
              className="w-full pl-8 pr-3 py-1.5 rounded-xl bg-slate-950/60 border border-slate-800 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-indigo-500"
            />
          </div>
        </div>

        {/* Add Ticket / External Link / Live GitHub Sync */}
        <div className="flex items-center gap-2">
          {onOpenGitHubSync && (
            <button
              onClick={onOpenGitHubSync}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-600/90 hover:bg-emerald-600 text-white text-xs font-semibold shadow-sm transition active:scale-95"
              title="Sync live GitHub issues and commits from repository URL or organization"
            >
              <RefreshCw className="w-3.5 h-3.5 text-emerald-200" />
              <span>Live GitHub Sync</span>
            </button>
          )}

          {selectedTeamId !== 'ALL' && (
            <>
              {(() => {
                const selTeam = teams.find((t) => t.id === selectedTeamId);
                return (
                  <>
                    {selTeam?.kanbanUrl && (
                      <a
                        href={selTeam.kanbanUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-600/20 hover:bg-emerald-600/30 text-xs font-semibold text-emerald-300 border border-emerald-500/30 transition"
                        title="Open Team's Live GitHub Projects Board"
                      >
                        <Layers className="w-3.5 h-3.5 text-emerald-400" />
                        <span className="hidden sm:inline">GitHub Projects</span>
                        <ExternalLink className="w-3 h-3 opacity-70" />
                      </a>
                    )}

                    <a
                      href={selTeam?.githubRepoUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs font-mono text-slate-300 border border-slate-700 transition"
                      title="Open Team GitHub Repository"
                    >
                      <span className="hidden sm:inline">Repo</span>
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>

                    {onEditTeam && selTeam && (
                      <button
                        onClick={() => onEditTeam(selTeam)}
                        className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs text-slate-300 border border-slate-700 transition"
                        title="Edit Team, Repo, Kanban Board Link, & Members"
                      >
                        <Edit2 className="w-3.5 h-3.5 text-indigo-400" />
                        <span className="hidden sm:inline">Edit</span>
                      </button>
                    )}
                  </>
                );
              })()}
            </>
          )}

          <button
            onClick={() => setShowAddModal(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold shadow-sm transition"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Ticket</span>
          </button>
        </div>
      </div>

      {/* 4 Kanban Columns */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 items-start">
        {columns.map((col) => {
          const colCards = filteredCards.filter((c) => c.status === col.id);

          return (
            <div
              key={col.id}
              className={`bg-slate-900/90 border ${col.border} rounded-2xl p-3 flex flex-col min-h-[500px] shadow-sm`}
            >
              {/* Column Header */}
              <div className="flex items-center justify-between pb-3 border-b border-slate-800 mb-3">
                <div className="flex items-center gap-2">
                  <h3 className={`text-xs font-bold uppercase tracking-wider ${col.color}`}>
                    {col.title}
                  </h3>
                  <span className={`px-2 py-0.5 rounded-full text-xs font-bold ${col.badgeBg}`}>
                    {colCards.length}
                  </span>
                </div>
              </div>

              {/* Cards Container */}
              <div className="space-y-3 flex-1 overflow-y-auto max-h-[75vh] pr-1">
                {colCards.length === 0 ? (
                  <div className="h-32 border border-dashed border-slate-800 rounded-xl flex items-center justify-center text-xs text-slate-500">
                    No tickets in {col.title}
                  </div>
                ) : (
                  colCards.map((card) => {
                    const cardTeam = teams.find((t) => t.id === card.teamId);

                    return (
                      <div
                        key={card.id}
                        className="bg-slate-950/70 border border-slate-800 rounded-xl p-3.5 hover:border-slate-700 transition shadow-sm space-y-2.5"
                      >
                        {/* Top: Ticket Number, Week Badge & Actions */}
                        <div className="flex items-center justify-between gap-1">
                          <div className="flex items-center gap-1.5 truncate">
                            <span className="text-[11px] font-mono font-bold text-indigo-400 bg-indigo-500/10 px-2 py-0.5 rounded border border-indigo-500/20 truncate">
                              {card.ticketNumber}
                            </span>
                            <span className="text-[10px] font-mono text-slate-400 px-1.5 py-0.5 rounded bg-slate-800">
                              W{card.weekNumber}
                            </span>
                          </div>

                          <div className="flex items-center gap-0.5 shrink-0">
                            <button
                              type="button"
                              onClick={() => setEditingCard(card)}
                              className="p-1 rounded text-slate-400 hover:text-white hover:bg-slate-800 transition"
                              title="Edit Kanban Ticket"
                            >
                              <Edit2 className="w-3 h-3" />
                            </button>
                            {onDeleteCard && (
                              <button
                                type="button"
                                onClick={() => setEditingCard(card)}
                                className="p-1 rounded text-slate-400 hover:text-rose-400 hover:bg-slate-800 transition"
                                title="Delete Kanban Ticket"
                              >
                                <Trash2 className="w-3 h-3" />
                              </button>
                            )}
                          </div>
                        </div>

                        {/* Title & Team Name */}
                        <div>
                          <h4 className="text-xs font-bold text-white line-clamp-2">
                            {card.title}
                          </h4>
                          {selectedTeamId === 'ALL' && cardTeam && (
                            <div className="text-[10px] text-slate-400 mt-0.5 font-medium truncate">
                              {cardTeam.name}
                            </div>
                          )}
                        </div>

                        {/* Summary */}
                        {card.summary && (
                          <p className="text-[11px] text-slate-300/90 line-clamp-3 bg-slate-900/50 p-2 rounded-lg border border-slate-800/60">
                            {card.summary}
                          </p>
                        )}

                        {/* Blocker alert if present */}
                        {card.hasBlocker && card.blockers && (
                          <div className="p-2 rounded-lg bg-amber-500/10 border border-amber-500/20 text-[11px] text-amber-300 flex items-start gap-1.5">
                            <AlertTriangle className="w-3.5 h-3.5 text-amber-400 shrink-0 mt-0.5" />
                            <span className="line-clamp-2">{card.blockers}</span>
                          </div>
                        )}

                        {/* Assignee & Git Commit Link */}
                        <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between gap-2 text-xs">
                          <div className="flex items-center gap-1.5 truncate">
                            <span className="w-5 h-5 rounded-full bg-slate-800 text-slate-300 flex items-center justify-center text-[10px] font-bold shrink-0">
                              {card.assignee.charAt(0)}
                            </span>
                            <span className="text-[11px] text-slate-300 truncate font-medium">
                              {card.assignee}
                            </span>
                          </div>

                          {card.commitUrl && (
                            <a
                              href={card.commitUrl.startsWith('http') ? card.commitUrl : `https://github.com/${cardTeam?.repoName || ''}/commit/${card.commitUrl}`}
                              target="_blank"
                              rel="noreferrer"
                              className="text-[10px] font-mono text-indigo-400 hover:text-indigo-300 flex items-center gap-1 bg-indigo-500/10 px-1.5 py-0.5 rounded border border-indigo-500/20 shrink-0"
                              title="View Commit on GitHub"
                            >
                              <GitCommit className="w-3 h-3" />
                              <span>Commit</span>
                              <ExternalLink className="w-2.5 h-2.5 opacity-70" />
                            </a>
                          )}
                        </div>

                        {/* Card Move Actions (Interactive Board) */}
                        <div className="pt-1 flex items-center justify-between text-[10px] text-slate-500">
                          {col.id !== 'backlog' ? (
                            <button
                              onClick={() => {
                                const prev = col.id === 'done' ? 'review' : col.id === 'review' ? 'in_progress' : 'backlog';
                                onMoveCard(card.id, prev);
                              }}
                              className="hover:text-slate-300 flex items-center gap-0.5 p-1 rounded hover:bg-slate-800"
                              title="Move back"
                            >
                              <ArrowLeft className="w-3 h-3" />
                              <span>Back</span>
                            </button>
                          ) : (
                            <span />
                          )}

                          {col.id !== 'done' && (
                            <button
                              onClick={() => {
                                const next = col.id === 'backlog' ? 'in_progress' : col.id === 'in_progress' ? 'review' : 'done';
                                onMoveCard(card.id, next);
                              }}
                              className="hover:text-emerald-400 text-slate-400 flex items-center gap-0.5 p-1 rounded hover:bg-slate-800 ml-auto"
                              title="Move forward"
                            >
                              <span>Next</span>
                              <ArrowRight className="w-3 h-3" />
                            </button>
                          )}
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Add Ticket Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-md w-full p-6 shadow-2xl text-slate-200">
            <h3 className="text-base font-bold text-white mb-3">Add Kanban Ticket / Issue</h3>
            <form onSubmit={handleCreateCard} className="space-y-3.5">
              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1">Feature / Task Title</label>
                <input
                  type="text"
                  required
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="e.g. SQLite DB Helper, Riverpod Auth Controller"
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-slate-400 mb-1">Issue / Ticket #</label>
                  <input
                    type="text"
                    value={newTicketNo}
                    onChange={(e) => setNewTicketNo(e.target.value)}
                    placeholder="Issue #15"
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none focus:border-indigo-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-400 mb-1">Week Number</label>
                  <input
                    type="number"
                    min="1"
                    max="16"
                    value={newWeek}
                    onChange={(e) => setNewWeek(parseInt(e.target.value, 10) || 8)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none focus:border-indigo-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1">Assigned Student</label>
                <input
                  type="text"
                  value={newAssignee}
                  onChange={(e) => setNewAssignee(e.target.value)}
                  placeholder="Student Full Name"
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1">Initial Status</label>
                <select
                  value={newStatus}
                  onChange={(e) => setNewStatus(e.target.value as any)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none focus:border-indigo-500"
                >
                  <option value="backlog">Backlog / Planning</option>
                  <option value="in_progress">In Progress (Active Coding)</option>
                  <option value="review">Code Review & QA</option>
                  <option value="done">Done (Merged & Verified)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1">Task Scope / Summary</label>
                <textarea
                  rows={3}
                  value={newSummary}
                  onChange={(e) => setNewSummary(e.target.value)}
                  placeholder="Describe logic, expected deliverable, or technical notes..."
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold shadow-sm"
                >
                  Save Ticket
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Card Modal */}
      <EditCardModal
        isOpen={editingCard !== null}
        card={editingCard}
        teams={teams}
        onClose={() => setEditingCard(null)}
        onSaveCard={(updated) => {
          if (onEditCard) onEditCard(updated);
          setEditingCard(null);
        }}
        onDeleteCard={(cardId) => {
          if (onDeleteCard) onDeleteCard(cardId);
          setEditingCard(null);
        }}
      />
    </div>
  );
};
