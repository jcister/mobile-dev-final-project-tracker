import { AuditRecord, Team, KanbanCard, TicketStatus } from '../types';

export const GITHUB_ORG_NAME = 'UIC-CCS-MOBILE-DEVELOPMENT-2026-2027';

// Team name normalizer that handles inconsistent spelling from Google Forms
export function normalizeTeam(rawName: string): { teamId: string; teamName: string; repoName: string } {
  const lower = (rawName || '').toLowerCase().trim();

  if (lower.includes('alleah') || lower.includes('a.l.l.e.a.h')) {
    return {
      teamId: 'alleah-pos',
      teamName: 'ALLEAH - Accurate Ledger, Logistics, Enterprise & Accounting Hub',
      repoName: 'ALLEAH-POS-System',
    };
  }
  if (lower.includes('batid') || lower.includes('patas')) {
    return {
      teamId: 'batid-patas',
      teamName: 'Batid Patas - Legal Aid & Law AI Assistant',
      repoName: 'Batid-Patas-Aniag-Rivera',
    };
  }
  if (lower.includes('brainbox') || lower.includes('brain box')) {
    return {
      teamId: 'brainbox',
      teamName: 'BrainBox - Cognitive Learning Companion',
      repoName: 'BrainBox-Mobile-App',
    };
  }
  if (lower.includes('spendlens')) {
    return {
      teamId: 'spendlens',
      teamName: 'SpendLens - AI Receipt & Expense Visualizer',
      repoName: 'SpendLens-Ampi-Reponoya',
    };
  }
  if (lower.includes('spendwise')) {
    return {
      teamId: 'spendwise',
      teamName: 'SpendWise - Personal Financial Planner',
      repoName: 'SpendWise-Nanual-Alconera',
    };
  }
  if (lower.includes('wordquest')) {
    return {
      teamId: 'wordquest',
      teamName: 'WordQuest - Vocabulary Puzzle Engine',
      repoName: 'WordQuest',
    };
  }
  if (lower.includes('luau') || lower.includes('learn luau')) {
    return {
      teamId: 'learn-luau',
      teamName: 'Learn Luau - Interactive Coding & Scripting App',
      repoName: 'LearnLuau-Olpenado-Palencia',
    };
  }
  if (lower.includes('iskolar') || lower.includes('edu-iskolar')) {
    return {
      teamId: 'edu-iskolar',
      teamName: 'Edu-Iskolar - Scholarship & Student Portal',
      repoName: 'Edu-Iskolar_Eucare_Delos_Santos',
    };
  }
  if (lower.includes('studysprint')) {
    return {
      teamId: 'studysprint',
      teamName: 'StudySprint - Collaborative Exam Prep Tracker',
      repoName: 'studysprint_Crispino-lulab',
    };
  }
  if (lower.includes('beyond')) {
    return {
      teamId: 'beyond',
      teamName: 'Beyond - Interactive Campus & Gamified Map Navigator',
      repoName: 'Beyond-Attos-Millondaga',
    };
  }
  if (lower.includes('23:5') || lower.includes('cafe')) {
    return {
      teamId: 'cafe-235',
      teamName: '23:5 Cafe - Mobile Ordering & Barista Dispatch',
      repoName: '23-5-cafe-mobileApp-Galorio-Vergara',
    };
  }
  if (lower.includes('studysync')) {
    return {
      teamId: 'studysync',
      teamName: 'StudySync - UIC Peer-to-Peer Study Matchmaker & Note Repository',
      repoName: 'uic-studysync-app',
    };
  }

  // Fallback for custom teams
  const cleanId = lower.replace(/[^a-z0-9]/g, '-').replace(/-+/g, '-');
  return {
    teamId: cleanId || 'custom-team',
    teamName: rawName.trim() || 'Custom Team',
    repoName: cleanId || 'mobile-project',
  };
}

export function parseWeekNumber(weekStr: string): number {
  if (!weekStr) return 1;
  const match = weekStr.match(/week\s*(\d+)/i);
  if (match) return parseInt(match[1], 10);
  const num = parseInt(weekStr.replace(/[^0-9]/g, ''), 10);
  return isNaN(num) ? 1 : num;
}

export function mapTicketStatus(rawStatus: string): TicketStatus {
  const s = (rawStatus || '').toLowerCase();
  if (s.includes('done') || s.includes('completed') || s.includes('merged')) return 'Done';
  if (s.includes('in progress') || s.includes('coding') || s.includes('ongoing')) return 'In Progress';
  if (s.includes('review') || s.includes('testing') || s.includes('pr')) return 'Review';
  return 'Backlog';
}

