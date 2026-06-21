/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  phone: string;
  avatarUrl: string;
  onboarded: boolean;
  weight: number; // in kg
  height: number; // in cm
  age: number;
  gender: string;
  goal: 'lose_fat' | 'build_muscle' | 'maintain' | 'endurance';
  dietPreference: 'balanced' | 'high_protein' | 'low_carb' | 'vegetarian' | 'vegan' | 'keto';
  activityLevel: 'sedentary' | 'lightly_active' | 'moderately_active' | 'very_active';
  experienceLevel: 'fresher' | 'intermediate' | 'experienced';
  equipment: string[]; // ['gym', 'dumbbells', 'resistance_bands', 'bodyweight']
  dailyCaloriesTarget: number;
  dailyProteinTarget: number;
  dailyCarbsTarget: number;
  dailyFatTarget: number;
  remindersEnabled: boolean;
  reminderChannel: 'email' | 'phone' | 'both';
  reminderTimeMeal: string; // "08:00"
  reminderTimeWorkout: string; // "18:00"
  occupation: string; // E.g., 'Software Engineer', 'Student', etc.
  countryStyle: string;
  language?: string; // Explicit language selection decoupled from country Style
  lastLoginDate?: string; // ISO date string for login reminder checks
  lastRoutineCompletionDate?: string; // ISO date string of the last completed workout day
}

export interface Exercise {
  id: string;
  name: string;
  sets: number;
  reps: number;
  weight?: number; // in kg
  completed: boolean;
  category: string; // 'chest', 'back', 'legs', 'shoulders', 'arms', 'core', 'cardio'
}

export interface WorkoutRoutine {
  id: string;
  title: string;
  description: string;
  equipmentRequired: string[];
  difficulty: 'fresher' | 'intermediate' | 'experienced';
  exercises: Exercise[];
  sharedBy?: string; // name of friend if shared
}

export interface LoggedWorkout {
  id: string;
  routineId: string;
  title: string;
  durationMinutes: number;
  caloriesBurned: number;
  date: string; // YYYY-MM-DD
  exercises: Exercise[];
}

export interface FoodLogItem {
  id: string;
  name: string;
  calories: number;
  protein: number; // g
  carbs: number; // g
  fat: number; // g
  mealType: 'breakfast' | 'lunch' | 'dinner' | 'snack';
  date: string;
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string; // lucide icon name
  unlocked: boolean;
  progress: number;
  target: number;
  category: 'streak' | 'workouts' | 'diet' | 'weight' | 'social';
  unlockedAt?: string;
}

export interface LeaderboardEntry {
  id: string;
  name: string;
  avatar: string;
  points: number;
  streak: number;
  workoutsThisWeek: number;
  isCurrentUser?: boolean;
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'assistant';
  content: string;
  timestamp: string;
}

export interface WearableDevice {
  id: string;
  name: string;
  icon: string;
  connected: boolean;
  lastSync?: string;
  data: {
    steps: number;
    caloriesBurned: number;
    heartRate: number;
    sleepMinutes: number;
  };
}
