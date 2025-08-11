import React, { useState } from 'react';
import { Plus, Trash2, Save } from 'lucide-react';
import { Workout, Exercise, Set, EventType, EventCategory } from '../types';
import { events, eventCategories, parseTimeInput, trainingTemplates } from '../utils/trackData';

interface WorkoutFormProps {
  onSave: (workout: Omit<Workout, 'id'>) => void;
  onCancel: () => void;
}

export default function WorkoutForm({ onSave, onCancel }: WorkoutFormProps) {
  const [eventType, setEventType] = useState<EventType>('100m');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [duration, setDuration] = useState('');
  const [notes, setNotes] = useState('');
  const [exercises, setExercises] = useState<Exercise[]>([]);

  const addExercise = () => {
    const newExercise: Exercise = {
      id: Date.now().toString(),
      name: '',
      eventCategory: events[eventType].category,
      sets: []
    };
    setExercises([...exercises, newExercise]);
  };

  const removeExercise = (exerciseId: string) => {
    setExercises(exercises.filter(ex => ex.id !== exerciseId));
  };

  const updateExercise = (exerciseId: string, field: keyof Exercise, value: any) => {
    setExercises(exercises.map(ex => 
      ex.id === exerciseId ? { ...ex, [field]: value } : ex
    ));
  };

  const addSet = (exerciseId: string) => {
    const newSet: Set = {
      id: Date.now().toString(),
      value: 0,
      unit: events[eventType].unit,
    };
    
    setExercises(exercises.map(ex => 
      ex.id === exerciseId 
        ? { ...ex, sets: [...ex.sets, newSet] }
        : ex
    ));
  };

  const removeSet = (exerciseId: string, setId: string) => {
    setExercises(exercises.map(ex => 
      ex.id === exerciseId 
        ? { ...ex, sets: ex.sets.filter(set => set.id !== setId) }
        : ex
    ));
  };

  const updateSet = (exerciseId: string, setId: string, field: keyof Set, value: any) => {
    setExercises(exercises.map(ex => 
      ex.id === exerciseId 
        ? {
            ...ex,
            sets: ex.sets.map(set => 
              set.id === setId 
                ? { ...set, [field]: field === 'value' && typeof value === 'string' ? parseTimeInput(value) : value }
                : set
            )
          }
        : ex
    ));
  };

  const loadTemplate = (templateId: string) => {
    const template = trainingTemplates.find(t => t.id === templateId);
    if (template) {
      const templateExercises: Exercise[] = template.exercises.map((ex, index) => ({
        ...ex,
        id: `template-${Date.now()}-${index}`,
        sets: ex.sets.map((set, setIndex) => ({
          ...set,
          id: `set-${Date.now()}-${index}-${setIndex}`
        }))
      }));
      setExercises(templateExercises);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const workout: Omit<Workout, 'id'> = {
      date,
      eventType,
      exercises,
      notes: notes.trim() || undefined,
      duration: duration ? parseInt(duration) : undefined,
    };

    onSave(workout);
  };

  const availableTemplates = trainingTemplates.filter(t => 
    t.eventCategory === events[eventType].category
  );

  return (
    <div className="max-w-4xl mx-auto">
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">Log New Workout</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Event Type</label>
              <select
                value={eventType}
                onChange={(e) => setEventType(e.target.value as EventType)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
              >
                {Object.entries(eventCategories).map(([category, label]) => (
                  <optgroup key={category} label={label}>
                    {Object.entries(events)
                      .filter(([, event]) => event.category === category)
                      .map(([key, event]) => (
                        <option key={key} value={key}>{event.name}</option>
                      ))
                    }
                  </optgroup>
                ))}
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Date</label>
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Duration (minutes)</label>
              <input
                type="number"
                value={duration}
                onChange={(e) => setDuration(e.target.value)}
                placeholder="60"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
              />
            </div>
          </div>

          {availableTemplates.length > 0 && (
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">Quick Start Templates</label>
              <div className="flex flex-wrap gap-2">
                {availableTemplates.map((template) => (
                  <button
                    key={template.id}
                    type="button"
                    onClick={() => loadTemplate(template.id)}
                    className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm hover:bg-blue-200 transition-colors duration-200"
                  >
                    {template.name}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Exercises */}
        <div className="space-y-4">
          {exercises.map((exercise) => (
            <div key={exercise.id} className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
              <div className="flex items-center justify-between mb-4">
                <input
                  type="text"
                  value={exercise.name}
                  onChange={(e) => updateExercise(exercise.id, 'name', e.target.value)}
                  placeholder="Exercise name (e.g., 100m Sprint, 400m Repeats)"
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                />
                <button
                  type="button"
                  onClick={() => removeExercise(exercise.id)}
                  className="ml-3 p-2 text-red-600 hover:bg-red-100 rounded-lg transition-colors duration-200"
                >
                  <Trash2 className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-3">
                {exercise.sets.map((set, setIndex) => (
                  <div key={set.id} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                    <span className="text-sm font-medium text-gray-500 w-8">#{setIndex + 1}</span>
                    
                    <div className="flex-1">
                      <input
                        type="text"
                        value={set.unit === 's' ? (set.value || '') : set.value || ''}
                        onChange={(e) => updateSet(exercise.id, set.id, 'value', e.target.value)}
                        placeholder={set.unit === 's' ? '12.34 or 1:23.45' : `0.00`}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                      />
                      <p className="text-xs text-gray-500 mt-1">
                        {set.unit === 's' ? 'Time (seconds or MM:SS.ss)' : `Distance/Height (${set.unit})`}
                      </p>
                    </div>

                    {set.unit === 's' && (
                      <div className="w-20">
                        <input
                          type="number"
                          value={set.rest || ''}
                          onChange={(e) => updateSet(exercise.id, set.id, 'rest', parseInt(e.target.value) || 0)}
                          placeholder="Rest"
                          className="w-full px-2 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 text-sm"
                        />
                        <p className="text-xs text-gray-500 mt-1">Rest (s)</p>
                      </div>
                    )}

                    <button
                      type="button"
                      onClick={() => removeSet(exercise.id, set.id)}
                      className="p-2 text-red-600 hover:bg-red-100 rounded-lg transition-colors duration-200"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
                
                <button
                  type="button"
                  onClick={() => addSet(exercise.id)}
                  className="w-full py-2 border-2 border-dashed border-gray-300 rounded-lg text-gray-600 hover:border-red-300 hover:text-red-600 transition-colors duration-200"
                >
                  Add Set
                </button>
              </div>
            </div>
          ))}

          <button
            type="button"
            onClick={addExercise}
            className="w-full py-4 border-2 border-dashed border-gray-300 rounded-xl text-gray-600 hover:border-red-300 hover:text-red-600 transition-colors duration-200 flex items-center justify-center"
          >
            <Plus className="w-5 h-5 mr-2" />
            Add Exercise
          </button>
        </div>

        {/* Notes */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <label className="block text-sm font-medium text-gray-700 mb-2">Notes</label>
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="How did the workout feel? Weather conditions? Any observations..."
            rows={3}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
          />
        </div>

        {/* Actions */}
        <div className="flex justify-end space-x-3">
          <button
            type="button"
            onClick={onCancel}
            className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors duration-200"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={exercises.length === 0}
            className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors duration-200 flex items-center"
          >
            <Save className="w-4 h-4 mr-2" />
            Save Workout
          </button>
        </div>
      </form>
    </div>
  );
}