// 1. Initial Google Forms Audits (Weeks 5-8) - Direct parse of UIC Mobile Dev responses
export const INITIAL_FORM_AUDITS: AuditRecord[] = [
  {
    id: 'gf-1',
    timestamp: '10/15/2026 11:34:17',
    studentEmail: 'rsalibay_240000001605@uic.edu.ph',
    weekNumber: 7,
    weekLabel: 'Week 7 (Oct 10 - Oct 16)',
    section: 'BSIT 3A & CS',
    studentName: 'Salibay, Rex Del Cielo R.',
    studentId: '240000001605',
    rawTeamName: 'WordQuest',
    teamId: 'wordquest',
    teamName: 'WordQuest - Vocabulary Puzzle Engine',
    githubUsername: 'REX69-123',
    orgInviteAccepted: true,
    assignedFeature: 'UI Layout',
    ticketNumber: 'Issue #1',
    ticketStatus: 'Backlog',
    commitUrl: 'https://github.com/UIC-CCS-MOBILE-DEVELOPMENT-2026-2027/WordQuest/commit/a180593',
    summary: 'Implemented UI layout for word grid.',
    blockers: 'None stated, but card still marked Backlog despite initial commit.',
    sourceType: 'google_form',
    date: '2026-10-15',
  },
  {
    id: 'gf-2',
    timestamp: '10/15/2026 11:49:49',
    studentEmail: 'nolpenado_240000001755@uic.edu.ph',
    weekNumber: 7,
    weekLabel: 'Week 7 (Oct 10 - Oct 16)',
    section: 'BSIT 3A & CS',
    studentName: 'Olpenado, Ninmar H.',
    studentId: '240000001755',
    rawTeamName: 'Team 05 - Learn Luau',
    teamId: 'learn-luau',
    teamName: 'Learn Luau - Interactive Coding & Scripting App',
    githubUsername: 'nyanmyr',
    orgInviteAccepted: true,
    assignedFeature: 'Database Connection, Register, Login, Logout',
    ticketNumber: 'Database Connection #11, Register #2, Login #3, Logout #4',
    ticketStatus: 'Done',
    commitUrl: 'https://github.com/UIC-CCS-MOBILE-DEVELOPMENT-2026-2027/LearnLuau-Olpenado-Palencia/commit/55e8d70f8c4be86e40fcf69d1aa978f7067284d5',
    summary: 'Connected the blank application to the database; completed basic register, login, and logout features.',
    blockers: 'Initial DB authentication handshake latency resolved.',
    sourceType: 'google_form',
    date: '2026-10-15',
  },
  {
    id: 'gf-3',
    timestamp: '10/15/2026 13:42:19',
    studentEmail: 'edelossantos_240000001315@uic.edu.ph',
    weekNumber: 7,
    weekLabel: 'Week 7 (Oct 10 - Oct 16)',
    section: 'BSIT 3A & CS',
    studentName: 'Delos Santos, Ethan Gabriele E.',
    studentId: '240000001315',
    rawTeamName: 'Edu-Iskolar',
    teamId: 'edu-iskolar',
    teamName: 'Edu-Iskolar - Scholarship & Student Portal',
    githubUsername: 'GabrieleEspiritu',
    orgInviteAccepted: true,
    assignedFeature: 'Updating UI/UX, Fixing Buttons, Kanban repository, initial backend',
    ticketNumber: 'Issue #3, 6, 7, 1',
    ticketStatus: 'In Progress',
    commitUrl: 'https://github.com/UIC-CCS-MOBILE-DEVELOPMENT-2026-2027/Edu-Iskolar_Eucare_Delos_Santos/commit/6d1b10b05b338ca9fc6572e4a5ba0928f0b7a672',
    summary: 'Implementing login and register logic for users.',
    blockers: 'Creating the DB since still learning or recalling what to do for it.',
    sourceType: 'google_form',
    date: '2026-10-15',
  },
  {
    id: 'gf-4',
    timestamp: '10/15/2026 13:51:34',
    studentEmail: 'edelossantos_240000001315@uic.edu.ph',
    weekNumber: 5,
    weekLabel: 'Week 5 (Sept 26 - Oct 2)',
    section: 'BSIT 3A & CS',
    studentName: 'Delos Santos, Ethan Gabriele E.',
    studentId: '240000001315',
    rawTeamName: 'Edu-Iskolar',
    teamId: 'edu-iskolar',
    teamName: 'Edu-Iskolar - Scholarship & Student Portal',
    githubUsername: 'GabrieleEspiritu',
    orgInviteAccepted: true,
    assignedFeature: 'initial commit',
    ticketNumber: 'Issue #3',
    ticketStatus: 'Done',
    commitUrl: 'https://github.com/UIC-CCS-MOBILE-DEVELOPMENT-2026-2027/Edu-Iskolar_Eucare_Delos_Santos/commit/98a9da0d9d820e17dca33fcea3d3c0466ca00336',
    summary: 'Transfer prototype to VS Code for initial system.',
    blockers: 'Facing issue matching same design as the prototype.',
    sourceType: 'google_form',
    date: '2026-10-15',
  },
  {
    id: 'gf-5',
    timestamp: '10/15/2026 13:59:38',
    studentEmail: 'edelossantos_240000001315@uic.edu.ph',
    weekNumber: 6,
    weekLabel: 'Week 6 (Oct 3 - Oct 9)',
    section: 'BSIT 3A & CS',
    studentName: 'Delos Santos, Ethan Gabriele E.',
    studentId: '240000001315',
    rawTeamName: 'Edu-Iskolar',
    teamId: 'edu-iskolar',
    teamName: 'Edu-Iskolar - Scholarship & Student Portal',
    githubUsername: 'GabrieleEspiritu',
    orgInviteAccepted: true,
    assignedFeature: 'merge initial remote setup',
    ticketNumber: 'Issues #7, 2',
    ticketStatus: 'In Progress',
    commitUrl: 'https://github.com/UIC-CCS-MOBILE-DEVELOPMENT-2026-2027/Edu-Iskolar_Eucare_Delos_Santos/commit/89b7e0899b1c456ffbace35e84ea564ea20b4580',
    summary: 'Just initial merge on the initial commits.',
    blockers: 'Remote git branches conflict resolved.',
    sourceType: 'google_form',
    date: '2026-10-15',
  },
  {
    id: 'gf-6',
    timestamp: '10/16/2026 10:59:05',
    studentEmail: 'mcrispino_240000000173@uic.edu.ph',
    weekNumber: 7,
    weekLabel: 'Week 7 (Oct 10 - Oct 16)',
    section: 'BSIT 3B',
    studentName: 'Crispino, Matthew Ikee M.',
    studentId: '240000000173',
    rawTeamName: 'studysprint_Crispino-lulab',
    teamId: 'studysprint',
    teamName: 'StudySprint - Collaborative Exam Prep Tracker',
    githubUsername: 'matthew05042001',
    orgInviteAccepted: true,
    assignedFeature: 'Flutter Code Setup & Repository Initialization',
    ticketNumber: 'Issue #2',
    ticketStatus: 'Backlog',
    commitUrl: 'https://github.com/UIC-CCS-MOBILE-DEVELOPMENT-2026-2027/studysprint_Crispino-lulab/commits/main/',
    summary: 'Updated project title in README.md and initialized repository structure for the Flutter application.',
    blockers: 'None. Still in initial setup phase.',
    sourceType: 'google_form',
    date: '2026-10-16',
  },
  {
    id: 'gf-7',
    timestamp: '10/17/2026 09:56:05',
    studentEmail: 'jreponoya_240000001805@uic.edu.ph',
    weekNumber: 8,
    weekLabel: 'Week 8 (Oct 17 - Oct 23)',
    section: 'BSIT 3A & CS',
    studentName: 'Reponoya, Joshua M.',
    studentId: '240000001805',
    rawTeamName: 'SpendLens',
    teamId: 'spendlens',
    teamName: 'SpendLens - AI Receipt & Expense Visualizer',
    githubUsername: 'JoshyReps',
    orgInviteAccepted: true,
    assignedFeature: 'backend-auth-controller',
    ticketNumber: 'Issue #13',
    ticketStatus: 'Done',
    commitUrl: 'https://github.com/UIC-CCS-MOBILE-DEVELOPMENT-2026-2027/SpendLens-Ampi-Reponoya/commit/d0f68ae1fce453474bd363a8a6aa602869d406b2',
    summary: 'Created the Login and Registration UI and the Backend Auth Controller.',
    blockers: 'None. Code merged and verified.',
    sourceType: 'google_form',
    date: '2026-10-17',
  },
  {
    id: 'gf-8',
    timestamp: '10/17/2026 09:59:20',
    studentEmail: 'jreponoya_240000001805@uic.edu.ph',
    weekNumber: 7,
    weekLabel: 'Week 7 (Oct 10 - Oct 16)',
    section: 'BSIT 3A & CS',
    studentName: 'Reponoya, Joshua M.',
    studentId: '240000001805',
    rawTeamName: 'SpendLens',
    teamId: 'spendlens',
    teamName: 'SpendLens - AI Receipt & Expense Visualizer',
    githubUsername: 'JoshyReps',
    orgInviteAccepted: true,
    assignedFeature: 'Camera-and-AI Analysis',
    ticketNumber: 'Issue #12',
    ticketStatus: 'Done',
    commitUrl: 'https://github.com/UIC-CCS-MOBILE-DEVELOPMENT-2026-2027/SpendLens-Ampi-Reponoya/commit/d0f68ae1fce453474bd363a8a6aa602869d406b2',
    summary: 'Finished Camera and AI analysis by sending requests to Gemini through our backend Receipt Controller.',
    blockers: 'Connecting React Native with ASP.NET Core Backend through HTTPS. Solved by transitioning dev endpoints to HTTP.',
    sourceType: 'google_form',
    date: '2026-10-17',
  },
  {
    id: 'gf-9',
    timestamp: '10/17/2026 10:02:25',
    studentEmail: 'jreponoya_240000001805@uic.edu.ph',
    weekNumber: 6,
    weekLabel: 'Week 6 (Oct 3 - Oct 9)',
    section: 'BSIT 3A & CS',
    studentName: 'Reponoya, Joshua M.',
    studentId: '240000001805',
    rawTeamName: 'SpendLens',
    teamId: 'spendlens',
    teamName: 'SpendLens - AI Receipt & Expense Visualizer',
    githubUsername: 'JoshyReps',
    orgInviteAccepted: true,
    assignedFeature: 'camera-ui',
    ticketNumber: 'Issue #8',
    ticketStatus: 'Done',
    commitUrl: 'https://github.com/UIC-CCS-MOBILE-DEVELOPMENT-2026-2027/SpendLens-Ampi-Reponoya/commit/d0f68ae1fce453474bd363a8a6aa602869d406b2',
    summary: 'Created camera button requesting permissions and invoking capture.',
    blockers: 'Android Studio virtual device lacked image persistence. Solution: switched to Expo Go on physical device.',
    sourceType: 'google_form',
    date: '2026-10-17',
  },
  {
    id: 'gf-10',
    timestamp: '10/17/2026 10:06:34',
    studentEmail: 'jreponoya_240000001805@uic.edu.ph',
    weekNumber: 5,
    weekLabel: 'Week 5 (Sept 26 - Oct 2)',
    section: 'BSIT 3A & CS',
    studentName: 'Reponoya, Joshua M.',
    studentId: '240000001805',
    rawTeamName: 'SpendLens',
    teamId: 'spendlens',
    teamName: 'SpendLens - AI Receipt & Expense Visualizer',
    githubUsername: 'JoshyReps',
    orgInviteAccepted: true,
    assignedFeature: 'ERD Design, camera-ui, camera-and-ai-analysis',
    ticketNumber: 'Issue #14, #12',
    ticketStatus: 'Backlog',
    commitUrl: 'https://github.com/UIC-CCS-MOBILE-DEVELOPMENT-2026-2027/SpendLens-Ampi-Reponoya/commit/d0f68ae1fce453474bd363a8a6aa602869d406b2',
    summary: 'Figured out camera UI flow and Gemini AI delegation pipeline.',
    blockers: 'First time using Gemini AI API and camera image buffers.',
    sourceType: 'google_form',
    date: '2026-10-17',
  },
  {
    id: 'gf-11',
    timestamp: '10/18/2026 14:17:55',
    studentEmail: 'elohera_240000001068@uic.edu.ph',
    weekNumber: 7,
    weekLabel: 'Week 7 (Oct 10 - Oct 16)',
    section: 'BSIT 3A & CS',
    studentName: 'Lohera, Edziel R.',
    studentId: '240000001068',
    rawTeamName: 'WordQuest',
    teamId: 'wordquest',
    teamName: 'WordQuest - Vocabulary Puzzle Engine',
    githubUsername: 'Edziel-Tr',
    orgInviteAccepted: true,
    assignedFeature: 'practice screen',
    ticketNumber: 'Issue #2',
    ticketStatus: 'In Progress',
    commitUrl: 'https://github.com/UIC-CCS-MOBILE-DEVELOPMENT-2026-2027/WordQuest/commit/a180593e21081ca1d7e7c09504445b1c70d63b83',
    summary: 'Implemented WordQuest Puzzle Practice screen with letter grid, clues, word validation, scoring, and results. Passed flutter analyze and flutter test.',
    blockers: 'Fixed compilation errors in letter grid builder.',
    sourceType: 'google_form',
    date: '2026-10-18',
  },
  {
    id: 'gf-12',
    timestamp: '10/19/2026 14:18:55',
    studentEmail: 'cattos_240000000912@uic.edu.ph',
    weekNumber: 7,
    weekLabel: 'Week 7 (Oct 10 - Oct 16)',
    section: 'BSIT 3B',
    studentName: 'Attos, Christian',
    studentId: '240000000912',
    rawTeamName: 'Beyond',
    teamId: 'beyond',
    teamName: 'Beyond - Interactive Campus & Gamified Map Navigator',
    githubUsername: 'Yan-Yan-Kun',
    orgInviteAccepted: true,
    assignedFeature: 'Finish the Main Navigation Flow',
    ticketNumber: 'TICKET-002',
    ticketStatus: 'In Progress',
    commitUrl: 'https://github.com/UIC-CCS-MOBILE-DEVELOPMENT-2026-2027/Beyond-Attos-Millondaga/issues/3',
    summary: 'Five destinations accessible. Map selection does not move player directly. Return flow tested.',
    blockers: 'State loop between mini-map and return to main game canvas.',
    sourceType: 'google_form',
    date: '2026-10-19',
  },
  {
    id: 'gf-13',
    timestamp: '10/19/2026 14:19:33',
    studentEmail: 'emillondaga_240000000686@uic.edu.ph',
    weekNumber: 7,
    weekLabel: 'Week 7 (Oct 10 - Oct 16)',
    section: 'BSIT 3B',
    studentName: 'Millondaga, Eduardo II L.',
    studentId: '240000000686',
    rawTeamName: 'Beyond',
    teamId: 'beyond',
    teamName: 'Beyond - Interactive Campus & Gamified Map Navigator',
    githubUsername: 'HexKonEdung',
    orgInviteAccepted: true,
    assignedFeature: 'Confirm the Existing App Runs',
    ticketNumber: 'TICKET-001',
    ticketStatus: 'In Progress',
    commitUrl: 'https://github.com/UIC-CCS-MOBILE-DEVELOPMENT-2026-2027/Beyond-Attos-Millondaga/issues/1',
    summary: 'App launches without blocking error. Existing navigation and screens checked.',
    blockers: 'Presentation-blocking setup in emulator recorded and mitigated.',
    sourceType: 'google_form',
    date: '2026-10-19',
  },
  {
    id: 'gf-14',
    timestamp: '10/21/2026 10:06:12',
    studentEmail: 'cgalorio_240000001297@uic.edu.ph',
    weekNumber: 5,
    weekLabel: 'Week 5 (Sept 26 - Oct 2)',
    section: 'BSIT 3B',
    studentName: 'Galorio, Christian Jay',
    studentId: '240000001297',
    rawTeamName: '23:5 Cafe Mobile Ordering System',
    teamId: 'cafe-235',
    teamName: '23:5 Cafe - Mobile Ordering & Barista Dispatch',
    githubUsername: 'Enchanjii',
    orgInviteAccepted: true,
    assignedFeature: 'Built and integrated functional ordering capabilities',
    ticketNumber: 'add features #2',
    ticketStatus: 'Done',
    commitUrl: 'https://github.com/UIC-CCS-MOBILE-DEVELOPMENT-2026-2027/23-5-cafe-mobileApp-Galorio-Vergara/commit/41c0333cd94f13bdfbfe340b78cb53a9ff117429',
    summary: 'Successfully integrated additional functional capabilities into the main codebase.',
    blockers: 'Smooth cart data flow established.',
    sourceType: 'google_form',
    date: '2026-10-21',
  },
  {
    id: 'gf-15',
    timestamp: '10/21/2026 10:06:32',
    studentEmail: 'lalconera_240000001395@uic.edu.ph',
    weekNumber: 5,
    weekLabel: 'Week 5 (Sept 26 - Oct 2)',
    section: 'BSIT 3B',
    studentName: 'Alconera, Louie Jay A.',
    studentId: '240000001395',
    rawTeamName: 'SpendWise',
    teamId: 'spendwise',
    teamName: 'SpendWise - Personal Financial Planner',
    githubUsername: 'luwijay',
    orgInviteAccepted: true,
    assignedFeature: 'Brainstorming',
    ticketNumber: 'Planning',
    ticketStatus: 'Backlog',
    commitUrl: 'https://github.com/UIC-CCS-MOBILE-DEVELOPMENT-2026-2027/SpendWise-Nanual-Alconera',
    summary: 'Planning and backlog discussion.',
    blockers: 'Slow transition into coding tasks.',
    sourceType: 'google_form',
    date: '2026-10-21',
  },
  {
    id: 'gf-16',
    timestamp: '10/21/2026 10:11:57',
    studentEmail: 'jnanual_240000000820@uic.edu.ph',
    weekNumber: 5,
    weekLabel: 'Week 5 (Sept 26 - Oct 2)',
    section: 'BSIT 3B',
    studentName: 'Nanual, Jayce Bruce O.',
    studentId: '240000000820',
    rawTeamName: 'SpendWise',
    teamId: 'spendwise',
    teamName: 'SpendWise - Personal Financial Planner',
    githubUsername: 'Jayzee336',
    orgInviteAccepted: true,
    assignedFeature: 'Planning',
    ticketNumber: 'Planning',
    ticketStatus: 'Backlog',
    commitUrl: 'https://github.com/UIC-CCS-MOBILE-DEVELOPMENT-2026-2027/SpendWise-Nanual-Alconera',
    summary: 'Planning application modules.',
    blockers: 'Awaiting team repository feature assignment.',
    sourceType: 'google_form',
    date: '2026-10-21',
  },
  {
    id: 'gf-17',
    timestamp: '10/21/2026 10:25:03',
    studentEmail: 'mespera_240000001373@uic.edu.ph',
    weekNumber: 5,
    weekLabel: 'Week 5 (Sept 26 - Oct 2)',
    section: 'BSIT 3B',
    studentName: 'Espera, Matt Adrian L.',
    studentId: '240000001373',
    rawTeamName: 'A.L.L.E.A.H POS System',
    teamId: 'alleah-pos',
    teamName: 'ALLEAH - Accurate Ledger, Logistics, Enterprise & Accounting Hub',
    githubUsername: 'qMattz',
    orgInviteAccepted: true,
    assignedFeature: 'Research about user friendly interfaces',
    ticketNumber: 'UI-Task',
    ticketStatus: 'In Progress',
    commitUrl: '',
    summary: 'Researched POS layouts and user friendly checkout designs.',
    blockers: 'None.',
    sourceType: 'google_form',
    date: '2026-10-21',
  },
  {
    id: 'gf-18',
    timestamp: '10/21/2026 10:43:23',
    studentEmail: 'jpelpinosas_240000001765@uic.edu.ph',
    weekNumber: 5,
    weekLabel: 'Week 5 (Sept 26 - Oct 2)',
    section: 'BSIT 3B',
    studentName: 'Pelpinosas, Justin James R.',
    studentId: '240000001765',
    rawTeamName: 'ALLEAH POS',
    teamId: 'alleah-pos',
    teamName: 'ALLEAH - Accurate Ledger, Logistics, Enterprise & Accounting Hub',
    githubUsername: 'Justin-J1205',
    orgInviteAccepted: true,
    assignedFeature: 'Research and discussion with teammates regarding user friendly interface',
    ticketNumber: 'Issue #1',
    ticketStatus: 'Done',
    commitUrl: '',
    summary: 'Discussed and brainstormed UI interface specs and POS terminal workflows.',
    blockers: 'None.',
    sourceType: 'google_form',
    date: '2026-10-21',
  },
  {
    id: 'gf-19',
    timestamp: '10/21/2026 10:44:11',
    studentEmail: 'imilitares_240000000524@uic.edu.ph',
    weekNumber: 5,
    weekLabel: 'Week 5 (Sept 26 - Oct 2)',
    section: 'BSIT 3B',
    studentName: 'Militares, Ivina Blaise',
    studentId: '240000000524',
    rawTeamName: 'A.L.L.E.A.H POS',
    teamId: 'alleah-pos',
    teamName: 'ALLEAH - Accurate Ledger, Logistics, Enterprise & Accounting Hub',
    githubUsername: 'GlitterySwan',
    orgInviteAccepted: true,
    assignedFeature: 'Research and Discussion',
    ticketNumber: 'Planning',
    ticketStatus: 'Done',
    commitUrl: '',
    summary: 'Discussed user friendly interfaces on mobile tablet layouts.',
    blockers: 'None.',
    sourceType: 'google_form',
    date: '2026-10-21',
  },
  {
    id: 'gf-20',
    timestamp: '10/21/2026 10:53:40',
    studentEmail: 'nmahipus_240000001368@uic.edu.ph',
    weekNumber: 5,
    weekLabel: 'Week 5 (Sept 26 - Oct 2)',
    section: 'BSIT 3A & CS',
    studentName: 'Mahipus, Nico',
    studentId: '240000001368',
    rawTeamName: 'BrainBox',
    teamId: 'brainbox',
    teamName: 'BrainBox - Cognitive Learning Companion',
    githubUsername: 'Niconnect_Ka_Kai_Nico',
    orgInviteAccepted: true,
    assignedFeature: 'Lead Programmer UI Setup',
    ticketNumber: 'Issue #1',
    ticketStatus: 'In Progress',
    commitUrl: 'https://github.com/UIC-CCS-MOBILE-DEVELOPMENT-2026-2027/BrainBox-Mobile-App.git',
    summary: 'Implemented the UI designed but still connecting functional requirements.',
    blockers: 'Connecting UI widgets to logic controllers.',
    sourceType: 'google_form',
    date: '2026-10-21',
  },
  {
    id: 'gf-21',
    timestamp: '10/21/2026 11:09:44',
    studentEmail: 'imilitares_240000000524@uic.edu.ph',
    weekNumber: 6,
    weekLabel: 'Week 6 (Oct 3 - Oct 9)',
    section: 'BSIT 3B',
    studentName: 'Militares, Ivina Blaise',
    studentId: '240000000524',
    rawTeamName: 'A.L.L.E.A.H POS',
    teamId: 'alleah-pos',
    teamName: 'ALLEAH - Accurate Ledger, Logistics, Enterprise & Accounting Hub',
    githubUsername: 'GlitterySwan',
    orgInviteAccepted: true,
    assignedFeature: 'System Layout',
    ticketNumber: 'Issue #4',
    ticketStatus: 'In Progress',
    commitUrl: '',
    summary: 'Planning system features and functions to avoid scope creep.',
    blockers: 'Scope creep mitigation.',
    sourceType: 'google_form',
    date: '2026-10-21',
  },
  {
    id: 'gf-22',
    timestamp: '10/21/2026 11:15:22',
    studentEmail: 'nmahipus_240000001368@uic.edu.ph',
    weekNumber: 6,
    weekLabel: 'Week 6 (Oct 3 - Oct 9)',
    section: 'BSIT 3B',
    studentName: 'Mahipus, Nico',
    studentId: '240000001368',
    rawTeamName: 'Brain Box',
    teamId: 'brainbox',
    teamName: 'BrainBox - Cognitive Learning Companion',
    githubUsername: 'Niconnect_Ka_Kai_Nico',
    orgInviteAccepted: true,
    assignedFeature: 'Overall functionality',
    ticketNumber: 'Issue #2',
    ticketStatus: 'Done',
    commitUrl: '580a2632d0e39d457e9f834c0c9ed068f2937d1d',
    summary: 'UI is finished; fixing logic errors preventing UI from working with functional requirements.',
    blockers: 'Logic errors in state updates resolved.',
    sourceType: 'google_form',
    date: '2026-10-21',
  },
  {
    id: 'gf-23',
    timestamp: '10/21/2026 11:16:05',
    studentEmail: 'mespera_240000001373@uic.edu.ph',
    weekNumber: 6,
    weekLabel: 'Week 6 (Oct 3 - Oct 9)',
    section: 'BSIT 3B',
    studentName: 'Espera, Matt Adrian L.',
    studentId: '240000001373',
    rawTeamName: 'A.L.L.E.A.H. POS System',
    teamId: 'alleah-pos',
    teamName: 'ALLEAH - Accurate Ledger, Logistics, Enterprise & Accounting Hub',
    githubUsername: 'qMattz',
    orgInviteAccepted: true,
    assignedFeature: 'Planning out the system features and functions',
    ticketNumber: 'Feature-Planning',
    ticketStatus: 'In Progress',
    commitUrl: '',
    summary: 'Reaching out with teammates to coordinate POS modules.',
    blockers: 'Awaiting repo access sync.',
    sourceType: 'google_form',
    date: '2026-10-21',
  },
  {
    id: 'gf-24',
    timestamp: '10/21/2026 11:16:42',
    studentEmail: 'imilitares_240000000524@uic.edu.ph',
    weekNumber: 7,
    weekLabel: 'Week 7 (Oct 10 - Oct 16)',
    section: 'BSIT 3B',
    studentName: 'Militares, Ivina Blaise',
    studentId: '240000000524',
    rawTeamName: 'A.L.L.E.A.H POS',
    teamId: 'alleah-pos',
    teamName: 'ALLEAH - Accurate Ledger, Logistics, Enterprise & Accounting Hub',
    githubUsername: 'GlitterySwan',
    orgInviteAccepted: true,
    assignedFeature: 'Setting up for system creation and github collaboration',
    ticketNumber: 'Org-Access',
    ticketStatus: 'In Progress',
    commitUrl: '',
    summary: 'Invited to GitHub Org Access & Team Repository. Lead programmer initiated environment setup.',
    blockers: 'None.',
    sourceType: 'google_form',
    date: '2026-10-21',
  },
  {
    id: 'gf-25',
    timestamp: '10/21/2026 11:17:34',
    studentEmail: 'jpelpinosas_240000001765@uic.edu.ph',
    weekNumber: 6,
    weekLabel: 'Week 6 (Oct 3 - Oct 9)',
    section: 'BSIT 3B',
    studentName: 'Pelpinosas, Justin James R.',
    studentId: '240000001765',
    rawTeamName: 'ALLEAH POS',
    teamId: 'alleah-pos',
    teamName: 'ALLEAH - Accurate Ledger, Logistics, Enterprise & Accounting Hub',
    githubUsername: 'Justin-J1205',
    orgInviteAccepted: true,
    assignedFeature: 'System architecture & features discussion',
    ticketNumber: 'Arch-Discussion',
    ticketStatus: 'Done',
    commitUrl: '',
    summary: 'Discussed system architecture and multi-role features.',
    blockers: 'None.',
    sourceType: 'google_form',
    date: '2026-10-21',
  },
  {
    id: 'gf-26',
    timestamp: '10/21/2026 11:21:20',
    studentEmail: 'nmahipus_240000001368@uic.edu.ph',
    weekNumber: 7,
    weekLabel: 'Week 7 (Oct 10 - Oct 16)',
    section: 'BSIT 3A & CS',
    studentName: 'Mahipus, Nico',
    studentId: '240000001368',
    rawTeamName: 'Brain Box',
    teamId: 'brainbox',
    teamName: 'BrainBox - Cognitive Learning Companion',
    githubUsername: 'Niconnect_Ka_Kai_Nico',
    orgInviteAccepted: true,
    assignedFeature: 'Overall functionality',
    ticketNumber: 'Issue #3',
    ticketStatus: 'In Progress',
    commitUrl: 'b02c7c551963f220ccad5ae441552101daa3a543',
    summary: 'Functionality is coming together; half of target working capabilities active.',
    blockers: 'Async state timing on question transition.',
    sourceType: 'google_form',
    date: '2026-10-21',
  },
  {
    id: 'gf-27',
    timestamp: '10/21/2026 11:21:41',
    studentEmail: 'jpelpinosas_240000001765@uic.edu.ph',
    weekNumber: 7,
    weekLabel: 'Week 7 (Oct 10 - Oct 16)',
    section: 'BSIT 3B',
    studentName: 'Pelpinosas, Justin James R.',
    studentId: '240000001765',
    rawTeamName: 'ALLEAH POS',
    teamId: 'alleah-pos',
    teamName: 'ALLEAH - Accurate Ledger, Logistics, Enterprise & Accounting Hub',
    githubUsername: 'Justin-J1205',
    orgInviteAccepted: true,
    assignedFeature: 'GitHub Org & Kanban Setup',
    ticketNumber: 'Kanban-Setup',
    ticketStatus: 'Done',
    commitUrl: '',
    summary: 'Invited to official GitHub organization and created the team Kanban board for projects.',
    blockers: 'None.',
    sourceType: 'google_form',
    date: '2026-10-21',
  },
  {
    id: 'gf-28',
    timestamp: '10/21/2026 11:26:28',
    studentEmail: 'mespera_240000001373@uic.edu.ph',
    weekNumber: 7,
    weekLabel: 'Week 7 (Oct 10 - Oct 16)',
    section: 'BSIT 3B',
    studentName: 'Espera, Matt Adrian L.',
    studentId: '240000001373',
    rawTeamName: 'A.L.L.E.A.H POS System',
    teamId: 'alleah-pos',
    teamName: 'ALLEAH - Accurate Ledger, Logistics, Enterprise & Accounting Hub',
    githubUsername: 'qMattz',
    orgInviteAccepted: true,
    assignedFeature: 'GitHub Org Access & Team Repo Planning',
    ticketNumber: 'Org-Sync',
    ticketStatus: 'In Progress',
    commitUrl: '',
    summary: 'Discussed and planned implementation milestones.',
    blockers: 'None.',
    sourceType: 'google_form',
    date: '2026-10-21',
  },
  {
    id: 'gf-29',
    timestamp: '10/21/2026 11:29:58',
    studentEmail: 'imilitares_240000000524@uic.edu.ph',
    weekNumber: 8,
    weekLabel: 'Week 8 (Oct 17 - Oct 23)',
    section: 'BSIT 3B',
    studentName: 'Militares, Ivina Blaise',
    studentId: '240000000524',
    rawTeamName: 'A.L.L.E.A.H POS',
    teamId: 'alleah-pos',
    teamName: 'ALLEAH - Accurate Ledger, Logistics, Enterprise & Accounting Hub',
    githubUsername: 'GlitterySwan',
    orgInviteAccepted: true,
    assignedFeature: 'Flutter and Dart',
    ticketNumber: 'Issue #8, #9, #10, #11',
    ticketStatus: 'In Progress',
    commitUrl: 'The commit link is provided by our team programmer Mr. Pelpinosas',
    summary: 'Programmer is working on system updates; team focusing on delivering Minimum Viable Product for presentation day.',
    blockers: 'Synchronizing final presentation demo assets.',
    sourceType: 'google_form',
    date: '2026-10-21',
  },
  {
    id: 'gf-30',
    timestamp: '10/21/2026 11:30:54',
    studentEmail: 'jpelpinosas_240000001765@uic.edu.ph',
    weekNumber: 8,
    weekLabel: 'Week 8 (Oct 17 - Oct 23)',
    section: 'BSIT 3B',
    studentName: 'Pelpinosas, Justin James R.',
    studentId: '240000001765',
    rawTeamName: 'ALLEAH POS',
    teamId: 'alleah-pos',
    teamName: 'ALLEAH - Accurate Ledger, Logistics, Enterprise & Accounting Hub',
    githubUsername: 'Justin-J1205',
    orgInviteAccepted: true,
    assignedFeature: 'Dashboard POS, State management for Cart, check-out screen',
    ticketNumber: 'Issue #8, 9, 10, 11',
    ticketStatus: 'Done',
    commitUrl: '383172eed123d8e12f00664bcb384658c878adcb',
    summary: 'Built full dashboard workspace: hardware status banner, real-time clock, sidebar drawer, table grid, barcode scanner (scanner_screen.dart), menu catalog, payment checkout with quick-cash tender and live change, login & register onboarding.',
    blockers: 'None. Comprehensive high-velocity delivery completed.',
    sourceType: 'google_form',
    date: '2026-10-21',
  },
  {
    id: 'gf-31',
    timestamp: '10/21/2026 11:41:33',
    studentEmail: 'mespera_240000001373@uic.edu.ph',
    weekNumber: 8,
    weekLabel: 'Week 8 (Oct 17 - Oct 23)',
    section: 'BSIT 3B',
    studentName: 'Espera, Matt Adrian L.',
    studentId: '240000001373',
    rawTeamName: 'A.L.L.E.A.H POS System',
    teamId: 'alleah-pos',
    teamName: 'ALLEAH - Accurate Ledger, Logistics, Enterprise & Accounting Hub',
    githubUsername: 'qMattz',
    orgInviteAccepted: true,
    assignedFeature: 'Dashboard UI review',
    ticketNumber: 'Issue #8, 9, 10, 11',
    ticketStatus: 'In Progress',
    commitUrl: '383172eed123d8e12f00664bcb384658c878adcb',
    summary: 'Met and discussed with the group about POS interface progress.',
    blockers: 'None.',
    sourceType: 'google_form',
    date: '2026-10-21',
  },
  {
    id: 'gf-32',
    timestamp: '10/21/2026 14:57:18',
    studentEmail: 'crivera_240000001717@uic.edu.ph',
    weekNumber: 5,
    weekLabel: 'Week 5 (Sept 26 - Oct 2)',
    section: 'BSIT 3A & CS',
    studentName: 'Rivera, Chantal',
    studentId: '240000001717',
    rawTeamName: 'Batid Patas App',
    teamId: 'batid-patas',
    teamName: 'Batid Patas - Legal Aid & Law AI Assistant',
    githubUsername: 'CreateToExtirpate',
    orgInviteAccepted: true,
    assignedFeature: 'Model response logic analysis',
    ticketNumber: 'Pending Org Invite',
    ticketStatus: 'Backlog',
    commitUrl: '',
    summary: 'Discussed with Stephanie on what logic had to improve. Model was not giving correct replies.',
    blockers: 'Main concern: AI model not providing accurate legal responses; delayed GitHub invite.',
    sourceType: 'google_form',
    date: '2026-10-21',
  },
  {
    id: 'gf-33',
    timestamp: '10/21/2026 15:08:39',
    studentEmail: 'crivera_240000001717@uic.edu.ph',
    weekNumber: 6,
    weekLabel: 'Week 6 (Oct 3 - Oct 9)',
    section: 'BSIT 3A & CS',
    studentName: 'Rivera, Chantal',
    studentId: '240000001717',
    rawTeamName: 'Batid Patas App',
    teamId: 'batid-patas',
    teamName: 'Batid Patas - Legal Aid & Law AI Assistant',
    githubUsername: 'CreateToExtirpate',
    orgInviteAccepted: true,
    assignedFeature: 'UI Fixing for Chat Screen',
    ticketNumber: 'Issue #3',
    ticketStatus: 'Done',
    commitUrl: 'https://github.com/UIC-CCS-MOBILE-DEVELOPMENT-2026-2027/Batid-Patas-Aniag-Rivera/commit/c891696f72139df39d0a575062dbf434836d3802',
    summary: 'Fixed minor UI error in chat history screen. Began working on Issue #3 model answers accuracy.',
    blockers: 'Prompt tuning for legal accuracy.',
    sourceType: 'google_form',
    date: '2026-10-21',
  },
  {
    id: 'gf-34',
    timestamp: '10/21/2026 15:30:27',
    studentEmail: 'crivera_240000001717@uic.edu.ph',
    weekNumber: 7,
    weekLabel: 'Week 7 (Oct 10 - Oct 16)',
    section: 'BSIT 3A & CS',
    studentName: 'Rivera, Chantal',
    studentId: '240000001717',
    rawTeamName: 'Batid Patas App',
    teamId: 'batid-patas',
    teamName: 'Batid Patas - Legal Aid & Law AI Assistant',
    githubUsername: 'CreateToExtirpate',
    orgInviteAccepted: true,
    assignedFeature: 'Model Chat Feature & Vector Text Chunking',
    ticketNumber: 'Issue #3',
    ticketStatus: 'Done',
    commitUrl: 'https://github.com/UIC-CCS-MOBILE-DEVELOPMENT-2026-2027/Batid-Patas-Aniag-Rivera/commit/13fcb5c8f4d9e5827dc3a9d9c6f23590af953cce',
    summary: 'Adjusted text chunk size for vector text extraction from law documents. Adjusted reply rules and integrated Data Privacy Act document.',
    blockers: 'App crashed due to exceeding mobile memory; successfully fixed by lowering text chunk size from 350 to 250.',
    sourceType: 'google_form',
    date: '2026-10-21',
  },
];

