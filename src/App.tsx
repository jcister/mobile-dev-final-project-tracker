import React, { useState, useMemo, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { OverviewCards } from './components/OverviewCards';
import { TeamsView } from './components/TeamsView';
import { KanbanBoardView } from './components/KanbanBoardView';
import { UnifiedMatrixView } from './components/UnifiedMatrixView';
import { BlockersView } from './components/BlockersView';
import { TeamDetailModal } from './components/TeamDetailModal';
import { DataIngestionModal } from './components/DataIngestionModal';
import { DefenseModal } from './components/DefenseModal';
import { GitHubSyncModal } from './components/GitHubSyncModal';
import { AddTeamModal } from './components/AddTeamModal';
import { AddAuditModal } from './components/AddAuditModal';
import { EditTeamModal } from './components/EditTeamModal';
import { DeleteTeamModal } from './components/DeleteTeamModal';
import {
  INITIAL_UNIFIED_AUDITS,
  computeTeams,
  generateKanbanCards,
  DEMO_SAMPLE_AUDITS,
  STUDYSYNC_CANONICAL_AUDITS,
} from './data/defaultData';
import { AuditRecord, Team, KanbanCard } from './types';

const STORAGE_KEY = 'uic_mobile_dev_unified_audits_v2';
const CARDS_STORAGE_KEY = 'uic_mobile_dev_kanban_cards_v2';
const CUSTOM_TEAMS_STORAGE_KEY = 'uic_mobile_dev_custom_teams_v1';
const TEAM_OVERRIDES_STORAGE_KEY = 'uic_mobile_dev_team_overrides_v1';
const DELETED_TEAMS_STORAGE_KEY = 'uic_mobile_dev_deleted_teams_v1';

// Helper to consolidate any fragmented raw rows (e.g. 11 sub-clauses) into the 4 canonical weekly milestones
function sanitizeAudits(raw: AuditRecord[]): AuditRecord[] {
  const isStudySync = (a: AuditRecord) =>
    a.teamId === 'studysync' ||
    (a.rawTeamName && a.rawTeamName.toLowerCase().includes('studysync')) ||
    (a.teamName && a.teamName.toLowerCase().includes('studysync')) ||
    (a.studentName && a.studentName.toLowerCase().includes('allawan'));

  const studySyncAudits = raw.filter(isStudySync);
  const otherAudits = raw.filter((a) => !isStudySync(a));

  if (studySyncAudits.length === 0) {
    return [...STUDYSYNC_CANONICAL_AUDITS, ...otherAudits];
  }

  // If previous raw regex parsing split the 3 PDFs into 11 fragments, consolidate to the 4 canonical milestones
  if (studySyncAudits.length !== 4) {
    return [...STUDYSYNC_CANONICAL_AUDITS, ...otherAudits];
  }

  return raw;
}

function sanitizeCards(cards: KanbanCard[]): KanbanCard[] {
  const isStudySyncCard = (c: KanbanCard) =>
    c.teamId === 'studysync' ||
    (c.assignee && c.assignee.toLowerCase().includes('allawan'));

  const ssCards = cards.filter(isStudySyncCard);
  if (ssCards.length !== 4) {
    const nonSsCards = cards.filter((c) => !isStudySyncCard(c));
    const ssMilestones = generateKanbanCards(STUDYSYNC_CANONICAL_AUDITS);
    return [...ssMilestones, ...nonSsCards];
  }
  return cards;
}

export default function App() {
  // Load custom registered teams
  const [customTeams, setCustomTeams] = useState<Team[]>(() => {
    try {
      const saved = localStorage.getItem(CUSTOM_TEAMS_STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) return parsed;
      }
    } catch (e) {
      console.error('Failed to load custom teams', e);
    }
    return [];
  });

  // Load audits with initial default fallback and automatic consolidation to right quantity
  const [audits, setAudits] = useState<AuditRecord[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return sanitizeAudits(parsed);
        }
      }
    } catch (e) {
      console.error('Failed to load audits from localStorage', e);
    }
    return INITIAL_UNIFIED_AUDITS;
  });

  // Load custom Kanban cards
  const [customCards, setCustomCards] = useState<KanbanCard[]>(() => {
    try {
      const saved = localStorage.getItem(CARDS_STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return sanitizeCards(parsed);
        }
      }
    } catch (e) {
      console.error('Failed to load cards from localStorage', e);
    }
    return generateKanbanCards(INITIAL_UNIFIED_AUDITS);
  });

  // Load team overrides (custom edits to any team's name, repo, kanban link, members)
  const [teamOverrides, setTeamOverrides] = useState<Record<string, Partial<Team>>>(() => {
    try {
      const saved = localStorage.getItem(TEAM_OVERRIDES_STORAGE_KEY);
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error('Failed to load team overrides', e);
    }
    return {};
  });

  // Load deleted team IDs
  const [deletedTeamIds, setDeletedTeamIds] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem(DELETED_TEAMS_STORAGE_KEY);
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error('Failed to load deleted teams', e);
    }
    return [];
  });

  // Save to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(CUSTOM_TEAMS_STORAGE_KEY, JSON.stringify(customTeams));
    } catch (e) {
      console.error(e);
    }
  }, [customTeams]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(audits));
    } catch (e) {
      console.error(e);
    }
  }, [audits]);

  useEffect(() => {
    try {
      localStorage.setItem(CARDS_STORAGE_KEY, JSON.stringify(customCards));
    } catch (e) {
      console.error(e);
    }
  }, [customCards]);

  useEffect(() => {
    try {
      localStorage.setItem(TEAM_OVERRIDES_STORAGE_KEY, JSON.stringify(teamOverrides));
    } catch (e) {
      console.error(e);
    }
  }, [teamOverrides]);

  useEffect(() => {
    try {
      localStorage.setItem(DELETED_TEAMS_STORAGE_KEY, JSON.stringify(deletedTeamIds));
    } catch (e) {
      console.error(e);
    }
  }, [deletedTeamIds]);

  // Compute live teams (seeded with custom registered teams, overrides, and deleted filter)
  const allTeams = useMemo(
    () => computeTeams(audits, customTeams, teamOverrides, deletedTeamIds),
    [audits, customTeams, teamOverrides, deletedTeamIds]
  );

  // Navigation & Filtering state
  const [activeView, setActiveView] = useState<'teams' | 'kanban' | 'matrix' | 'blockers'>('teams');
  const [currentSection, setCurrentSection] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Modals state
  const [selectedTeamForModal, setSelectedTeamForModal] = useState<Team | null>(null);
  const [editingTeam, setEditingTeam] = useState<Team | null>(null);
  const [deletingTeam, setDeletingTeam] = useState<Team | null>(null);
  const [selectedTeamForKanban, setSelectedTeamForKanban] = useState<string>('ALL');
  const [defenseModalOpen, setDefenseModalOpen] = useState(false);
  const [defenseTeamId, setDefenseTeamId] = useState<string>('');
  const [ingestionModalOpen, setIngestionModalOpen] = useState(false);
  const [gitHubSyncModalOpen, setGitHubSyncModalOpen] = useState(false);
  const [addTeamModalOpen, setAddTeamModalOpen] = useState(false);
  const [addAuditModalOpen, setAddAuditModalOpen] = useState(false);
  const [auditPrefill, setAuditPrefill] = useState<{
    teamId?: string;
    studentName?: string;
    weekNumber?: number;
  }>({});
  const [liveNotification, setLiveNotification] = useState<{
    studentName: string;
    teamName: string;
    weekLabel: string;
    feature: string;
  } | null>(null);

  // Poll for live Google Form webhook audits every 15 seconds
  useEffect(() => {
    const interval = setInterval(async () => {
      try {
        const res = await fetch('/api/forms/live-webhook-audits');
        const json = await res.json();
        if (json.success && json.audits && json.audits.length > 0) {
          setAudits((prev) => {
            const existingIds = new Set(prev.map((a) => a.id));
            const newOnes = json.audits.filter((a: any) => !existingIds.has(a.id));
            if (newOnes.length > 0) {
              const latest = newOnes[0];
              setLiveNotification({
                studentName: latest.studentName,
                teamName: latest.rawTeamName,
                weekLabel: latest.weekLabel,
                feature: latest.assignedFeature,
              });
              setTimeout(() => setLiveNotification(null), 7000);
              return [...newOnes, ...prev];
            }
            return prev;
          });
        }
      } catch (e) {
        // Silent poller
      }
    }, 15000);

    return () => clearInterval(interval);
  }, []);

  // Filtered teams based on section and search query
  const filteredTeams = useMemo(() => {
    return allTeams.filter((t) => {
      const matchesSection = currentSection === 'ALL' || t.section === currentSection;
      const q = searchQuery.toLowerCase().trim();
      const matchesSearch =
        q === '' ||
        t.name.toLowerCase().includes(q) ||
        t.repoName.toLowerCase().includes(q) ||
        t.members.some((m) => m.name.toLowerCase().includes(q) || m.githubUsername.toLowerCase().includes(q));
      return matchesSection && matchesSearch;
    });
  }, [allTeams, currentSection, searchQuery]);

  // Filtered audits based on section and search
  const filteredAudits = useMemo(() => {
    return audits.filter((a) => {
      const matchesSection = currentSection === 'ALL' || a.section === currentSection;
      const q = searchQuery.toLowerCase().trim();
      const matchesSearch =
        q === '' ||
        a.teamName.toLowerCase().includes(q) ||
        a.studentName.toLowerCase().includes(q) ||
        a.assignedFeature.toLowerCase().includes(q) ||
        a.githubUsername.toLowerCase().includes(q);
      return matchesSection && matchesSearch;
    });
  }, [audits, currentSection, searchQuery]);

  // Stats calculation
  const stats = useMemo(() => {
    const totalTeams = filteredTeams.length;
    const onTrackCount = filteredTeams.filter((t) => t.healthStatus === 'on_track').length;
    const atRiskCount = filteredTeams.filter((t) => t.healthStatus === 'needs_attention').length;
    const blockedCount = filteredTeams.filter((t) => t.healthStatus === 'blocked').length;
    return {
      totalTeams,
      onTrackCount,
      atRiskCount,
      blockedCount,
      totalAudits: filteredAudits.length,
    };
  }, [filteredTeams, filteredAudits]);

  // Actions
  const handleOpenDefenseForTeam = (team: Team) => {
    setDefenseTeamId(team.id);
    setDefenseModalOpen(true);
  };

  const handleOpenKanbanForTeam = (teamId: string) => {
    setSelectedTeamForKanban(teamId);
    setActiveView('kanban');
  };

  const handleMoveCard = (cardId: string, newStatus: 'backlog' | 'in_progress' | 'review' | 'done') => {
    setCustomCards((prev) =>
      prev.map((c) => (c.id === cardId ? { ...c, status: newStatus } : c))
    );
  };

  const handleAddCard = (newCardData: Omit<KanbanCard, 'id' | 'updatedAt'>) => {
    const newCard: KanbanCard = {
      ...newCardData,
      id: `custom-card-${Date.now()}`,
      updatedAt: new Date().toLocaleDateString(),
    };
    setCustomCards((prev) => [newCard, ...prev]);
  };

  const handleMergeAudits = (newAudits: AuditRecord[]) => {
    setAudits((prev) => {
      const existingIds = new Set(prev.map((a) => a.id));
      const filteredNew = newAudits.filter((a) => !existingIds.has(a.id));
      const merged = [...prev, ...filteredNew];
      // Also update cards
      setCustomCards(generateKanbanCards(merged));
      return merged;
    });
  };

  const handleApplySyncedCards = (newCards: KanbanCard[], teamId?: string) => {
    setCustomCards((prev) => {
      const newIds = new Set(newCards.map((c) => c.id));
      let filtered = prev.filter((c) => !newIds.has(c.id));
      if (teamId) {
        filtered = filtered.filter((c) => c.teamId !== teamId);
      }
      return [...newCards, ...filtered];
    });

    // Also reflect live issues in the audit matrix so presentation readiness stays live
    setAudits((prev) => {
      const updated = [...prev];
      newCards.forEach((c) => {
        const ticketStatus: 'Done' | 'In Progress' | 'Review' | 'Backlog' =
          c.status === 'done' ? 'Done' : c.status === 'review' ? 'Review' : c.status === 'in_progress' ? 'In Progress' : 'Backlog';

        const existingIdx = updated.findIndex(
          (a) => a.ticketNumber === c.ticketNumber || (a.teamId === c.teamId && a.assignedFeature === c.title)
        );

        if (existingIdx >= 0) {
          updated[existingIdx] = {
            ...updated[existingIdx],
            ticketStatus,
            commitUrl: c.commitUrl || updated[existingIdx].commitUrl,
            summary: c.summary || updated[existingIdx].summary,
          };
        } else {
          const team = allTeams.find((t) => t.id === c.teamId);
          updated.push({
            id: `gh-live-${c.id}`,
            timestamp: new Date().toISOString(),
            studentEmail: `${(c.assigneeGithub || 'student').toLowerCase()}@uic.edu.ph`,
            weekNumber: 7,
            weekLabel: 'Week 7 (Live GitHub Sync)',
            section: team?.section || 'BSIT',
            studentName: c.assignee || 'Assigned Student',
            studentId: '',
            rawTeamName: team?.name || c.teamId,
            teamId: c.teamId,
            teamName: team?.name || c.teamId,
            githubUsername: c.assigneeGithub || '',
            orgInviteAccepted: true,
            assignedFeature: c.title,
            ticketNumber: c.ticketNumber,
            ticketStatus,
            commitUrl: c.commitUrl || '',
            summary: c.summary,
            blockers: c.blockers || 'None',
            sourceType: 'google_form',
          });
        }
      });
      return updated;
    });
  };

  const handleSaveTeam = (newTeam: Team, initialAudits: AuditRecord[], initialCards: KanbanCard[]) => {
    setCustomTeams((prev) => {
      const existing = prev.filter((t) => t.id !== newTeam.id);
      return [...existing, newTeam];
    });

    if (initialAudits.length > 0) {
      setAudits((prev) => {
        // Cleanly replace any older or fragmented audits for this team
        const otherAudits = prev.filter(
          (a) => a.teamId !== newTeam.id && !a.rawTeamName?.toLowerCase().includes(newTeam.name.toLowerCase())
        );
        return [...initialAudits, ...otherAudits];
      });
    }

    if (initialCards.length > 0) {
      setCustomCards((prev) => {
        const otherCards = prev.filter((c) => c.teamId !== newTeam.id);
        return [...initialCards, ...otherCards];
      });
    }

    setLiveNotification({
      studentName: newTeam.members[0]?.name || newTeam.name,
      teamName: newTeam.name,
      weekLabel: `Registered (${newTeam.members.length} members)`,
      feature: `Repository: ${newTeam.repoName} ready on Kanban`,
    });
    setTimeout(() => setLiveNotification(null), 6000);
  };

  const handleOpenAddAuditWithPrefill = (prefill: { teamId?: string; studentName?: string; weekNumber?: number }) => {
    setAuditPrefill(prefill);
    setAddAuditModalOpen(true);
  };

  const handleSaveAudit = (newAudit: AuditRecord) => {
    setAudits((prev) => {
      const existingIndex = prev.findIndex(
        (a) => a.studentName.toLowerCase() === newAudit.studentName.toLowerCase() && a.weekNumber === newAudit.weekNumber
      );
      if (existingIndex >= 0) {
        const copy = [...prev];
        copy[existingIndex] = newAudit;
        return copy;
      }
      return [newAudit, ...prev];
    });

    let cardStatus: 'backlog' | 'in_progress' | 'review' | 'done' = 'backlog';
    if (newAudit.ticketStatus === 'Done') cardStatus = 'done';
    else if (newAudit.ticketStatus === 'In Progress') cardStatus = 'in_progress';
    else if (newAudit.ticketStatus === 'Review') cardStatus = 'review';

    const newCard: KanbanCard = {
      id: `kc-${newAudit.id}`,
      teamId: newAudit.teamId,
      title: newAudit.assignedFeature,
      ticketNumber: newAudit.ticketNumber,
      status: cardStatus,
      assignee: newAudit.studentName,
      assigneeGithub: newAudit.githubUsername,
      commitUrl: newAudit.commitUrl,
      weekNumber: newAudit.weekNumber,
      summary: newAudit.summary,
      blockers: newAudit.blockers,
      hasBlocker: Boolean(newAudit.blockers && !newAudit.blockers.toLowerCase().includes('none')),
      updatedAt: 'Just now',
      priority: newAudit.ticketStatus === 'Done' ? 'low' : 'medium',
    };

    setCustomCards((prev) => {
      const filtered = prev.filter((c) => c.id !== newCard.id);
      return [newCard, ...filtered];
    });

    setLiveNotification({
      studentName: newAudit.studentName,
      teamName: newAudit.teamName,
      weekLabel: `Week ${newAudit.weekNumber} Logged`,
      feature: newAudit.assignedFeature,
    });
    setTimeout(() => setLiveNotification(null), 5000);
  };

  const handleUpdateTeam = (updatedTeam: Team) => {
    // If it's a custom registered team, update it in customTeams
    setCustomTeams((prev) =>
      prev.map((t) => (t.id === updatedTeam.id ? { ...t, ...updatedTeam } : t))
    );

    // Also persist in teamOverrides so default or custom teams keep updates
    setTeamOverrides((prev) => ({
      ...prev,
      [updatedTeam.id]: updatedTeam,
    }));

    // Update active modal if open
    if (selectedTeamForModal && selectedTeamForModal.id === updatedTeam.id) {
      setSelectedTeamForModal(updatedTeam);
    }

    setLiveNotification({
      studentName: 'Updated',
      teamName: updatedTeam.name,
      weekLabel: `Team & Roster Updated`,
      feature: `Repository: ${updatedTeam.repoName} • ${updatedTeam.members.length} members`,
    });
    setTimeout(() => setLiveNotification(null), 5000);
  };

  const handleDeleteTeam = (teamId: string, deleteAudits: boolean, deleteCards: boolean) => {
    const targetTeam = allTeams.find((t) => t.id === teamId);
    const teamName = targetTeam?.name || teamId;

    // Add to deletedTeamIds
    setDeletedTeamIds((prev) => (prev.includes(teamId) ? prev : [...prev, teamId]));

    // Remove from customTeams and teamOverrides
    setCustomTeams((prev) => prev.filter((t) => t.id !== teamId));
    setTeamOverrides((prev) => {
      const copy = { ...prev };
      delete copy[teamId];
      return copy;
    });

    if (deleteAudits) {
      setAudits((prev) => prev.filter((a) => a.teamId !== teamId));
    }

    if (deleteCards) {
      setCustomCards((prev) => prev.filter((c) => c.teamId !== teamId));
    }

    if (selectedTeamForModal?.id === teamId) {
      setSelectedTeamForModal(null);
    }
    if (selectedTeamForKanban === teamId) {
      setSelectedTeamForKanban('ALL');
    }

    setLiveNotification({
      studentName: 'Deleted',
      teamName,
      weekLabel: `Removed from Tracker`,
      feature: `Team and associated configurations safely removed.`,
    });
    setTimeout(() => setLiveNotification(null), 5000);
  };

  const handleEditCard = (updatedCard: KanbanCard) => {
    setCustomCards((prev) =>
      prev.map((c) => (c.id === updatedCard.id ? updatedCard : c))
    );

    // Sync back to audit record if this card corresponds to an audit
    setAudits((prev) =>
      prev.map((a) => {
        if (a.ticketNumber === updatedCard.ticketNumber && a.teamId === updatedCard.teamId) {
          const ticketStatus: 'Done' | 'In Progress' | 'Review' | 'Backlog' =
            updatedCard.status === 'done'
              ? 'Done'
              : updatedCard.status === 'review'
              ? 'Review'
              : updatedCard.status === 'in_progress'
              ? 'In Progress'
              : 'Backlog';

          return {
            ...a,
            assignedFeature: updatedCard.title,
            studentName: updatedCard.assignee || a.studentName,
            githubUsername: updatedCard.assigneeGithub || a.githubUsername,
            ticketStatus,
            summary: updatedCard.summary,
            blockers: updatedCard.blockers || a.blockers,
            commitUrl: updatedCard.commitUrl || a.commitUrl,
          };
        }
        return a;
      })
    );

    setLiveNotification({
      studentName: updatedCard.assignee,
      teamName: updatedCard.ticketNumber,
      weekLabel: `Kanban Ticket Updated`,
      feature: updatedCard.title,
    });
    setTimeout(() => setLiveNotification(null), 4000);
  };

  const handleDeleteCard = (cardId: string) => {
    const cardToDelete = customCards.find((c) => c.id === cardId);
    setCustomCards((prev) => prev.filter((c) => c.id !== cardId));

    setLiveNotification({
      studentName: 'Removed',
      teamName: cardToDelete?.ticketNumber || 'Ticket',
      weekLabel: `Ticket Deleted`,
      feature: cardToDelete?.title || 'Card removed from Kanban',
    });
    setTimeout(() => setLiveNotification(null), 4000);
  };

  const handleResetToDefault = () => {
    setAudits(INITIAL_UNIFIED_AUDITS);
    setCustomCards(generateKanbanCards(INITIAL_UNIFIED_AUDITS));
    setCustomTeams([]);
    setTeamOverrides({});
    setDeletedTeamIds([]);
    try {
      localStorage.removeItem(STORAGE_KEY);
      localStorage.removeItem(CARDS_STORAGE_KEY);
      localStorage.removeItem(CUSTOM_TEAMS_STORAGE_KEY);
      localStorage.removeItem(TEAM_OVERRIDES_STORAGE_KEY);
      localStorage.removeItem(DELETED_TEAMS_STORAGE_KEY);
    } catch (e) {
      console.error(e);
    }
  };

  const handleLoadDemoSample = () => {
    setAudits(DEMO_SAMPLE_AUDITS);
    setCustomCards(generateKanbanCards(DEMO_SAMPLE_AUDITS));
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-indigo-500/30 selection:text-white">
      {/* Navbar with Title, GitHub Org, Section Filter, and Search */}
      <Navbar
        currentSection={currentSection}
        onSectionChange={setCurrentSection}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        onOpenIngestion={() => setIngestionModalOpen(true)}
        onOpenDefense={() => setDefenseModalOpen(true)}
        onOpenGitHubSync={() => setGitHubSyncModalOpen(true)}
        onOpenAddTeam={() => setAddTeamModalOpen(true)}
        onExport={() => setIngestionModalOpen(true)}
        activeView={activeView}
        onViewChange={setActiveView}
        stats={stats}
      />

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        {/* High-level Metric Cards & Professor Alerts */}
        <OverviewCards
          teams={filteredTeams}
          audits={filteredAudits}
          onOpenIngestion={() => setIngestionModalOpen(true)}
        />

        {/* Dynamic View Content */}
        {activeView === 'teams' && (
          <TeamsView
            teams={filteredTeams}
            onSelectTeam={(t) => setSelectedTeamForModal(t)}
            onOpenDefenseForTeam={handleOpenDefenseForTeam}
            onOpenKanbanForTeam={handleOpenKanbanForTeam}
            onOpenAddTeam={() => setAddTeamModalOpen(true)}
            onEditTeam={(t) => setEditingTeam(t)}
            onDeleteTeam={(t) => setDeletingTeam(t)}
          />
        )}

        {activeView === 'kanban' && (
          <KanbanBoardView
            cards={customCards}
            teams={allTeams}
            selectedTeamId={selectedTeamForKanban}
            onSelectTeamId={setSelectedTeamForKanban}
            onMoveCard={handleMoveCard}
            onAddCard={handleAddCard}
            onEditCard={handleEditCard}
            onDeleteCard={handleDeleteCard}
            onOpenGitHubSync={() => setGitHubSyncModalOpen(true)}
            onEditTeam={(t) => setEditingTeam(t)}
          />
        )}

        {activeView === 'matrix' && (
          <UnifiedMatrixView
            teams={filteredTeams}
            audits={filteredAudits}
            onOpenTeam={(t) => setSelectedTeamForModal(t)}
            onOpenAddAudit={handleOpenAddAuditWithPrefill}
            onOpenAddTeam={() => setAddTeamModalOpen(true)}
          />
        )}

        {activeView === 'blockers' && (
          <BlockersView
            teams={filteredTeams}
            audits={filteredAudits}
            onOpenTeam={(t) => setSelectedTeamForModal(t)}
            onOpenDefense={handleOpenDefenseForTeam}
          />
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-900 bg-slate-950 py-4 text-center text-xs text-slate-400">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <span>
            University of the Immaculate Conception • College of Computer Studies (COD-IT)
          </span>
          <span className="font-mono text-[11px] text-slate-400">
            Official Course Tracker: CC020 Mobile Applications Development 2026–2027
          </span>
        </div>
      </footer>

      {/* Modals */}
      <TeamDetailModal
        team={selectedTeamForModal}
        onClose={() => setSelectedTeamForModal(null)}
        audits={audits}
        onOpenDefense={handleOpenDefenseForTeam}
        onOpenKanban={handleOpenKanbanForTeam}
        onEditTeam={(t) => setEditingTeam(t)}
        onDeleteTeam={(t) => setDeletingTeam(t)}
      />

      <EditTeamModal
        isOpen={editingTeam !== null}
        team={editingTeam}
        onClose={() => setEditingTeam(null)}
        onSaveTeam={handleUpdateTeam}
        onRequestDelete={(t) => {
          setEditingTeam(null);
          setDeletingTeam(t);
        }}
      />

      <DeleteTeamModal
        isOpen={deletingTeam !== null}
        team={deletingTeam}
        audits={audits}
        cards={customCards}
        onClose={() => setDeletingTeam(null)}
        onConfirmDelete={handleDeleteTeam}
      />

      <DataIngestionModal
        isOpen={ingestionModalOpen}
        onClose={() => setIngestionModalOpen(false)}
        onMergeAudits={handleMergeAudits}
        onAutoProvisionTeam={handleSaveTeam}
        allTeams={allTeams}
        onResetToDefault={handleResetToDefault}
        existingAudits={audits}
      />

      <DefenseModal
        isOpen={defenseModalOpen}
        onClose={() => setDefenseModalOpen(false)}
        teams={allTeams}
        audits={audits}
        initialTeamId={defenseTeamId}
      />

      <GitHubSyncModal
        isOpen={gitHubSyncModalOpen}
        onClose={() => setGitHubSyncModalOpen(false)}
        teams={allTeams}
        onApplySyncedCards={handleApplySyncedCards}
      />

      <AddTeamModal
        isOpen={addTeamModalOpen}
        onClose={() => setAddTeamModalOpen(false)}
        onSaveTeam={handleSaveTeam}
      />

      <AddAuditModal
        isOpen={addAuditModalOpen}
        onClose={() => setAddAuditModalOpen(false)}
        teams={allTeams}
        initialTeamId={auditPrefill.teamId}
        initialStudentName={auditPrefill.studentName}
        initialWeekNumber={auditPrefill.weekNumber}
        onSaveAudit={handleSaveAudit}
      />

      {/* Floating Live Google Form Submission Toast */}
      {liveNotification && (
        <div className="fixed bottom-6 right-6 z-50 bg-slate-900 border border-emerald-500/50 shadow-2xl rounded-2xl p-4 max-w-sm flex items-start gap-3 animate-bounce">
          <div className="p-2 rounded-xl bg-emerald-500/20 text-emerald-400 shrink-0">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 inline-block animate-ping"></span>
          </div>
          <div>
            <div className="flex items-center gap-1.5 text-[11px] font-bold text-emerald-300 uppercase tracking-wider">
              <span>Live Google Form Submission</span>
            </div>
            <h4 className="text-xs font-bold text-white mt-0.5">
              {liveNotification.studentName}
            </h4>
            <div className="text-[11px] text-indigo-300 font-medium truncate">
              {liveNotification.teamName} • {liveNotification.weekLabel}
            </div>
            <p className="text-[10px] text-slate-400 mt-1 line-clamp-1">
              {liveNotification.feature}
            </p>
          </div>
          <button
            onClick={() => setLiveNotification(null)}
            className="text-slate-500 hover:text-white text-xs ml-auto"
          >
            ✕
          </button>
        </div>
      )}
    </div>
  );
}
