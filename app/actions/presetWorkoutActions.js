export const addPresetWorkout = (id,data) => {
  // Add new or update existing
  return {
    type: 'ADD_PRESET_WORKOUT',
    id,
    data
  }
}

export const replaceWorkoutExercises = (id,data) => {
  return {
    type: 'REPLACE_WORKOUT_EXERCISES',
    id,
    data
  }
}

export const deleteWorkout = (id) => {
  return {
    type: 'DELETE_WORKOUT',
    id,
  }
}
