import React, { useState } from 'react';
import {
  UploadCloud,
  FileText,
  FormInput,
  CheckCircle2,
  AlertCircle,
  Sparkles,
  Download,
  X,
  FileCheck,
  RefreshCw,
  FolderGit2,
  ShieldCheck,
  Copy,
  Check,
  Zap,
  Users,
  Plus,
  Trash2,
  ArrowRight,
  Radio,
  Link2,
} from 'lucide-react';
import { AuditRecord, Team, DocumentParseResult, KanbanCard, TeamMember } from '../types';
import {
  INITIAL_FORM_AUDITS,
  INITIAL_DOCUMENT_AUDITS,
  normalizeTeam,
  parseWeekNumber,
  mapTicketStatus,
} from '../data/defaultData';

interface DataIngestionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onMergeAudits: (newAudits: AuditRecord[]) => void;
  onAutoProvisionTeam?: (newTeam: Team, initialAudits: AuditRecord[], initialCards: KanbanCard[]) => void;
  allTeams?: Team[];
  onResetToDefault: () => void;
  existingAudits: AuditRecord[];
}

interface BatchDocItem {
  id: string;
  file: File;
  name: string;
  size: number;
  base64: string;
  detectedWeeks: number[];
}

export const DataIngestionModal: React.FC<DataIngestionModalProps> = ({
  isOpen,
  onClose,
  onMergeAudits,
  onAutoProvisionTeam,
  allTeams = [],
  onResetToDefault,
  existingAudits,
}) => {
  const [activeTab, setActiveTab] = useState<'doc' | 'form' | 'export'>('doc');
  const [formSubTab, setFormSubTab] = useState<'live_sheet' | 'webhook' | 'csv'>('live_sheet');

  // Multi-document / Batch ingestion state
  const [batchFiles, setBatchFiles] = useState<BatchDocItem[]>([]);
  const [docText, setDocText] = useState<string>('');
  const [studentHint, setStudentHint] = useState<string>('');
  const [projectHint, setProjectHint] = useState<string>('');
  const [isParsingDoc, setIsParsingDoc] = useState<boolean>(false);
  const [docParseError, setDocParseError] = useState<string>('');

  // Parsed result structure
  const [parsedDocResult, setParsedDocResult] = useState<{
    projectTitle: string;
    studentName: string;
    partnerName: string;
    section: string;
    teamId: string;
    teamName: string;
    repoName: string;
    weeksCovered: number[];
    isNewTeam: boolean;
    source: string;
    entries: {
      weekNumber: number;
      date: string;
      assignedFeature: string;
      summary: string;
      notesAndBlockers: string;
      estimatedKanbanStatus: string;
      tags?: string[];
    }[];
  } | null>(null);

  // Editable auto-provision parameters
  const [provisionTeamName, setProvisionTeamName] = useState<string>('');
  const [provisionSection, setProvisionSection] = useState<string>('BSIT');
  const [provisionRepoName, setProvisionRepoName] = useState<string>('');
  const [provisionLeadName, setProvisionLeadName] = useState<string>('');
  const [provisionPartnerName, setProvisionPartnerName] = useState<string>('');

  // Live Google Sheet sync state
  const [sheetUrl, setSheetUrl] = useState(() => {
    return localStorage.getItem('uic_gform_sheet_url') || '';
  });
  const [isSyncingSheet, setIsSyncingSheet] = useState<boolean>(false);
  const [sheetSyncError, setSheetSyncError] = useState<string>('');
  const [sheetSyncSuccess, setSheetSyncSuccess] = useState<string>('');
  const [copiedScript, setCopiedScript] = useState<boolean>(false);

  // CSV ingestion state
  const [csvText, setCsvText] = useState<string>('');
  const [parsedCsvCount, setParsedCsvCount] = useState<number>(0);
  const [csvPreview, setCsvPreview] = useState<AuditRecord[]>([]);
  const [csvSuccessMessage, setCsvSuccessMessage] = useState<string>('');

  if (!isOpen) return null;

  // Helper to extract preliminary week numbers from filename (e.g., Week_3___4 -> [3, 4])
  const detectWeeksFromFilename = (name: string): number[] => {
    const m = name.match(/week[s_\-\s]*(\d+)(?:[_\-\s]+(?:and|&|to|[_\-])\s*(\d+))?/i);
    if (m) {
      const w1 = parseInt(m[1], 10);
      const w2 = m[2] ? parseInt(m[2], 10) : null;
      const res: number[] = [];
      if (w1 >= 1 && w1 <= 8) res.push(w1);
      if (w2 && w2 >= 1 && w2 <= 8) res.push(w2);
      if (res.length > 0) return res;
    }
    return [1];
  };

  // Handle multi-file selection
  const handleBatchFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    Array.from(files).forEach((file) => {
      const reader = new FileReader();
      reader.onload = () => {
        const result = reader.result as string;
        const base64 = result.split(',')[1] || result;
        const weeks = detectWeeksFromFilename(file.name);

        setBatchFiles((prev) => [
          ...prev,
          {
            id: `batch-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
            file,
            name: file.name,
            size: file.size,
            base64,
            detectedWeeks: weeks,
          },
        ]);
      };
      reader.readAsDataURL(file);
    });
  };

  const handleRemoveBatchFile = (id: string) => {
    setBatchFiles((prev) => prev.filter((f) => f.id !== id));
  };

  // Load sample UIC PDF (Single file Crispino)
  const handleLoadSamplePdf = async () => {
    setIsParsingDoc(true);
    setDocParseError('');
    try {
      const res = await fetch('/assets/aistudio/Individual_Progress_45093923.pdf');
      const blob = await res.blob();
      const reader = new FileReader();
      reader.onload = () => {
        const result = reader.result as string;
        const base64 = result.split(',')[1] || result;
        setBatchFiles([
          {
            id: `sample-crispino-${Date.now()}`,
            file: new File([blob], 'Individual_Progress_45093923.pdf', { type: 'application/pdf' }),
            name: 'Individual_Progress_45093923.pdf',
            size: blob.size,
            base64,
            detectedWeeks: [1, 2, 3, 4],
          },
        ]);
        setStudentHint('Crispino, Matthew Ikee M.');
        setProjectHint('StudySprint');
        setIsParsingDoc(false);
      };
      reader.readAsDataURL(blob);
    } catch (err: any) {
      console.error(err);
      setIsParsingDoc(false);
    }
  };

  // Instant One-Click Loader for the User's 3 Attached Files (StudySync - Weeks 1, 2, 3 & 4)
  const handleLoadStudySyncReports = async () => {
    setIsParsingDoc(true);
    setDocParseError('');
    try {
      const res = await fetch('/api/load-sample-studysync-reports');
      const json = await res.json();
      if (!res.ok || !json.success) {
        throw new Error(json.error || 'Failed to load StudySync attached reports');
      }

      const teamName = json.team?.name || 'StudySync';
      const isAlreadyExisting = allTeams.some(
        (t) => t.id === 'studysync' || t.name.toLowerCase() === teamName.toLowerCase()
      );

      const parsedData = {
        projectTitle: json.team?.fullTitle || 'StudySync: UIC Peer-to-Peer Study Matchmaker & Note Repository',
        studentName: json.team?.members?.[0]?.name || 'James Reino A. Allawan',
        partnerName: json.team?.members?.[1]?.name || 'Neill Laurence H. Amper',
        section: json.team?.section || 'BSIT',
        teamId: json.team?.id || 'studysync',
        teamName,
        repoName: json.team?.repoName || 'uic-studysync-app',
        weeksCovered: json.weeksCovered || [1, 2, 3, 4],
        isNewTeam: !isAlreadyExisting,
        source: 'local_pdf_extract',
        entries: json.entries || [],
      };

      setParsedDocResult(parsedData);
      setProvisionTeamName(teamName);
      setProvisionSection(json.team?.section || 'BSIT');
      setProvisionRepoName(json.team?.repoName || 'uic-studysync-app');
      setProvisionLeadName(parsedData.studentName);
      setProvisionPartnerName(parsedData.partnerName);
    } catch (err: any) {
      console.error(err);
      setDocParseError(err.message || 'Could not load StudySync attached reports.');
    } finally {
      setIsParsingDoc(false);
    }
  };

  // Parse uploaded batch files with Gemini AI / PDF engine
  const handleParseBatchFiles = async () => {
    if (batchFiles.length === 0 && !docText.trim()) {
      setDocParseError('Please select at least one student progress report or paste text.');
      return;
    }

    setIsParsingDoc(true);
    setDocParseError('');

    try {
      const payload: any = {
        studentHint,
        projectHint,
        textContent: docText,
      };

      if (batchFiles.length === 1) {
        payload.fileBase64 = batchFiles[0].base64;
        payload.filename = batchFiles[0].name;
        payload.mimeType = 'application/pdf';
      } else if (batchFiles.length > 1) {
        payload.files = batchFiles.map((b) => ({
          filename: b.name,
          base64: b.base64,
          mimeType: 'application/pdf',
        }));
      }

      const response = await fetch('/api/parse-document-report', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const json = await response.json();
      if (!response.ok || !json.success) {
        throw new Error(json.error || json.details || 'Document parsing failed');
      }

      const detectedTitle = json.data?.projectTitle || json.team?.fullTitle || projectHint || 'Mobile App Project';
      const detectedTeamName = json.team?.name || detectedTitle.split(':')[0].trim();
      const detectedStudentName = json.data?.studentName || json.team?.members?.[0]?.name || 'Student Author';
      const detectedPartnerName = json.data?.partnerName || json.team?.members?.[1]?.name || '';
      const detectedSection = json.data?.section || json.team?.section || 'BSIT';

      const isAlreadyExisting = allTeams.some(
        (t) => t.id === json.team?.id || t.name.toLowerCase() === detectedTeamName.toLowerCase()
      );

      const parsedData = {
        projectTitle: detectedTitle,
        studentName: detectedStudentName,
        partnerName: detectedPartnerName,
        section: detectedSection,
        teamId: json.team?.id || detectedTeamName.toLowerCase().replace(/[^a-z0-9]/g, '-'),
        teamName: detectedTeamName,
        repoName: json.team?.repoName || `uic-${detectedTeamName.toLowerCase().replace(/[^a-z0-9]/g, '-')}-app`,
        weeksCovered: json.weeksCovered || [1, 2, 3, 4],
        isNewTeam: !isAlreadyExisting,
        source: json.source || 'gemini_ai',
        entries: json.data?.entries || [],
      };

      setParsedDocResult(parsedData);
      setProvisionTeamName(detectedTeamName);
      setProvisionSection(detectedSection);
      setProvisionRepoName(parsedData.repoName);
      setProvisionLeadName(detectedStudentName);
      setProvisionPartnerName(detectedPartnerName);
    } catch (err: any) {
      console.error('Document parsing error:', err);
      setDocParseError(err.message || 'Failed to parse document with Gemini AI');
    } finally {
      setIsParsingDoc(false);
    }
  };

  // Commit and Auto-Provision Team + Audits + Kanban Cards
  const handleCommitAutoProvision = () => {
    if (!parsedDocResult) return;

    const finalTeamName = provisionTeamName.trim() || parsedDocResult.teamName;
    const finalTeamId = finalTeamName.toLowerCase().replace(/[^a-z0-9]/g, '-');
    const finalSection = provisionSection.trim() || parsedDocResult.section;
    const finalRepoName = provisionRepoName.trim() || parsedDocResult.repoName;
    const finalLead = provisionLeadName.trim() || parsedDocResult.studentName;
    const finalPartner = provisionPartnerName.trim() || parsedDocResult.partnerName;

    // Check if team already exists
    const existingTeam = allTeams.find(
      (t) => t.id === finalTeamId || t.name.toLowerCase() === finalTeamName.toLowerCase()
    );

    // Build Audit Records for all parsed entries
    const newAudits: AuditRecord[] = parsedDocResult.entries.map((entry, idx) => {
      return {
        id: `doc-audit-${finalTeamId}-${entry.weekNumber}-${Date.now()}-${idx}`,
        timestamp: entry.date || new Date().toISOString(),
        studentEmail: `${finalLead.toLowerCase().replace(/[^a-z]/g, '')}@uic.edu.ph`,
        weekNumber: entry.weekNumber || 1,
        weekLabel: `Week ${entry.weekNumber} (Document Report)`,
        section: finalSection,
        studentName: finalLead,
        studentId: '240000000000',
        rawTeamName: parsedDocResult.projectTitle,
        teamId: finalTeamId,
        teamName: finalTeamName,
        githubUsername: finalLead.split(' ')[0].toLowerCase() + '-dev',
        orgInviteAccepted: true,
        assignedFeature: entry.assignedFeature || `Week ${entry.weekNumber} Milestone`,
        ticketNumber: `Doc-W${entry.weekNumber}-${idx + 1}`,
        ticketStatus: mapTicketStatus(entry.estimatedKanbanStatus || 'Done'),
        commitUrl: `https://github.com/UIC-CCS-MOBILE-DEVELOPMENT-2026-2027/${finalRepoName}/commits/week-${entry.weekNumber}`,
        summary: entry.summary,
        blockers: entry.notesAndBlockers || 'None',
        sourceType: 'document',
        date: entry.date,
        tags: entry.tags || [`Week ${entry.weekNumber}`, 'Milestone'],
      };
    });

    // Build Kanban cards for historical delivery (completed tickets)
    const newCards: KanbanCard[] = parsedDocResult.entries.map((entry, idx) => {
      return {
        id: `card-${finalTeamId}-w${entry.weekNumber}-${idx}`,
        teamId: finalTeamId,
        title: entry.assignedFeature || `Week ${entry.weekNumber} Milestone`,
        ticketNumber: `Issue #W${entry.weekNumber}-${idx + 1}`,
        status: 'done',
        assignee: finalLead,
        assigneeGithub: finalLead.split(' ')[0].toLowerCase() + '-dev',
        commitUrl: `https://github.com/UIC-CCS-MOBILE-DEVELOPMENT-2026-2027/${finalRepoName}/commits/week-${entry.weekNumber}`,
        weekNumber: entry.weekNumber,
        summary: entry.summary,
        blockers: entry.notesAndBlockers,
        hasBlocker: false,
        updatedAt: entry.date || new Date().toLocaleDateString(),
        priority: 'medium',
      };
    });

    if (!existingTeam && onAutoProvisionTeam) {
      // Auto-provision brand new team
      const members: TeamMember[] = [
        {
          name: finalLead,
          studentId: '240000000000',
          githubUsername: finalLead.split(' ')[0].toLowerCase() + '-dev',
          email: `${finalLead.toLowerCase().replace(/[^a-z]/g, '')}@uic.edu.ph`,
          section: finalSection,
          role: 'Lead Developer & Architect',
          hasAcceptedOrg: true,
        },
      ];

      if (finalPartner) {
        members.push({
          name: finalPartner,
          studentId: '240000000001',
          githubUsername: finalPartner.split(' ')[0].toLowerCase() + '-dev',
          email: `${finalPartner.toLowerCase().replace(/[^a-z]/g, '')}@uic.edu.ph`,
          section: finalSection,
          role: 'Partner / Backend Developer',
          hasAcceptedOrg: true,
        });
      }

      const weeksSet = Array.from(new Set(parsedDocResult.entries.map((e) => e.weekNumber)));

      const newTeam: Team = {
        id: finalTeamId,
        name: finalTeamName,
        repoName: finalRepoName,
        githubRepoUrl: `https://github.com/UIC-CCS-MOBILE-DEVELOPMENT-2026-2027/${finalRepoName}`,
        kanbanUrl: `https://github.com/orgs/UIC-CCS-MOBILE-DEVELOPMENT-2026-2027/projects/${finalTeamId}`,
        section: finalSection,
        appDescription: parsedDocResult.projectTitle,
        members,
        readinessScore: Math.min(65 + weeksSet.length * 7, 95),
        healthStatus: 'on_track',
        healthReason: `Weeks 1 to ${Math.max(...weeksSet)} successfully documented and validated via PDF progress audits.`,
        kanbanCounts: {
          backlog: 0,
          inProgress: 0,
          review: 0,
          done: newCards.length,
        },
        totalTickets: newCards.length,
        unresolvedBlockers: [],
        weeksLogged: weeksSet,
        mvpChecklist: {
          ideationApproved: weeksSet.includes(1),
          wireframesDone: weeksSet.includes(2),
          architectureDesigned: weeksSet.includes(3),
          initialRepoSetup: weeksSet.includes(4),
          coreBackendOrDb: false,
          primaryScreensWorking: false,
          packagingAndTesting: false,
        },
      };

      onAutoProvisionTeam(newTeam, newAudits, newCards);
    } else {
      // Team already exists, merge audits into team
      onMergeAudits(newAudits);
    }

    setParsedDocResult(null);
    setBatchFiles([]);
    setDocText('');
    onClose();
  };

  // Parse CSV function
  const handleParseCsv = (raw: string) => {
    setCsvText(raw);
    if (!raw.trim()) {
      setCsvPreview([]);
      setParsedCsvCount(0);
      return;
    }

    try {
      // Basic CSV splitter handling quotes
      const lines: string[][] = [];
      let row: string[] = [];
      let inQuotes = false;
      let cur = '';

      for (let i = 0; i < raw.length; i++) {
        const char = raw[i];
        const next = raw[i + 1];
        if (char === '"') {
          if (inQuotes && next === '"') {
            cur += '"';
            i++;
          } else {
            inQuotes = !inQuotes;
          }
        } else if (char === ',' && !inQuotes) {
          row.push(cur.trim());
          cur = '';
        } else if ((char === '\r' || char === '\n') && !inQuotes) {
          if (char === '\r' && next === '\n') i++;
          row.push(cur.trim());
          if (row.length > 3) lines.push(row);
          row = [];
          cur = '';
        } else {
          cur += char;
        }
      }
      if (cur || row.length > 3) {
        row.push(cur.trim());
        lines.push(row);
      }

      if (lines.length <= 1) return;

      const dataRows = lines.slice(1);
      const mapped: AuditRecord[] = dataRows.map((r, idx) => {
        // Map columns according to standard UIC Google Form layout
        const timestamp = r[0] || '';
        const email = r[1] || '';
        const rawWeek = r[2] || 'Week 7';
        const section = r[3] || 'BSIT';
        const name = r[4] || 'Student Name';
        const studentId = r[5] || '';
        const rawTeam = r[6] || 'Mobile App';
        const githubUser = r[7] || '';
        const orgAccepted = (r[8] || '').toLowerCase().includes('yes');
        const feature = r[9] || 'Feature Implementation';
        const ticketNo = r[10] || 'Issue #';
        const rawStatus = r[11] || 'In Progress';
        const commitLink = r[12] || '';
        const summaryAndBlockers = r[13] || '';

        const weekNum = parseWeekNumber(rawWeek);
        const { teamId, teamName } = normalizeTeam(rawTeam);

        const cleanIdent = (email || studentId || name).toLowerCase().replace(/[^a-z0-9]/g, '');
        const id = `gform-csv-${cleanIdent}-w${weekNum}`;

        return {
          id,
          timestamp,
          studentEmail: email,
          weekNumber: weekNum,
          weekLabel: rawWeek,
          section,
          studentName: name,
          studentId,
          rawTeamName: rawTeam,
          teamId,
          teamName,
          githubUsername: githubUser,
          orgInviteAccepted: orgAccepted,
          assignedFeature: feature,
          ticketNumber: ticketNo,
          ticketStatus: mapTicketStatus(rawStatus),
          commitUrl: commitLink,
          summary: summaryAndBlockers,
          blockers: summaryAndBlockers.toLowerCase().includes('issue') || summaryAndBlockers.toLowerCase().includes('blocker')
            ? summaryAndBlockers
            : 'None',
          sourceType: 'google_form',
        };
      });

      setCsvPreview(mapped);
      setParsedCsvCount(mapped.length);
    } catch (err) {
      console.error('CSV parse error:', err);
    }
  };

  const handleSyncLiveSheet = async () => {
    if (!sheetUrl.trim()) {
      setSheetSyncError('Please provide a Google Sheet link.');
      return;
    }
    setIsSyncingSheet(true);
    setSheetSyncError('');
    setSheetSyncSuccess('');

    try {
      const response = await fetch('/api/forms/sync-live-sheet', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sheetUrl: sheetUrl.trim() }),
      });

      const json = await response.json();
      if (!response.ok || !json.success) {
        throw new Error(json.error || json.details || 'Failed to sync with Google Sheet');
      }

      if (json.audits && json.audits.length > 0) {
        const mappedAudits: AuditRecord[] = json.audits.map((a: any) => {
          const { teamId, teamName } = normalizeTeam(a.rawTeamName || a.teamName);
          const cleanIdent = (a.studentEmail || a.studentId || a.studentName || '').toLowerCase().replace(/[^a-z0-9]/g, '');
          return {
            ...a,
            id: a.id || `gform-${cleanIdent}-w${a.weekNumber}`,
            teamId,
            teamName,
          };
        });
        onMergeAudits(mappedAudits);
        setSheetSyncSuccess(`Successfully synchronized ${mappedAudits.length} live responses from your Google Sheet without duplicates!`);
        localStorage.setItem('uic_gform_sheet_url', sheetUrl.trim());
      } else {
        setSheetSyncSuccess('Connected to Google Sheet successfully! (0 new responses waiting)');
      }
    } catch (err: any) {
      console.error(err);
      setSheetSyncError(err.message || 'Error fetching Google Sheet');
    } finally {
      setIsSyncingSheet(false);
    }
  };

  const handleCopyWebhookScript = () => {
    const origin = window.location.origin;
    const script = `// -------------------------------------------------------------
// Google Apps Script: Live Progress Audit Webhook
// Paste this into your Google Form / Sheets Script Editor
// -------------------------------------------------------------
function onFormSubmit(e) {
  var targetUrl = "${origin}/api/webhooks/google-form";
  var payload = e.namedValues || e.values || {};

  var options = {
    method: "post",
    contentType: "application/json",
    payload: JSON.stringify(payload),
    muteHttpExceptions: true
  };

  try {
    UrlFetchApp.fetch(targetUrl, options);
    Logger.log("Audit response successfully pushed to MobileDev Dashboard!");
  } catch (err) {
    Logger.log("Webhook dispatch error: " + err);
  }
}`;
    navigator.clipboard.writeText(script);
    setCopiedScript(true);
    setTimeout(() => setCopiedScript(false), 2500);
  };

  const handleApplyCsv = () => {
    if (csvPreview.length === 0) return;
    onMergeAudits(csvPreview);
    setCsvSuccessMessage(`Successfully merged ${csvPreview.length} Google Form audit responses!`);
    setTimeout(() => {
      setCsvSuccessMessage('');
      onClose();
    }, 1200);
  };

  // Export CSV generator
  const handleExportCsv = () => {
    const headers = [
      'Audit ID',
      'Source Type',
      'Week Number',
      'Class Section',
      'Student Name',
      'Student ID',
      'Team Name',
      'GitHub Username',
      'Assigned Feature / Module',
      'Ticket Number',
      'Kanban Status',
      'Commit Link',
      'Summary of Accomplishments',
      'Technical Blockers',
      'Timestamp',
    ];

    const rows = existingAudits.map((a) => [
      `"${a.id}"`,
      `"${a.sourceType}"`,
      `"Week ${a.weekNumber}"`,
      `"${a.section}"`,
      `"${a.studentName}"`,
      `"${a.studentId}"`,
      `"${a.teamName}"`,
      `"${a.githubUsername}"`,
      `"${a.assignedFeature.replace(/"/g, '""')}"`,
      `"${a.ticketNumber}"`,
      `"${a.ticketStatus}"`,
      `"${a.commitUrl}"`,
      `"${a.summary.replace(/"/g, '""')}"`,
      `"${a.blockers.replace(/"/g, '""')}"`,
      `"${a.timestamp}"`,
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `UIC_MobileDev_Unified_Audits_W1_W8_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-3xl w-full p-6 shadow-2xl text-slate-200 flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="flex items-start justify-between pb-4 border-b border-slate-800">
          <div>
            <div className="flex items-center gap-2">
              <span className="p-1 rounded-lg bg-indigo-500/10 text-indigo-400">
                <UploadCloud className="w-5 h-5" />
              </span>
              <h3 className="text-lg font-bold text-white tracking-tight">
                Historical Data Unification Engine
              </h3>
            </div>
            <p className="text-xs text-slate-400 mt-1">
              Automate the ingestion and reconciliation of Weeks 1–4 Document Reports (PDF/Text) and Weeks 5–8 Google Form responses.
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab switcher */}
        <div className="flex items-center gap-2 mt-4 pb-2 border-b border-slate-800 text-xs">
          <button
            onClick={() => setActiveTab('doc')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-semibold transition ${
              activeTab === 'doc'
                ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
            }`}
          >
            <FileText className="w-4 h-4 text-amber-400" />
            <span>Weeks 1–4: Document Report Ingestion (Gemini AI)</span>
          </button>

          <button
            onClick={() => setActiveTab('form')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-semibold transition ${
              activeTab === 'form'
                ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
            }`}
          >
            <FormInput className="w-4 h-4 text-emerald-400" />
            <span>Weeks 5–8: Google Forms CSV Ingestion</span>
          </button>

          <button
            onClick={() => setActiveTab('export')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-semibold transition ${
              activeTab === 'export'
                ? 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/30'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
            }`}
          >
            <Download className="w-4 h-4 text-indigo-400" />
            <span>Export & Dean Summary</span>
          </button>
        </div>

        {/* Content area */}
        <div className="flex-1 overflow-y-auto py-4 space-y-4">
          {activeTab === 'doc' && (
            <div className="space-y-4">
              <div className="bg-amber-500/10 border border-amber-500/20 rounded-2xl p-4 text-xs text-amber-200 flex items-start gap-3">
                <Sparkles className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-semibold text-amber-100 flex items-center gap-2">
                    <span>Automated Multi-Week Document Ingestion &amp; Team Auto-Provisioning</span>
                    <span className="px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 text-[10px] font-mono border border-amber-500/30">
                      Weeks 1–4 PDF/DOCX
                    </span>
                  </h4>
                  <p className="mt-1 text-amber-300/80 leading-relaxed">
                    Upload single or multiple student progress reports. If a team is not yet in the system roster (e.g., <strong>StudySync</strong>), the engine automatically creates the team, registers its members, and provisions Kanban cards for completed historical milestones. Files spanning multiple weeks (e.g. <em>Week 3 &amp; 4</em>) are automatically partitioned.
                  </p>
                </div>
              </div>

              {/* Instant One-Click Loaders */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {/* Loader for User Attached Files: StudySync */}
                <div className="p-3.5 rounded-2xl bg-gradient-to-br from-indigo-950/60 to-purple-950/40 border border-indigo-500/40 flex flex-col justify-between space-y-2">
                  <div>
                    <div className="flex items-center justify-between">
                      <span className="px-2 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 text-[10px] font-bold border border-indigo-500/30">
                        ⭐ Attached User Reports
                      </span>
                      <span className="text-[10px] font-mono text-indigo-300">3 Files • Weeks 1–4</span>
                    </div>
                    <h5 className="font-bold text-white text-xs mt-1.5">
                      StudySync (James Allawan &amp; Neill Amper)
                    </h5>
                    <p className="text-[11px] text-slate-400 mt-0.5 leading-snug">
                      Includes Week 1, Week 2, and the combined Week 3 &amp; 4 PDF. Auto-provisions the new team into the roster.
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={handleLoadStudySyncReports}
                    disabled={isParsingDoc}
                    className="w-full py-2 px-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs shadow-md transition flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-50"
                  >
                    <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                    <span>{isParsingDoc ? 'Processing Attached Reports...' : '1-Click Ingest Attached StudySync Files'}</span>
                  </button>
                </div>

                {/* Loader for Crispino StudySprint */}
                <div className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800 flex flex-col justify-between space-y-2">
                  <div>
                    <div className="flex items-center justify-between">
                      <span className="px-2 py-0.5 rounded-full bg-slate-800 text-slate-300 text-[10px] font-bold">
                        Single File Sample
                      </span>
                      <span className="text-[10px] font-mono text-slate-500">1 File • Weeks 1–4</span>
                    </div>
                    <h5 className="font-bold text-white text-xs mt-1.5">
                      StudySprint (Matthew Crispino)
                    </h5>
                    <p className="text-[11px] text-slate-400 mt-0.5 leading-snug">
                      Load standard progress report template for pre-registered StudySprint team.
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={handleLoadSamplePdf}
                    disabled={isParsingDoc}
                    className="w-full py-2 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold text-xs border border-slate-700 transition flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-50"
                  >
                    <FileCheck className="w-3.5 h-3.5 text-indigo-400" />
                    <span>Load Crispino Report</span>
                  </button>
                </div>
              </div>

              {/* Multi-File Upload Box */}
              <div className="border-2 border-dashed border-slate-700 hover:border-indigo-500 rounded-2xl p-5 text-center transition bg-slate-950/40">
                <UploadCloud className="w-8 h-8 text-indigo-400 mx-auto mb-2" />
                <label className="cursor-pointer text-xs font-semibold text-indigo-400 hover:text-indigo-300 block">
                  <span>Browse Student Progress Report PDFs / Word Docs</span>
                  <span className="block text-[11px] font-normal text-slate-400 mt-0.5">
                    Select 1 or multiple files (supports multi-week reports like <code>Week_3___4.pdf</code>)
                  </span>
                  <input
                    type="file"
                    multiple
                    accept=".pdf,.doc,.docx,.txt"
                    onChange={handleBatchFileSelect}
                    className="hidden"
                  />
                </label>
              </div>

              {/* Selected Files Queue */}
              {batchFiles.length > 0 && (
                <div className="p-3 rounded-2xl bg-slate-950 border border-slate-800 space-y-2">
                  <div className="flex items-center justify-between text-xs font-semibold text-slate-300">
                    <div className="flex items-center gap-1.5">
                      <FolderGit2 className="w-4 h-4 text-indigo-400" />
                      <span>{batchFiles.length} Document(s) Ready for Ingestion</span>
                    </div>
                    <button
                      type="button"
                      onClick={() => setBatchFiles([])}
                      className="text-[11px] text-rose-400 hover:text-rose-300"
                    >
                      Clear All
                    </button>
                  </div>

                  <div className="space-y-1.5 max-h-36 overflow-y-auto pr-1">
                    {batchFiles.map((b) => (
                      <div
                        key={b.id}
                        className="flex items-center justify-between p-2 rounded-xl bg-slate-900 border border-slate-800 text-xs"
                      >
                        <div className="flex items-center gap-2 truncate pr-2">
                          <FileText className="w-4 h-4 text-amber-400 shrink-0" />
                          <span className="truncate text-slate-200 font-mono text-[11px]">{b.name}</span>
                          <span className="text-[10px] text-slate-500">({(b.size / 1024).toFixed(0)} KB)</span>
                        </div>
                        <div className="flex items-center gap-2 shrink-0">
                          <span className="px-2 py-0.5 rounded-md bg-indigo-500/20 text-indigo-300 text-[10px] font-mono font-semibold">
                            {b.detectedWeeks.length > 1
                              ? `Weeks ${b.detectedWeeks.join(' & ')} (Multi-Week)`
                              : `Week ${b.detectedWeeks[0]}`}
                          </span>
                          <button
                            type="button"
                            onClick={() => handleRemoveBatchFile(b.id)}
                            className="p-1 rounded text-slate-500 hover:text-rose-400"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Parse Action */}
                  <div className="pt-2 flex justify-end">
                    <button
                      type="button"
                      onClick={handleParseBatchFiles}
                      disabled={isParsingDoc}
                      className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white text-xs font-bold shadow-md transition disabled:opacity-50 cursor-pointer"
                    >
                      {isParsingDoc ? (
                        <>
                          <RefreshCw className="w-4 h-4 animate-spin" />
                          <span>Parsing &amp; Partitioning Documents...</span>
                        </>
                      ) : (
                        <>
                          <Sparkles className="w-4 h-4 text-amber-300" />
                          <span>Parse All {batchFiles.length} File(s) with AI &amp; PDF Engine</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              )}

              {/* Optional Text Paste Alternative */}
              {batchFiles.length === 0 && (
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Or Paste Progress Report Text:
                  </label>
                  <textarea
                    rows={3}
                    value={docText}
                    onChange={(e) => setDocText(e.target.value)}
                    placeholder="Project Title: StudySync&#10;Name: James Reino A. Allawan (Partner: Neill Laurence H. Amper)&#10;Date: Sept 21, 2026 Accomplishments: Interactive Figma prototypes..."
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 font-mono"
                  />
                  {docText.trim() && (
                    <div className="flex justify-end mt-2">
                      <button
                        type="button"
                        onClick={handleParseBatchFiles}
                        disabled={isParsingDoc}
                        className="px-4 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold transition"
                      >
                        Parse Pasted Text
                      </button>
                    </div>
                  )}
                </div>
              )}

              {docParseError && (
                <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{docParseError}</span>
                </div>
              )}

              {/* Parsed Result & Auto-Provisioning Confirmation */}
              {parsedDocResult && (
                <div className="p-4 rounded-2xl bg-slate-950 border border-emerald-500/50 space-y-4">
                  {/* Status Banner */}
                  <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className="font-bold text-white text-xs">
                            Extracted {parsedDocResult.entries.length} Weekly Milestones across Weeks{' '}
                            {parsedDocResult.weeksCovered.join(', ')}
                          </h4>
                          {parsedDocResult.isNewTeam ? (
                            <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 text-[10px] font-bold border border-emerald-500/40">
                              🆕 New Team Not in Roster
                            </span>
                          ) : (
                            <span className="px-2 py-0.5 rounded-full bg-blue-500/20 text-blue-300 text-[10px] font-bold border border-blue-500/40">
                              Existing Team Matched
                            </span>
                          )}
                        </div>
                        <p className="text-[11px] text-slate-400 mt-0.5">
                          Multi-week report partitioned successfully into distinct weekly audit records &amp; Kanban tickets.
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Auto-Provision Form (Pre-filled, editable) */}
                  <div className="bg-slate-900/90 p-3.5 rounded-xl border border-slate-800 space-y-3">
                    <div className="flex items-center justify-between text-xs font-semibold text-indigo-300">
                      <div className="flex items-center gap-1.5">
                        <Users className="w-4 h-4 text-indigo-400" />
                        <span>Team &amp; Repository Provisioning Details:</span>
                      </div>
                      <span className="text-[10px] text-slate-400">All fields automatically detected</span>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-2.5 text-xs">
                      <div>
                        <label className="block text-[11px] text-slate-400 mb-1">Team Name</label>
                        <input
                          type="text"
                          value={provisionTeamName}
                          onChange={(e) => setProvisionTeamName(e.target.value)}
                          className="w-full px-2.5 py-1.5 rounded-lg bg-slate-950 border border-slate-700 text-white text-xs font-semibold"
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] text-slate-400 mb-1">Class Section</label>
                        <input
                          type="text"
                          value={provisionSection}
                          onChange={(e) => setProvisionSection(e.target.value)}
                          className="w-full px-2.5 py-1.5 rounded-lg bg-slate-950 border border-slate-700 text-white text-xs"
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] text-slate-400 mb-1">Assigned Repo</label>
                        <input
                          type="text"
                          value={provisionRepoName}
                          onChange={(e) => setProvisionRepoName(e.target.value)}
                          className="w-full px-2.5 py-1.5 rounded-lg bg-slate-950 border border-slate-700 text-indigo-300 text-xs font-mono"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5 text-xs">
                      <div>
                        <label className="block text-[11px] text-slate-400 mb-1">Lead Student (Author)</label>
                        <input
                          type="text"
                          value={provisionLeadName}
                          onChange={(e) => setProvisionLeadName(e.target.value)}
                          className="w-full px-2.5 py-1.5 rounded-lg bg-slate-950 border border-slate-700 text-white text-xs font-medium"
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] text-slate-400 mb-1">Partner (Registered in Team)</label>
                        <input
                          type="text"
                          value={provisionPartnerName}
                          onChange={(e) => setProvisionPartnerName(e.target.value)}
                          placeholder="Partner name if detected or leave empty"
                          className="w-full px-2.5 py-1.5 rounded-lg bg-slate-950 border border-slate-700 text-white text-xs font-medium"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Weekly Entries Breakdown */}
                  <div>
                    <span className="text-xs font-bold text-slate-300 block mb-2">
                      Extracted Weekly Accomplishments ({parsedDocResult.entries.length} items):
                    </span>
                    <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
                      {parsedDocResult.entries.map((entry, idx) => (
                        <div
                          key={idx}
                          className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 text-xs space-y-1"
                        >
                          <div className="flex items-center justify-between text-[11px]">
                            <div className="flex items-center gap-2">
                              <span className="px-2 py-0.5 rounded-md bg-indigo-500/20 text-indigo-300 font-bold">
                                Week {entry.weekNumber}
                              </span>
                              <span className="font-semibold text-slate-200">{entry.assignedFeature}</span>
                            </div>
                            <span className="font-mono text-slate-400 text-[10px]">{entry.date}</span>
                          </div>
                          <p className="text-slate-300 text-[11px] leading-relaxed">{entry.summary}</p>
                          {entry.notesAndBlockers && entry.notesAndBlockers !== 'None' && (
                            <div className="text-[10px] text-amber-300/90 italic">
                              Notes: {entry.notesAndBlockers}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Confirm CTA */}
                  <div className="flex items-center justify-between pt-2 border-t border-slate-800">
                    <span className="text-[11px] text-slate-400">
                      Creates team entry, updates presentation score, and seeds Kanban board
                    </span>
                    <button
                      type="button"
                      onClick={handleCommitAutoProvision}
                      className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-lg transition flex items-center gap-2 cursor-pointer"
                    >
                      <CheckCircle2 className="w-4 h-4" />
                      <span>
                        {parsedDocResult.isNewTeam
                          ? `✨ Auto-Provision "${provisionTeamName || 'Team'}" & Ingest ${parsedDocResult.entries.length} Milestones`
                          : `Merge ${parsedDocResult.entries.length} Audits into ${provisionTeamName}`}
                      </span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}

          {activeTab === 'form' && (
            <div className="space-y-4">
              {/* Sub-tab navigation */}
              <div className="flex items-center gap-1 bg-slate-950 p-1 rounded-xl border border-slate-800 text-xs">
                <button
                  type="button"
                  onClick={() => setFormSubTab('live_sheet')}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-semibold transition ${
                    formSubTab === 'live_sheet'
                      ? 'bg-emerald-600 text-white shadow-sm'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  <Link2 className="w-3.5 h-3.5" />
                  <span>Method 1: Live Google Sheet Link (Real-Time)</span>
                </button>

                <button
                  type="button"
                  onClick={() => setFormSubTab('webhook')}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-semibold transition ${
                    formSubTab === 'webhook'
                      ? 'bg-purple-600 text-white shadow-sm'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  <Zap className="w-3.5 h-3.5 text-amber-300" />
                  <span>Method 2: Instant Form Webhook (Apps Script)</span>
                </button>

                <button
                  type="button"
                  onClick={() => setFormSubTab('csv')}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-semibold transition ${
                    formSubTab === 'csv'
                      ? 'bg-slate-800 text-white shadow-sm'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  <FileText className="w-3.5 h-3.5" />
                  <span>Method 3: Paste CSV Export</span>
                </button>
              </div>

              {/* Sub-tab 1: Live Google Sheet Link */}
              {formSubTab === 'live_sheet' && (
                <div className="space-y-4">
                  <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-2xl p-4 text-xs text-emerald-200 flex items-start gap-3">
                    <Radio className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5 animate-pulse" />
                    <div>
                      <h4 className="font-semibold text-emerald-100">
                        Live Continuous Sync via Linked Google Sheet
                      </h4>
                      <p className="mt-0.5 text-emerald-300/80 leading-relaxed">
                        Whenever students submit your Google Form, responses automatically populate in the linked Google Sheet. Simply paste that Sheet's URL below. The dashboard will pull the latest student submissions dynamically without needing manual file downloads.
                      </p>
                    </div>
                  </div>

                  <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 space-y-3">
                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1">
                        Google Sheet Response URL:
                      </label>
                      <input
                        type="url"
                        value={sheetUrl}
                        onChange={(e) => setSheetUrl(e.target.value)}
                        placeholder="https://docs.google.com/spreadsheets/d/1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs74OgvE2upms/edit"
                        className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700/80 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500 font-mono"
                      />
                      <p className="text-[11px] text-slate-400 mt-1">
                        <strong>Tip:</strong> In your Google Sheet, ensure permissions are set to <em>"Anyone with the link can view"</em> or click <em>File &gt; Share &gt; Publish to web</em>.
                      </p>
                    </div>

                    {sheetSyncError && (
                      <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex items-center gap-2">
                        <AlertCircle className="w-4 h-4 shrink-0" />
                        <span>{sheetSyncError}</span>
                      </div>
                    )}

                    {sheetSyncSuccess && (
                      <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4 shrink-0" />
                        <span>{sheetSyncSuccess}</span>
                      </div>
                    )}

                    <div className="flex items-center justify-between pt-2">
                      <div className="text-[11px] text-slate-400">
                        Updates both Kanban &amp; Weeks 1–8 Matrix automatically
                      </div>
                      <button
                        type="button"
                        onClick={handleSyncLiveSheet}
                        disabled={isSyncingSheet || !sheetUrl.trim()}
                        className="flex items-center gap-2 px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold shadow-md transition disabled:opacity-50 cursor-pointer"
                      >
                        <RefreshCw className={`w-3.5 h-3.5 ${isSyncingSheet ? 'animate-spin' : ''}`} />
                        <span>{isSyncingSheet ? 'Fetching Live Responses...' : 'Sync Live Sheet Now'}</span>
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* Sub-tab 2: Instant Form Webhook */}
              {formSubTab === 'webhook' && (
                <div className="space-y-4">
                  <div className="bg-purple-500/10 border border-purple-500/20 rounded-2xl p-4 text-xs text-purple-200 flex items-start gap-3">
                    <Zap className="w-5 h-5 text-amber-300 shrink-0 mt-0.5" />
                    <div>
                      <h4 className="font-semibold text-purple-100">
                        Zero-Delay Push: Google Apps Script Webhook
                      </h4>
                      <p className="mt-0.5 text-purple-300/80 leading-relaxed">
                        Want instant notifications the exact second a student clicks <strong>Submit</strong>? A simple 5-line Google Apps Script on your Form sends the student's submission directly to this dashboard's webhook.
                      </p>
                    </div>
                  </div>

                  <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 space-y-3">
                    <div className="flex items-center justify-between">
                      <div>
                        <span className="text-xs font-bold text-white uppercase tracking-wider">
                          Ready-to-Use Google Apps Script
                        </span>
                        <div className="text-[11px] text-emerald-400 flex items-center gap-1.5 mt-0.5">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                          <span>Already deployed &amp; running live on Google Cloud Run</span>
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={handleCopyWebhookScript}
                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold shadow-sm transition"
                      >
                        {copiedScript ? <Check className="w-3.5 h-3.5 text-emerald-300" /> : <Copy className="w-3.5 h-3.5" />}
                        <span>{copiedScript ? 'Copied with Your Live URL!' : 'Copy Pre-Filled Script'}</span>
                      </button>
                    </div>

                    <div className="p-2.5 rounded-xl bg-slate-900/80 border border-slate-800 text-[11px] font-mono text-slate-300 flex items-center justify-between gap-2">
                      <div className="truncate">
                        <span className="text-slate-500">Your Webhook URL: </span>
                        <span className="text-emerald-400">
                          {typeof window !== 'undefined' ? window.location.origin : ''}/api/webhooks/google-form
                        </span>
                      </div>
                    </div>

                    <pre className="p-3 rounded-xl bg-slate-900 border border-slate-800 text-[11px] font-mono text-indigo-300 overflow-x-auto leading-relaxed">
{`function onFormSubmit(e) {
  // Your applet is already live on Google Cloud Run:
  var targetUrl = "${typeof window !== 'undefined' ? window.location.origin : ''}/api/webhooks/google-form";
  var payload = e.namedValues || e.values || {};

  UrlFetchApp.fetch(targetUrl, {
    method: "post",
    contentType: "application/json",
    payload: JSON.stringify(payload),
    muteHttpExceptions: true
  });
}`}
                    </pre>

                    <div className="space-y-1.5 text-xs text-slate-300 bg-slate-900/60 p-3 rounded-xl border border-slate-800/80">
                      <h5 className="font-bold text-white text-[11px] uppercase">3-Step Setup Guide:</h5>
                      <ol className="list-decimal list-inside space-y-1 text-slate-400 text-[11px]">
                        <li>In your Google Form (or linked Sheet), click the <strong>3 vertical dots</strong> in the top right &gt; select <strong>&lt;&gt; Script editor</strong>.</li>
                        <li>Paste the pre-filled code above into the script editor and click the <strong>Save</strong> disk icon.</li>
                        <li>Click the <strong>Triggers</strong> icon (clock on the left menu) &gt; click <strong>Add Trigger</strong> &gt; set <em>Select event type</em> to <strong>On form submit</strong> &gt; Save.</li>
                      </ol>
                    </div>
                  </div>
                </div>
              )}

              {/* Sub-tab 3: CSV Paste */}
              {formSubTab === 'csv' && (
                <div className="space-y-4">
                  {/* Quick Reload Default CSV Button */}
                  <div className="flex items-center justify-between bg-slate-950 p-3 rounded-xl border border-slate-800 text-xs">
                    <div>
                      <span className="font-semibold text-white">Reset or Restore Authentic Class Data</span>
                      <div className="text-[11px] text-slate-400">
                        Re-seeds default audits from both Google Forms &amp; historical documents
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={onResetToDefault}
                      className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 font-medium border border-slate-700 transition flex items-center gap-1.5"
                    >
                      <RefreshCw className="w-3.5 h-3.5" />
                      <span>Restore UIC Class Dataset</span>
                    </button>
                  </div>

                  {/* CSV Textarea */}
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">
                      Paste Google Forms CSV Data:
                    </label>
                    <textarea
                      rows={6}
                      value={csvText}
                      onChange={(e) => handleParseCsv(e.target.value)}
                      placeholder="Timestamp,Email Address,Select Week Number,Select Class Section,Full Name,Student ID,App Title,GitHub Username..."
                      className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 font-mono"
                    />
                  </div>

                  {parsedCsvCount > 0 && (
                    <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4 shrink-0" />
                        <span>Parsed {parsedCsvCount} valid audit records from CSV</span>
                      </div>
                      <button
                        onClick={handleApplyCsv}
                        className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-sm transition"
                      >
                        Apply to Dashboard
                      </button>
                    </div>
                  )}

                  {csvSuccessMessage && (
                    <div className="p-3 rounded-xl bg-emerald-500/20 text-emerald-200 text-xs font-bold text-center">
                      {csvSuccessMessage}
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

          {activeTab === 'export' && (
            <div className="space-y-4">
              <div className="bg-indigo-500/10 border border-indigo-500/20 rounded-2xl p-4 text-xs text-indigo-200">
                <h4 className="font-semibold text-indigo-100">
                  Export Unified Faculty Audit Dossier
                </h4>
                <p className="mt-0.5 text-indigo-300/80 leading-relaxed">
                  Download a complete reconciled report of all 8 weeks formatted for progress review and documentation.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <button
                  onClick={handleExportCsv}
                  className="p-4 rounded-2xl bg-slate-950 border border-slate-800 hover:border-indigo-500 text-left transition space-y-2 group"
                >
                  <div className="flex items-center justify-between">
                    <span className="p-2 rounded-xl bg-indigo-500/20 text-indigo-400 group-hover:scale-110 transition">
                      <Download className="w-5 h-5" />
                    </span>
                    <span className="text-[10px] font-mono text-slate-500">.CSV Spreadsheet</span>
                  </div>
                  <h4 className="font-bold text-white text-xs">Download Unified CSV</h4>
                  <p className="text-[11px] text-slate-400">
                    Contains all {existingAudits.length} entries across Weeks 1 to 8 with commit URLs and blockers.
                  </p>
                </button>

                <button
                  onClick={() => window.print()}
                  className="p-4 rounded-2xl bg-slate-950 border border-slate-800 hover:border-indigo-500 text-left transition space-y-2 group"
                >
                  <div className="flex items-center justify-between">
                    <span className="p-2 rounded-xl bg-purple-500/20 text-purple-400 group-hover:scale-110 transition">
                      <FileCheck className="w-5 h-5" />
                    </span>
                    <span className="text-[10px] font-mono text-slate-500">Print / PDF</span>
                  </div>
                  <h4 className="font-bold text-white text-xs">Print Audit Summary</h4>
                  <p className="text-[11px] text-slate-400">
                    Faculty-formatted print view displaying team readiness, milestones, and status.
                  </p>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
