import { Workout, Achievement, UserProfile } from '../types';
import { events } from './trackData';

export const XP_PER_SET = 10;
export const XP_BONUS_MULTIPLIER = 1.5;
export const XP_SPEED_BONUS = 20;

export function calculateWorkoutXP(workout: Workout): number {
  let totalXP = 0;
  
  workout.exercises.forEach(exercise => {
    // Base XP for each set
    totalXP += exercise.sets.length * XP_PER_SET;
    
    // Bonus XP for completing sets quickly (if rest time is recorded and low)
    exercise.sets.forEach(set => {
      if (set.rest && set.rest < 60) { // Less than 60 seconds rest
        totalXP += XP_SPEED_BONUS;
      }
      
      // Bonus XP for good performance (this is simplified - could be more sophisticated)
      if (set.value > 0) {
        totalXP += 5;
      }
    });
  });
  
  // Duration bonus - more XP for longer workouts
  if (workout.duration && workout.duration > 60) {
    totalXP *= XP_BONUS_MULTIPLIER;
  }
  
  return Math.round(totalXP);
}

export function calculateLevel(totalXP: number): number {
  // Level formula: level = floor(sqrt(totalXP / 100)) + 1
  return Math.floor(Math.sqrt(totalXP / 100)) + 1;
}

export function getXPForNextLevel(currentLevel: number): number {
  return Math.pow(currentLevel, 2) * 100;
}

export function getXPProgress(totalXP: number, currentLevel: number): { current: number; needed: number; percentage: number } {
  const currentLevelXP = Math.pow(currentLevel - 1, 2) * 100;
  const nextLevelXP = getXPForNextLevel(currentLevel);
  const current = totalXP - currentLevelXP;
  const needed = nextLevelXP - currentLevelXP;
  const percentage = (current / needed) * 100;
  
  return { current, needed, percentage };
}

export const defaultAchievements: Omit<Achievement, 'currentProgress' | 'isUnlocked' | 'unlockedDate'>[] = [
  // XP Achievements
  {
    id: 'first-steps',
    title: 'First Steps',
    description: 'Earn your first 100 XP',
    type: 'xp',
    target: 100,
    icon: '🏃‍♂️',
    rarity: 'bronze'
  },
  {
    id: 'getting-stronger',
    title: 'Getting Stronger',
    description: 'Reach 500 XP',
    type: 'xp',
    target: 500,
    icon: '💪',
    rarity: 'bronze'
  },
  {
    id: 'dedicated-athlete',
    title: 'Dedicated Athlete',
    description: 'Reach 1,000 XP',
    type: 'xp',
    target: 1000,
    icon: '🏆',
    rarity: 'silver'
  },
  {
    id: 'elite-performer',
    title: 'Elite Performer',
    description: 'Reach 2,500 XP',
    type: 'xp',
    target: 2500,
    icon: '⭐',
    rarity: 'gold'
  },
  {
    id: 'legendary-athlete',
    title: 'Legendary Athlete',
    description: 'Reach 5,000 XP',
    type: 'xp',
    target: 5000,
    icon: '👑',
    rarity: 'platinum'
  },
  
  // Workout Count Achievements
  {
    id: 'first-workout',
    title: 'First Workout',
    description: 'Complete your first workout',
    type: 'workout_count',
    target: 1,
    icon: '🎯',
    rarity: 'bronze'
  },
  {
    id: 'consistent-trainer',
    title: 'Consistent Trainer',
    description: 'Complete 10 workouts',
    type: 'workout_count',
    target: 10,
    icon: '📈',
    rarity: 'bronze'
  },
  {
    id: 'training-machine',
    title: 'Training Machine',
    description: 'Complete 25 workouts',
    type: 'workout_count',
    target: 25,
    icon: '🔥',
    rarity: 'silver'
  },
  {
    id: 'workout-warrior',
    title: 'Workout Warrior',
    description: 'Complete 50 workouts',
    type: 'workout_count',
    target: 50,
    icon: '⚡',
    rarity: 'gold'
  },
  
  // Time-based achievements (example for 100m)
  {
    id: 'sub-12-100m',
    title: 'Sub-12 Sprinter',
    description: 'Run 100m in under 12 seconds',
    type: 'time',
    target: 12,
    icon: '🏃‍♂️',
    rarity: 'silver'
  },
  {
    id: 'sub-11-100m',
    title: 'Elite Sprinter',
    description: 'Run 100m in under 11 seconds',
    type: 'time',
    target: 11,
    icon: '⚡',
    rarity: 'gold'
  },
  {
    id: 'sub-10-100m',
    title: 'World Class',
    description: 'Run 100m in under 10 seconds',
    type: 'time',
    target: 10,
    icon: '🌟',
    rarity: 'platinum'
  }
];

export function checkAchievements(
  achievements: Achievement[],
  totalXP: number,
  workoutCount: number,
  records: any[]
): Achievement[] {
  return achievements.map(achievement => {
    if (achievement.isUnlocked) return achievement;
    
    let currentProgress = 0;
    let shouldUnlock = false;
    
    switch (achievement.type) {
      case 'xp':
        currentProgress = totalXP;
        shouldUnlock = totalXP >= achievement.target;
        break;
        
      case 'workout_count':
        currentProgress = workoutCount;
        shouldUnlock = workoutCount >= achievement.target;
        break;
        
      case 'time':
        // Check for 100m records (simplified example)
        if (achievement.id.includes('100m')) {
          const best100m = records
            .filter(r => r.eventType === '100m')
            .sort((a, b) => a.value - b.value)[0];
          
          if (best100m) {
            currentProgress = best100m.value;
            shouldUnlock = best100m.value <= achievement.target;
          }
        }
        break;
    }
    
    return {
      ...achievement,
      currentProgress,
      isUnlocked: shouldUnlock,
      unlockedDate: shouldUnlock ? new Date().toISOString() : undefined
    };
  });
}

export function getRarityColor(rarity: Achievement['rarity']): string {
  switch (rarity) {
    case 'bronze': return 'text-amber-600 bg-amber-100';
    case 'silver': return 'text-gray-600 bg-gray-100';
    case 'gold': return 'text-yellow-600 bg-yellow-100';
    case 'platinum': return 'text-purple-600 bg-purple-100';
    default: return 'text-gray-600 bg-gray-100';
  }
}