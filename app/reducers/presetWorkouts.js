const initialState =  {
      "-KUTM_WQlVSLfKuI0yGO" : {
        "name": "Chest & Abs",
        "exercises" : {
          "-KUUU0Ded4vAMJBJkw5C" : {
            "name" : "Dumbbell Bicep Curls",
            "type" : "strength",
            "sets": {},
          },
          "-KV8oTdGSPw2Ath9m2Nc" : {
            "name" : "Hammer Strength Incline Press",
            "type" : "strength",
            "sets" : {},
        },
          "-KV8oTdGSfsdfasdf" : {
            "name" : "Running",
            "type" : "cardio",
            "sets" : {},
        },
      }
    }
  }

function removeByKey (myObj, deleteKey) {
  return Object.keys(myObj)
    .filter(key => key !== deleteKey)
    .reduce((result, current) => {
      result[current] = myObj[current]
      return result;
  }, {})
}

const presetWorkouts = (state = initialState, action = {}) => {
  switch (action.type) {
    case 'ADD_PRESET_WORKOUT':
      return {
        ...state,
          [action.id] : {
            ...action.data
          }
      }
    case 'DELETE_WORKOUT':
      return {...removeByKey(state,action.id)}
    case 'UPDATE_WORKOUT':
      return state
    default:
      return state
  }
}

export default presetWorkouts
