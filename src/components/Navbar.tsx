import React from 'react';
import {
  FolderGit2,
  UploadCloud,
  GraduationCap,
  Download,
  Search,
  Filter,
  CheckCircle2,
  AlertTriangle,
  Flame,
  Layers,
  Users,
  Lock,
  LogOut,
  Eye,
  EyeOff,
  ShieldCheck,
  RefreshCw,
  ExternalLink,
} from 'lucide-react';
import { GITHUB_ORG_NAME } from '../data/defaultData';

interface NavbarProps {
  currentSection: string;
  onSectionChange: (sec: string) => void;
  searchQuery: string;
  onSearchChange: (q: string) => void;
  onOpenIngestion: () => void;
  onOpenDefense: () => void;
  onOpenGitHubSync: () => void;
  onOpenAddTeam?: () => void;
  onExport: () => void;
  activeView: 'teams' | 'kanban' | 'matrix' | 'blockers';
  onViewChange: (v: 'teams' | 'kanban' | 'matrix' | 'blockers') => void;
  stats: {
    totalTeams: number;
    onTrackCount: number;
    atRiskCount: number;
    blockedCount: number;
    totalAudits: number;
  };
  isAdmin: boolean;
  previewAsStudent: boolean;
  onTogglePreviewAsStudent: () => void;
  onOpenLogin: () => void;
  onLogout: () => void;
  isSavingToServer?: boolean;
  onQuickSyncForms?: () => void;
  isSyncingForms?: boolean;
  lastFormsSyncTime?: string | null;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentSection,
  onSectionChange,
  searchQuery,
  onSearchChange,
  onOpenIngestion,
  onOpenDefense,
  onOpenGitHubSync,
  onOpenAddTeam,
  onExport,
  activeView,
  onViewChange,
  stats,
  isAdmin,
  previewAsStudent,
  onTogglePreviewAsStudent,
  onOpenLogin,
  onLogout,
  isSavingToServer = false,
  onQuickSyncForms,
  isSyncingForms = false,
  lastFormsSyncTime = null,
}) => {
  const isEffectiveAdmin = isAdmin && !previewAsStudent;

  return (
    <header className="bg-slate-900 border-b border-slate-800 text-slate-100 sticky top-0 z-40 shadow-lg">
      {/* Top Banner: University & Course Info */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-3 pb-2 flex flex-col md:flex-row items-start md:items-center justify-between gap-3 border-b border-slate-800/80">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-indigo-500 flex items-center justify-center text-white font-bold">
            <GraduationCap className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs uppercase tracking-wider font-semibold text-indigo-400">
                Mobile Dev Class Tracker • Joshua M. Cister
              </span>
              {isEffectiveAdmin ? (
                <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-medium bg-slate-800 text-slate-200 border border-slate-700">
                  <ShieldCheck className="w-3 h-3 mr-1 text-indigo-400" />
                  Teacher / Admin
                </span>
              ) : previewAsStudent ? (
                <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-medium bg-slate-800 text-slate-200 border border-slate-700">
                  <Eye className="w-3 h-3 mr-1 text-indigo-400" />
                  Previewing Student View
                </span>
              ) : (
                <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-medium bg-slate-800 text-slate-300 border border-slate-700">
                  Student Portal • View Only
                </span>
              )}
            </div>
            <h1 className="text-lg sm:text-xl font-bold tracking-tight text-white flex items-center gap-2">
              Mobile App Project Tracker & Kanban Monitor
            </h1>
          </div>
        </div>

        {/* Action Controls & Authentication */}
        <div className="flex flex-wrap items-center gap-2 self-stretch md:self-auto">
          {/* Admin Sync Status Indicator */}
          {isEffectiveAdmin && (
            <span
              className={`hidden lg:inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[11px] font-mono border ${
                isSavingToServer
                  ? 'bg-amber-500/10 border-amber-500/30 text-amber-300 animate-pulse'
                  : 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400'
              }`}
              title="Persistent server data sync status"
            >
              <span className={`w-1.5 h-1.5 rounded-full ${isSavingToServer ? 'bg-amber-400' : 'bg-emerald-400'}`}></span>
              <span>{isSavingToServer ? 'Syncing to Server...' : 'Server Synced'}</span>
            </span>
          )}

          {/* Teacher Mode Controls */}
          {isEffectiveAdmin ? (
            <>
              {/* Preview as Student Toggle */}
              <button
                onClick={onTogglePreviewAsStudent}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold border border-slate-700 shadow-sm transition active:scale-95"
                title="Preview what students see on this deployed page"
              >
                <Eye className="w-3.5 h-3.5 text-indigo-400" />
                <span>Student Preview</span>
              </button>

              {onOpenAddTeam && (
                <button
                  onClick={onOpenAddTeam}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold shadow-sm transition active:scale-95"
                  title="Register a new team, student roster, and Weeks 1-8 progress"
                >
                  <Users className="w-3.5 h-3.5" />
                  <span>+ Add Team</span>
                </button>
              )}

              {/* 1-Click Quick Sync Forms Button */}
              {onQuickSyncForms && (
                <button
                  onClick={onQuickSyncForms}
                  disabled={isSyncingForms}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-600/90 hover:bg-emerald-600 text-white text-xs font-semibold shadow-sm transition active:scale-95 disabled:opacity-60"
                  title="1-Click Instant Sync of Google Form responses from linked Google Sheet (zero duplicates)"
                >
                  <RefreshCw className={`w-3.5 h-3.5 text-emerald-200 ${isSyncingForms ? 'animate-spin' : ''}`} />
                  <span>{isSyncingForms ? 'Syncing Forms...' : 'Sync Forms'}</span>
                  {!isSyncingForms && (
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-300 animate-pulse"></span>
                  )}
                </button>
              )}

              <button
                onClick={onOpenGitHubSync}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-teal-700/80 hover:bg-teal-700 text-white text-xs font-semibold shadow-sm transition active:scale-95"
                title="Sync dynamic GitHub Kanban boards and repository issues directly"
              >
                <FolderGit2 className="w-3.5 h-3.5 text-teal-200" />
                <span>Live Sync</span>
                <span className="w-1.5 h-1.5 rounded-full bg-teal-200 animate-ping"></span>
              </button>

              <button
                onClick={onOpenIngestion}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold border border-slate-700 shadow-sm transition active:scale-95"
                title="Unify Google Forms (W5-8) & Document Reports (W1-4)"
              >
                <UploadCloud className="w-3.5 h-3.5 text-indigo-400" />
                <span>Unify Reports</span>
              </button>

              <button
                onClick={onOpenDefense}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-purple-600/90 hover:bg-purple-600 text-white text-xs font-semibold shadow-sm transition active:scale-95"
                title="AI Oral Presentation Defense Evaluator"
              >
                <Flame className="w-3.5 h-3.5 text-amber-300" />
                <span>Defense AI</span>
              </button>

              <button
                onClick={onExport}
                className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium border border-slate-700 transition"
                title="Export Unified Audit Sheet"
              >
                <Download className="w-3.5 h-3.5 text-slate-400" />
                <span>Export</span>
              </button>

              <button
                onClick={onLogout}
                className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-rose-950/40 hover:bg-rose-900/60 text-rose-300 border border-rose-800/60 text-xs font-medium transition"
                title="Log out of Admin Mode"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>Logout</span>
              </button>
            </>
          ) : previewAsStudent ? (
            /* Button to exit student preview */
            <button
              onClick={onTogglePreviewAsStudent}
              className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-amber-600 hover:bg-amber-500 text-white text-xs font-semibold shadow-md transition active:scale-95"
            >
              <EyeOff className="w-3.5 h-3.5" />
              <span>Exit Student Preview</span>
            </button>
          ) : (
            /* Student Mode - Action links & Teacher Login button */
            <div className="flex items-center gap-2">
              <a
                href="https://docs.google.com/forms/d/1UpePK5pjkXIr67T3zpSHIVKRHRYucYzVKEcHJGAxSvE/edit"
                target="_blank"
                rel="noreferrer"
                className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-600/90 hover:bg-emerald-600 text-white text-xs font-semibold shadow-sm transition active:scale-95"
                title="Fill out or update your progress report form"
              >
                <span>Submit Form</span>
                <ExternalLink className="w-3 h-3" />
              </a>

              <a
                href="https://github.com/UIC-CCS-MOBILE-DEVELOPMENT-2026-2027"
                target="_blank"
                rel="noreferrer"
                className="hidden md:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700 text-xs font-medium transition"
                title="Open GitHub Organization for Mobile Dev Projects"
              >
                <FolderGit2 className="w-3.5 h-3.5 text-indigo-400" />
                <span>GitHub Org</span>
              </a>

              <button
                onClick={onOpenLogin}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-indigo-300 hover:text-white border border-slate-700 text-xs font-semibold shadow-sm transition active:scale-95"
                title="Instructors: Sign in to manage teams and progress records"
              >
                <Lock className="w-3.5 h-3.5 text-indigo-400" />
                <span>Teacher Login</span>
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Bottom Bar: Views & Filters */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2.5 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
        {/* Navigation Tabs */}
        <nav className="flex items-center gap-1 bg-slate-950/60 p-1 rounded-xl border border-slate-800 overflow-x-auto">
          {isEffectiveAdmin ? (
            <>
              <button
                onClick={() => onViewChange('teams')}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-semibold transition whitespace-nowrap ${
                  activeView === 'teams'
                    ? 'bg-indigo-600 text-white shadow-sm'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
                }`}
              >
                <Layers className="w-3.5 h-3.5" />
                <span>Teams & Repositories ({stats.totalTeams})</span>
              </button>

              <button
                onClick={() => onViewChange('kanban')}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-semibold transition whitespace-nowrap ${
                  activeView === 'kanban'
                    ? 'bg-indigo-600 text-white shadow-sm'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
                }`}
              >
                <FolderGit2 className="w-3.5 h-3.5" />
                <span>Kanban Boards</span>
              </button>

              <button
                onClick={() => onViewChange('matrix')}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-semibold transition whitespace-nowrap ${
                  activeView === 'matrix'
                    ? 'bg-indigo-600 text-white shadow-sm'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
                }`}
              >
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Weeks 1–8 Progress Matrix</span>
              </button>

              <button
                onClick={() => onViewChange('blockers')}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-semibold transition whitespace-nowrap ${
                  activeView === 'blockers'
                    ? 'bg-amber-600 text-white shadow-sm'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
                }`}
              >
                <AlertTriangle className="w-3.5 h-3.5 text-amber-400" />
                <span>Blockers & Risk Radar</span>
                {stats.blockedCount > 0 && (
                  <span className="ml-1 px-1.5 py-0.2 rounded-full text-[10px] font-bold bg-amber-500/20 text-amber-300">
                    {stats.blockedCount}
                  </span>
                )}
              </button>
            </>
          ) : (
            /* Student Mode: Single Focused Progress Matrix Tab */
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-semibold bg-indigo-600 text-white shadow-sm">
              <CheckCircle2 className="w-4 h-4 text-emerald-300" />
              <span>Weeks 1–8 Progress Matrix ({stats.totalTeams} Teams)</span>
            </div>
          )}
        </nav>

        {/* Section Filter & Search */}
        <div className="flex items-center gap-2">
          {/* Section Selector */}
          <div className="flex items-center gap-1.5 bg-slate-950/60 px-2.5 py-1 rounded-xl border border-slate-800 text-xs">
            <Filter className="w-3.5 h-3.5 text-slate-400" />
            <select
              value={currentSection}
              onChange={(e) => onSectionChange(e.target.value)}
              className="bg-transparent text-slate-200 focus:outline-none cursor-pointer pr-1"
            >
              <option value="ALL" className="bg-slate-900 text-slate-200">
                All Sections
              </option>
              <option value="BSIT 3A & CS" className="bg-slate-900 text-slate-200">
                BSIT 3A & CS
              </option>
              <option value="BSIT 3B" className="bg-slate-900 text-slate-200">
                BSIT 3B
              </option>
            </select>
          </div>

          {/* Search Box */}
          <div className="relative flex-1 sm:w-64">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder="Search team, student, github..."
              className="w-full pl-8 pr-3 py-1.5 rounded-xl bg-slate-950/60 border border-slate-800 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-indigo-500 transition"
            />
          </div>
        </div>
      </div>
    </header>
  );
};
