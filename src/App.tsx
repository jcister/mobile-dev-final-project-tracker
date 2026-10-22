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
import { AdminLoginModal } from './components/AdminLoginModal';
import {
  INITIAL_UNIFIED_AUDITS,
  computeTeams,
  generateKanbanCards,
  DEMO_SAMPLE_AUDITS,
  STUDYSYNC_CANONICAL_AUDITS,
  deduplicateAuditsList,
  deduplicateCardsList,
  mergeAuditsDeduplicated,
  areAuditsDuplicate,
} from './data/defaultData';
import { AuditRecord, Team, KanbanCard } from './types';

const STORAGE_KEY = 'uic_mobile_dev_unified_audits_v2';
const CARDS_STORAGE_KEY = 'uic_mobile_dev_kanban_cards_v2';
const CUSTOM_TEAMS_STORAGE_KEY = 'uic_mobile_dev_custom_teams_v1';
const TEAM_OVERRIDES_STORAGE_KEY = 'uic_mobile_dev_team_overrides_v1';
const DELETED_TEAMS_STORAGE_KEY = 'uic_mobile_dev_deleted_teams_v1';

// Helper to consolidate any fragmented raw rows and deduplicate records
function sanitizeAudits(raw: AuditRecord[]): AuditRecord[] {
  const isStudySync = (a: AuditRecord) =>
    a.teamId === 'studysync' ||
    (a.rawTeamName && a.rawTeamName.toLowerCase().includes('studysync')) ||
    (a.teamName && a.teamName.toLowerCase().includes('studysync')) ||
    (a.studentName && a.studentName.toLowerCase().includes('allawan'));

  const studySyncAudits = raw.filter(isStudySync);
  const otherAudits = raw.filter((a) => !isStudySync(a));

  let baseAudits = raw;
  if (studySyncAudits.length !== 4) {
    baseAudits = [...STUDYSYNC_CANONICAL_AUDITS, ...otherAudits];
  }

  return deduplicateAuditsList(baseAudits);
}

