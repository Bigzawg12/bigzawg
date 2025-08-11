import React from 'react';
import { Trophy, TrendingUp, Calendar } from 'lucide-react';
import { PersonalRecord } from '../types';
import { formatTime, events, eventCategories } from '../utils/trackData';

interface PersonalRecordsProps {
  records: PersonalRecord[];
}

export default function PersonalRecords({ records }: PersonalRecordsProps) {
  const groupedRecords = records.reduce((groups, record) => {
    const event = events[record.eventType];
    const category = event?.category || 'other';
    if (!groups[category]) {
      groups[category] = [];
    }
    groups[category].push(record);
    return groups;
  }, {} as Record<string, PersonalRecord[]>);

  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-yellow-400 to-orange-500 rounded-xl p-6 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold mb-2">Personal Records</h2>
            <p className="text-yellow-100">Your best performances across all events</p>
          </div>
          <Trophy className="w-16 h-16 text-yellow-200" />
        </div>
      </div>

      {Object.keys(groupedRecords).length > 0 ? (
        Object.entries(groupedRecords).map(([category, categoryRecords]) => (
          <div key={category} className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
            <h3 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
              <TrendingUp className="w-5 h-5 mr-2 text-blue-600" />
              {eventCategories[category as keyof typeof eventCategories] || category}
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {categoryRecords
                .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
                .map((record) => (
                  <div key={record.id} className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-lg p-4 border-l-4 border-yellow-400">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-semibold text-gray-900">{record.eventName}</h4>
                      <Trophy className="w-5 h-5 text-yellow-500" />
                    </div>
                    
                    <div className="space-y-2">
                      <div className="text-2xl font-bold text-gray-900">
                        {record.unit === 's' ? formatTime(record.value) : `${record.value}${record.unit}`}
                      </div>
                      
                      <div className="flex items-center text-sm text-gray-600">
                        <Calendar className="w-4 h-4 mr-1" />
                        {new Date(record.date).toLocaleDateString()}
                      </div>
                    </div>
                  </div>
                ))
              }
            </div>
          </div>
        ))
      ) : (
        <div className="text-center py-12">
          <Trophy className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-500 text-lg">No personal records yet</p>
          <p className="text-gray-400">Complete workouts to start setting PRs!</p>
        </div>
      )}
    </div>
  );
}