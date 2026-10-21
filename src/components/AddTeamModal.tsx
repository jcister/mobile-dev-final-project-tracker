import React, { useState } from 'react';
import {
  X,
  Users,
  FolderGit2,
  CheckCircle2,
  Calendar,
  Sparkles,
  Plus,
  Trash2,
  ExternalLink,
  Layers,
  HelpCircle,
  AlertTriangle,
  Github,
} from 'lucide-react';
import { Team, TeamMember, AuditRecord, KanbanCard, TicketStatus } from '../types';
import { GITHUB_ORG_NAME, normalizeTeam } from '../data/defaultData';

interface AddTeamModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSaveTeam: (team: Team, initialAudits: AuditRecord[], initialCards: KanbanCard[]) => void;
}

const DEFAULT_MILESTONES = [
  { week: 1, title: 'Project Ideation & Problem Proposal', desc: 'Identified target users, market gap, and mobile project scope.' },
  { week: 2, title: 'UI/UX Wireframes & Component Design', desc: 'Designed high-fidelity mobile flow in Figma.' },
  { week: 3, title: 'System Architecture & Database Schema', desc: 'Defined ERD, API contracts, and state management.' },
  { week: 4, title: 'Git Repo Setup & Mobile Toolchain', desc: 'Initialized Flutter/React Native repo, CI/CD, and linter.' },
  { week: 5, title: 'Authentication & Database Handshake', desc: 'Implemented user login, registration, and cloud DB.' },
  { week: 6, title: 'Core Feature Business Logic', desc: 'Developed primary mobile application controllers and state.' },
  { week: 7, title: 'Screen Integration & UI Polish', desc: 'Integrated backend APIs into polished mobile screen layouts.' },
  { week: 8, title: 'Packaging, Testing & Demo Readiness', desc: 'Built APK/release bundle, fixed bugs, ready for defense.' },
];

