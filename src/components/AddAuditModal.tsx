import React, { useState, useEffect } from 'react';
import {
  X,
  Calendar,
  CheckCircle2,
  AlertTriangle,
  GitCommit,
  Layers,
  Sparkles,
  User,
  Plus,
} from 'lucide-react';
import { Team, AuditRecord, TicketStatus } from '../types';

interface AddAuditModalProps {
  isOpen: boolean;
  onClose: () => void;
  teams: Team[];
  initialTeamId?: string;
  initialStudentName?: string;
  initialWeekNumber?: number;
  onSaveAudit: (audit: AuditRecord) => void;
}

export const AddAuditModal: React.FC<AddAuditModalProps> = ({
  isOpen,
  onClose,
  teams,
  initialTeamId,
  initialStudentName,
  initialWeekNumber = 1,
  onSaveAudit,
}) => {
  const [selectedTeamId, setSelectedTeamId] = useState<string>(initialTeamId || (teams[0]?.id || ''));
  const [studentName, setStudentName] = useState<string>(initialStudentName || '');
  const [studentId, setStudentId] = useState<string>('');
  const [studentEmail, setStudentEmail] = useState<string>('');
  const [githubUsername, setGithubUsername] = useState<string>('');
  const [weekNumber, setWeekNumber] = useState<number>(initialWeekNumber);
  const [ticketStatus, setTicketStatus] = useState<TicketStatus>('Done');
  const [assignedFeature, setAssignedFeature] = useState<string>('');
  const [ticketNumber, setTicketNumber] = useState<string>('');
  const [commitUrl, setCommitUrl] = useState<string>('');
  const [summary, setSummary] = useState<string>('');
  const [blockers, setBlockers] = useState<string>('None');
  const [sourceType, setSourceType] = useState<'document' | 'google_form' | 'kanban_sync'>('document');

  // Sync initial props when opened
  useEffect(() => {
    if (initialTeamId) setSelectedTeamId(initialTeamId);
    if (initialStudentName) setStudentName(initialStudentName);
    if (initialWeekNumber) {
      setWeekNumber(initialWeekNumber);
      setSourceType(initialWeekNumber <= 4 ? 'document' : 'google_form');
    }
  }, [initialTeamId, initialStudentName, initialWeekNumber, isOpen]);

  // When team changes, populate student suggestions
  const currentTeam = teams.find((t) => t.id === selectedTeamId) || teams[0];

  const handleSelectMember = (member: any) => {
    setStudentName(member.name);
    setStudentId(member.studentId || '');
    setStudentEmail(member.email || '');
    setGithubUsername(member.githubUsername || '');
  };

  if (!isOpen) return null;

  const handleSave = () => {
    if (!assignedFeature.trim()) {
      alert('Please specify the assigned feature or milestone accomplished.');
      return;
    }

    const t = currentTeam;
    const finalStudentName = studentName.trim() || 'Student Contributor';
    const finalStudentId = studentId.trim() || '240000000000';
    const finalTeamName = t ? t.name : 'Mobile Project';
    const finalTeamId = t ? t.id : 'custom-team';

    const newAudit: AuditRecord = {
      id: `manual-audit-${Date.now()}`,
      timestamp: new Date().toLocaleString(),
      studentEmail: studentEmail || `s_${finalStudentId}@uic.edu.ph`,
      weekNumber: weekNumber,
      weekLabel: `Week ${weekNumber}: ${assignedFeature.trim()}`,
      section: t?.section || 'BSIT',
      studentName: finalStudentName,
      studentId: finalStudentId,
      rawTeamName: finalTeamName,
      teamId: finalTeamId,
      teamName: finalTeamName,
      githubUsername: githubUsername || finalStudentName.toLowerCase().replace(/[^a-z0-9]/g, ''),
      orgInviteAccepted: true,
      assignedFeature: assignedFeature.trim(),
      ticketNumber: ticketNumber.trim() || `Milestone #W0${weekNumber}`,
      ticketStatus: ticketStatus,
      commitUrl: commitUrl.trim() || (t ? t.githubRepoUrl : ''),
      summary: summary.trim() || `Completed weekly mobile task: ${assignedFeature}`,
      blockers: blockers.trim() || 'None',
      sourceType: sourceType,
      date: new Date().toISOString().split('T')[0],
    };

    onSaveAudit(newAudit);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-xl w-full shadow-2xl overflow-hidden text-slate-100 flex flex-col max-h-[92vh]">
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-slate-800 flex items-center justify-between bg-slate-950/70">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-600/20 border border-indigo-500/30 flex items-center justify-center text-indigo-400">
              <Calendar className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white">Log Weekly Progress Audit</h2>
              <p className="text-xs text-slate-400">
                Record or override individual student milestones for Weeks 1 to 8.
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-5 overflow-y-auto space-y-4 text-xs">
          {/* Team and Week Selection */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-slate-300 font-semibold mb-1">Select Team</label>
              <select
                value={selectedTeamId}
                onChange={(e) => {
                  setSelectedTeamId(e.target.value);
                  const tm = teams.find((t) => t.id === e.target.value);
                  if (tm && tm.members.length > 0) {
                    handleSelectMember(tm.members[0]);
                  }
                }}
                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-indigo-500"
              >
                {teams.map((t) => (
                  <option key={t.id} value={t.id}>
                    {t.name} ({t.section})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-slate-300 font-semibold mb-1">Audit Week</label>
              <select
                value={weekNumber}
                onChange={(e) => {
                  const val = parseInt(e.target.value, 10);
                  setWeekNumber(val);
                  setSourceType(val <= 4 ? 'document' : 'google_form');
                }}
                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-indigo-500 font-mono"
              >
                <option value={1}>Week 1: Proposal & Ideation (Doc)</option>
                <option value={2}>Week 2: UI/UX Wireframing (Doc)</option>
                <option value={3}>Week 3: System Architecture (Doc)</option>
                <option value={4}>Week 4: Repo Setup & Toolchain (Doc)</option>
                <option value={5}>Week 5: Backend & Database Handshake (Form)</option>
                <option value={6}>Week 6: Core Business Logic (Form)</option>
                <option value={7}>Week 7: Screen Integration (Form)</option>
                <option value={8}>Week 8: Packaging & Testing (Form)</option>
              </select>
            </div>
          </div>

          {/* Student Picker from Team Members */}
          {currentTeam && currentTeam.members.length > 0 && (
            <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800 space-y-2">
              <span className="block text-[11px] text-slate-400 font-medium">
                Quick Select Member in {currentTeam.name}:
              </span>
              <div className="flex flex-wrap gap-1.5">
                {currentTeam.members.map((m) => (
                  <button
                    key={m.studentId || m.name}
                    type="button"
                    onClick={() => handleSelectMember(m)}
                    className={`px-2.5 py-1 rounded-lg text-[11px] font-medium border transition ${
                      studentName === m.name
                        ? 'bg-indigo-600 text-white border-indigo-500'
                        : 'bg-slate-800 text-slate-300 border-slate-700 hover:bg-slate-700'
                    }`}
                  >
                    {m.name}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Student Name & ID */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-slate-300 font-semibold mb-1">
                Student Full Name <span className="text-rose-400">*</span>
              </label>
              <input
                type="text"
                value={studentName}
                onChange={(e) => setStudentName(e.target.value)}
                placeholder="e.g. Dela Cruz, Juan"
                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-indigo-500"
              />
            </div>
            <div>
              <label className="block text-slate-300 font-semibold mb-1">Student ID</label>
              <input
                type="text"
                value={studentId}
                onChange={(e) => setStudentId(e.target.value)}
                placeholder="e.g. 240000001234"
                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white font-mono focus:outline-none focus:border-indigo-500"
              />
            </div>
          </div>

          {/* Deliverable & Status */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="sm:col-span-2">
              <label className="block text-slate-300 font-semibold mb-1">
                Assigned Feature / Deliverable <span className="text-rose-400">*</span>
              </label>
              <input
                type="text"
                value={assignedFeature}
                onChange={(e) => setAssignedFeature(e.target.value)}
                placeholder="e.g. SQLite local caching & offline queue sync"
                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-indigo-500"
              />
            </div>

            <div>
              <label className="block text-slate-300 font-semibold mb-1">Ticket Status</label>
              <select
                value={ticketStatus}
                onChange={(e) => setTicketStatus(e.target.value as TicketStatus)}
                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-indigo-500 font-semibold"
              >
                <option value="Done">Done</option>
                <option value="In Progress">In Progress</option>
                <option value="Review">Review</option>
                <option value="Backlog">Backlog</option>
              </select>
            </div>
          </div>

          {/* Ticket Number & Commit URL */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-slate-300 font-semibold mb-1">Ticket / Issue #</label>
              <input
                type="text"
                value={ticketNumber}
                onChange={(e) => setTicketNumber(e.target.value)}
                placeholder="e.g. Issue #14 or Milestone-W3"
                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white font-mono focus:outline-none focus:border-indigo-500"
              />
            </div>

            <div>
              <label className="block text-slate-300 font-semibold mb-1">GitHub Commit URL (Optional)</label>
              <input
                type="text"
                value={commitUrl}
                onChange={(e) => setCommitUrl(e.target.value)}
                placeholder="https://github.com/.../commit/..."
                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white font-mono text-[11px] focus:outline-none focus:border-indigo-500"
              />
            </div>
          </div>

          {/* Summary */}
          <div>
            <label className="block text-slate-300 font-semibold mb-1">Weekly Summary & Details</label>
            <textarea
              value={summary}
              onChange={(e) => setSummary(e.target.value)}
              placeholder="Summary of student contribution and code delivered this week..."
              rows={2}
              className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-indigo-500"
            />
          </div>

          {/* Blockers */}
          <div>
            <label className="block text-slate-300 font-semibold mb-1">Blockers / Roadblocks</label>
            <input
              type="text"
              value={blockers}
              onChange={(e) => setBlockers(e.target.value)}
              placeholder="e.g. None or Waiting on payment webhook credentials"
              className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-indigo-500"
            />
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-800 bg-slate-950 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span
              className={`text-[10px] font-mono px-2 py-0.5 rounded ${
                weekNumber <= 4
                  ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                  : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
              }`}
            >
              {weekNumber <= 4 ? 'Source: Document Record' : 'Source: Google Form Audit'}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-400 hover:text-white hover:bg-slate-800 transition"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleSave}
              className="px-5 py-2 rounded-xl text-xs font-semibold bg-indigo-600 hover:bg-indigo-500 text-white shadow-md shadow-indigo-500/20 transition active:scale-95 flex items-center gap-1.5"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>Record Audit</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
