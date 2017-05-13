export const addWorkout = (workoutInfo) => {
  return {
    type: 'ADD_WORKOUT',
    data: workoutInfo
  }
}

export const removeWorkout= (entryID) => {
  return {
    type: 'REMOVE_ENTRY',
    data: entryID
  }
}
