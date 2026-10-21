export type HealthStatus = 'on_track' | 'needs_attention' | 'blocked';

export type TicketStatus = 'Backlog' | 'In Progress' | 'Review' | 'Done';

export interface AuditRecord {
  id: string;
  timestamp: string;
  studentEmail: string;
  weekNumber: number; // 1 to 8+
  weekLabel: string; // e.g. "Week 7 (Oct 10 - Oct 16)" or "Week 2: Wireframing"
  section: string; // "BSIT 3A & CS" | "BSIT 3B"
  studentName: string;
  studentId: string;
  rawTeamName: string;
  teamId: string; // Normalized ID (e.g., 'alleah-pos', 'wordquest')
  teamName: string; // Canonical team name
  githubUsername: string;
  orgInviteAccepted: boolean;
  assignedFeature: string;
  ticketNumber: string;
  ticketStatus: TicketStatus;
  commitUrl: string;
  summary: string;
  blockers: string;
  sourceType: 'document' | 'google_form' | 'kanban_sync';
  date?: string;
  tags?: string[];
}

export interface TeamMember {
  name: string;
  studentId: string;
  githubUsername: string;
  email: string;
  section: string;
  role?: string;
  hasAcceptedOrg?: boolean;
}

export interface KanbanCard {
  id: string;
  teamId: string;
  title: string;
  ticketNumber: string;
  status: 'backlog' | 'in_progress' | 'review' | 'done';
  assignee: string;
  assigneeGithub: string;
  commitUrl?: string;
  weekNumber: number;
  summary: string;
  blockers?: string;
  hasBlocker: boolean;
  updatedAt: string;
  priority?: 'high' | 'medium' | 'low';
}

export interface Team {
  id: string;
  name: string;
  repoName: string;
  githubRepoUrl: string;
  kanbanUrl?: string; // GitHub Project Board or custom Kanban URL
  section: string;
  appDescription: string;
  members: TeamMember[];
  readinessScore: number; // 0 to 100
  healthStatus: HealthStatus;
  healthReason: string;
  kanbanCounts: {
    backlog: number;
    inProgress: number;
    review: number;
    done: number;
  };
  totalTickets: number;
  unresolvedBlockers: string[];
  latestCommitDate?: string;
  weeksLogged: number[]; // e.g. [1, 2, 3, 4, 5, 6, 7, 8]
  mvpChecklist: {
    ideationApproved: boolean; // W1
    wireframesDone: boolean; // W2
    architectureDesigned: boolean; // W3
    initialRepoSetup: boolean; // W4
    coreBackendOrDb: boolean; // W5-6
    primaryScreensWorking: boolean; // W7
    packagingAndTesting: boolean; // W8
  };
}

export interface DefenseEvaluation {
  readinessVerdict: string;
  executiveSummary: string;
  defenseQuestions: {
    targetMember: string;
    question: string;
    rationale: string;
    expectedKeyAnswers: string;
  }[];
  technicalRisksToInspectInLiveDemo: string[];
  recommendedGradingAdjustment: string;
}

export interface DocumentParseResult {
  studentName: string;
  projectTitle: string;
  studentId?: string;
  section?: string;
  githubUsername?: string;
  entries: {
    weekNumber: number;
    date: string;
    assignedFeature: string;
    summary: string;
    notesAndBlockers: string;
    estimatedKanbanStatus: string;
    tags?: string[];
  }[];
}
