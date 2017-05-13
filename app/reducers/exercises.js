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
  let copy = Object.assign({}, state)
  let exercisesCopy = {}

  switch (action.type) {
    case 'ADD_EXERCISES':
      return {
        ...copy,
        [action.entryID]:action.data
      }

    case 'ADD_EXERCISE':
      return {
        ...state,
          [action.entryID] : {
            ...state[action.entryID],
              [action.exerciseID] : {
                ...action.data
              }
          }
      }
      return copy
    case 'REMOVE_EXERCISES':
        return {
          ...removeByKey(state, action.entryID)
        }
    case 'REMOVE_EXERCISE':
      return {
        ...state,
          [action.entryID] : {
            ...removeByKey(state[action.entryID], action.exerciseID)
          }
      }
    case 'PURGE_EXERCISES':
      return {}
    default:
        return state
    }
}

export default exercises