function sanitizeCards(cards: KanbanCard[]): KanbanCard[] {
  const isStudySyncCard = (c: KanbanCard) =>
    c.teamId === 'studysync' ||
    (c.assignee && c.assignee.toLowerCase().includes('allawan'));

  const ssCards = cards.filter(isStudySyncCard);
  let baseCards = cards;
  if (ssCards.length !== 4) {
    const nonSsCards = cards.filter((c) => !isStudySyncCard(c));
    const ssMilestones = generateKanbanCards(STUDYSYNC_CANONICAL_AUDITS);
    baseCards = [...ssMilestones, ...nonSsCards];
  }
  return deduplicateCardsList(baseCards);
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

  // Authentication & Role State
  const [adminToken, setAdminToken] = useState<string | null>(() => {
    return localStorage.getItem('uic_mobile_dev_admin_token') || sessionStorage.getItem('uic_mobile_dev_admin_token') || null;
  });
  const [isAdmin, setIsAdmin] = useState<boolean>(false);
  const [previewAsStudent, setPreviewAsStudent] = useState<boolean>(false);
  const [adminLoginModalOpen, setAdminLoginModalOpen] = useState<boolean>(false);
  const [isSavingToServer, setIsSavingToServer] = useState<boolean>(false);

  const isEffectiveAdmin = isAdmin && !previewAsStudent;

  // Navigation & Filtering state (Defaults to Progress Matrix for students)
  const [activeView, setActiveView] = useState<'teams' | 'kanban' | 'matrix' | 'blockers'>('matrix');
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
  const [isSyncingForms, setIsSyncingForms] = useState<boolean>(false);
  const [googleSheetUrl, setGoogleSheetUrl] = useState<string>(() => {
    return localStorage.getItem('uic_gform_sheet_url') || '';
  });
  const [lastFormsSyncTime, setLastFormsSyncTime] = useState<string | null>(null);

  const [liveNotification, setLiveNotification] = useState<{
    studentName: string;
    teamName: string;
    weekLabel: string;
    feature: string;
  } | null>(null);

  // Initial startup: verify admin token and fetch shared server state
  useEffect(() => {
    const initTracker = async () => {
      // 1. Check admin token validity
      if (adminToken) {
        try {
          const res = await fetch('/api/auth/verify', {
            headers: { Authorization: `Bearer ${adminToken}` },
          });
          const data = await res.json();
          if (data.success && data.isAdmin) {
            setIsAdmin(true);
          } else {
            setIsAdmin(false);
            setAdminToken(null);
            localStorage.removeItem('uic_mobile_dev_admin_token');
            sessionStorage.removeItem('uic_mobile_dev_admin_token');
          }
        } catch (e) {
          console.warn('Admin token verification error:', e);
        }
      }

      // 2. Fetch shared tracker state from server disk
      try {
        const stateRes = await fetch('/api/tracker/state');
        const stateData = await stateRes.json();
        if (stateData.success && stateData.data) {
          const { audits: sAudits, customTeams: sTeams, customCards: sCards, teamOverrides: sOverrides, deletedTeamIds: sDeleted } = stateData.data;
          let cleanedAudits: AuditRecord[] | null = null;
          let cleanedCards: KanbanCard[] | null = null;

          if (Array.isArray(sAudits) && sAudits.length > 0) {
            cleanedAudits = sanitizeAudits(sAudits);
            setAudits(cleanedAudits);
          }
          if (Array.isArray(sTeams)) {
            setCustomTeams(sTeams);
          }
          if (Array.isArray(sCards) && sCards.length > 0) {
            cleanedCards = sanitizeCards(sCards);
            setCustomCards(cleanedCards);
          }
          if (sOverrides && typeof sOverrides === 'object') {
            setTeamOverrides(sOverrides);
          }
          if (Array.isArray(sDeleted)) {
            setDeletedTeamIds(sDeleted);
          }

          if (stateData.data.googleSheetUrl && !googleSheetUrl) {
            setGoogleSheetUrl(stateData.data.googleSheetUrl);
            localStorage.setItem('uic_gform_sheet_url', stateData.data.googleSheetUrl);
          }
          if (stateData.data.lastSyncedAt) {
            setLastFormsSyncTime(stateData.data.lastSyncedAt);
          }

          // Auto-heal: If server store had duplicates, sync back the clean state
          if (cleanedAudits && sAudits && cleanedAudits.length !== sAudits.length) {
            syncTrackerToServer({
              audits: cleanedAudits,
              customCards: cleanedCards || (cleanedAudits ? generateKanbanCards(cleanedAudits) : undefined),
            });
          }
        }
      } catch (err) {
        console.warn('Failed to load shared server state, using local cache:', err);
      }
    };

    initTracker();
  }, []);

  // Sync state mutations to server
  const syncTrackerToServer = async (payload: {
    audits?: AuditRecord[];
    customTeams?: Team[];
    customCards?: KanbanCard[];
    teamOverrides?: Record<string, Partial<Team>>;
    deletedTeamIds?: string[];
    googleSheetUrl?: string;
    lastSyncedAt?: string;
  }) => {
    const token = adminToken || localStorage.getItem('uic_mobile_dev_admin_token') || sessionStorage.getItem('uic_mobile_dev_admin_token');
    if (!token) return;

    setIsSavingToServer(true);
    try {
      const body = {
        audits: payload.audits ?? audits,
        customTeams: payload.customTeams ?? customTeams,
        customCards: payload.customCards ?? customCards,
        teamOverrides: payload.teamOverrides ?? teamOverrides,
        deletedTeamIds: payload.deletedTeamIds ?? deletedTeamIds,
        googleSheetUrl: payload.googleSheetUrl ?? googleSheetUrl,
        lastSyncedAt: payload.lastSyncedAt ?? lastFormsSyncTime,
      };
      await fetch('/api/tracker/state', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(body),
      });
    } catch (err) {
      console.error('Failed to sync changes to server:', err);
    } finally {
      setTimeout(() => setIsSavingToServer(false), 500);
    }
  };

  // 1-Click & Automated Quick Sync of Google Form responses
  const handleQuickSyncForms = async (silent = false) => {
    const targetUrl = googleSheetUrl || localStorage.getItem('uic_gform_sheet_url') || '';
    if (!targetUrl.trim()) {
      if (!silent) {
        setIngestionModalOpen(true);
      }
      return;
    }

    setIsSyncingForms(true);
    try {
      const res = await fetch('/api/forms/sync-live-sheet', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sheetUrl: targetUrl.trim() }),
      });
      const json = await res.json();
      if (!res.ok || !json.success) {
        throw new Error(json.error || json.details || 'Failed to sync Google Sheet');
      }

      if (json.audits && Array.isArray(json.audits)) {
        const { merged, addedCount, updatedCount } = mergeAuditsDeduplicated(audits, json.audits);
        const nextCards = deduplicateCardsList(generateKanbanCards(merged));
        setAudits(merged);
        setCustomCards(nextCards);
        const now = new Date().toLocaleTimeString();
        setLastFormsSyncTime(now);

        syncTrackerToServer({
          audits: merged,
          customCards: nextCards,
          googleSheetUrl: targetUrl.trim(),
          lastSyncedAt: now,
        });

        if (!silent || addedCount > 0) {
          setLiveNotification({
            studentName: 'Google Forms Sync',
            teamName: `${json.audits.length} Form Responses Verified`,
            weekLabel: addedCount > 0 ? `${addedCount} New • ${updatedCount} Updated` : '0 New • Up to Date',
            feature: `Synced with 0 duplicates (${merged.length} total active records).`,
          });
          setTimeout(() => setLiveNotification(null), 5000);
        }
      }
    } catch (err: any) {
      console.warn('Google Sheet auto-sync error:', err);
      if (!silent) {
        setLiveNotification({
          studentName: 'Sync Notice',
          teamName: 'Google Sheet Connection',
          weekLabel: 'Could not connect',
          feature: err.message || 'Check your Google Sheet sharing link',
        });
        setTimeout(() => setLiveNotification(null), 6000);
      }
    } finally {
      setIsSyncingForms(false);
    }
  };

  // Automated Background Sync Timer (polls every 5 minutes when instructor session is active)
  useEffect(() => {
    if (!isAdmin) return;
    const interval = setInterval(() => {
      handleQuickSyncForms(true);
    }, 5 * 60 * 1000); // 5 minutes

    return () => clearInterval(interval);
  }, [isAdmin, googleSheetUrl, audits]);

  const handleLoginSuccess = (token: string) => {
    setAdminToken(token);
    setIsAdmin(true);
    setPreviewAsStudent(false);
    setLiveNotification({
      studentName: 'Administrator',
      teamName: 'Teacher Controls Unlocked',
      weekLabel: 'Admin Mode Active',
      feature: 'Full editing, student management, and defense AI controls enabled.',
    });
    setTimeout(() => setLiveNotification(null), 5000);
  };

  const handleLogout = () => {
    setAdminToken(null);
    setIsAdmin(false);
    setPreviewAsStudent(false);
    setActiveView('matrix');
    localStorage.removeItem('uic_mobile_dev_admin_token');
    sessionStorage.removeItem('uic_mobile_dev_admin_token');
    setLiveNotification({
      studentName: 'Signed Out',
      teamName: 'Student Portal (View Only)',
      weekLabel: 'Logged Out',
      feature: 'Returned to student read-only matrix view.',
    });
    setTimeout(() => setLiveNotification(null), 4000);
  };

  const handleTogglePreviewAsStudent = () => {
    setPreviewAsStudent((prev) => {
      const next = !prev;
      if (next) {
        setActiveView('matrix');
      }
      return next;
    });
  };

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
    const next = customCards.map((c) => (c.id === cardId ? { ...c, status: newStatus } : c));
    setCustomCards(next);
    syncTrackerToServer({ customCards: next });
  };

  const handleAddCard = (newCardData: Omit<KanbanCard, 'id' | 'updatedAt'>) => {
    const newCard: KanbanCard = {
      ...newCardData,
      id: `custom-card-${Date.now()}`,
      updatedAt: new Date().toLocaleDateString(),
    };
    const next = [newCard, ...customCards];
    setCustomCards(next);
    syncTrackerToServer({ customCards: next });
  };

  const handleMergeAudits = (newAudits: AuditRecord[]) => {
    const { merged, addedCount, updatedCount } = mergeAuditsDeduplicated(audits, newAudits);
    const nextCards = deduplicateCardsList(generateKanbanCards(merged));
    setAudits(merged);
    setCustomCards(nextCards);
    syncTrackerToServer({ audits: merged, customCards: nextCards });

    setLiveNotification({
      studentName: 'Live Google Sheet Sync',
      teamName: `${newAudits.length} Form Responses Processed`,
      weekLabel: `${addedCount} New • ${updatedCount} Updated`,
      feature: `All responses verified and synchronized with 0 duplicates.`,
    });
    setTimeout(() => setLiveNotification(null), 5000);
  };

  const handleApplySyncedCards = (newCards: KanbanCard[], teamId?: string) => {
    const newIds = new Set(newCards.map((c) => c.id));
    let filtered = customCards.filter((c) => !newIds.has(c.id));
    if (teamId) {
      filtered = filtered.filter((c) => c.teamId !== teamId);
    }
    const nextCards = [...newCards, ...filtered];
    setCustomCards(nextCards);

    // Also reflect live issues in the audit matrix so presentation readiness stays live
    const updated = [...audits];
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
    setAudits(updated);
    syncTrackerToServer({ customCards: nextCards, audits: updated });
  };

  const handleSaveTeam = (newTeam: Team, initialAudits: AuditRecord[], initialCards: KanbanCard[]) => {
    const nextCustomTeams = [...customTeams.filter((t) => t.id !== newTeam.id), newTeam];
    setCustomTeams(nextCustomTeams);

    let nextAudits = audits;
    if (initialAudits.length > 0) {
      // Cleanly replace any older or fragmented audits for this team
      const otherAudits = audits.filter(
        (a) => a.teamId !== newTeam.id && !a.rawTeamName?.toLowerCase().includes(newTeam.name.toLowerCase())
      );
      nextAudits = [...initialAudits, ...otherAudits];
      setAudits(nextAudits);
    }

    let nextCards = customCards;
    if (initialCards.length > 0) {
      const otherCards = customCards.filter((c) => c.teamId !== newTeam.id);
      nextCards = [...initialCards, ...otherCards];
      setCustomCards(nextCards);
    }

    syncTrackerToServer({ customTeams: nextCustomTeams, audits: nextAudits, customCards: nextCards });

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
    const existingIndex = audits.findIndex((a) => areAuditsDuplicate(a, newAudit));
    const nextAudits = [...audits];
    if (existingIndex >= 0) {
      nextAudits[existingIndex] = {
        ...nextAudits[existingIndex],
        ...newAudit,
      };
    } else {
      nextAudits.unshift(newAudit);
    }
    const cleanAudits = deduplicateAuditsList(nextAudits);
    setAudits(cleanAudits);

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

    const nextCards = [newCard, ...customCards.filter((c) => c.id !== newCard.id)];
    setCustomCards(nextCards);

    syncTrackerToServer({ audits: nextAudits, customCards: nextCards });

    setLiveNotification({
      studentName: newAudit.studentName,
      teamName: newAudit.teamName,
      weekLabel: `Week ${newAudit.weekNumber} Logged`,
      feature: newAudit.assignedFeature,
    });
    setTimeout(() => setLiveNotification(null), 5000);
  };

  const handleUpdateTeam = (updatedTeam: Team) => {
    const nextCustomTeams = customTeams.map((t) => (t.id === updatedTeam.id ? { ...t, ...updatedTeam } : t));
    const nextOverrides = {
      ...teamOverrides,
      [updatedTeam.id]: updatedTeam,
    };
    setCustomTeams(nextCustomTeams);
    setTeamOverrides(nextOverrides);

    if (selectedTeamForModal && selectedTeamForModal.id === updatedTeam.id) {
      setSelectedTeamForModal(updatedTeam);
    }

    syncTrackerToServer({ customTeams: nextCustomTeams, teamOverrides: nextOverrides });

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

    const nextDeleted = deletedTeamIds.includes(teamId) ? deletedTeamIds : [...deletedTeamIds, teamId];
    const nextCustomTeams = customTeams.filter((t) => t.id !== teamId);
    const nextOverrides = { ...teamOverrides };
    delete nextOverrides[teamId];

    let nextAudits = audits;
    if (deleteAudits) {
      nextAudits = audits.filter((a) => a.teamId !== teamId);
      setAudits(nextAudits);
    }

    let nextCards = customCards;
    if (deleteCards) {
      nextCards = customCards.filter((c) => c.teamId !== teamId);
      setCustomCards(nextCards);
    }

    setDeletedTeamIds(nextDeleted);
    setCustomTeams(nextCustomTeams);
    setTeamOverrides(nextOverrides);

    if (selectedTeamForModal?.id === teamId) {
      setSelectedTeamForModal(null);
    }
    if (selectedTeamForKanban === teamId) {
      setSelectedTeamForKanban('ALL');
    }

    syncTrackerToServer({
      deletedTeamIds: nextDeleted,
      customTeams: nextCustomTeams,
      teamOverrides: nextOverrides,
      audits: nextAudits,
      customCards: nextCards,
    });

    setLiveNotification({
      studentName: 'Deleted',
      teamName,
      weekLabel: `Removed from Tracker`,
      feature: `Team and associated configurations safely removed.`,
    });
    setTimeout(() => setLiveNotification(null), 5000);
  };

  const handleEditCard = (updatedCard: KanbanCard) => {
    const nextCards = customCards.map((c) => (c.id === updatedCard.id ? updatedCard : c));
    setCustomCards(nextCards);

    const nextAudits = audits.map((a) => {
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
    });

    setAudits(nextAudits);
    syncTrackerToServer({ customCards: nextCards, audits: nextAudits });

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
    const nextCards = customCards.filter((c) => c.id !== cardId);
    setCustomCards(nextCards);
    syncTrackerToServer({ customCards: nextCards });

    setLiveNotification({
      studentName: 'Removed',
      teamName: cardToDelete?.ticketNumber || 'Ticket',
      weekLabel: `Ticket Deleted`,
      feature: cardToDelete?.title || 'Card removed from Kanban',
    });
    setTimeout(() => setLiveNotification(null), 4000);
  };

  const handleResetToDefault = async () => {
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

      if (adminToken) {
        await fetch('/api/tracker/reset', {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${adminToken}`,
          },
        });
      }
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
        activeView={isEffectiveAdmin ? activeView : 'matrix'}
        onViewChange={(v) => {
          if (isEffectiveAdmin) setActiveView(v);
        }}
        stats={stats}
        isAdmin={isAdmin}
        previewAsStudent={previewAsStudent}
        onTogglePreviewAsStudent={handleTogglePreviewAsStudent}
        onOpenLogin={() => setAdminLoginModalOpen(true)}
        onLogout={handleLogout}
        isSavingToServer={isSavingToServer}
        onQuickSyncForms={() => handleQuickSyncForms(false)}
        isSyncingForms={isSyncingForms}
        lastFormsSyncTime={lastFormsSyncTime}
      />

      {/* Main Container */}
      <main
        className={`flex-1 w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6 ${
          !isEffectiveAdmin || activeView === 'matrix' ? 'max-w-[1800px]' : 'max-w-7xl'
        }`}
      >
        {/* High-level Metric Cards & Professor Alerts */}
        <OverviewCards
          teams={filteredTeams}
          audits={filteredAudits}
          onOpenIngestion={() => setIngestionModalOpen(true)}
          isAdmin={isEffectiveAdmin}
        />

        {/* Dynamic View Content */}
        {isEffectiveAdmin && activeView === 'teams' && (
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

        {isEffectiveAdmin && activeView === 'kanban' && (
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

        {/* Progress Matrix View (Default for students or when selected) */}
        {(!isEffectiveAdmin || activeView === 'matrix') && (
          <UnifiedMatrixView
            teams={filteredTeams}
            audits={filteredAudits}
            onOpenTeam={(t) => setSelectedTeamForModal(t)}
            onOpenAddAudit={handleOpenAddAuditWithPrefill}
            onOpenAddTeam={() => setAddTeamModalOpen(true)}
            isAdmin={isEffectiveAdmin}
          />
        )}

        {isEffectiveAdmin && activeView === 'blockers' && (
          <BlockersView
            teams={filteredTeams}
            audits={filteredAudits}
            onOpenTeam={(t) => setSelectedTeamForModal(t)}
            onOpenDefense={handleOpenDefenseForTeam}
          />
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-900 bg-slate-950 py-4 text-xs text-slate-400">
        <div className="max-w-7xl mx-auto px-4 flex flex-col lg:flex-row items-center justify-between gap-2 text-center lg:text-left">
          <span>
            Unofficial class tracker for the Mobile Application Development students of Joshua M. Cister.
            Not an official UIC course system.
          </span>
          <span className="text-[11px] text-slate-500">
            Built with Google AI Studio &amp; Antigravity (AI-assisted development).
          </span>
        </div>
      </footer>

      {/* Modals */}
      <AdminLoginModal
        isOpen={adminLoginModalOpen}
        onClose={() => setAdminLoginModalOpen(false)}
        onLoginSuccess={handleLoginSuccess}
      />

      <TeamDetailModal
        team={selectedTeamForModal}
        onClose={() => setSelectedTeamForModal(null)}
        audits={audits}
        onOpenDefense={handleOpenDefenseForTeam}
        onOpenKanban={handleOpenKanbanForTeam}
        onEditTeam={(t) => setEditingTeam(t)}
        onDeleteTeam={(t) => setDeletingTeam(t)}
        isAdmin={isEffectiveAdmin}
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
