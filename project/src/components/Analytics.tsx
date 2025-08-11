import React, { useMemo } from 'react';
import { BarChart3, TrendingUp, Activity, Calendar } from 'lucide-react';
import { Workout, PersonalRecord } from '../types';
import { events, eventCategories } from '../utils/trackData';

interface AnalyticsProps {
  workouts: Workout[];
  records: PersonalRecord[];
}

export default function Analytics({ workouts, records }: AnalyticsProps) {
  const analytics = useMemo(() => {
    // Workout frequency by week
    const workoutsByWeek = workouts.reduce((acc, workout) => {
      const date = new Date(workout.date);
      const week = `${date.getFullYear()}-W${Math.ceil((date.getDate() - date.getDay()) / 7)}`;
      acc[week] = (acc[week] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    // Event category distribution
    const eventDistribution = workouts.reduce((acc, workout) => {
      const category = events[workout.eventType]?.category || 'other';
      acc[category] = (acc[category] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    // Recent activity (last 30 days)
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    
    const recentWorkouts = workouts.filter(w => 
      new Date(w.date) >= thirtyDaysAgo
    );

    const totalSets = workouts.reduce((total, workout) => 
      total + workout.exercises.reduce((exerciseTotal, exercise) => 
        exerciseTotal + exercise.sets.length, 0
      ), 0
    );

    return {
      totalWorkouts: workouts.length,
      totalSets,
      recentWorkouts: recentWorkouts.length,
      avgWorkoutsPerWeek: Object.values(workoutsByWeek).length > 0 
        ? Object.values(workoutsByWeek).reduce((a, b) => a + b, 0) / Object.values(workoutsByWeek).length 
        : 0,
      eventDistribution,
      workoutsByWeek
    };
  }, [workouts]);

  const recentRecords = useMemo(() => {
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    
    return records.filter(record => new Date(record.date) >= thirtyDaysAgo);
  }, [records]);

  const stats = [
    {
      label: 'Total Workouts',
      value: analytics.totalWorkouts,
      icon: Activity,
      color: 'text-blue-600',
      bg: 'bg-blue-100'
    },
    {
      label: 'Total Sets',
      value: analytics.totalSets,
      icon: BarChart3,
      color: 'text-green-600',
      bg: 'bg-green-100'
    },
    {
      label: 'Workouts (30 days)',
      value: analytics.recentWorkouts,
      icon: Calendar,
      color: 'text-purple-600',
      bg: 'bg-purple-100'
    },
    {
      label: 'New PRs (30 days)',
      value: recentRecords.length,
      icon: TrendingUp,
      color: 'text-yellow-600',
      bg: 'bg-yellow-100'
    }
  ];

  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl p-6 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold mb-2">Training Analytics</h2>
            <p className="text-blue-100">Track your progress and performance trends</p>
          </div>
          <BarChart3 className="w-16 h-16 text-blue-200" />
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <div key={index} className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
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
        {/* Event Distribution */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Training Focus</h3>
          {Object.keys(analytics.eventDistribution).length > 0 ? (
            <div className="space-y-3">
              {Object.entries(analytics.eventDistribution)
                .sort(([,a], [,b]) => b - a)
                .map(([category, count]) => {
                  const percentage = (count / analytics.totalWorkouts) * 100;
                  return (
                    <div key={category} className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="font-medium text-gray-700">
                          {eventCategories[category as keyof typeof eventCategories] || category}
                        </span>
                        <span className="text-gray-600">{count} workouts ({percentage.toFixed(1)}%)</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-blue-500 h-2 rounded-full transition-all duration-300"
                          style={{ width: `${percentage}%` }}
                        />
                      </div>
                    </div>
                  );
                })
              }
            </div>
          ) : (
            <p className="text-gray-500 text-center py-8">No training data available</p>
          )}
        </div>

        {/* Recent Progress */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Progress (30 Days)</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
              <div className="flex items-center">
                <Activity className="w-5 h-5 text-green-600 mr-3" />
                <span className="font-medium text-gray-900">Workouts Completed</span>
              </div>
              <span className="text-2xl font-bold text-green-600">{analytics.recentWorkouts}</span>
            </div>
            
            <div className="flex items-center justify-between p-3 bg-yellow-50 rounded-lg">
              <div className="flex items-center">
                <TrendingUp className="w-5 h-5 text-yellow-600 mr-3" />
                <span className="font-medium text-gray-900">New Personal Records</span>
              </div>
              <span className="text-2xl font-bold text-yellow-600">{recentRecords.length}</span>
            </div>
            
            <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
              <div className="flex items-center">
                <BarChart3 className="w-5 h-5 text-blue-600 mr-3" />
                <span className="font-medium text-gray-900">Average per Week</span>
              </div>
              <span className="text-2xl font-bold text-blue-600">
                {analytics.avgWorkoutsPerWeek.toFixed(1)}
              </span>
            </div>
          </div>
        </div>
      </div>

      {analytics.totalWorkouts === 0 && (
        <div className="text-center py-12">
          <BarChart3 className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-500 text-lg">No data to analyze yet</p>
          <p className="text-gray-400">Start logging workouts to see your progress!</p>
        </div>
      )}
    </div>
  );
}