// Canonical 4-Week Milestones for StudySync (Allawan & Amper) from attached UIC Progress Reports
export const STUDYSYNC_CANONICAL_AUDITS: AuditRecord[] = [
  {
    id: 'doc-studysync-w1',
    timestamp: '09/03/2026 10:00:00',
    date: 'September 3, 2026',
    studentEmail: 'jallawan_240000000000@uic.edu.ph',
    weekNumber: 1,
    weekLabel: 'Week 1 (Aug 29 - Sept 4)',
    section: 'BSIT',
    studentName: 'James Reino A. Allawan',
    studentId: '240000000000',
    rawTeamName: 'StudySync: UIC Peer-to-Peer Study Matchmaker & Note Repository',
    teamId: 'studysync',
    teamName: 'StudySync',
    githubUsername: 'james-dev',
    orgInviteAccepted: true,
    assignedFeature: 'User Personas & Architecture Benchmarking',
    ticketNumber: 'Doc-W1-1',
    ticketStatus: 'Done',
    commitUrl: 'https://github.com/UIC-CCS-MOBILE-DEVELOPMENT-2026-2027/uic-studysync-app/commits/week-1',
    summary: 'Mapped user personas across UIC college programs (CCS, Pharmacy, Nursing, Business) and evaluated mobile architectures for peer-to-peer study matching and note repository.',
    blockers: 'Identified high demand for cross-subject study groups and collaborative reviewer hubs.',
    sourceType: 'document',
    tags: ['User', 'Week 1'],
  },
  {
    id: 'doc-studysync-w2',
    timestamp: '09/10/2026 10:00:00',
    date: 'Sept 10, 2026',
    studentEmail: 'jallawan_240000000000@uic.edu.ph',
    weekNumber: 2,
    weekLabel: 'Week 2 (Sept 5 - Sept 11)',
    section: 'BSIT',
    studentName: 'James Reino A. Allawan',
    studentId: '240000000000',
    rawTeamName: 'StudySync: UIC Peer-to-Peer Study Matchmaker & Note Repository',
    teamId: 'studysync',
    teamName: 'StudySync',
    githubUsername: 'james-dev',
    orgInviteAccepted: true,
    assignedFeature: 'NABC Matrix & Pitch Deck Formulation',
    ticketNumber: 'Doc-W2-1',
    ticketStatus: 'Done',
    commitUrl: 'https://github.com/UIC-CCS-MOBILE-DEVELOPMENT-2026-2027/uic-studysync-app/commits/week-2',
    summary: 'Formulated NABC value proposition matrix (Need, Approach, Benefits, Competition), developed initial pitch deck, and scoped cross-platform mobile specifications.',
    blockers: 'Refined value proposition to distinguish StudySync from generic flashcard apps.',
    sourceType: 'document',
    tags: ['NABC', 'Week 2'],
  },
  {
    id: 'doc-studysync-w3',
    timestamp: '09/24/2026 10:00:00',
    date: 'Sept 21, 2026 – Sept 24, 2026',
    studentEmail: 'jallawan_240000000000@uic.edu.ph',
    weekNumber: 3,
    weekLabel: 'Week 3 (Sept 12 - Sept 18)',
    section: 'BSIT',
    studentName: 'James Reino A. Allawan',
    studentId: '240000000000',
    rawTeamName: 'StudySync: UIC Peer-to-Peer Study Matchmaker & Note Repository',
    teamId: 'studysync',
    teamName: 'StudySync',
    githubUsername: 'james-dev',
    orgInviteAccepted: true,
    assignedFeature: 'Interactive Figma Prototypes & Repo Setup',
    ticketNumber: 'Doc-W3-1',
    ticketStatus: 'Done',
    commitUrl: 'https://github.com/UIC-CCS-MOBILE-DEVELOPMENT-2026-2027/uic-studysync-app/commits/week-3',
    summary: 'Designed interactive Figma screen wireframes for Study Matchmaker, Subject Channels, and Reviewer Hub; initialized base GitHub repository architecture.',
    blockers: 'Ensured component design system aligns with material design standards.',
    sourceType: 'document',
    tags: ['Interactive', 'Week 3'],
  },
  {
    id: 'doc-studysync-w4',
    timestamp: '09/29/2026 10:00:00',
    date: 'Sept 27, 2026 – Sept 29, 2026',
    studentEmail: 'jallawan_240000000000@uic.edu.ph',
    weekNumber: 4,
    weekLabel: 'Week 4 (Sept 19 - Sept 25)',
    section: 'BSIT',
    studentName: 'James Reino A. Allawan',
    studentId: '240000000000',
    rawTeamName: 'StudySync: UIC Peer-to-Peer Study Matchmaker & Note Repository',
    teamId: 'studysync',
    teamName: 'StudySync',
    githubUsername: 'james-dev',
    orgInviteAccepted: true,
    assignedFeature: 'Flutter UI Screen Layouts & State Wiring',
    ticketNumber: 'Doc-W4-1',
    ticketStatus: 'Done',
    commitUrl: 'https://github.com/UIC-CCS-MOBILE-DEVELOPMENT-2026-2027/uic-studysync-app/commits/week-4',
    summary: 'Implemented responsive Flutter mobile UI screen layouts, navigation tabs, and wired preliminary state management for match requests and note repositories.',
    blockers: 'Addressed local Flutter SDK hot reload configurations on team laptops.',
    sourceType: 'document',
    tags: ['Flutter', 'Week 4'],
  },
];

