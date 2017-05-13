import _ from 'lodash'

const initialState = {}

function removeByKey (myObj, deleteKey) {
  return Object.keys(myObj)
    .filter(key => key !== deleteKey)
    .reduce((result, current) => {
      result[current] = myObj[current]
      return result;
  }, {})
}

// TODO clean this up
function move(array, from, to) {
  if ( to === from  || to === -1 || to >  array.length-1)
  return array

  var target = array[from]
  var increment = to < from ? -1 : 1

  for(var k = from; k != to; k += increment){
    array[k] = array[k + increment]
  }
  array[to] = target
  return array
}

const entries = (state = initialState, action) => {
  let newExercises
  switch (action.type) {
    case 'ADD_ENTRY':
      return {
        ...state,
        [action.data.id]:action.data
      }
    case 'REMOVE_ENTRY':
      return {
        ...removeByKey(state, action.entryID)
      }
      return copy
    case 'TOGGLE_COMPLETE':
      return {
        ...state,
          [action.entryID]: {
            ...state[action.entryID],
              completed: !action.completed
          }
      }
    case 'TOGGLE_SHARED':
      return {
        ...state,
          [action.entryID] : {
            ...state[action.entryID],
              shared: action.shared,
              dateShared: action.date
          }
      }
    case 'UPDATE_NOTES':
      return {
        ...state,
          [action.entryID] : {
            ...state[action.entryID],
              notes: action.value
          }
      }
    case 'UPDATE_CALORIES':
      return {
        ...state,
          [action.entryID] : {
            ...state[action.entryID],
              calories: action.value
          }
      }
    case 'UPDATE_WEIGHT':
      return {
        ...state,
          [action.entryID] : {
            ...state[action.entryID],
              weight: action.value
          }
      }
    case 'REMOVE_EXERCISE_FROM_ENTRY':
      newExercises = state[action.entryID].exercises.filter(item => item !== action.exerciseID)
      return {
        ...state,
          [action.entryID] : {
            ...state[action.entryID],
              exercises: newExercises
          }
      }
    case 'ADD_EXERCISE_TO_ENTRY':
      newExercises = state[action.entryID].exercises ? state[action.entryID].exercises : new Array()
      newExercises.push(action.exerciseID)
        return {
          ...state,
            [action.entryID] : {
              ...state[action.entryID],
                exercises: newExercises
            }
        }

    case 'REORDER_EXERCISE':
      let exercises = state[action.entryID].exercises ? state[action.entryID].exercises : new Array()
      let exerciseIndex = exercises.indexOf(action.exerciseID)
      newExercises = move(exercises,exerciseIndex,action.direction == 'down' ? exerciseIndex+1 : exerciseIndex-1)
      return {
        ...state,
          [action.entryID] : {
            ...state[action.entryID],
              exercises: newExercises
          }
      }

    case 'PURGE_ENTRIES':
      return {}
    default:
      return state
  }
}

export default entries
