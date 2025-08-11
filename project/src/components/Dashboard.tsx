import React from 'react';
import { Calendar, Clock, TrendingUp, Zap } from 'lucide-react';
import { Workout, PersonalRecord, UserProfile } from '../types';
import { formatTime, events } from '../utils/trackData';
import XPDisplay from './XPDisplay';

interface DashboardProps {
  workouts: Workout[];
  records: PersonalRecord[];
  profile: UserProfile;
  recentXP?: number;
}

export default function Dashboard({ workouts, records, profile, recentXP }: DashboardProps) {
  const recentWorkouts = workouts
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 5);

  const recentRecords = records
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 3);

  const thisWeekWorkouts = workouts.filter(w => {
    const workoutDate = new Date(w.date);
    const oneWeekAgo = new Date();
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
    return workoutDate >= oneWeekAgo;
  }).length;

  const totalTrainingTime = workouts.reduce((total, workout) => 
    total + (workout.duration || 0), 0
  );

  const stats = [
    {
      label: 'Workouts This Week',
      value: thisWeekWorkouts.toString(),
      icon: Calendar,
      color: 'text-blue-600',
      bg: 'bg-blue-100'
    },
    {
      label: 'Total Training Hours',
      value: Math.round(totalTrainingTime / 60).toString(),
      icon: Clock,
      color: 'text-green-600',
      bg: 'bg-green-100'
    },
    {
      label: 'Personal Records',
      value: records.length.toString(),
      icon: TrendingUp,
      color: 'text-yellow-600',
      bg: 'bg-yellow-100'
    },
    {
      label: 'Total Workouts',
      value: workouts.length.toString(),
      icon: Zap,
      color: 'text-red-600',
      bg: 'bg-red-100'
    }
  ];

  return (
    <div className="space-y-6">
      {/* XP Display */}
      <XPDisplay profile={profile} recentXP={recentXP} />

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <div key={index} className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow duration-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">{stat.label}</p>
                  <p className="text-3xl font-bold text-gray-900 mt-1">{stat.value}</p>
                </div>
                <div className={`${stat.bg} p-3 rounded-lg`}>
                  <Icon className={`w-6 h-6 ${stat.color}`} />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Workouts */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Workouts</h3>
          {recentWorkouts.length > 0 ? (
            <div className="space-y-3">
              {recentWorkouts.map((workout) => (
                <div key={workout.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div>
                    <p className="font-medium text-gray-900">{events[workout.eventType]?.name || workout.eventType}</p>
                    <p className="text-sm text-gray-600">{new Date(workout.date).toLocaleDateString()}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium text-gray-900">{workout.exercises.length} exercises</p>
                    {workout.duration && (
                      <p className="text-sm text-gray-600">{workout.duration}min</p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500 text-center py-8">No workouts yet. Start training!</p>
          )}
        </div>

        {/* Recent Records */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Personal Records</h3>
          {recentRecords.length > 0 ? (
            <div className="space-y-3">
              {recentRecords.map((record) => (
                <div key={record.id} className="flex items-center justify-between p-3 bg-gradient-to-r from-yellow-50 to-orange-50 rounded-lg border-l-4 border-yellow-400">
                  <div>
                    <p className="font-medium text-gray-900">{record.eventName}</p>
                    <p className="text-sm text-gray-600">{new Date(record.date).toLocaleDateString()}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-lg font-bold text-yellow-700">
                      {record.unit === 's' ? formatTime(record.value) : `${record.value}${record.unit}`}
                    </p>
                    <p className="text-xs text-yellow-600">NEW PR!</p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500 text-center py-8">No personal records yet. Keep pushing!</p>
          )}
        </div>
      </div>
    </div>
  );
}