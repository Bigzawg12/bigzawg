import React, { useState } from 'react';
import { Calendar, Clock, Eye, Trash2 } from 'lucide-react';
import { Workout } from '../types';
import { events, formatTime } from '../utils/trackData';

interface WorkoutsListProps {
  workouts: Workout[];
  onDelete: (id: string) => void;
}

export default function WorkoutsList({ workouts, onDelete }: WorkoutsListProps) {
  const [selectedWorkout, setSelectedWorkout] = useState<Workout | null>(null);

  const sortedWorkouts = workouts.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  const WorkoutModal = ({ workout, onClose }: { workout: Workout; onClose: () => void }) => (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl max-w-2xl w-full max-h-[80vh] overflow-y-auto">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-semibold text-gray-900">
              {events[workout.eventType]?.name || workout.eventType}
            </h3>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600"
            >
              ✕
            </button>
          </div>
          <div className="flex items-center text-sm text-gray-600 mt-2">
            <Calendar className="w-4 h-4 mr-1" />
            {new Date(workout.date).toLocaleDateString()}
            {workout.duration && (
              <>
                <Clock className="w-4 h-4 ml-4 mr-1" />
                {workout.duration} minutes
              </>
            )}
          </div>
        </div>
        
        <div className="p-6">
          <div className="space-y-4">
            {workout.exercises.map((exercise) => (
              <div key={exercise.id} className="border border-gray-200 rounded-lg p-4">
                <h4 className="font-medium text-gray-900 mb-3">{exercise.name}</h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {exercise.sets.map((set, index) => (
                    <div key={set.id} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                      <span className="text-sm text-gray-600">Set {index + 1}</span>
                      <span className="font-medium">
                        {set.unit === 's' ? formatTime(set.value) : `${set.value}${set.unit}`}
                      </span>
                      {set.rest && (
                        <span className="text-sm text-gray-500">Rest: {set.rest}s</span>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
          
          {workout.notes && (
            <div className="mt-4 p-4 bg-blue-50 rounded-lg">
              <h4 className="font-medium text-gray-900 mb-2">Notes</h4>
              <p className="text-gray-700">{workout.notes}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );

  return (
    <div>
      {sortedWorkouts.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {sortedWorkouts.map((workout) => (
            <div key={workout.id} className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow duration-200">
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-semibold text-gray-900">{events[workout.eventType]?.name || workout.eventType}</h3>
                <div className="flex space-x-1">
                  <button
                    onClick={() => setSelectedWorkout(workout)}
                    className="p-2 text-blue-600 hover:bg-blue-100 rounded-lg transition-colors duration-200"
                  >
                    <Eye className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => onDelete(workout.id)}
                    className="p-2 text-red-600 hover:bg-red-100 rounded-lg transition-colors duration-200"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
              
              <div className="flex items-center text-sm text-gray-600 mb-3">
                <Calendar className="w-4 h-4 mr-1" />
                {new Date(workout.date).toLocaleDateString()}
                {workout.duration && (
                  <>
                    <Clock className="w-4 h-4 ml-3 mr-1" />
                    {workout.duration}min
                  </>
                )}
              </div>
              
              <div className="text-sm text-gray-700">
                {workout.exercises.length} exercise{workout.exercises.length !== 1 ? 's' : ''}
                <div className="mt-2 space-y-1">
                  {workout.exercises.slice(0, 2).map((exercise) => (
                    <div key={exercise.id} className="text-xs text-gray-500">
                      • {exercise.name} ({exercise.sets.length} sets)
                    </div>
                  ))}
                  {workout.exercises.length > 2 && (
                    <div className="text-xs text-gray-500">
                      • +{workout.exercises.length - 2} more exercise{workout.exercises.length - 2 !== 1 ? 's' : ''}
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <Calendar className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-500 text-lg">No workouts logged yet</p>
          <p className="text-gray-400">Start tracking your training sessions!</p>
        </div>
      )}
      
      {selectedWorkout && (
        <WorkoutModal
          workout={selectedWorkout}
          onClose={() => setSelectedWorkout(null)}
        />
      )}
    </div>
  );
}