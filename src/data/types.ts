export type EducationTarget = 
  | 'high_school_9_11'   // Ученик 9-11 класса
  | 'bachelor_kz'        // Абитуриент бакалавриата в Казахстане
  | 'abroad_study'       // Поступающий на зарубежную программу
  | 'transfer_master';   // Перевод / Спецпрограмма

export type FieldOfStudy = 
  | 'cs_it'              // IT & Computer Science
  | 'engineering'        // Инженерия и технологии
  | 'business_econ'      // Бизнес, финансы и менеджмент
  | 'medicine_bio'       // Медицина и биомедицина
  | 'social_humanities'  // Международные отношения, право
  | 'design_art';        // Дизайн, архитектура, медиа

export interface UserProfile {
  target: EducationTarget;
  gradeOrAge: string;
  field: FieldOfStudy;
  gpa: number;           // Scale 2.0 - 4.0 or 3.0 - 5.0 (standardized to 4.0 internally)
  ielts: number;         // 0 - 9.0
  sat: number;           // 0 - 1600
  ent: number;           // 0 - 140
  annualBudgetUsd: number; // 0 - 50,000+ USD
  preferredCountries: string[]; // ["Казахстан", "Германия", "США", "Италия", "Турция", "Корея", "Венгрия"]
  targetYear: number;
  extracurricularsCount: number; // Олимпиады, волонтерство, проекты (0-5)
  needsScholarship: boolean;
}

export type MatchTier = 'Safety' | 'Target' | 'Reach';

export interface University {
  id: string;
  name: string;
  nameEn: string;
  country: string;
  city: string;
  logo: string;
  imageUrl: string;
  officialUrl: string;
  ranking: string;
  tuitionUsdPerYear: number;
  costOfLivingUsdPerMonth: number;
  minIelts: number;
  minSat?: number;
  minGpa: number;
  minEnt?: number;
  availableGrants: string[];
  strongFields: FieldOfStudy[];
  fallDeadline: string;
  springDeadline?: string;
  acceptanceRatePercent: number;
  campusHighlights: string[];
  isDemonstrationData?: boolean;
}

export interface UniversityMatch {
  university: University;
  matchScore: number; // 0 - 100
  tier: MatchTier;
  matchReasons: string[];
  riskFactors: string[];
  scholarshipAdvice: string;
}

export interface DiagnosticResult {
  overallStrength: 'высокая' | 'средняя' | 'требует_усиления';
  strongPoints: string[];
  bottlenecks: string[];
  keyAdvice: string;
  scholarshipEligibility: string;
}

export interface RoadmapStep {
  id: string;
  title: string;
  category: 'экзамены' | 'документы' | 'дедлайны' | 'активности';
  deadlineDate: string;
  timeRemaining: string;
  description: string;
  completed: boolean;
  priority: 'высокий' | 'средний' | 'плановый';
  links?: { title: string; url: string }[];
}

export interface AdmissionState {
  currentStep: number; // 1 to 7
  profile: UserProfile;
  selectedUniversityIds: string[]; // for comparison
  completedStepIds: string[];      // for progress tracking
}
