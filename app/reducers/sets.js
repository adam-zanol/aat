// Controls the state of entryExercises by using id of entry, RELATIONAL
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

const exercises = (state = initialState, action) => {
  switch (action.type) {
    case 'ADD_SET':
      return {
        ...state,
          [action.exerciseID] : {
            ...state[action.exerciseID],
              [action.setID] : {
                ...action.data
              }
          }
      }
    case 'DUPLICATE_SET':
      return {
        ...state,
          [action.exerciseID] : {
            ...state[action.exerciseID],
              [action.setID] : {
                ...action.data
              }
          }
      }
    case 'REMOVE_SET':
      return {
        ...state,
          [action.exerciseID] : {
            ...removeByKey(state[action.exerciseID], action.setID)
          }
      }
    case 'REMOVE_SETS':
      return {
        ...removeByKey(state, action.exerciseID)
      }
    case 'UPDATE_VALUE':
      return {
        ...state,
          [action.exerciseID] : {
            ...state[action.exerciseID],
              [action.setID] : {
                ...state[action.exerciseID][action.setID],
                [action.targetType] : action.value
              }
          }
      }
    case 'PURGE_SETS':
      return {}
    default:
        return state
    }
}

export default exercises