// 2. Synthesized Historical Document Reports (Weeks 1 to 4) - Using the standard Report format
export const INITIAL_DOCUMENT_AUDITS: AuditRecord[] = [
  ...STUDYSYNC_CANONICAL_AUDITS,
  // ALLEAH POS (Pelpinosas, Militares, Espera)
  {
    id: 'doc-alleah-w1',
    timestamp: '09/04/2026 10:00:00',
    studentEmail: 'jpelpinosas_240000001765@uic.edu.ph',
    weekNumber: 1,
    weekLabel: 'Week 1 (Aug 29 - Sept 4)',
    section: 'BSIT 3B',
    studentName: 'Pelpinosas, Justin James R.',
    studentId: '240000001765',
    rawTeamName: 'ALLEAH POS',
    teamId: 'alleah-pos',
    teamName: 'ALLEAH - Accurate Ledger, Logistics, Enterprise & Accounting Hub',
    githubUsername: 'Justin-J1205',
    orgInviteAccepted: true,
    assignedFeature: 'Project Proposal & Problem Statement Definition',
    ticketNumber: 'Doc-P01',
    ticketStatus: 'Done',
    commitUrl: '',
    summary: 'Defined enterprise scope for Point of Sale & Ledger application targeting retail SMEs.',
    blockers: 'Clarifying offline vs online multi-role permissions.',
    sourceType: 'document',
    date: '2026-09-04',
  },
  {
    id: 'doc-alleah-w2',
    timestamp: '09/11/2026 10:00:00',
    studentEmail: 'mespera_240000001373@uic.edu.ph',
    weekNumber: 2,
    weekLabel: 'Week 2 (Sept 5 - Sept 11)',
    section: 'BSIT 3B',
    studentName: 'Espera, Matt Adrian L.',
    studentId: '240000001373',
    rawTeamName: 'ALLEAH POS',
    teamId: 'alleah-pos',
    teamName: 'ALLEAH - Accurate Ledger, Logistics, Enterprise & Accounting Hub',
    githubUsername: 'qMattz',
    orgInviteAccepted: true,
    assignedFeature: 'Figma UI Wireframes & Layout Prototypes',
    ticketNumber: 'Doc-P02',
    ticketStatus: 'Done',
    commitUrl: '',
    summary: 'Designed tablet workspace layout with order grid, tender keypad, and navigation drawer in Figma.',
    blockers: 'Ensuring screen adapts smoothly to both mobile and tablet viewports.',
    sourceType: 'document',
    date: '2026-09-11',
  },
  {
    id: 'doc-alleah-w3',
    timestamp: '09/18/2026 10:00:00',
    studentEmail: 'jpelpinosas_240000001765@uic.edu.ph',
    weekNumber: 3,
    weekLabel: 'Week 3 (Sept 12 - Sept 18)',
    section: 'BSIT 3B',
    studentName: 'Pelpinosas, Justin James R.',
    studentId: '240000001765',
    rawTeamName: 'ALLEAH POS',
    teamId: 'alleah-pos',
    teamName: 'ALLEAH - Accurate Ledger, Logistics, Enterprise & Accounting Hub',
    githubUsername: 'Justin-J1205',
    orgInviteAccepted: true,
    assignedFeature: 'System Architecture & Database ERD Design',
    ticketNumber: 'Doc-P03',
    ticketStatus: 'Done',
    commitUrl: '',
    summary: 'Created ERD schema for Products, Categories, Orders, OrderItems, Operators, and Inventory logs.',
    blockers: 'Debating SQLite vs cloud sync synchronization conflict handling.',
    sourceType: 'document',
    date: '2026-09-18',
  },
  {
    id: 'doc-alleah-w4',
    timestamp: '09/25/2026 10:00:00',
    studentEmail: 'imilitares_240000000524@uic.edu.ph',
    weekNumber: 4,
    weekLabel: 'Week 4 (Sept 19 - Sept 25)',
    section: 'BSIT 3B',
    studentName: 'Militares, Ivina Blaise',
    studentId: '240000000524',
    rawTeamName: 'ALLEAH POS',
    teamId: 'alleah-pos',
    teamName: 'ALLEAH - Accurate Ledger, Logistics, Enterprise & Accounting Hub',
    githubUsername: 'GlitterySwan',
    orgInviteAccepted: true,
    assignedFeature: 'Flutter Project Scaffolding & State Provider Setup',
    ticketNumber: 'Doc-P04',
    ticketStatus: 'Done',
    commitUrl: '',
    summary: 'Initialized Flutter boilerplate, established directory architecture, and verified local compilation.',
    blockers: 'Configuring proper Flutter SDK environment dependencies across team laptops.',
    sourceType: 'document',
    date: '2026-09-25',
  },

  // SpendLens (Reponoya)
  {
    id: 'doc-spendlens-w1',
    timestamp: '09/04/2026 10:00:00',
    studentEmail: 'jreponoya_240000001805@uic.edu.ph',
    weekNumber: 1,
    weekLabel: 'Week 1 (Aug 29 - Sept 4)',
    section: 'BSIT 3A & CS',
    studentName: 'Reponoya, Joshua M.',
    studentId: '240000001805',
    rawTeamName: 'SpendLens',
    teamId: 'spendlens',
    teamName: 'SpendLens - AI Receipt & Expense Visualizer',
    githubUsername: 'JoshyReps',
    orgInviteAccepted: true,
    assignedFeature: 'Vision Document & Tech Stack Selection',
    ticketNumber: 'Doc-SL01',
    ticketStatus: 'Done',
    commitUrl: '',
    summary: 'Outlined SpendLens mobile concept: capturing receipt photos and extracting JSON line items via Gemini AI.',
    blockers: 'Evaluating React Native vs Flutter; decided on React Native with ASP.NET Core backend.',
    sourceType: 'document',
    date: '2026-09-04',
  },
  {
    id: 'doc-spendlens-w2',
    timestamp: '09/11/2026 10:00:00',
    studentEmail: 'jreponoya_240000001805@uic.edu.ph',
    weekNumber: 2,
    weekLabel: 'Week 2 (Sept 5 - Sept 11)',
    section: 'BSIT 3A & CS',
    studentName: 'Reponoya, Joshua M.',
    studentId: '240000001805',
    rawTeamName: 'SpendLens',
    teamId: 'spendlens',
    teamName: 'SpendLens - AI Receipt & Expense Visualizer',
    githubUsername: 'JoshyReps',
    orgInviteAccepted: true,
    assignedFeature: 'Mobile Screen Wireframes in Figma',
    ticketNumber: 'Doc-SL02',
    ticketStatus: 'Done',
    commitUrl: '',
    summary: 'Designed Camera Shutter screen, Expense Dashboard, Monthly Chart view, and Login dialog.',
    blockers: 'Designing intuitive receipt cropping bounding boxes.',
    sourceType: 'document',
    date: '2026-09-11',
  },
  {
    id: 'doc-spendlens-w3',
    timestamp: '09/18/2026 10:00:00',
    studentEmail: 'jreponoya_240000001805@uic.edu.ph',
    weekNumber: 3,
    weekLabel: 'Week 3 (Sept 12 - Sept 18)',
    section: 'BSIT 3A & CS',
    studentName: 'Reponoya, Joshua M.',
    studentId: '240000001805',
    rawTeamName: 'SpendLens',
    teamId: 'spendlens',
    teamName: 'SpendLens - AI Receipt & Expense Visualizer',
    githubUsername: 'JoshyReps',
    orgInviteAccepted: true,
    assignedFeature: 'Backend Architecture & API Specifications',
    ticketNumber: 'Doc-SL03',
    ticketStatus: 'Done',
    commitUrl: '',
    summary: 'Designed ASP.NET Core Web API routes for Receipt Upload, OCR parsing, and JWT authentication.',
    blockers: 'Setting up SSL certificates for local mobile app testing.',
    sourceType: 'document',
    date: '2026-09-18',
  },
  {
    id: 'doc-spendlens-w4',
    timestamp: '09/25/2026 10:00:00',
    studentEmail: 'jreponoya_240000001805@uic.edu.ph',
    weekNumber: 4,
    weekLabel: 'Week 4 (Sept 19 - Sept 25)',
    section: 'BSIT 3A & CS',
    studentName: 'Reponoya, Joshua M.',
    studentId: '240000001805',
    rawTeamName: 'SpendLens',
    teamId: 'spendlens',
    teamName: 'SpendLens - AI Receipt & Expense Visualizer',
    githubUsername: 'JoshyReps',
    orgInviteAccepted: true,
    assignedFeature: 'Repo Setup & Gemini API Proof of Concept',
    ticketNumber: 'Doc-SL04',
    ticketStatus: 'Done',
    commitUrl: '',
    summary: 'Tested sending sample receipt image to Gemini endpoint and parsed returned JSON item breakdown.',
    blockers: 'Ensuring JSON response formatting remains strictly deterministic.',
    sourceType: 'document',
    date: '2026-09-25',
  },

  // Batid Patas (Rivera)
  {
    id: 'doc-batid-w1',
    timestamp: '09/04/2026 10:00:00',
    studentEmail: 'crivera_240000001717@uic.edu.ph',
    weekNumber: 1,
    weekLabel: 'Week 1 (Aug 29 - Sept 4)',
    section: 'BSIT 3A & CS',
    studentName: 'Rivera, Chantal',
    studentId: '240000001717',
    rawTeamName: 'Batid Patas App',
    teamId: 'batid-patas',
    teamName: 'Batid Patas - Legal Aid & Law AI Assistant',
    githubUsername: 'CreateToExtirpate',
    orgInviteAccepted: true,
    assignedFeature: 'Legal Companion Proposal & Legal Corpus Gathering',
    ticketNumber: 'Doc-BP01',
    ticketStatus: 'Done',
    commitUrl: '',
    summary: 'Formulated project proposal for Batid Patas to provide citizen-friendly legal knowledge and rights assistance.',
    blockers: 'Gathering open-source Philippine legal statutes (Labor Code, Data Privacy Act).',
    sourceType: 'document',
    date: '2026-09-04',
  },
  {
    id: 'doc-batid-w2',
    timestamp: '09/11/2026 10:00:00',
    studentEmail: 'crivera_240000001717@uic.edu.ph',
    weekNumber: 2,
    weekLabel: 'Week 2 (Sept 5 - Sept 11)',
    section: 'BSIT 3A & CS',
    studentName: 'Rivera, Chantal',
    studentId: '240000001717',
    rawTeamName: 'Batid Patas App',
    teamId: 'batid-patas',
    teamName: 'Batid Patas - Legal Aid & Law AI Assistant',
    githubUsername: 'CreateToExtirpate',
    orgInviteAccepted: true,
    assignedFeature: 'Chatbot UI & Persona Wireframing',
    ticketNumber: 'Doc-BP02',
    ticketStatus: 'Done',
    commitUrl: '',
    summary: 'Designed friendly conversational interface, citation accordion card, and quick disclaimer dialog.',
    blockers: 'Designing legal disclaimer so users do not treat app as attorney substitute.',
    sourceType: 'document',
    date: '2026-09-11',
  },
  {
    id: 'doc-batid-w3',
    timestamp: '09/18/2026 10:00:00',
    studentEmail: 'crivera_240000001717@uic.edu.ph',
    weekNumber: 3,
    weekLabel: 'Week 3 (Sept 12 - Sept 18)',
    section: 'BSIT 3A & CS',
    studentName: 'Rivera, Chantal',
    studentId: '240000001717',
    rawTeamName: 'Batid Patas App',
    teamId: 'batid-patas',
    teamName: 'Batid Patas - Legal Aid & Law AI Assistant',
    githubUsername: 'CreateToExtirpate',
    orgInviteAccepted: true,
    assignedFeature: 'RAG Retrieval Pipeline Specification',
    ticketNumber: 'Doc-BP03',
    ticketStatus: 'Done',
    commitUrl: '',
    summary: 'Researched mobile embedding search and chunking strategies for long legal text sections.',
    blockers: 'Memory constraints when embedding PDFs on mobile hardware.',
    sourceType: 'document',
    date: '2026-09-18',
  },
  {
    id: 'doc-batid-w4',
    timestamp: '09/25/2026 10:00:00',
    studentEmail: 'crivera_240000001717@uic.edu.ph',
    weekNumber: 4,
    weekLabel: 'Week 4 (Sept 19 - Sept 25)',
    section: 'BSIT 3A & CS',
    studentName: 'Rivera, Chantal',
    studentId: '240000001717',
    rawTeamName: 'Batid Patas App',
    teamId: 'batid-patas',
    teamName: 'Batid Patas - Legal Aid & Law AI Assistant',
    githubUsername: 'CreateToExtirpate',
    orgInviteAccepted: true,
    assignedFeature: 'Mobile Flutter App Initialization',
    ticketNumber: 'Doc-BP04',
    ticketStatus: 'Done',
    commitUrl: '',
    summary: 'Created repository, set up Riverpod state management and base chat bubble UI widgets.',
    blockers: 'Awaiting team invite link from professor for official GitHub Org.',
    sourceType: 'document',
    date: '2026-09-25',
  },

  // WordQuest (Salibay & Lohera)
  {
    id: 'doc-wordquest-w1',
    timestamp: '09/04/2026 10:00:00',
    studentEmail: 'rsalibay_240000001605@uic.edu.ph',
    weekNumber: 1,
    weekLabel: 'Week 1 (Aug 29 - Sept 4)',
    section: 'BSIT 3A & CS',
    studentName: 'Salibay, Rex Del Cielo R.',
    studentId: '240000001605',
    rawTeamName: 'WordQuest',
    teamId: 'wordquest',
    teamName: 'WordQuest - Vocabulary Puzzle Engine',
    githubUsername: 'REX69-123',
    orgInviteAccepted: true,
    assignedFeature: 'Gamified Vocabulary Proposal',
    ticketNumber: 'Doc-WQ01',
    ticketStatus: 'Done',
    commitUrl: '',
    summary: 'Authored WordQuest proposal: gamifying vocabulary retention for high school and collegiate learners.',
    blockers: 'Determining offline dictionary storage vs cloud API lookups.',
    sourceType: 'document',
    date: '2026-09-04',
  },
  {
    id: 'doc-wordquest-w2',
    timestamp: '09/11/2026 10:00:00',
    studentEmail: 'elohera_240000001068@uic.edu.ph',
    weekNumber: 2,
    weekLabel: 'Week 2 (Sept 5 - Sept 11)',
    section: 'BSIT 3A & CS',
    studentName: 'Lohera, Edziel R.',
    studentId: '240000001068',
    rawTeamName: 'WordQuest',
    teamId: 'wordquest',
    teamName: 'WordQuest - Vocabulary Puzzle Engine',
    githubUsername: 'Edziel-Tr',
    orgInviteAccepted: true,
    assignedFeature: 'Interactive Puzzle Grid Wireframing',
    ticketNumber: 'Doc-WQ02',
    ticketStatus: 'Done',
    commitUrl: '',
    summary: 'Designed touch grid drag selection, letter animations, and level score modal.',
    blockers: 'Touch responsiveness considerations on slow devices.',
    sourceType: 'document',
    date: '2026-09-11',
  },
  {
    id: 'doc-wordquest-w3',
    timestamp: '09/18/2026 10:00:00',
    studentEmail: 'rsalibay_240000001605@uic.edu.ph',
    weekNumber: 3,
    weekLabel: 'Week 3 (Sept 12 - Sept 18)',
    section: 'BSIT 3A & CS',
    studentName: 'Salibay, Rex Del Cielo R.',
    studentId: '240000001605',
    rawTeamName: 'WordQuest',
    teamId: 'wordquest',
    teamName: 'WordQuest - Vocabulary Puzzle Engine',
    githubUsername: 'REX69-123',
    orgInviteAccepted: true,
    assignedFeature: 'Dictionary Trie Search Algorithm Design',
    ticketNumber: 'Doc-WQ03',
    ticketStatus: 'Done',
    commitUrl: '',
    summary: 'Formulated Trie data structure logic for fast prefix validation in Flutter.',
    blockers: 'Memory consumption of large dictionary trees.',
    sourceType: 'document',
    date: '2026-09-18',
  },
  {
    id: 'doc-wordquest-w4',
    timestamp: '09/25/2026 10:00:00',
    studentEmail: 'elohera_240000001068@uic.edu.ph',
    weekNumber: 4,
    weekLabel: 'Week 4 (Sept 19 - Sept 25)',
    section: 'BSIT 3A & CS',
    studentName: 'Lohera, Edziel R.',
    studentId: '240000001068',
    rawTeamName: 'WordQuest',
    teamId: 'wordquest',
    teamName: 'WordQuest - Vocabulary Puzzle Engine',
    githubUsername: 'Edziel-Tr',
    orgInviteAccepted: true,
    assignedFeature: 'Flutter Base Project & Asset Setup',
    ticketNumber: 'Doc-WQ04',
    ticketStatus: 'Done',
    commitUrl: '',
    summary: 'Scaffolded Flutter app, loaded custom typography and audio SFX assets for correct word guessing.',
    blockers: 'Audio player cross-platform permissions.',
    sourceType: 'document',
    date: '2026-09-25',
  },

  // Learn Luau (Olpenado)
  {
    id: 'doc-luau-w1',
    timestamp: '09/04/2026 10:00:00',
    studentEmail: 'nolpenado_240000001755@uic.edu.ph',
    weekNumber: 1,
    weekLabel: 'Week 1 (Aug 29 - Sept 4)',
    section: 'BSIT 3A & CS',
    studentName: 'Olpenado, Ninmar H.',
    studentId: '240000001755',
    rawTeamName: 'Team 05 - Learn Luau',
    teamId: 'learn-luau',
    teamName: 'Learn Luau - Interactive Coding & Scripting App',
    githubUsername: 'nyanmyr',
    orgInviteAccepted: true,
    assignedFeature: 'Curriculum & Project Proposal',
    ticketNumber: 'Doc-LL01',
    ticketStatus: 'Done',
    commitUrl: '',
    summary: 'Designed learning roadmap for Luau programming language (Roblox game scripting) on mobile.',
    blockers: 'Evaluating syntax highlighting mobile editors.',
    sourceType: 'document',
    date: '2026-09-04',
  },
  {
    id: 'doc-luau-w4',
    timestamp: '09/25/2026 10:00:00',
    studentEmail: 'nolpenado_240000001755@uic.edu.ph',
    weekNumber: 4,
    weekLabel: 'Week 4 (Sept 19 - Sept 25)',
    section: 'BSIT 3A & CS',
    studentName: 'Olpenado, Ninmar H.',
    studentId: '240000001755',
    rawTeamName: 'Team 05 - Learn Luau',
    teamId: 'learn-luau',
    teamName: 'Learn Luau - Interactive Coding & Scripting App',
    githubUsername: 'nyanmyr',
    orgInviteAccepted: true,
    assignedFeature: 'Database & Auth Scaffold',
    ticketNumber: 'Doc-LL04',
    ticketStatus: 'Done',
    commitUrl: '',
    summary: 'Set up user authentication and database tables for tracking student lesson progress.',
    blockers: 'Remote database latency.',
    sourceType: 'document',
    date: '2026-09-25',
  },

  // Beyond (Attos & Millondaga)
  {
    id: 'doc-beyond-w1',
    timestamp: '09/04/2026 10:00:00',
    studentEmail: 'cattos_240000000912@uic.edu.ph',
    weekNumber: 1,
    weekLabel: 'Week 1 (Aug 29 - Sept 4)',
    section: 'BSIT 3B',
    studentName: 'Attos, Christian',
    studentId: '240000000912',
    rawTeamName: 'Beyond',
    teamId: 'beyond',
    teamName: 'Beyond - Interactive Campus & Gamified Map Navigator',
    githubUsername: 'Yan-Yan-Kun',
    orgInviteAccepted: true,
    assignedFeature: 'Campus Interactive Gamified Navigator Proposal',
    ticketNumber: 'Doc-BY01',
    ticketStatus: 'Done',
    commitUrl: '',
    summary: 'Conceptualized gamified navigation for new students around campus landmarks.',
    blockers: 'GPS accuracy inside campus buildings.',
    sourceType: 'document',
    date: '2026-09-04',
  },
  {
    id: 'doc-beyond-w4',
    timestamp: '09/25/2026 10:00:00',
    studentEmail: 'emillondaga_240000000686@uic.edu.ph',
    weekNumber: 4,
    weekLabel: 'Week 4 (Sept 19 - Sept 25)',
    section: 'BSIT 3B',
    studentName: 'Millondaga, Eduardo II L.',
    studentId: '240000000686',
    rawTeamName: 'Beyond',
    teamId: 'beyond',
    teamName: 'Beyond - Interactive Campus & Gamified Map Navigator',
    githubUsername: 'HexKonEdung',
    orgInviteAccepted: true,
    assignedFeature: 'Initial Map & Navigation Engine Prototype',
    ticketNumber: 'Doc-BY04',
    ticketStatus: 'Done',
    commitUrl: '',
    summary: 'Initial screen routing and five landmark destinations mapped out in code.',
    blockers: 'Preventing emulator memory crash during canvas rendering.',
    sourceType: 'document',
    date: '2026-09-25',
  },

  // BrainBox (Mahipus)
  {
    id: 'doc-brainbox-w1',
    timestamp: '09/04/2026 10:00:00',
    studentEmail: 'nmahipus_240000001368@uic.edu.ph',
    weekNumber: 1,
    weekLabel: 'Week 1 (Aug 29 - Sept 4)',
    section: 'BSIT 3A & CS',
    studentName: 'Mahipus, Nico',
    studentId: '240000001368',
    rawTeamName: 'BrainBox',
    teamId: 'brainbox',
    teamName: 'BrainBox - Cognitive Learning Companion',
    githubUsername: 'Niconnect_Ka_Kai_Nico',
    orgInviteAccepted: true,
    assignedFeature: 'BrainBox Concept & Spaced Repetition Design',
    ticketNumber: 'Doc-BB01',
    ticketStatus: 'Done',
    commitUrl: '',
    summary: 'Proposal for spaced repetition study deck app for college students.',
    blockers: 'Flashcard algorithm formulation.',
    sourceType: 'document',
    date: '2026-09-04',
  },
  {
    id: 'doc-brainbox-w4',
    timestamp: '09/25/2026 10:00:00',
    studentEmail: 'nmahipus_240000001368@uic.edu.ph',
    weekNumber: 4,
    weekLabel: 'Week 4 (Sept 19 - Sept 25)',
    section: 'BSIT 3A & CS',
    studentName: 'Mahipus, Nico',
    studentId: '240000001368',
    rawTeamName: 'BrainBox',
    teamId: 'brainbox',
    teamName: 'BrainBox - Cognitive Learning Companion',
    githubUsername: 'Niconnect_Ka_Kai_Nico',
    orgInviteAccepted: true,
    assignedFeature: 'UI Prototype in Flutter',
    ticketNumber: 'Doc-BB04',
    ticketStatus: 'In Progress',
    commitUrl: '',
    summary: 'Built deck navigation and flip card animation widgets.',
    blockers: 'Logic state synchronization between deck view and answer scoring.',
    sourceType: 'document',
    date: '2026-09-25',
  },

  // SpendWise (Alconera & Nanual)
  {
    id: 'doc-spendwise-w1',
    timestamp: '09/04/2026 10:00:00',
    studentEmail: 'lalconera_240000001395@uic.edu.ph',
    weekNumber: 1,
    weekLabel: 'Week 1 (Aug 29 - Sept 4)',
    section: 'BSIT 3B',
    studentName: 'Alconera, Louie Jay A.',
    studentId: '240000001395',
    rawTeamName: 'SpendWise',
    teamId: 'spendwise',
    teamName: 'SpendWise - Personal Financial Planner',
    githubUsername: 'luwijay',
    orgInviteAccepted: true,
    assignedFeature: 'Personal Finance App Proposal',
    ticketNumber: 'Doc-SW01',
    ticketStatus: 'Done',
    commitUrl: '',
    summary: 'Budgeting & savings tracking mobile app proposal.',
    blockers: 'Scope clarity.',
    sourceType: 'document',
    date: '2026-09-04',
  },
  {
    id: 'doc-spendwise-w4',
    timestamp: '09/25/2026 10:00:00',
    studentEmail: 'jnanual_240000000820@uic.edu.ph',
    weekNumber: 4,
    weekLabel: 'Week 4 (Sept 19 - Sept 25)',
    section: 'BSIT 3B',
    studentName: 'Nanual, Jayce Bruce O.',
    studentId: '240000000820',
    rawTeamName: 'SpendWise',
    teamId: 'spendwise',
    teamName: 'SpendWise - Personal Financial Planner',
    githubUsername: 'Jayzee336',
    orgInviteAccepted: true,
    assignedFeature: 'Initial Architecture Planning',
    ticketNumber: 'Doc-SW04',
    ticketStatus: 'In Progress',
    commitUrl: '',
    summary: 'Outlining expense categories and budget calculation formula.',
    blockers: 'Transition to code repository delayed.',
    sourceType: 'document',
    date: '2026-09-25',
  },

  // StudySprint (Crispino)
  {
    id: 'doc-studysprint-w1',
    timestamp: '09/04/2026 10:00:00',
    studentEmail: 'mcrispino_240000000173@uic.edu.ph',
    weekNumber: 1,
    weekLabel: 'Week 1 (Aug 29 - Sept 4)',
    section: 'BSIT 3B',
    studentName: 'Crispino, Matthew Ikee M.',
    studentId: '240000000173',
    rawTeamName: 'StudySprint',
    teamId: 'studysprint',
    teamName: 'StudySprint - Collaborative Exam Prep Tracker',
    githubUsername: 'matthew05042001',
    orgInviteAccepted: true,
    assignedFeature: 'Exam Study Sprint Proposal',
    ticketNumber: 'Doc-SS01',
    ticketStatus: 'Done',
    commitUrl: '',
    summary: 'Submitted project ideation for collaborative study timer and quiz sprint.',
    blockers: 'None.',
    sourceType: 'document',
    date: '2026-09-04',
  },

  // 23:5 Cafe (Galorio)
  {
    id: 'doc-cafe-w1',
    timestamp: '09/04/2026 10:00:00',
    studentEmail: 'cgalorio_240000001297@uic.edu.ph',
    weekNumber: 1,
    weekLabel: 'Week 1 (Aug 29 - Sept 4)',
    section: 'BSIT 3B',
    studentName: 'Galorio, Christian Jay',
    studentId: '240000001297',
    rawTeamName: '23:5 Cafe Mobile Ordering System',
    teamId: 'cafe-235',
    teamName: '23:5 Cafe - Mobile Ordering & Barista Dispatch',
    githubUsername: 'Enchanjii',
    orgInviteAccepted: true,
    assignedFeature: 'Cafe Mobile Ordering App Proposal',
    ticketNumber: 'Doc-CF01',
    ticketStatus: 'Done',
    commitUrl: '',
    summary: 'Proposed coffee shop ordering and table pickup management app.',
    blockers: 'None.',
    sourceType: 'document',
    date: '2026-09-04',
  },
];

