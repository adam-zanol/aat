export const addExercises = (exercises,entryID) => {
  return {
    type: 'ADD_EXERCISES',
    data: exercises,
    entryID: entryID,
  }
}

export const addExercise = (data,exerciseID,entryID) => {
  return {
    type: 'ADD_EXERCISE',
    data: data,
    exerciseID,
    entryID,
  }
}

export const removeExercises = (entryID) => {
  return {
    type: 'REMOVE_EXERCISES',
    entryID
  }
}

export const removeExercise = (entryID,exerciseID) => {
  return {
    type: 'REMOVE_EXERCISE',
    exerciseID,
    entryID
  }
}

export const purgeExercises = () => {
  return {
    type: 'PURGE_EXERCISES',
  }
}
