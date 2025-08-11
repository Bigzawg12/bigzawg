import React from 'react';
import { Trophy, Lock, CheckCircle } from 'lucide-react';
import { Achievement } from '../types';
import { getRarityColor } from '../utils/xpSystem';

interface AchievementsListProps {
  achievements: Achievement[];
}

export default function AchievementsList({ achievements }: AchievementsListProps) {
  const unlockedAchievements = achievements.filter(a => a.isUnlocked);
  const lockedAchievements = achievements.filter(a => !a.isUnlocked);

  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-yellow-400 to-orange-500 rounded-xl p-6 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold mb-2">Achievements</h2>
            <p className="text-yellow-100">
              {unlockedAchievements.length} of {achievements.length} unlocked
            </p>
          </div>
          <Trophy className="w-16 h-16 text-yellow-200" />
        </div>
      </div>

      {unlockedAchievements.length > 0 && (
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <CheckCircle className="w-5 h-5 mr-2 text-green-600" />
            Unlocked Achievements
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {unlockedAchievements
              .sort((a, b) => new Date(b.unlockedDate!).getTime() - new Date(a.unlockedDate!).getTime())
              .map((achievement) => (
                <div key={achievement.id} className="border border-gray-200 rounded-lg p-4 bg-gradient-to-br from-green-50 to-blue-50">
                  <div className="flex items-start justify-between mb-2">
                    <div className={`p-2 rounded-lg ${getRarityColor(achievement.rarity)}`}>
                      <span className="text-2xl">{achievement.icon}</span>
                    </div>
                    <div className="text-right">
                      <span className={`text-xs px-2 py-1 rounded-full ${getRarityColor(achievement.rarity)}`}>
                        {achievement.rarity}
                      </span>
                    </div>
                  </div>
                  
                  <h4 className="font-semibold text-gray-900 mb-1">{achievement.title}</h4>
                  <p className="text-sm text-gray-600 mb-2">{achievement.description}</p>
                  
                  {achievement.unlockedDate && (
                    <p className="text-xs text-gray-500">
                      Unlocked {new Date(achievement.unlockedDate).toLocaleDateString()}
                    </p>
                  )}
                </div>
              ))
            }
          </div>
        </div>
      )}

      {lockedAchievements.length > 0 && (
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <Lock className="w-5 h-5 mr-2 text-gray-400" />
            Locked Achievements
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {lockedAchievements.map((achievement) => {
              const progressPercentage = achievement.type === 'time' 
                ? Math.max(0, 100 - (achievement.currentProgress / achievement.target) * 100)
                : (achievement.currentProgress / achievement.target) * 100;
              
              return (
                <div key={achievement.id} className="border border-gray-200 rounded-lg p-4 bg-gray-50 opacity-75">
                  <div className="flex items-start justify-between mb-2">
                    <div className="p-2 rounded-lg bg-gray-200">
                      <span className="text-2xl grayscale">{achievement.icon}</span>
                    </div>
                    <div className="text-right">
                      <span className="text-xs px-2 py-1 rounded-full bg-gray-200 text-gray-600">
                        {achievement.rarity}
                      </span>
                    </div>
                  </div>
                  
                  <h4 className="font-semibold text-gray-700 mb-1">{achievement.title}</h4>
                  <p className="text-sm text-gray-500 mb-3">{achievement.description}</p>
                  
                  <div className="space-y-1">
                    <div className="flex justify-between text-xs text-gray-500">
                      <span>Progress</span>
                      <span>
                        {achievement.type === 'time' 
                          ? `${achievement.currentProgress.toFixed(2)}s / ${achievement.target}s`
                          : `${achievement.currentProgress} / ${achievement.target}`
                        }
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-blue-500 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${Math.min(progressPercentage, 100)}%` }}
                      />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}