// Authentic class audit list with Weeks 1-4 Document Reports (StudySync) & Weeks 5-8 Google Forms
export const INITIAL_UNIFIED_AUDITS: AuditRecord[] = [
  ...STUDYSYNC_CANONICAL_AUDITS,
  ...INITIAL_FORM_AUDITS,
];

// Optional demonstration dataset with Weeks 1-4 pre-populated for previewing
export const DEMO_SAMPLE_AUDITS: AuditRecord[] = [
  ...INITIAL_DOCUMENT_AUDITS,
  ...INITIAL_FORM_AUDITS,
];

// Helper to calculate team health, readiness score, and kanban distribution
export function computeTeams(
  audits: AuditRecord[],
  customRegisteredTeams: Team[] = [],
  teamOverrides: Record<string, Partial<Team>> = {},
  deletedTeamIds: string[] = []
): Team[] {
  const teamMap = new Map<string, {
    id: string;
    name: string;
    repoName: string;
    githubRepoUrl?: string;
    kanbanUrl?: string;
    appDescription?: string;
    section: string;
    membersMap: Map<string, any>;
    audits: AuditRecord[];
    initialScore?: number;
  }>();

  const deletedSet = new Set(deletedTeamIds);

  // 1. Seed custom registered teams first so their custom metadata & members are preserved
  customRegisteredTeams.forEach((t) => {
    if (deletedSet.has(t.id)) return;
    const membersMap = new Map();
    (t.members || []).forEach((m) => membersMap.set(m.name, m));
    teamMap.set(t.id, {
      id: t.id,
      name: t.name,
      repoName: t.repoName,
      githubRepoUrl: t.githubRepoUrl,
      kanbanUrl: t.kanbanUrl,
      appDescription: t.appDescription,
      section: t.section,
      membersMap,
      audits: [],
      initialScore: t.readinessScore,
    });
  });

  // 2. Group audits by canonical team
  audits.forEach((a) => {
    const { teamId, teamName, repoName } = normalizeTeam(a.rawTeamName || a.teamName);
    if (deletedSet.has(teamId)) return;
    if (!teamMap.has(teamId)) {
      teamMap.set(teamId, {
        id: teamId,
        name: teamName,
        repoName: repoName,
        section: a.section || 'BSIT',
        membersMap: new Map(),
        audits: [],
      });
    }

    const t = teamMap.get(teamId)!;
    t.audits.push(a);

    // Track member (deduplicated by email, studentId, or tokenized name)
    if (a.studentName) {
      let existingKey: string | null = null;
      for (const [key, mem] of t.membersMap.entries()) {
        const sameEmail = Boolean(a.studentEmail && mem.email && a.studentEmail.toLowerCase().trim() === mem.email.toLowerCase().trim());
        const sameId = Boolean(a.studentId && mem.studentId && a.studentId.trim() === mem.studentId.trim());
        const sameName = areNamesSamePerson(a.studentName, mem.name);
        if (sameEmail || sameId || sameName) {
          existingKey = key;
          break;
        }
      }

      if (existingKey) {
        const mem = t.membersMap.get(existingKey)!;
        t.membersMap.set(existingKey, {
          ...mem,
          studentId: mem.studentId || a.studentId || '',
          githubUsername: mem.githubUsername || a.githubUsername || '',
          email: mem.email || a.studentEmail || '',
        });
      } else {
        t.membersMap.set(a.studentName, {
          name: a.studentName,
          studentId: a.studentId || '',
          githubUsername: a.githubUsername || '',
          email: a.studentEmail || '',
          section: a.section || t.section || 'BSIT',
          hasAcceptedOrg: a.orgInviteAccepted ?? true,
        });
      }
    }
  });

  const teams: Team[] = [];

  teamMap.forEach((entry) => {
    const { id, name, repoName, githubRepoUrl, kanbanUrl, appDescription, section, membersMap, audits: teamAudits } = entry;
    if (deletedSet.has(id)) return;

    const override = teamOverrides[id];
    const finalName = override?.name || name;
    const finalRepoName = override?.repoName || repoName;
    const finalGithubRepoUrl = override?.githubRepoUrl || githubRepoUrl || `https://github.com/${GITHUB_ORG_NAME}/${finalRepoName}`;
    const finalKanbanUrl = override?.kanbanUrl || kanbanUrl;
    const finalSection = override?.section || section;
    const finalAppDescription = override?.appDescription || appDescription || getAppDescription(id);
    const members = (override?.members && override.members.length > 0) ? override.members : Array.from(membersMap.values());

    // Kanban stats
    const kanbanCounts = {
      backlog: 0,
      inProgress: 0,
      review: 0,
      done: 0,
    };

    const weeksLoggedSet = new Set<number>();
    const blockersSet = new Set<string>();
    let latestCommit = '';

    teamAudits.forEach((audit) => {
      weeksLoggedSet.add(audit.weekNumber);

      const status = audit.ticketStatus;
      if (status === 'Done') kanbanCounts.done++;
      else if (status === 'In Progress') kanbanCounts.inProgress++;
      else if (status === 'Review') kanbanCounts.review++;
      else kanbanCounts.backlog++;

      if (audit.blockers && !audit.blockers.toLowerCase().includes('none') && !audit.blockers.toLowerCase().includes('not yet applicable')) {
        blockersSet.add(audit.blockers.trim());
      }

      if (audit.commitUrl && (!latestCommit || audit.timestamp > latestCommit)) {
        latestCommit = audit.timestamp;
      }
    });

    const totalTickets = kanbanCounts.backlog + kanbanCounts.inProgress + kanbanCounts.review + kanbanCounts.done;
    const weeksLogged = Array.from(weeksLoggedSet).sort((a, b) => a - b);

    // Calculate MVP milestone checklist
    const hasW1 = weeksLogged.includes(1);
    const hasW2 = weeksLogged.includes(2);
    const hasW3 = weeksLogged.includes(3);
    const hasW4 = weeksLogged.includes(4);
    const hasW5or6 = weeksLogged.includes(5) || weeksLogged.includes(6);
    const hasW7 = weeksLogged.includes(7);
    const hasW8 = weeksLogged.includes(8);

    // Presentation readiness score (0-100)
    let score = 20; // Base score for project formation
    if (hasW1 && hasW2) score += 15;
    if (hasW3 && hasW4) score += 15;
    if (hasW5or6) score += 15;
    if (hasW7) score += 15;
    if (hasW8) score += 10;

    // Done ratio bonus/penalty
    const doneRatio = totalTickets > 0 ? kanbanCounts.done / totalTickets : 0;
    score += Math.round(doneRatio * 10);

    // Blockers penalty
    const activeBlockersCount = blockersSet.size;
    if (activeBlockersCount >= 3) score -= 10;

    score = Math.max(10, Math.min(100, score));

    // Health status determination
    let healthStatus: 'on_track' | 'needs_attention' | 'blocked' = 'on_track';
    let healthReason = 'Progressing smoothly across design and implementation milestones.';

    if (id === 'spendwise' && !hasW7 && !hasW8) {
      healthStatus = 'blocked';
      healthReason = 'Stuck in early planning phase during Weeks 5; no verified commits or Kanban delivery logged for Weeks 7-8.';
    } else if (id === 'studysprint' && kanbanCounts.done === 0) {
      healthStatus = 'needs_attention';
      healthReason = 'Repository initialized but no completed Kanban tickets or merged code registered yet.';
    } else if (id === 'batid-patas' && blockersSet.size > 0) {
      healthStatus = 'on_track';
      healthReason = 'Encountered mobile memory crash with 350-chunk size; successfully self-mitigated to 250 chunks. RAG feature on track.';
    } else if (id === 'alleah-pos') {
      healthStatus = 'on_track';
      healthReason = 'High velocity: complete POS workspace, barcode scanner, catalog and checkout terminal constructed and tested.';
    } else if (id === 'spendlens') {
      healthStatus = 'on_track';
      healthReason = 'Delivered Gemini receipt OCR and backend Auth controller; HTTPS-to-HTTP mobile tunnel resolved.';
    } else if (kanbanCounts.backlog > kanbanCounts.done + kanbanCounts.inProgress) {
      healthStatus = 'needs_attention';
      healthReason = 'High backlog accumulation relative to completed deliverables.';
    }

    teams.push({
      id,
      name: finalName,
      repoName: finalRepoName,
      githubRepoUrl: finalGithubRepoUrl,
      kanbanUrl: finalKanbanUrl,
      section: finalSection,
      appDescription: finalAppDescription,
      members,
      readinessScore: teamAudits.length > 0 ? score : (entry.initialScore || 25),
      healthStatus,
      healthReason,
      kanbanCounts,
      totalTickets,
      unresolvedBlockers: Array.from(blockersSet),
      latestCommitDate: latestCommit || undefined,
      weeksLogged,
      mvpChecklist: {
        ideationApproved: hasW1,
        wireframesDone: hasW2,
        architectureDesigned: hasW3,
        initialRepoSetup: hasW4,
        coreBackendOrDb: hasW5or6,
        primaryScreensWorking: hasW7,
        packagingAndTesting: hasW8,
      },
    });
  });

  return teams.sort((a, b) => b.readinessScore - a.readinessScore);
}

