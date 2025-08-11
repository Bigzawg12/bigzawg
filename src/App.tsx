@@ .. @@
 import { Workout, PersonalRecord, UserProfile, Achievement } from './types';
 import { useLocalStorage } from './hooks/useLocalStorage';
-import { events } from './utils/trackData';
+import { events, isWindLegal } from './utils/trackData';
 import { calculateWorkoutXP, calculateLevel, defaultAchievements, checkAchievements } from './utils/xpSystem';

 function App() {
   const [activeTab, setActiveTab] = useState('dashboard');
   const [showWorkoutForm, setShowWorkoutForm] = useState(false);
   const [workouts, setWorkouts] = useLocalStorage<Workout[]>('trackpro-workouts', []);
   const [records, setRecords] = useLocalStorage<PersonalRecord[]>('trackpro-records', []);
   const [profile, setProfile] = useLocalStorage<UserProfile>('trackpro-profile', {
     totalXP: 0,
     level: 1,
     achievements: defaultAchievements.map(a => ({
       ...a,
       currentProgress: 0,
       isUnlocked: false
     }))
   });
   const [recentXP, setRecentXP] = useState<number>(0);
   const [newAchievement, setNewAchievement] = useState<Achievement | null>(null);

   // Update achievements when data changes
   useEffect(() => {
     const updatedAchievements = checkAchievements(
       profile.achievements,
       profile.totalXP,
       workouts.length,
       records
     );
     
     // Check for newly unlocked achievements
     const newlyUnlocked = updatedAchievements.find(
       (updated, index) => updated.isUnlocked && !profile.achievements[index].isUnlocked
     );
     
     if (newlyUnlocked) {
       setNewAchievement(newlyUnlocked);
     }
     
     setProfile(prev => ({
       ...prev,
       achievements: updatedAchievements
     }));
   }, [profile.totalXP, workouts.length, records]);
   const handleSaveWorkout = (workoutData: Omit<Workout, 'id'>) => {
     const newWorkout: Workout = {
       ...workoutData,
       id: Date.now().toString(),
     };
     
     const updatedWorkouts = [...workouts, newWorkout];
     setWorkouts(updatedWorkouts);
     
     // Calculate and add XP
     const xpGained = calculateWorkoutXP(newWorkout);
     const newTotalXP = profile.totalXP + xpGained;
     const newLevel = calculateLevel(newTotalXP);
     
     setProfile(prev => ({
       ...prev,
       totalXP: newTotalXP,
       level: newLevel
     }));
     
     setRecentXP(xpGained);
     
     // Clear recent XP after 5 seconds
     setTimeout(() => setRecentXP(0), 5000);
     
     // Check for new personal records
     checkForPersonalRecords(newWorkout);
     setShowWorkoutForm(false);
   };

   const checkForPersonalRecords = (workout: Workout) => {
     const newRecords: PersonalRecord[] = [];
     
     workout.exercises.forEach(exercise => {
       exercise.sets.forEach(set => {
         if (set.value > 0) {
           // For time-based events (lower is better)
           const isTimeBased = set.unit === 's';
           const existingRecord = records.find(r => 
             r.eventType === workout.eventType && r.eventName === exercise.name
           );
           
           const isNewRecord = !existingRecord || 
             (isTimeBased ? set.value < existingRecord.value : set.value > existingRecord.value);
           
           if (isNewRecord) {
+            const windSpeed = set.windSpeed || 0;
+            const isWindLegalRecord = set.windSpeed === undefined || isWindLegal(windSpeed);
+            
             const newRecord: PersonalRecord = {
               id: `${workout.id}-${exercise.id}-${set.id}`,
               eventType: workout.eventType,
               eventName: exercise.name,
               value: set.value,
               unit: set.unit,
               date: workout.date,
               workoutId: workout.id,
+              windSpeed: set.windSpeed,
+              isWindLegal: isWindLegalRecord,
             };
             
             newRecords.push(newRecord);
             
             // Remove old record if it exists
             if (existingRecord) {
               setRecords(prev => prev.filter(r => r.id !== existingRecord.id));
             }
           }
         }
       });
     });
     
     if (newRecords.length > 0) {
       setRecords(prev => [...prev, ...newRecords]);
     }
   };