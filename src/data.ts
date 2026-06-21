/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { WorkoutRoutine, FoodLogItem, Achievement, LeaderboardEntry, WearableDevice } from "./types";

export const INITIAL_LEADERBOARD: LeaderboardEntry[] = [
  { id: "leader-1", name: "David 'Pure Grit'", avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80", points: 2450, streak: 12, workoutsThisWeek: 6 },
  { id: "leader-2", name: "Coach Brad", avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80", points: 2100, streak: 9, workoutsThisWeek: 5 },
  { id: "leader-3", name: "Sarah Spin-Queen", avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150&q=80", points: 1850, streak: 5, workoutsThisWeek: 4 },
  { id: "leader-current", name: "Mouni (You)", avatar: "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=150&q=80", points: 0, streak: 0, workoutsThisWeek: 0, isCurrentUser: true },
  { id: "leader-5", name: "Alexa Core", avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=150&q=80", points: 950, streak: 2, workoutsThisWeek: 2 },
  { id: "leader-6", name: "Leo Flex", avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=150&q=80", points: 700, streak: 1, workoutsThisWeek: 1 },
];

export const INITIAL_ACHIEVEMENTS: Achievement[] = [
  { id: "ach-streak-1", title: "Ignition", description: "Maintain a 3-day workout streak 🔥", icon: "Flame", unlocked: false, progress: 0, target: 3, category: "streak" },
  { id: "ach-streak-5", title: "Dedicated Spirit", description: "Maintain a 5-day active tracking streak", icon: "Calendar", unlocked: false, progress: 0, target: 5, category: "streak" },
  { id: "ach-work-1", title: "First Ascent", description: "Log your first workout routine", icon: "CheckCircle", unlocked: false, progress: 0, target: 1, category: "workouts" },
  { id: "ach-work-10", title: "Iron Disciple", description: "Complete 10 fitness sessions", icon: "Award", unlocked: false, progress: 0, target: 10, category: "workouts" },
  { id: "ach-diet-1", title: "Macro Perfection", description: "Hit your target calories & macros exactly", icon: "Zap", unlocked: false, progress: 0, target: 1, category: "diet" },
  { id: "ach-wearable", title: "Cyborg Status", description: "Connect any wearable smart device", icon: "Activity", unlocked: false, progress: 0, target: 1, category: "social" },
  { id: "ach-share", title: "Lifting Buddies", description: "Share a custom routine or challenge with friends", icon: "Users", unlocked: false, progress: 0, target: 1, category: "social" }
];

export const WEARABLE_TEMPLATES: WearableDevice[] = [
  {
    id: "apple_watch",
    name: "Apple Watch Active",
    icon: "Watch",
    connected: false,
    data: { steps: 8432, caloriesBurned: 420, heartRate: 72, sleepMinutes: 440 }
  },
  {
    id: "fitbit",
    name: "Fitbit Charge 6",
    icon: "Tv",
    connected: false,
    data: { steps: 11250, caloriesBurned: 580, heartRate: 68, sleepMinutes: 460 }
  },
  {
    id: "garmin",
    name: "Garmin Venu 3",
    icon: "Compass",
    connected: false,
    data: { steps: 14200, caloriesBurned: 710, heartRate: 61, sleepMinutes: 490 }
  },
  {
    id: "whoop",
    name: "Whoop Strap 4.0",
    icon: "Smartphone",
    connected: false,
    data: { steps: 9100, caloriesBurned: 390, heartRate: 59, sleepMinutes: 420 }
  }
];

// Dynamically generate workout plans based on experience level and equipment available
export function generateWorkoutPlan(level: string, equipment: string[], goal: string): WorkoutRoutine[] {
  const routines: WorkoutRoutine[] = [];

  const equipmentLabel = equipment.includes("gym") 
    ? "Full Gym Equipment" 
    : equipment.includes("dumbbells") 
      ? "Dumbbells Only" 
      : "Bodyweight Only";

  if (goal === "lose_fat") {
    routines.push({
      id: "fat-shred-1",
      title: "Lazy Zone Metabolic Fire",
      description: `A fast-paced Fat Burning schedule customized for ${level} utilizing ${equipmentLabel}.`,
      equipmentRequired: equipment.length > 0 ? equipment : ["bodyweight"],
      difficulty: level as any,
      exercises: [
        { id: "e1", name: equipment.includes("gym") ? "Barbell Back Squats" : "Goblet Squats", sets: 4, reps: 12, weight: level === "fresher" ? 15 : 45, completed: false, category: "legs" },
        { id: "e2", name: "Bodyweight Pushups", sets: 3, reps: level === "experienced" ? 20 : 12, completed: false, category: "chest" },
        { id: "e3", name: "Dumbbell goblet lunges", sets: 3, reps: 10, completed: false, category: "legs" },
        { id: "e4", name: "Kettlebell or Dumbbell Swings", sets: 4, reps: 15, completed: false, category: "cardio" },
        { id: "e5", name: "Plank Hold", sets: 3, reps: 45, completed: false, category: "core" }
      ]
    });

    routines.push({
      id: "fat-shred-2",
      title: "HIIT Core Burner",
      description: "Explosive interval cardio to raise heart rate and target abdominal definition.",
      equipmentRequired: ["bodyweight"],
      difficulty: level as any,
      exercises: [
        { id: "e2-1", name: "Jumping Jacks", sets: 4, reps: 40, completed: false, category: "cardio" },
        { id: "e2-2", name: "Mountain Climbers", sets: 3, reps: 30, completed: false, category: "core" },
        { id: "e2-3", name: "Burpees", sets: 3, reps: 10, completed: false, category: "cardio" },
        { id: "e2-4", name: "Bicycle Crunches", sets: 3, reps: 20, completed: false, category: "core" }
      ]
    });
  } else if (goal === "build_muscle") {
    routines.push({
      id: "hyper-1",
      title: "Upper Body Hypertrophy",
      description: `Targeting chest, back, and arms. Custom ${level} plan for major gains using ${equipmentLabel}.`,
      equipmentRequired: equipment,
      difficulty: level as any,
      exercises: [
        { id: "b1", name: equipment.includes("gym") ? "Flat Barbell Bench Press" : "Dumbbell Floor Press", sets: 4, reps: 8, weight: level === "fresher" ? 12 : 60, completed: false, category: "chest" },
        { id: "b2", name: equipment.includes("gym") ? "Lat Pulldowns" : "Dumbbell Bent-Over Rows", sets: 4, reps: 10, weight: level === "fresher" ? 10 : 24, completed: false, category: "back" },
        { id: "b3", name: "Seated Dumbbell Shoulder Press", sets: 3, reps: 10, weight: level === "fresher" ? 6 : 16, completed: false, category: "shoulders" },
        { id: "b4", name: "Incline Dumbbell Bicep Curls", sets: 3, reps: 12, weight: 8, completed: false, category: "arms" },
        { id: "b5", name: "Tricep Overhead Extensions", sets: 3, reps: 12, completed: false, category: "arms" }
      ]
    });

    routines.push({
      id: "hyper-2",
      title: "Lower Body Power Sweep",
      description: "Bulking legs with high muscular tension squats and deadlift patterns.",
      equipmentRequired: equipment,
      difficulty: level as any,
      exercises: [
        { id: "b2-1", name: equipment.includes("gym") ? "Barbell Deadlifts" : "Dumbbell Romanian Deadlifts", sets: 4, reps: 6, weight: level === "fresher" ? 30 : 80, completed: false, category: "legs" },
        { id: "b2-2", name: "Walking Lunges", sets: 3, reps: 12, completed: false, category: "legs" },
        { id: "b2-3", name: "Calf Raises", sets: 4, reps: 15, completed: false, category: "legs" }
      ]
    });
  } else {
    // Endurance or maintain
    routines.push({
      id: "endure-1",
      title: "Athletic Conditioning Circuit",
      description: `Optimizing lung capacity and muscular endurance for ${level} athletes using ${equipmentLabel}.`,
      equipmentRequired: equipment,
      difficulty: level as any,
      exercises: [
        { id: "c1", name: "Thrusters", sets: 4, reps: 15, weight: 12, completed: false, category: "cardio" },
        { id: "c2", name: "Renegade Rows", sets: 3, reps: 12, completed: false, category: "back" },
        { id: "c3", name: "Jump Squats", sets: 4, reps: 15, completed: false, category: "legs" },
        { id: "c4", name: "Russian Twists", sets: 3, reps: 30, completed: false, category: "core" }
      ]
    });
  }

  return routines;
}

// Dynamically generate personalized diet advice based on profile statistics
export function generateDietProfile(goal: string, dietPref: string, weightKg: number) {
  let multiplier = 30; // base calories multiplier
  let proteinRatio = 2.0; // g per kg of bodyweight
  let fatRatio = 0.8; // g per kg of bodyweight

  if (goal === "lose_fat") {
    multiplier = 24;
    proteinRatio = 2.2;
    fatRatio = 0.7;
  } else if (goal === "build_muscle") {
    multiplier = 36;
    proteinRatio = 2.4;
    fatRatio = 0.9;
  } else if (goal === "endurance") {
    multiplier = 32;
    proteinRatio = 1.8;
    fatRatio = 0.8;
  }

  if (dietPref === "keto") {
    proteinRatio = 2.0;
    fatRatio = 1.8;
  }

  const calories = Math.round(weightKg * multiplier);
  const proteinGrams = Math.round(weightKg * proteinRatio);
  const fatGrams = Math.round(weightKg * fatRatio);
  // Remainder as carbohydrates
  const proteinCals = proteinGrams * 4;
  const fatCals = fatGrams * 9;
  const carbsCals = Math.max(20 * 4, calories - (proteinCals + fatCals));
  const carbsGrams = Math.round(carbsCals / 4);

  // Recommendations
  let breakfastSuggestions = [
    { name: "Egg White Veggie Scramble with Rye Toast", cal: 350, p: 28, c: 35, f: 10 },
    { name: "Greek Yogurt Bowl with Chia & Raspberries", cal: 280, p: 24, c: 22, f: 6 }
  ];
  let lunchSuggestions = [
    { name: "Grilled Chicken Breast with Brown Rice & Broccoli", cal: 520, p: 44, c: 55, f: 11 },
    { name: "Zesty Lemon Salmon Quinoa Salad", cal: 580, p: 38, c: 45, f: 18 }
  ];
  let dinnerSuggestions = [
    { name: "Lean Sirloin Tip Steak with Sweet Potato Fries", cal: 620, p: 46, c: 48, f: 17 },
    { name: "Baked Turkey Meatballs on Zucchini Noodles", cal: 450, p: 36, c: 22, f: 14 }
  ];

  if (dietPref === "vegetarian" || dietPref === "vegan") {
    breakfastSuggestions = [
      { name: "Tempeh Scramble with Avocado & Sprouted Tortilla", cal: 380, p: 25, c: 30, f: 16 },
      { name: "High-Protein Organic Hemp Seed Oatmeal", cal: 310, p: 18, c: 42, f: 9 }
    ];
    lunchSuggestions = [
      { name: "Spicy Chickpea Tahini bowl with Roasted Cauliflower", cal: 490, p: 20, c: 64, f: 14 },
      { name: "Lentil Pasta Primavera with nutritional yeast", cal: 510, p: 28, c: 74, f: 5 }
    ];
    dinnerSuggestions = [
      { name: "Glazed Organic Grilled Tofu Slabs with Quinoa Medley", cal: 530, p: 26, c: 58, f: 13 },
      { name: "Black Bean Sweet Potato Patty over Wilted Greens", cal: 465, p: 18, c: 68, f: 11 }
    ];
  } else if (dietPref === "keto") {
    breakfastSuggestions = [
      { name: "Bacon & Cheddar 3-Egg Omelet cooked in Butter", cal: 510, p: 32, c: 3, f: 42 },
      { name: "Avocado Keto Smoothie with MCT Oil & Whey", cal: 420, p: 20, c: 5, f: 36 }
    ];
    lunchSuggestions = [
      { name: "Keto Caesar Salad with Double Grilled Chicken & Avocado", cal: 640, p: 42, c: 6, f: 51 },
      { name: "Pan-fried Butter Salmon Ribbons on Spinach Bed", cal: 590, p: 35, c: 4, f: 48 }
    ];
    dinnerSuggestions = [
      { name: "Ribeye Steak with Garlic Herb Compound Butter", cal: 740, p: 48, c: 1, f: 62 },
      { name: "Bacon Wrapper Cheddar Stuffed Beef Burgers (no bun)", cal: 680, p: 41, c: 2, f: 56 }
    ];
  }

  return {
    calories,
    macros: {
      protein: proteinGrams,
      carbs: carbsGrams,
      fat: fatGrams
    },
    breakfastSuggestions,
    lunchSuggestions,
    dinnerSuggestions
  };
}

export const DEFAULT_MEAL_LOGS: FoodLogItem[] = [
  { id: "f1", name: "High-Protein Oatmeal", calories: 340, protein: 25, carbs: 45, fat: 6, mealType: "breakfast", date: new Date().toISOString().split("T")[0] },
  { id: "f2", name: "Spiced Chicken breast & Quinoa", calories: 510, protein: 42, carbs: 50, fat: 9, mealType: "lunch", date: new Date().toISOString().split("T")[0] }
];
