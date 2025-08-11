export interface Workout {
  id: string;
  date: string;
  eventType: EventType;
  exercises: Exercise[];
  notes?: string;
  duration?: number; // in minutes
}

export interface Exercise {
  id: string;
  name: string;
  sets: Set[];
  eventCategory: EventCategory;
}

export interface Set {
  id: string;
  value: number; // time in seconds, distance in meters, height in cm, etc.
  unit: string; // 's', 'm', 'cm', 'kg', etc.
  reps?: number;
  rest?: number; // rest time in seconds
}

export interface PersonalRecord {
  id: string;
  eventType: EventType;
  eventName: string;
  value: number;
  unit: string;
  date: string;
  workoutId: string;
}

export interface UserProfile {
  totalXP: number;
  level: number;
  achievements: Achievement[];
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  type: 'xp' | 'time' | 'workout_count' | 'streak';
  target: number;
  currentProgress: number;
  isUnlocked: boolean;
  unlockedDate?: string;
  icon: string;
  rarity: 'bronze' | 'silver' | 'gold' | 'platinum';
}

export type EventCategory = 'sprints' | 'distance' | 'jumps' | 'throws' | 'hurdles';

export type EventType = 
  // Sprints
  | '100m' | '200m' | '400m' 
  // Distance
  | '800m' | '1500m' | '3000m' | '5000m' | '10000m'
  // Jumps
  | 'long-jump' | 'high-jump' | 'pole-vault' | 'triple-jump'
  // Throws
  | 'shot-put' | 'discus' | 'hammer' | 'javelin'
  // Hurdles
  | '110m-hurdles' | '400m-hurdles';

export interface TrainingTemplate {
  id: string;
  name: string;
  eventCategory: EventCategory;
  exercises: Omit<Exercise, 'id'>[];
  description: string;
}