import React, { useState, useEffect } from 'react';
import {
  X,
  Users,
  FolderGit2,
  ExternalLink,
  Plus,
  Trash2,
  Edit2,
  Save,
  ShieldCheck,
  Check,
  Layout,
  AlertCircle,
} from 'lucide-react';
import { Team, TeamMember } from '../types';
import { GITHUB_ORG_NAME } from '../data/defaultData';

interface EditTeamModalProps {
  isOpen: boolean;
  onClose: () => void;
  team: Team | null;
  onSaveTeam: (updatedTeam: Team) => void;
  onRequestDelete?: (team: Team) => void;
}

export const EditTeamModal: React.FC<EditTeamModalProps> = ({
  isOpen,
  onClose,
  team,
  onSaveTeam,
  onRequestDelete,
}) => {
  const [activeTab, setActiveTab] = useState<'info' | 'members'>('info');

  // Form State
  const [name, setName] = useState('');
  const [section, setSection] = useState('BSIT 3A & CS');
  const [repoName, setRepoName] = useState('');
  const [githubRepoUrl, setGithubRepoUrl] = useState('');
  const [kanbanUrl, setKanbanUrl] = useState('');
  const [appDescription, setAppDescription] = useState('');
  const [members, setMembers] = useState<TeamMember[]>([]);

  // Member editing state
  const [newMemberName, setNewMemberName] = useState('');
  const [newMemberId, setNewMemberId] = useState('');
  const [newMemberGithub, setNewMemberGithub] = useState('');
  const [newMemberEmail, setNewMemberEmail] = useState('');
  const [newMemberRole, setNewMemberRole] = useState('Developer');
  const [newMemberOrgAccepted, setNewMemberOrgAccepted] = useState(true);
  const [showAddMemberForm, setShowAddMemberForm] = useState(false);
  const [editingMemberIndex, setEditingMemberIndex] = useState<number | null>(null);

  // Sync state when team changes
  useEffect(() => {
    if (team) {
      setName(team.name || '');
      setSection(team.section || 'BSIT 3A & CS');
      setRepoName(team.repoName || '');
      setGithubRepoUrl(
        team.githubRepoUrl || `https://github.com/${GITHUB_ORG_NAME}/${team.repoName}`
      );
      setKanbanUrl(team.kanbanUrl || '');
      setAppDescription(team.appDescription || '');
      setMembers(team.members ? [...team.members] : []);
      setShowAddMemberForm(false);
      setEditingMemberIndex(null);
      setActiveTab('info');
    }
  }, [team]);

  if (!isOpen || !team) return null;

  const handleAddMember = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMemberName.trim()) return;

    const newM: TeamMember = {
      name: newMemberName.trim(),
      studentId: newMemberId.trim(),
      githubUsername: newMemberGithub.trim().replace(/^@/, ''),
      email:
        newMemberEmail.trim() ||
        `${newMemberGithub.trim().toLowerCase() || 'student'}@uic.edu.ph`,
      section: section,
      role: newMemberRole.trim() || 'Developer',
      hasAcceptedOrg: newMemberOrgAccepted,
    };

    if (editingMemberIndex !== null) {
      const updated = [...members];
      updated[editingMemberIndex] = newM;
      setMembers(updated);
      setEditingMemberIndex(null);
    } else {
      setMembers([...members, newM]);
    }

    setNewMemberName('');
    setNewMemberId('');
    setNewMemberGithub('');
    setNewMemberEmail('');
    setNewMemberRole('Developer');
    setNewMemberOrgAccepted(true);
    setShowAddMemberForm(false);
  };

  const handleStartEditMember = (index: number) => {
    const m = members[index];
    setNewMemberName(m.name);
    setNewMemberId(m.studentId || '');
    setNewMemberGithub(m.githubUsername || '');
    setNewMemberEmail(m.email || '');
    setNewMemberRole(m.role || 'Developer');
    setNewMemberOrgAccepted(m.hasAcceptedOrg ?? true);
    setEditingMemberIndex(index);
    setShowAddMemberForm(true);
  };

  const handleRemoveMember = (index: number) => {
    setMembers(members.filter((_, idx) => idx !== index));
    if (editingMemberIndex === index) {
      setEditingMemberIndex(null);
      setShowAddMemberForm(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    const updatedTeam: Team = {
      ...team,
      name: name.trim(),
      section,
      repoName: repoName.trim() || team.repoName,
      githubRepoUrl:
        githubRepoUrl.trim() ||
        `https://github.com/${GITHUB_ORG_NAME}/${repoName.trim() || team.repoName}`,
      kanbanUrl: kanbanUrl.trim() || undefined,
      appDescription: appDescription.trim(),
      members,
    };

    onSaveTeam(updatedTeam);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-2xl w-full p-6 shadow-2xl text-slate-200 flex flex-col max-h-[90vh] animate-in fade-in zoom-in-95">
        {/* Header */}
        <div className="flex items-start justify-between pb-4 border-b border-slate-800">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-[11px] font-bold px-2 py-0.5 rounded bg-indigo-500/15 text-indigo-400 border border-indigo-500/30">
                Edit Team & Repository
              </span>
              <span className="text-xs font-mono px-2 py-0.5 rounded bg-slate-800 text-slate-400">
                ID: {team.id}
              </span>
            </div>
            <h3 className="text-lg font-bold text-white tracking-tight">{name || team.name}</h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Update team identity, GitHub repository, live Kanban link, and student roster.
            </p>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Switcher */}
        <div className="flex items-center gap-2 pt-4 pb-2 border-b border-slate-800/80">
          <button
            type="button"
            onClick={() => setActiveTab('info')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition ${
              activeTab === 'info'
                ? 'bg-indigo-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
            }`}
          >
            <FolderGit2 className="w-3.5 h-3.5" />
            <span>Team & Links</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('members')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition ${
              activeTab === 'members'
                ? 'bg-indigo-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
            }`}
          >
            <Users className="w-3.5 h-3.5" />
            <span>Members Roster ({members.length})</span>
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto py-4 space-y-4 pr-1">
          {activeTab === 'info' && (
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Team & Project Name *
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. ALLEAH - Accurate Ledger, Logistics & POS"
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Class Section
                  </label>
                  <select
                    value={section}
                    onChange={(e) => setSection(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none focus:border-indigo-500"
                  >
                    <option value="BSIT 3A & CS">BSIT 3A & CS</option>
                    <option value="BSIT 3B">BSIT 3B</option>
                    <option value="BSIT 3C">BSIT 3C</option>
                    <option value="BSCS 3">BSCS 3</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    GitHub Repo Name
                  </label>
                  <input
                    type="text"
                    value={repoName}
                    onChange={(e) => setRepoName(e.target.value)}
                    placeholder="e.g. ALLEAH-POS-System"
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs font-mono text-white focus:outline-none focus:border-indigo-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  GitHub Repository Full URL
                </label>
                <div className="relative">
                  <input
                    type="url"
                    value={githubRepoUrl}
                    onChange={(e) => setGithubRepoUrl(e.target.value)}
                    placeholder={`https://github.com/${GITHUB_ORG_NAME}/repo-name`}
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs font-mono text-white focus:outline-none focus:border-indigo-500 pr-8"
                  />
                  {githubRepoUrl && (
                    <a
                      href={githubRepoUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="absolute right-2.5 top-2.5 text-slate-400 hover:text-indigo-400"
                      title="Test Link"
                    >
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  )}
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Team's GitHub Project / Live Kanban Link
                </label>
                <div className="relative">
                  <input
                    type="url"
                    value={kanbanUrl}
                    onChange={(e) => setKanbanUrl(e.target.value)}
                    placeholder="https://github.com/orgs/UIC-CCS-MOBILE-DEVELOPMENT-2026-2027/projects/..."
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs font-mono text-white focus:outline-none focus:border-indigo-500 pr-8"
                  />
                  {kanbanUrl && (
                    <a
                      href={kanbanUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="absolute right-2.5 top-2.5 text-slate-400 hover:text-indigo-400"
                      title="Test Kanban Board Link"
                    >
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  )}
                </div>
                <p className="text-[10px] text-slate-400 mt-1">
                  Link to the team's official GitHub Projects Kanban board or external workspace.
                </p>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  App Overview & Problem Statement
                </label>
                <textarea
                  rows={3}
                  value={appDescription}
                  onChange={(e) => setAppDescription(e.target.value)}
                  placeholder="Describe the mobile application, target users, and key features..."
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none focus:border-indigo-500"
                />
              </div>
            </div>
          )}

          {activeTab === 'members' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-xs font-bold text-white uppercase tracking-wider">
                    Student Roster
                  </h4>
                  <p className="text-[11px] text-slate-400">
                    Assign student names, IDs, and GitHub accounts to this team.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setEditingMemberIndex(null);
                    setNewMemberName('');
                    setNewMemberId('');
                    setNewMemberGithub('');
                    setNewMemberEmail('');
                    setNewMemberRole('Developer');
                    setNewMemberOrgAccepted(true);
                    setShowAddMemberForm(true);
                  }}
                  className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-indigo-600/20 hover:bg-indigo-600/30 text-indigo-300 border border-indigo-500/30 text-xs font-semibold transition"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add Student</span>
                </button>
              </div>

              {/* Add / Edit Member Inline Form */}
              {showAddMemberForm && (
                <div className="p-3.5 rounded-2xl bg-slate-950 border border-indigo-500/30 space-y-3">
                  <div className="flex items-center justify-between text-xs font-bold text-indigo-300">
                    <span>{editingMemberIndex !== null ? 'Edit Student Member' : 'Add New Student to Team'}</span>
                    <button
                      type="button"
                      onClick={() => setShowAddMemberForm(false)}
                      className="text-slate-400 hover:text-white"
                    >
                      ✕
                    </button>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    <div>
                      <label className="block text-[11px] text-slate-400 mb-0.5">Full Name *</label>
                      <input
                        type="text"
                        required
                        value={newMemberName}
                        onChange={(e) => setNewMemberName(e.target.value)}
                        placeholder="e.g. Dela Cruz, Juan M."
                        className="w-full px-2.5 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-xs text-white"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] text-slate-400 mb-0.5">Student ID</label>
                      <input
                        type="text"
                        value={newMemberId}
                        onChange={(e) => setNewMemberId(e.target.value)}
                        placeholder="e.g. 240000001234"
                        className="w-full px-2.5 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-xs text-white"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    <div>
                      <label className="block text-[11px] text-slate-400 mb-0.5">GitHub Username</label>
                      <input
                        type="text"
                        value={newMemberGithub}
                        onChange={(e) => setNewMemberGithub(e.target.value)}
                        placeholder="e.g. octocat"
                        className="w-full px-2.5 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-xs font-mono text-white"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] text-slate-400 mb-0.5">Role / Responsibility</label>
                      <input
                        type="text"
                        value={newMemberRole}
                        onChange={(e) => setNewMemberRole(e.target.value)}
                        placeholder="e.g. Lead Developer, UI Designer"
                        className="w-full px-2.5 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-xs text-white"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 items-center">
                    <div>
                      <label className="block text-[11px] text-slate-400 mb-0.5">UIC Institutional Email</label>
                      <input
                        type="email"
                        value={newMemberEmail}
                        onChange={(e) => setNewMemberEmail(e.target.value)}
                        placeholder="e.g. jdelacruz@uic.edu.ph"
                        className="w-full px-2.5 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-xs text-white"
                      />
                    </div>
                    <label className="flex items-center gap-2 text-xs text-slate-300 mt-4 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={newMemberOrgAccepted}
                        onChange={(e) => setNewMemberOrgAccepted(e.target.checked)}
                        className="rounded border-slate-700 bg-slate-900 text-indigo-600"
                      />
                      <span>GitHub Org Invite Verified</span>
                    </label>
                  </div>

                  <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-800">
                    <button
                      type="button"
                      onClick={() => setShowAddMemberForm(false)}
                      className="px-3 py-1 rounded-lg text-xs text-slate-400 hover:text-white"
                    >
                      Cancel
                    </button>
                    <button
                      type="button"
                      onClick={handleAddMember}
                      className="px-3.5 py-1 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold"
                    >
                      {editingMemberIndex !== null ? 'Update Member' : 'Add to Team'}
                    </button>
                  </div>
                </div>
              )}

              {/* Members List */}
              <div className="space-y-2">
                {members.length === 0 ? (
                  <div className="p-8 text-center bg-slate-950/50 rounded-2xl border border-slate-800 text-slate-500 text-xs">
                    No student members listed yet. Click "+ Add Student" above to populate roster.
                  </div>
                ) : (
                  members.map((m, idx) => (
                    <div
                      key={idx}
                      className="p-3 rounded-xl bg-slate-950/60 border border-slate-800 flex items-center justify-between gap-3 hover:border-slate-700 transition"
                    >
                      <div className="flex items-center gap-2.5 truncate">
                        <div className="w-7 h-7 rounded-full bg-slate-800 text-slate-300 flex items-center justify-center text-xs font-bold shrink-0">
                          {m.name.charAt(0)}
                        </div>
                        <div className="truncate">
                          <div className="flex items-center gap-1.5">
                            <span className="text-xs font-bold text-white truncate">{m.name}</span>
                            {m.role && (
                              <span className="text-[10px] px-1.5 py-0.2 rounded bg-slate-800 text-indigo-300 font-medium">
                                {m.role}
                              </span>
                            )}
                            {m.hasAcceptedOrg && (
                              <span title="Verified Org Member">
                                <ShieldCheck className="w-3 h-3 text-emerald-400" />
                              </span>
                            )}
                          </div>
                          <div className="text-[11px] text-slate-400 font-mono flex items-center gap-2 mt-0.5">
                            {m.githubUsername && <span>@{m.githubUsername}</span>}
                            {m.studentId && <span>ID: {m.studentId}</span>}
                            {m.email && <span className="truncate">{m.email}</span>}
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-1 shrink-0">
                        <button
                          type="button"
                          onClick={() => handleStartEditMember(idx)}
                          className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition"
                          title="Edit Student Member"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleRemoveMember(idx)}
                          className="p-1.5 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-slate-800 transition"
                          title="Remove from Team"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}

          {/* Footer Controls */}
          <div className="pt-4 border-t border-slate-800 flex items-center justify-between gap-3">
            {onRequestDelete ? (
              <button
                type="button"
                onClick={() => onRequestDelete(team)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/30 text-xs font-semibold transition"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Delete Team</span>
              </button>
            ) : (
              <span />
            )}

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-400 hover:text-white hover:bg-slate-800 transition"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold shadow-md transition active:scale-95"
              >
                <Save className="w-3.5 h-3.5" />
                <span>Save Changes</span>
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
