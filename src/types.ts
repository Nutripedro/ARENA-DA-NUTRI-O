export type GameMode = 'individual' | 'team' | 'auditorium' | 'duel';

export interface Question {
  id: string;
  category: string;
  difficulty: 1 | 2 | 3;
  question: string;
  options: string[];
  correctAnswer: number; // 0 to 3
  explanation: string;
  tip: string;
}

export interface GameSettings {
  timeLimit: number; // in seconds (0 = no limit)
  difficultyMode: 'progressive' | '1' | '2' | '3';
  totalRounds: number; // 5, 10, or 15
}

export interface Team {
  id: string;
  name: string;
  score: number;
}

export interface GameLogEntry {
  questionId: string;
  selectedOption: number | null;
  isCorrect: boolean;
  timeSpent: number;
}

export interface RankingEntry {
  id: string;
  name: string;
  mode: string;
  score: number;
  correctCount: number;
  date: string;
}
