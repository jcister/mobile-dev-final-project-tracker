import React, { useState } from 'react';
import { AlertTriangle, Trash2, X } from 'lucide-react';
import { Team, AuditRecord, KanbanCard } from '../types';

interface DeleteTeamModalProps {
  isOpen: boolean;
  onClose: () => void;
  team: Team | null;
  audits: AuditRecord[];
  cards: KanbanCard[];
  onConfirmDelete: (teamId: string, deleteAudits: boolean, deleteCards: boolean) => void;
}

export const DeleteTeamModal: React.FC<DeleteTeamModalProps> = ({
  isOpen,
  onClose,
  team,
  audits,
  cards,
  onConfirmDelete,
}) => {
  const [deleteAudits, setDeleteAudits] = useState(true);
  const [deleteCards, setDeleteCards] = useState(true);

  if (!isOpen || !team) return null;

  const teamAuditsCount = audits.filter((a) => a.teamId === team.id).length;
  const teamCardsCount = cards.filter((c) => c.teamId === team.id).length;

  const handleDelete = () => {
    onConfirmDelete(team.id, deleteAudits, deleteCards);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-rose-500/30 rounded-2xl max-w-md w-full p-6 shadow-2xl text-slate-200 animate-in fade-in zoom-in-95">
        <div className="flex items-start justify-between pb-3 border-b border-slate-800">
          <div className="flex items-center gap-2.5 text-rose-400">
            <div className="p-2 rounded-xl bg-rose-500/15 border border-rose-500/25">
              <AlertTriangle className="w-5 h-5 text-rose-400" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">Delete Team</h3>
              <p className="text-xs text-slate-400">This action cannot be undone.</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="mt-4 space-y-3">
          <p className="text-xs text-slate-300">
            Are you sure you want to remove <strong className="text-white font-semibold">{team.name}</strong> ({team.section}) from the class tracker?
          </p>

          <div className="bg-slate-950/70 p-3.5 rounded-xl border border-slate-800 space-y-2.5">
            <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
              Cleanup Options:
            </div>

            <label className="flex items-start gap-2.5 text-xs text-slate-300 cursor-pointer">
              <input
                type="checkbox"
                checked={deleteCards}
                onChange={(e) => setDeleteCards(e.target.checked)}
                className="mt-0.5 rounded border-slate-700 bg-slate-900 text-rose-600 focus:ring-rose-500 focus:ring-offset-slate-950"
              />
              <span>
                Delete all <strong className="text-white font-medium">{teamCardsCount} Kanban tickets</strong> for this team
              </span>
            </label>

            <label className="flex items-start gap-2.5 text-xs text-slate-300 cursor-pointer">
              <input
                type="checkbox"
                checked={deleteAudits}
                onChange={(e) => setDeleteAudits(e.target.checked)}
                className="mt-0.5 rounded border-slate-700 bg-slate-900 text-rose-600 focus:ring-rose-500 focus:ring-offset-slate-950"
              />
              <span>
                Delete all <strong className="text-white font-medium">{teamAuditsCount} historical student audit logs</strong> for this team
              </span>
            </label>
          </div>

          <div className="text-[11px] text-slate-400 bg-rose-500/10 p-2.5 rounded-xl border border-rose-500/20">
            Note: You can always restore the original course default teams at any time by clicking "Reset Tracker" in the Ingestion menu.
          </div>
        </div>

        <div className="mt-6 flex items-center justify-end gap-2.5 pt-3 border-t border-slate-800">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-400 hover:text-white hover:bg-slate-800 transition"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleDelete}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-semibold shadow-md transition"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>Confirm & Delete Team</span>
          </button>
        </div>
      </div>
    </div>
  );
};
