import React from 'react';
import { X, Trophy } from 'lucide-react';
import { Achievement } from '../types';
import { getRarityColor } from '../utils/xpSystem';

interface AchievementModalProps {
  achievement: Achievement;
  onClose: () => void;
}

export default function AchievementModal({ achievement, onClose }: AchievementModalProps) {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl max-w-md w-full p-6 text-center animate-bounce">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
        >
          <X className="w-6 h-6" />
        </button>
        
        <div className="mb-4">
          <div className={`inline-flex items-center justify-center w-20 h-20 rounded-full ${getRarityColor(achievement.rarity)} mb-4`}>
            <span className="text-4xl">{achievement.icon}</span>
          </div>
          
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Achievement Unlocked!</h2>
          <h3 className="text-xl font-semibold text-gray-800 mb-2">{achievement.title}</h3>
          <p className="text-gray-600">{achievement.description}</p>
        </div>
        
        <div className="flex items-center justify-center space-x-2 text-sm text-gray-500 mb-4">
          <Trophy className="w-4 h-4" />
          <span className="capitalize">{achievement.rarity} Achievement</span>
        </div>
        
        <button
          onClick={onClose}
          className="w-full py-3 bg-gradient-to-r from-yellow-400 to-orange-500 text-white font-semibold rounded-lg hover:from-yellow-500 hover:to-orange-600 transition-all duration-200"
        >
          Awesome!
        </button>
      </div>
    </div>
  );
}