function getAppDescription(teamId: string): string {
  switch (teamId) {
    case 'alleah-pos':
      return 'Tablet-first Point of Sale & Inventory Ledger for retail stores with barcode scanning, live checkout, and multi-role operations.';
    case 'spendlens':
      return 'Receipt expense visualizer with camera OCR powered by Gemini AI and an ASP.NET Core backend API.';
    case 'batid-patas':
      return 'Philippine legal aid assistant with vector document retrieval (RAG) and citizen legal guidance in Filipino and English.';
    case 'wordquest':
      return 'Flutter vocabulary puzzle game featuring dynamic letter grids, clue engine, and timed practice sessions.';
    case 'learn-luau':
      return 'Interactive mobile coding sandbox and tutorial application teaching Luau script programming.';
    case 'beyond':
      return 'Gamified interactive map navigator for university campus landmarks and student orientation quests.';
    case 'brainbox':
      return 'Spaced repetition flashcard and active recall study tool designed for undergraduate computer science courses.';
    case 'edu-iskolar':
      return 'Scholarship application and requirements tracking portal for university beneficiaries.';
    case 'cafe-235':
      return 'Mobile cafe ordering system featuring real-time menu browsing, customizable orders, and barista queue dispatch.';
    case 'spendwise':
      return 'Personal finance and monthly budget tracker with savings goals and expense categorization.';
    case 'studysprint':
      return 'Collaborative study sprint timer with gamified milestones and group study sessions.';
    case 'studysync':
      return 'UIC peer-to-peer study group matchmaker and course note repository with cross-department subject channels.';
    default:
      return 'Mobile application development final course project.';
  }
}

