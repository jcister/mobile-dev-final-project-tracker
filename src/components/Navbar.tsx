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
}) => {
  return (
    <header className="bg-slate-900 border-b border-slate-800 text-slate-100 sticky top-0 z-40 shadow-lg">
      {/* Top Banner: University & Course Info */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-3 pb-2 flex flex-col md:flex-row items-start md:items-center justify-between gap-3 border-b border-slate-800/80">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 via-purple-600 to-pink-500 flex items-center justify-center shadow-md shadow-indigo-500/20 text-white font-bold">
            <GraduationCap className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs uppercase tracking-wider font-semibold text-indigo-400">
                UIC • College of Computer Studies • COD-IT
              </span>
              <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-medium bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 mr-1.5 animate-pulse"></span>
                Active Audit Cycle
              </span>
            </div>
            <h1 className="text-lg sm:text-xl font-bold tracking-tight text-white flex items-center gap-2">
              Mobile App Project Tracker & Kanban Monitor
            </h1>
          </div>
        </div>

        {/* GitHub Org Info & Action Buttons */}
        <div className="flex flex-wrap items-center gap-2 self-stretch md:self-auto">
          {onOpenAddTeam && (
            <button
              onClick={onOpenAddTeam}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold shadow-sm transition active:scale-95"
              title="Register a new team, student roster, and Weeks 1-8 progress"
            >
              <Users className="w-3.5 h-3.5" />
              <span>+ Add Team & Students</span>
            </button>
          )}

          <button
            onClick={onOpenGitHubSync}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-600/90 hover:bg-emerald-600 text-white text-xs font-semibold shadow-sm transition active:scale-95"
            title="Sync dynamic GitHub Kanban boards and repository issues directly"
          >
            <FolderGit2 className="w-3.5 h-3.5 text-emerald-200" />
            <span>Live GitHub Sync</span>
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-200 animate-ping"></span>
          </button>

          <button
            onClick={onOpenIngestion}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold border border-slate-700 shadow-sm transition active:scale-95"
            title="Unify Google Forms (W5-8) & Document Reports (W1-4)"
          >
            <UploadCloud className="w-3.5 h-3.5 text-indigo-400" />
            <span>Unify Reports (W1-8)</span>
          </button>

          <button
            onClick={onOpenDefense}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-purple-600/90 hover:bg-purple-600 text-white text-xs font-semibold shadow-sm transition active:scale-95"
            title="AI Oral Presentation Defense Evaluator"
          >
            <Flame className="w-3.5 h-3.5 text-amber-300" />
            <span>Defense AI Advisor</span>
          </button>

          <button
            onClick={onExport}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium border border-slate-700 transition"
            title="Export Unified Audit Sheet"
          >
            <Download className="w-3.5 h-3.5 text-slate-400" />
            <span>Export</span>
          </button>
        </div>
      </div>

      {/* Bottom Bar: Views & Filters */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2.5 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
        {/* Navigation Tabs */}
        <nav className="flex items-center gap-1 bg-slate-950/60 p-1 rounded-xl border border-slate-800 overflow-x-auto">
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
