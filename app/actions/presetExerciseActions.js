export const addPresetExercise = (id,data) => {
  // Add new or update existing
  return {
    type: 'ADD_PRESET_EXERCISE',
    id,
    data
  }
}

export const removePresetExercise = (id) => {
  return {
    type: 'REMOVE_PRESET_EXERCISE',
    id,
    }
}
