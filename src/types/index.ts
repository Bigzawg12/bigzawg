@@ .. @@
 export interface Achievement {
   id: string;
   title: string;
   description: string;
-  type: 'xp' | 'time' | 'workout_count' | 'streak';
+  type: 'xp' | 'time' | 'workout_count' | 'streak' | 'distance';
   target: number;
   currentProgress: number;
   isUnlocked: boolean;