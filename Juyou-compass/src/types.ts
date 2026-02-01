export interface WuXing {
  wood: number;
  fire: number;
  earth: number;
  metal: number;
  water: number;
}

export interface Dimension {
  name: string;
  val: number; // 0-10
  desc: string;
}

export interface UserProfile {
  energy_type: string; // e.g. "弱火命" or "Generator"
  match_score: number;
  match_comment: string;
  wuxing: WuXing;
}

export interface DestAnalysis {
  dimensions: Dimension[];
}

export interface Scores {
  short_term: number;
  mid_term: number;
  long_term: number;
  comment: string;
}

export interface RoadmapStage {
  stage_name: string; // e.g. "Week 1: 物理着陆"
  action_title: string; // e.g. "建立安全屋"
  description: string; // Detailed advice
}

export interface PaidContent {
  pitfalls: { 
    title: string; 
    risk_analysis: string; // 深度分析
    mitigation_strategy: string; // 具体的对冲策略
    severity: 'high' | 'medium' | 'low';
  }; 
  roadmap: RoadmapStage[]; // 3个阶段的行动规划
  cheat_code: { title: string; content: string }; // 本地黑客思维/内行洞察
  lucky_spots: { title: string; spots: string[] };
}

export interface SocialBadge {
  title: string; // e.g. "大理·火行漫游者"
  keywords: string[];
  auspicious_direction: string;
  lucky_color: string;
}

export interface ReportData {
  user_profile: UserProfile;
  social_badge: SocialBadge; 
  dest_analysis: DestAnalysis;
  scores: Scores;
  paid_content: PaidContent;
}

export interface UserInputs {
  targetCity: string;
  tripPurpose: string;
  birthDate: string;
  birthTime: string;
  birthPlace: string;
  mbti: string;
}

export interface AppState {
  step: 'input' | 'loading' | 'report';
  inputs: UserInputs;
  result: ReportData | null;
}
