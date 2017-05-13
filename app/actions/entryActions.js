export const addEntry = (newEntry) => {
  return {
    type: 'ADD_ENTRY',
    data: newEntry
  }
}

export const addExerciseToEntry = (entryID,exerciseID) => {
  return {
    type: 'ADD_EXERCISE_TO_ENTRY',
    entryID,
    exerciseID
  }
}

export const removeEntry = (entryID) => {
  return {
    type: 'REMOVE_ENTRY',
    entryID
  }
}

export const removeExerciseFromEntry = (entryID,exerciseID) => {
  return {
    type: 'REMOVE_EXERCISE_FROM_ENTRY',
    exerciseID,
    entryID
  }
}

export const toggleComplete = (entryID,completed) => {
  return {
    type: 'TOGGLE_COMPLETE',
    entryID,
    completed
  }
}

export const toggleShared = (entryID,shared,date) => {
  return {
    type: 'TOGGLE_SHARED',
    entryID,
    shared,
    date
  }
}

export const updateNotes = (entryID,value) => {
  return {
    type: 'UPDATE_NOTES',
    entryID,
    value
  }
}

export const updateWeight = (entryID,value) => {
  return {
    type: 'UPDATE_WEIGHT',
    entryID,
    value
  }
}

export const updateCalories = (entryID,value) => {
  return {
    type: 'UPDATE_CALORIES',
    entryID,
    value
  }
}

export const purgeEntries = () => {
  return {
    type: 'PURGE_ENTRIES',
  }
}

export const reorderExercise = (entryID,exerciseID,direction) => {
  return {
    type: 'REORDER_EXERCISE',
    entryID,
    exerciseID,
    direction
  }
}
