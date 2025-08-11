import React, { useState, useEffect } from 'react';
import Navigation from './components/Navigation';
import Dashboard from './components/Dashboard';
import WorkoutForm from './components/WorkoutForm';
import WorkoutsList from './components/WorkoutsList';
import PersonalRecords from './components/PersonalRecords';
import AchievementsList from './components/AchievementsList';
import AchievementModal from './components/AchievementModal';
import Analytics from './components/Analytics';
import { Workout, PersonalRecord, UserProfile, Achievement } from './types';
import { useLocalStorage } from './hooks/useLocalStorage';
import { events } from './utils/trackData';
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
            const newRecord: PersonalRecord = {
              id: `${workout.id}-${exercise.id}-${set.id}`,
              eventType: workout.eventType,
              eventName: exercise.name,
              value: set.value,
              unit: set.unit,
              date: workout.date,
              workoutId: workout.id,
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

  const handleDeleteWorkout = (id: string) => {
    setWorkouts(prev => prev.filter(w => w.id !== id));
    // Also remove associated records
    setRecords(prev => prev.filter(r => r.workoutId !== id));
  };

  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
    if (tab !== 'workouts') {
      setShowWorkoutForm(false);
    }
  };

  const renderContent = () => {
    if (activeTab === 'workouts' && showWorkoutForm) {
      return (
        <WorkoutForm
          onSave={handleSaveWorkout}
          onCancel={() => setShowWorkoutForm(false)}
        />
      );
    }

    switch (activeTab) {
      case 'dashboard':
        return <Dashboard workouts={workouts} records={records} profile={profile} recentXP={recentXP} />;
      case 'workouts':
        return (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold text-gray-900">Your Workouts</h2>
              <button
                onClick={() => setShowWorkoutForm(true)}
                className="px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors duration-200 flex items-center"
              >
                <span className="mr-2">+</span>
                Log Workout
              </button>
            </div>
            <WorkoutsList workouts={workouts} onDelete={handleDeleteWorkout} />
          </div>
        );
      case 'records':
        return <PersonalRecords records={records} />;
      case 'achievements':
        return <AchievementsList achievements={profile.achievements} />;
      case 'analytics':
        return <Analytics workouts={workouts} records={records} />;
      default:
        return <Dashboard workouts={workouts} records={records} profile={profile} recentXP={recentXP} />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation activeTab={activeTab} onTabChange={handleTabChange} />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {renderContent()}
      </main>
      
      {newAchievement && (
        <AchievementModal
          achievement={newAchievement}
          onClose={() => setNewAchievement(null)}
        />
      )}
    </div>
  );
}

export default App;