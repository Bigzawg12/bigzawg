import { EventType, EventCategory, TrainingTemplate } from '../types';

export const eventCategories: Record<EventCategory, string> = {
  sprints: 'Sprints',
  distance: 'Distance',
  jumps: 'Jumps',
  throws: 'Throws',
  hurdles: 'Hurdles',
};

export const events: Record<EventType, { name: string; category: EventCategory; unit: string }> = {
  // Sprints
  '100m': { name: '100m Sprint', category: 'sprints', unit: 's' },
  '200m': { name: '200m Sprint', category: 'sprints', unit: 's' },
  '400m': { name: '400m Sprint', category: 'sprints', unit: 's' },
  
  // Distance
  '800m': { name: '800m Run', category: 'distance', unit: 's' },
  '1500m': { name: '1500m Run', category: 'distance', unit: 's' },
  '3000m': { name: '3000m Run', category: 'distance', unit: 's' },
  '5000m': { name: '5000m Run', category: 'distance', unit: 's' },
  '10000m': { name: '10000m Run', category: 'distance', unit: 's' },
  
  // Jumps
  'long-jump': { name: 'Long Jump', category: 'jumps', unit: 'm' },
  'high-jump': { name: 'High Jump', category: 'jumps', unit: 'm' },
  'pole-vault': { name: 'Pole Vault', category: 'jumps', unit: 'm' },
  'triple-jump': { name: 'Triple Jump', category: 'jumps', unit: 'm' },
  
  // Throws
  'shot-put': { name: 'Shot Put', category: 'throws', unit: 'm' },
  'discus': { name: 'Discus', category: 'throws', unit: 'm' },
  'hammer': { name: 'Hammer', category: 'throws', unit: 'm' },
  'javelin': { name: 'Javelin', category: 'throws', unit: 'm' },
  
  // Hurdles
  '110m-hurdles': { name: '110m Hurdles', category: 'hurdles', unit: 's' },
  '400m-hurdles': { name: '400m Hurdles', category: 'hurdles', unit: 's' },
};

export const trainingTemplates: TrainingTemplate[] = [
  {
    id: 'sprint-speed',
    name: 'Speed Development',
    eventCategory: 'sprints',
    description: 'Focus on maximum velocity and acceleration',
    exercises: [
      {
        name: '60m Sprint',
        eventCategory: 'sprints',
        sets: [
          { id: '1', value: 0, unit: 's' },
          { id: '2', value: 0, unit: 's' },
          { id: '3', value: 0, unit: 's' },
        ]
      },
      {
        name: '100m Sprint',
        eventCategory: 'sprints',
        sets: [
          { id: '1', value: 0, unit: 's' },
          { id: '2', value: 0, unit: 's' },
        ]
      }
    ]
  },
  {
    id: 'distance-tempo',
    name: 'Tempo Run',
    eventCategory: 'distance',
    description: 'Aerobic capacity building workout',
    exercises: [
      {
        name: '3000m Tempo',
        eventCategory: 'distance',
        sets: [
          { id: '1', value: 0, unit: 's' },
        ]
      },
      {
        name: '400m Repeats',
        eventCategory: 'distance',
        sets: [
          { id: '1', value: 0, unit: 's' },
          { id: '2', value: 0, unit: 's' },
          { id: '3', value: 0, unit: 's' },
          { id: '4', value: 0, unit: 's' },
        ]
      }
    ]
  }
];

export const formatTime = (seconds: number): string => {
  if (seconds < 60) {
    return `${seconds.toFixed(2)}s`;
  }
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  return `${minutes}:${remainingSeconds.toFixed(2).padStart(5, '0')}`;
};

export const parseTimeInput = (input: string): number => {
  // Handle formats like "12.34", "1:23.45", "12:34.56"
  const timePattern = /^(?:(\d+):)?(?:(\d+):)?(\d+(?:\.\d+)?)$/;
  const match = input.match(timePattern);
  
  if (!match) return 0;
  
  const [, hours, minutes, seconds] = match;
  let totalSeconds = parseFloat(seconds || '0');
  
  if (minutes) totalSeconds += parseInt(minutes) * 60;
  if (hours) totalSeconds += parseInt(hours) * 3600;
  
  return totalSeconds;
};