// Convert Audits to Kanban cards for interactive board
export function generateKanbanCards(audits: AuditRecord[]): KanbanCard[] {
  const cards = audits.map((a) => {
    const rawStatus = a.ticketStatus;
    let status: 'backlog' | 'in_progress' | 'review' | 'done' = 'backlog';
    if (rawStatus === 'Done') status = 'done';
    else if (rawStatus === 'In Progress') status = 'in_progress';
    else if (rawStatus === 'Review') status = 'review';

    const hasBlocker = Boolean(
      a.blockers &&
      !a.blockers.toLowerCase().includes('none') &&
      !a.blockers.toLowerCase().includes('not yet applicable')
    );

    return {
      id: `kc-${a.id}`,
      teamId: a.teamId,
      title: a.assignedFeature || 'Feature Implementation',
      ticketNumber: a.ticketNumber || `Week ${a.weekNumber}`,
      status,
      assignee: a.studentName,
      assigneeGithub: a.githubUsername,
      commitUrl: a.commitUrl || undefined,
      weekNumber: a.weekNumber,
      summary: a.summary,
      blockers: a.blockers || undefined,
      hasBlocker,
      updatedAt: a.timestamp || a.date || 'Recent',
      priority: (hasBlocker ? 'high' : status === 'done' ? 'low' : 'medium') as 'high' | 'medium' | 'low',
    };
  });
  return deduplicateCardsList(cards);
}

