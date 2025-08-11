@@ .. @@
 export interface Achievement {
   id: string;
   title: string;
   description: string;
  windSpeed?: number; // wind speed in m/s (positive = tailwind, negative = headwind)
  windSpeed?: number; // wind speed in m/s
  isWindLegal?: boolean; // true if wind <= +2.0 m/s
 }
-  type: 'xp' | 'time' | 'workout_count' | 'streak';
+  type: 'xp' | 'time' | 'workout_count' | 'streak' | 'distance';
   target: number;
   currentProgress: number;
   isUnlocked: boolean;