export const AddTeamModal: React.FC<AddTeamModalProps> = ({
  isOpen,
  onClose,
  onSaveTeam,
}) => {
  const [activeTab, setActiveTab] = useState<'info' | 'members' | 'milestones'>('info');

  // Form State
  const [teamName, setTeamName] = useState('');
  const [section, setSection] = useState<'BSIT 3A & CS' | 'BSIT 3B' | string>('BSIT 3A & CS');
  const [customSection, setCustomSection] = useState('');
  const [repoName, setRepoName] = useState('');
  const [appDescription, setAppDescription] = useState('');
  const [githubRepoUrl, setGithubRepoUrl] = useState('');
  const [kanbanUrl, setKanbanUrl] = useState('');

  // Members State
  const [members, setMembers] = useState<TeamMember[]>([
    {
      name: '',
      studentId: '',
      githubUsername: '',
      email: '',
      section: 'BSIT 3A & CS',
      role: 'Project Lead / Full-Stack',
      hasAcceptedOrg: true,
    },
  ]);

  // Milestones State (Weeks 1 to 8)
  const [milestones, setMilestones] = useState<
    { week: number; enabled: boolean; status: TicketStatus; feature: string; blockers: string }[]
  >(
    DEFAULT_MILESTONES.map((m) => ({
      week: m.week,
      enabled: m.week <= 4, // default enable early historical weeks
      status: m.week <= 4 ? 'Done' : 'In Progress',
      feature: m.title,
      blockers: 'None',
    }))
  );

  const [isVerifyingRepo, setIsVerifyingRepo] = useState(false);
  const [repoStatusMessage, setRepoStatusMessage] = useState<string | null>(null);

  if (!isOpen) return null;

  // Auto-generate repo name and URL when team name changes
  const handleTeamNameChange = (val: string) => {
    setTeamName(val);
    const slug = val
      .trim()
      .replace(/[^a-zA-Z0-9\s-]/g, '')
      .replace(/\s+/g, '-');
    if (!repoName || repoName === '') {
      setRepoName(slug);
    }
    if (!githubRepoUrl || githubRepoUrl.includes(GITHUB_ORG_NAME)) {
      setGithubRepoUrl(`https://github.com/${GITHUB_ORG_NAME}/${slug || 'mobile-project'}`);
    }
  };

  const addMemberRow = () => {
    setMembers([
      ...members,
      {
        name: '',
        studentId: '',
        githubUsername: '',
        email: '',
        section: section === 'OTHER' ? customSection : section,
        role: 'Mobile Developer',
        hasAcceptedOrg: true,
      },
    ]);
  };

  const removeMemberRow = (idx: number) => {
    if (members.length === 1) return;
    setMembers(members.filter((_, i) => i !== idx));
  };

  const updateMember = (idx: number, field: keyof TeamMember, value: any) => {
    const updated = [...members];
    updated[idx] = { ...updated[idx], [field]: value };
    // Auto-fill student email if studentId or name is typed
    if (field === 'studentId' && value && !updated[idx].email) {
      updated[idx].email = `s_${value}@uic.edu.ph`;
    }
    setMembers(updated);
  };

  const handleVerifyRepo = async () => {
    if (!githubRepoUrl) {
      setRepoStatusMessage('Please enter a GitHub repository URL first.');
      return;
    }
    setIsVerifyingRepo(true);
    setRepoStatusMessage(null);
    try {
      const res = await fetch('/api/github/sync-url', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url: githubRepoUrl }),
      });
      const data = await res.json();
      if (data.success) {
        setRepoStatusMessage(`Found repo! Fetched ${data.issuesCount || 0} issues & ${data.commitsCount || 0} recent commits.`);
      } else {
        setRepoStatusMessage(`Note: ${data.error || 'Repo not accessible publically yet, will create local track.'}`);
      }
    } catch (e: any) {
      setRepoStatusMessage('Could not reach GitHub API; registered locally.');
    } finally {
      setIsVerifyingRepo(false);
    }
  };

  const handleSave = () => {
    if (!teamName.trim()) {
      alert('Please enter a Team Name.');
      return;
    }

    const effectiveSection = section === 'OTHER' ? customSection || 'BSIT' : section;
    const { teamId, teamName: canonicalName, repoName: defaultRepo } = normalizeTeam(teamName);
    const finalRepoName = repoName.trim() || defaultRepo;

    // Filter valid members
    const validMembers = members
      .filter((m) => m.name.trim().length > 0)
      .map((m) => ({
        ...m,
        section: effectiveSection,
      }));

    if (validMembers.length === 0) {
      // Create at least one member placeholder from team lead if empty
      validMembers.push({
        name: `${teamName} Lead`,
        studentId: '240000000000',
        githubUsername: repoName.toLowerCase(),
        email: `lead_${teamId}@uic.edu.ph`,
        section: effectiveSection,
        role: 'Team Lead',
        hasAcceptedOrg: true,
      });
    }

    // Generate audits for enabled milestones
    const generatedAudits: AuditRecord[] = [];
    const leadStudent = validMembers[0];

    milestones.forEach((m) => {
      if (!m.enabled) return;

      const isDoc = m.week <= 4;
      generatedAudits.push({
        id: `custom-audit-${teamId}-w${m.week}-${Date.now()}`,
        timestamp: new Date().toLocaleString(),
        studentEmail: leadStudent.email,
        weekNumber: m.week,
        weekLabel: `Week ${m.week}: ${m.feature}`,
        section: effectiveSection,
        studentName: leadStudent.name,
        studentId: leadStudent.studentId,
        rawTeamName: teamName,
        teamId: teamId,
        teamName: canonicalName,
        githubUsername: leadStudent.githubUsername,
        orgInviteAccepted: leadStudent.hasAcceptedOrg ?? true,
        assignedFeature: m.feature,
        ticketNumber: `Milestone-W0${m.week}`,
        ticketStatus: m.status,
        commitUrl: githubRepoUrl,
        summary: `Accomplished milestone for Week ${m.week}: ${m.feature}`,
        blockers: m.blockers,
        sourceType: isDoc ? 'document' : 'google_form',
        date: new Date().toISOString().split('T')[0],
      });
    });

    // Generate initial Kanban cards
    const initialCards: KanbanCard[] = generatedAudits.map((a) => {
      let cardStatus: 'backlog' | 'in_progress' | 'review' | 'done' = 'backlog';
      if (a.ticketStatus === 'Done') cardStatus = 'done';
      else if (a.ticketStatus === 'In Progress') cardStatus = 'in_progress';
      else if (a.ticketStatus === 'Review') cardStatus = 'review';

      return {
        id: `kc-${a.id}`,
        teamId: a.teamId,
        title: a.assignedFeature,
        ticketNumber: a.ticketNumber,
        status: cardStatus,
        assignee: a.studentName,
        assigneeGithub: a.githubUsername,
        commitUrl: a.commitUrl,
        weekNumber: a.weekNumber,
        summary: a.summary,
        blockers: a.blockers,
        hasBlocker: Boolean(a.blockers && !a.blockers.toLowerCase().includes('none')),
        updatedAt: 'Just added',
        priority: a.ticketStatus === 'Done' ? 'low' : 'medium',
      };
    });

    const newTeam: Team = {
      id: teamId,
      name: canonicalName || teamName,
      repoName: finalRepoName,
      githubRepoUrl: githubRepoUrl || `https://github.com/${GITHUB_ORG_NAME}/${finalRepoName}`,
      section: effectiveSection,
      appDescription: appDescription || `${teamName} mobile application for ${effectiveSection}.`,
      members: validMembers,
      readinessScore: generatedAudits.length > 0 ? Math.min(100, 30 + generatedAudits.length * 8) : 25,
      healthStatus: 'on_track',
      healthReason: 'New team successfully registered with initial milestones configured.',
      kanbanCounts: {
        backlog: initialCards.filter((c) => c.status === 'backlog').length,
        inProgress: initialCards.filter((c) => c.status === 'in_progress').length,
        review: initialCards.filter((c) => c.status === 'review').length,
        done: initialCards.filter((c) => c.status === 'done').length,
      },
      totalTickets: initialCards.length,
      unresolvedBlockers: [],
      latestCommitDate: new Date().toISOString(),
      weeksLogged: generatedAudits.map((a) => a.weekNumber),
      mvpChecklist: {
        ideationApproved: generatedAudits.some((a) => a.weekNumber === 1),
        wireframesDone: generatedAudits.some((a) => a.weekNumber === 2),
        architectureDesigned: generatedAudits.some((a) => a.weekNumber === 3),
        initialRepoSetup: generatedAudits.some((a) => a.weekNumber === 4),
        coreBackendOrDb: generatedAudits.some((a) => a.weekNumber === 5 || a.weekNumber === 6),
        primaryScreensWorking: generatedAudits.some((a) => a.weekNumber === 7),
        packagingAndTesting: generatedAudits.some((a) => a.weekNumber === 8),
      },
    };

    onSaveTeam(newTeam, generatedAudits, initialCards);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-3xl w-full shadow-2xl flex flex-col max-h-[92vh] overflow-hidden text-slate-100">
        {/* Header */}
        <div className="p-5 border-b border-slate-800 flex items-center justify-between bg-slate-950/60">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-600/20 border border-indigo-500/30 flex items-center justify-center text-indigo-400">
              <Plus className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white flex items-center gap-2">
                Register New Mobile App Team & Students
              </h2>
              <p className="text-xs text-slate-400">
                Add a mobile project team, student members, GitHub repository/Kanban board, and Weeks 1–8 milestones.
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-slate-800 bg-slate-900/80 px-6 gap-2 text-xs font-semibold">
          <button
            onClick={() => setActiveTab('info')}
            className={`py-3 px-3 border-b-2 flex items-center gap-2 transition ${
              activeTab === 'info'
                ? 'border-indigo-500 text-indigo-300'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <FolderGit2 className="w-4 h-4" />
            1. Team & GitHub Info
          </button>
          <button
            onClick={() => setActiveTab('members')}
            className={`py-3 px-3 border-b-2 flex items-center gap-2 transition ${
              activeTab === 'members'
                ? 'border-indigo-500 text-indigo-300'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Users className="w-4 h-4" />
            2. Student Members ({members.length})
          </button>
          <button
            onClick={() => setActiveTab('milestones')}
            className={`py-3 px-3 border-b-2 flex items-center gap-2 transition ${
              activeTab === 'milestones'
                ? 'border-indigo-500 text-indigo-300'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Calendar className="w-4 h-4" />
            3. Progress Reports (Weeks 1–8)
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1 text-xs">
          {/* TAB 1: TEAM & GITHUB INFO */}
          {activeTab === 'info' && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">
                    Project / Team Name <span className="text-rose-400">*</span>
                  </label>
                  <input
                    type="text"
                    value={teamName}
                    onChange={(e) => handleTeamNameChange(e.target.value)}
                    placeholder="e.g. EcoTrack Mobile or MediCare App"
                    className="w-full bg-slate-800/80 border border-slate-700 rounded-xl px-3 py-2 text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
                  />
                  <span className="text-[10px] text-slate-500 mt-0.5 block">
                    Canonical name displayed on all dashboards and matrices.
                  </span>
                </div>

                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Class Section</label>
                  <select
                    value={section}
                    onChange={(e) => setSection(e.target.value)}
                    className="w-full bg-slate-800/80 border border-slate-700 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-indigo-500"
                  >
                    <option value="BSIT 3A & CS">BSIT 3A & CS</option>
                    <option value="BSIT 3B">BSIT 3B</option>
                    <option value="OTHER">Custom / Other Section...</option>
                  </select>
                  {section === 'OTHER' && (
                    <input
                      type="text"
                      value={customSection}
                      onChange={(e) => setCustomSection(e.target.value)}
                      placeholder="e.g. BSCS 4A"
                      className="mt-2 w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-1.5 text-white"
                    />
                  )}
                </div>
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">
                  Mobile App Project Description & Scope
                </label>
                <textarea
                  value={appDescription}
                  onChange={(e) => setAppDescription(e.target.value)}
                  placeholder="e.g. Cross-platform mobile ordering application with real-time push alerts, offline SQLite cache, and payment receipt scanning."
                  rows={2}
                  className="w-full bg-slate-800/80 border border-slate-700 rounded-xl px-3 py-2 text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
                />
              </div>

              {/* GitHub Repo & Kanban Config */}
              <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800 space-y-3">
                <div className="flex items-center gap-2 text-emerald-400 font-semibold">
                  <Github className="w-4 h-4" />
                  <span>GitHub Repository & Kanban Integration</span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-slate-300 text-[11px] font-medium mb-1">
                      Repository URL
                    </label>
                    <input
                      type="text"
                      value={githubRepoUrl}
                      onChange={(e) => setGithubRepoUrl(e.target.value)}
                      placeholder={`https://github.com/${GITHUB_ORG_NAME}/repo-name`}
                      className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-1.5 text-white font-mono text-[11px] focus:outline-none focus:border-emerald-500"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-300 text-[11px] font-medium mb-1">
                      GitHub Kanban Project / Board Link (Optional)
                    </label>
                    <input
                      type="text"
                      value={kanbanUrl}
                      onChange={(e) => setKanbanUrl(e.target.value)}
                      placeholder="https://github.com/orgs/UIC.../projects/1"
                      className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-1.5 text-white font-mono text-[11px] focus:outline-none focus:border-emerald-500"
                    />
                  </div>
                </div>

                <div className="flex items-center justify-between pt-1">
                  <p className="text-[11px] text-slate-400">
                    If this repository exists on GitHub, we can verify it right now to pull open issues and commits.
                  </p>
                  <button
                    type="button"
                    onClick={handleVerifyRepo}
                    disabled={isVerifyingRepo || !githubRepoUrl}
                    className="px-3 py-1 bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 rounded-lg text-xs font-medium transition disabled:opacity-50"
                  >
                    {isVerifyingRepo ? 'Verifying...' : 'Test & Inspect Repo'}
                  </button>
                </div>

                {repoStatusMessage && (
                  <div className="p-2.5 rounded-lg bg-indigo-950/40 border border-indigo-800/60 text-indigo-300 text-[11px]">
                    {repoStatusMessage}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* TAB 2: STUDENT MEMBERS */}
          {activeTab === 'members' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-semibold text-slate-200">Team Roster</h3>
                  <p className="text-[11px] text-slate-400">
                    Students will be matched against Google Form submissions and GitHub commit authors.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={addMemberRow}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white font-medium transition"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add Student</span>
                </button>
              </div>

              <div className="space-y-3">
                {members.map((m, idx) => (
                  <div
                    key={idx}
                    className="p-3.5 rounded-xl bg-slate-950/60 border border-slate-800/80 space-y-2.5 relative group"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-semibold text-indigo-300 text-[11px]">
                        Student #{idx + 1}
                      </span>
                      {members.length > 1 && (
                        <button
                          type="button"
                          onClick={() => removeMemberRow(idx)}
                          className="text-slate-500 hover:text-rose-400 transition p-1"
                          title="Remove student"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-2.5">
                      <div>
                        <label className="block text-[10px] text-slate-400 mb-0.5">
                          Full Name (Last, First)
                        </label>
                        <input
                          type="text"
                          value={m.name}
                          onChange={(e) => updateMember(idx, 'name', e.target.value)}
                          placeholder="e.g. Cruz, Juan M."
                          className="w-full bg-slate-900 border border-slate-700 rounded-lg px-2.5 py-1.5 text-white focus:outline-none focus:border-indigo-500"
                        />
                      </div>

                      <div>
                        <label className="block text-[10px] text-slate-400 mb-0.5">
                          Student ID
                        </label>
                        <input
                          type="text"
                          value={m.studentId}
                          onChange={(e) => updateMember(idx, 'studentId', e.target.value)}
                          placeholder="e.g. 240000001234"
                          className="w-full bg-slate-900 border border-slate-700 rounded-lg px-2.5 py-1.5 text-white font-mono text-[11px] focus:outline-none focus:border-indigo-500"
                        />
                      </div>

                      <div>
                        <label className="block text-[10px] text-slate-400 mb-0.5">
                          GitHub Username
                        </label>
                        <input
                          type="text"
                          value={m.githubUsername}
                          onChange={(e) => updateMember(idx, 'githubUsername', e.target.value)}
                          placeholder="e.g. juancruz-dev"
                          className="w-full bg-slate-900 border border-slate-700 rounded-lg px-2.5 py-1.5 text-white font-mono text-[11px] focus:outline-none focus:border-indigo-500"
                        />
                      </div>

                      <div>
                        <label className="block text-[10px] text-slate-400 mb-0.5">
                          Assigned Role
                        </label>
                        <select
                          value={m.role}
                          onChange={(e) => updateMember(idx, 'role', e.target.value)}
                          className="w-full bg-slate-900 border border-slate-700 rounded-lg px-2.5 py-1.5 text-white text-[11px] focus:outline-none focus:border-indigo-500"
                        >
                          <option value="Lead Developer">Lead Developer</option>
                          <option value="UI/UX Designer">UI/UX Designer</option>
                          <option value="Backend & Database">Backend & Database</option>
                          <option value="Mobile Core Logic">Mobile Core Logic</option>
                          <option value="QA & Documentation">QA & Documentation</option>
                        </select>
                      </div>
                    </div>

                    <div className="flex items-center justify-between pt-1 text-[11px]">
                      <div className="text-slate-400 flex items-center gap-1.5">
                        <span>Email:</span>
                        <input
                          type="email"
                          value={m.email}
                          onChange={(e) => updateMember(idx, 'email', e.target.value)}
                          placeholder="s_24000000...@uic.edu.ph"
                          className="bg-transparent border-b border-slate-700 text-slate-300 font-mono text-[10px] px-1 py-0.5 focus:outline-none focus:border-indigo-500"
                        />
                      </div>
                      <label className="flex items-center gap-1.5 text-slate-300 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={m.hasAcceptedOrg}
                          onChange={(e) => updateMember(idx, 'hasAcceptedOrg', e.target.checked)}
                          className="rounded text-emerald-500 bg-slate-900 border-slate-700"
                        />
                        <span>Accepted Org Invite</span>
                      </label>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 3: PROGRESS REPORTS (WEEKS 1 TO 8) */}
          {activeTab === 'milestones' && (
            <div className="space-y-4">
              <div className="p-3 rounded-xl bg-indigo-950/40 border border-indigo-800/60 flex items-start gap-2.5">
                <Sparkles className="w-4 h-4 text-indigo-400 shrink-0 mt-0.5" />
                <div className="text-[11px] text-indigo-200">
                  <p className="font-semibold">Unify Historical & Current Progress (Weeks 1 to 8):</p>
                  <p className="text-slate-300 mt-0.5">
                    Select which weeks this team has already complied with. Checked weeks will be recorded into the 8-Week Audit Matrix and automatically seeded onto their Kanban board!
                  </p>
                </div>
              </div>

              <div className="space-y-2">
                {milestones.map((m, idx) => (
                  <div
                    key={m.week}
                    className={`p-3 rounded-xl border transition ${
                      m.enabled
                        ? m.week <= 4
                          ? 'bg-amber-500/[0.04] border-amber-500/30'
                          : 'bg-emerald-500/[0.04] border-emerald-500/30'
                        : 'bg-slate-950/30 border-slate-800/60 opacity-60'
                    }`}
                  >
                    <div className="flex items-center justify-between gap-3">
                      <div className="flex items-center gap-2.5">
                        <input
                          type="checkbox"
                          checked={m.enabled}
                          onChange={(e) => {
                            const updated = [...milestones];
                            updated[idx].enabled = e.target.checked;
                            setMilestones(updated);
                          }}
                          className="w-4 h-4 rounded text-indigo-500 bg-slate-900 border-slate-700"
                        />
                        <span
                          className={`font-mono font-bold text-[11px] px-2 py-0.5 rounded ${
                            m.week <= 4
                              ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                              : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                          }`}
                        >
                          Week {m.week} {m.week <= 4 ? '(Doc Format)' : '(Google Form)'}
                        </span>
                        <input
                          type="text"
                          value={m.feature}
                          onChange={(e) => {
                            const updated = [...milestones];
                            updated[idx].feature = e.target.value;
                            setMilestones(updated);
                          }}
                          className="bg-transparent text-slate-200 font-medium text-xs focus:outline-none focus:border-b border-indigo-500 px-1"
                        />
                      </div>

                      {m.enabled && (
                        <div className="flex items-center gap-2">
                          <select
                            value={m.status}
                            onChange={(e) => {
                              const updated = [...milestones];
                              updated[idx].status = e.target.value as TicketStatus;
                              setMilestones(updated);
                            }}
                            className={`px-2 py-1 rounded text-[11px] font-semibold border ${
                              m.status === 'Done'
                                ? 'bg-emerald-950/60 text-emerald-400 border-emerald-700'
                                : m.status === 'In Progress'
                                ? 'bg-blue-950/60 text-blue-400 border-blue-700'
                                : m.status === 'Review'
                                ? 'bg-purple-950/60 text-purple-400 border-purple-700'
                                : 'bg-slate-800 text-slate-400 border-slate-700'
                            }`}
                          >
                            <option value="Done">Done</option>
                            <option value="In Progress">In Progress</option>
                            <option value="Review">Review</option>
                            <option value="Backlog">Backlog</option>
                          </select>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="p-4 border-t border-slate-800 bg-slate-950 flex items-center justify-between">
          <div className="text-[11px] text-slate-400 flex items-center gap-2">
            <span>Org:</span>
            <code className="text-emerald-400 font-mono">{GITHUB_ORG_NAME}</code>
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
              className="px-5 py-2 rounded-xl text-xs font-semibold bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white shadow-md shadow-indigo-500/20 transition active:scale-95 flex items-center gap-1.5"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>Save Team & Create Board</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