// ==========================================
// DEDUPLICATION & DETERMINISTIC MERGE UTILITIES
// ==========================================

export function normalizeNameTokens(name: string): string[] {
  return (name || '')
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, ' ')
    .split(/\s+/)
    .filter(Boolean)
    .sort();
}

export function areNamesSamePerson(name1: string, name2: string): boolean {
  if (!name1 || !name2) return false;
  const tokens1 = normalizeNameTokens(name1);
  const tokens2 = normalizeNameTokens(name2);
  if (tokens1.length === 0 || tokens2.length === 0) return false;
  if (tokens1.join(' ') === tokens2.join(' ')) return true;
  const mainTokens1 = tokens1.filter((t) => t.length > 1);
  const mainTokens2 = tokens2.filter((t) => t.length > 1);
  if (mainTokens1.length > 0 && mainTokens1.join(' ') === mainTokens2.join(' ')) return true;
  return false;
}

export function areAuditsDuplicate(a: AuditRecord, b: AuditRecord): boolean {
  if (a.id && b.id && a.id === b.id) return true;

  const emailA = (a.studentEmail || '').toLowerCase().trim();
  const emailB = (b.studentEmail || '').toLowerCase().trim();
  const sameEmail = Boolean(emailA && emailB && emailA === emailB);

  const idA = (a.studentId || '').trim();
  const idB = (b.studentId || '').trim();
  const sameStudentId = Boolean(idA && idB && idA === idB);

  const sameName = areNamesSamePerson(a.studentName, b.studentName);

  const isSameStudent = sameEmail || sameStudentId || sameName;
  if (!isSameStudent) return false;

  const timeA = (a.timestamp || '').trim();
  const timeB = (b.timestamp || '').trim();
  if (timeA && timeB && timeA === timeB) return true;

  if (a.weekNumber && b.weekNumber && a.weekNumber === b.weekNumber) {
    return true;
  }

  return false;
}

export function areCardsDuplicate(c1: KanbanCard, c2: KanbanCard): boolean {
  if (c1.id && c2.id && c1.id === c2.id) return true;
  const team1 = (c1.teamId || '').toLowerCase().trim();
  const team2 = (c2.teamId || '').toLowerCase().trim();
  if (team1 !== team2) return false;
  const week1 = c1.weekNumber || 0;
  const week2 = c2.weekNumber || 0;
  if (week1 !== week2) return false;
  return areNamesSamePerson(c1.assignee, c2.assignee);
}

export function deduplicateAuditsList(audits: AuditRecord[]): AuditRecord[] {
  const result: AuditRecord[] = [];
  for (const a of audits) {
    const existingIndex = result.findIndex((existing) => areAuditsDuplicate(existing, a));
    if (existingIndex >= 0) {
      const existing = result[existingIndex];
      const preferExistingId = existing.id.startsWith('gf-') || existing.id.startsWith('doc-');
      result[existingIndex] = {
        ...existing,
        ...a,
        id: preferExistingId ? existing.id : (a.id || existing.id),
        timestamp: a.timestamp || existing.timestamp,
        date: a.date || existing.date,
        summary: a.summary || existing.summary,
        blockers: (a.blockers && !a.blockers.toLowerCase().includes('none')) ? a.blockers : existing.blockers,
        commitUrl: a.commitUrl || existing.commitUrl,
      };
    } else {
      result.push(a);
    }
  }
  return result;
}

export function deduplicateCardsList(cards: KanbanCard[]): KanbanCard[] {
  const result: KanbanCard[] = [];
  for (const c of cards) {
    const existingIndex = result.findIndex((existing) => areCardsDuplicate(existing, c));
    if (existingIndex >= 0) {
      result[existingIndex] = {
        ...result[existingIndex],
        ...c,
        id: result[existingIndex].id,
      };
    } else {
      result.push(c);
    }
  }
  return result;
}

export function mergeAuditsDeduplicated(
  existingAudits: AuditRecord[],
  incomingAudits: AuditRecord[]
): {
  merged: AuditRecord[];
  addedCount: number;
  updatedCount: number;
} {
  const result = [...existingAudits];
  let addedCount = 0;
  let updatedCount = 0;

  for (const incoming of incomingAudits) {
    const existingIndex = result.findIndex((existing) => areAuditsDuplicate(existing, incoming));
    if (existingIndex >= 0) {
      const existing = result[existingIndex];
      const preferExistingId = existing.id.startsWith('gf-') || existing.id.startsWith('doc-');
      result[existingIndex] = {
        ...existing,
        ...incoming,
        id: preferExistingId ? existing.id : (incoming.id || existing.id),
        timestamp: incoming.timestamp || existing.timestamp,
        date: incoming.date || existing.date,
        summary: incoming.summary || existing.summary,
        blockers: (incoming.blockers && !incoming.blockers.toLowerCase().includes('none')) ? incoming.blockers : existing.blockers,
        commitUrl: incoming.commitUrl || existing.commitUrl,
        ticketStatus: incoming.ticketStatus || existing.ticketStatus,
      };
      updatedCount++;
    } else {
      result.push(incoming);
      addedCount++;
    }
  }

  return { merged: result, addedCount, updatedCount };
}

