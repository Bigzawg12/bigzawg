import React from 'react';
import { Star, Zap, Trophy } from 'lucide-react';
import { UserProfile } from '../types';
import { getXPProgress } from '../utils/xpSystem';

interface XPDisplayProps {
  profile: UserProfile;
  recentXP?: number;
}

export default function XPDisplay({ profile, recentXP }: XPDisplayProps) {
  const progress = getXPProgress(profile.totalXP, profile.level);

  return (
    <div className="bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl p-6 text-white">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center">
          <div className="bg-white bg-opacity-20 p-3 rounded-lg mr-4">
            <Star className="w-8 h-8" />
          </div>
          <div>
            <h3 className="text-2xl font-bold">Level {profile.level}</h3>
            <p className="text-blue-100">{profile.totalXP.toLocaleString()} Total XP</p>
          </div>
        </div>
        
        {recentXP && recentXP > 0 && (
          <div className="bg-green-500 bg-opacity-90 px-3 py-1 rounded-full flex items-center animate-pulse">
            <Zap className="w-4 h-4 mr-1" />
            <span className="font-bold">+{recentXP} XP</span>
          </div>
        )}
      </div>
      
      <div className="space-y-2">
        <div className="flex justify-between text-sm">
          <span>Progress to Level {profile.level + 1}</span>
          <span>{progress.current}/{progress.needed} XP</span>
        </div>
        <div className="w-full bg-white bg-opacity-20 rounded-full h-3">
          <div 
            className="bg-white h-3 rounded-full transition-all duration-500 ease-out"
            style={{ width: `${Math.min(progress.percentage, 100)}%` }}
          />
        </div>
      </div>
      
      <div className="flex items-center justify-between mt-4 text-sm">
        <div className="flex items-center">
          <Trophy className="w-4 h-4 mr-1" />
          <span>{profile.achievements.filter(a => a.isUnlocked).length} Achievements</span>
        </div>
        <span className="text-blue-100">
          {Math.round(progress.percentage)}% to next level
        </span>
      </div>
    </div>
  );
}