import _ from 'lodash'


const initialState = {
  "preset0001" : {
    "name" : "Front Dumbbell Raise",
    "type" : "strength",
    "sets" : {},
    "tags" : ['shoulders','dumbbell']
  },
  "preset0002" : {
    "name" : "Lateral Dumbbell Raise",
    "type" : "strength",
    "sets" : {},
    "tags" : ['shoulders','dumbbell']
  },
  "preset0003" : {
    "name" : "Face Pull",
    "type" : "strength",
    "sets" : {},
    "tags" : ['shoulders','dumbbell','rear delts']
  },
  "preset0004" : {
    "name" : "Arnold Press",
    "type" : "strength",
    "sets" : {},
    "tags" : ['shoulders','dumbbell']
  },
  "preset0005" : {
    "name" : "Reverse Pec Deck",
    "type" : "strength",
    "sets" : {},
    "tags" : ['shoulders','dumbbell','rear delts']
  },
  "preset0006" : {
    "name" : "Cable Lateral Raise",
    "type" : "strength",
    "sets" : {},
    "tags" : ['shoulders','cable']
  },
  "preset0007" : {
    "name" : "Overhead Press",
    "type" : "strength",
    "sets" : {},
    "tags" : ['shoulders','dumbbell']
  },
  "preset0008" : {
    "name" : "Dumbbell Bicep Curls",
    "type" : "strength",
    "sets" : {},
    "tags" : ['bicep','dumbbell']
  },
  "preset0009" : {
    "name" : "Bench Press",
    "type" : "strength",
    "sets" : {},
    "tags" : ['chest','triceps','barbell']
  },
  "preset0010" : {
    "name" : "Skull Crusher",
    "type" : "strength",
    "sets" : {},
    "tags" : ['barbell','triceps'],
  },
  "preset0011" : {
    "name" : "Tricep Extension",
    "type" : "strength",
    "sets" : {},
    "tags" : ['dumbbell','triceps'],
  },
  "preset0012" : {
    "name" : "Leg Press",
    "type" : "strength",
    "sets" : {},
    "tags" : ['machine','legs'],
  },
  "preset0013" : {
    "name" : "Squat",
    "type" : "strength",
    "sets" : {},
    "tags" : ['barbell','legs'],
  },
  "preset0014" : {
    "name" : "Split Squat",
    "type" : "strength",
    "sets" : {},
    "tags" : ['barbell'],
  },
  "preset0015" : {
    "name" : "Barbell Curl",
    "type" : "strength",
    "sets" : {},
    "tags" : ['barbell','biceps'],
  },
  "preset0016" : {
    "name" : "Hammer Curl",
    "type" : "strength",
    "sets" : {},
    "tags" : ['dumbbell','biceps','forearms'],
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

const presetExercises = (state = initialState, action) => {

  switch (action.type) {
    case 'ADD_PRESET_EXERCISE':
      return {
        ...state,
          [action.id] : {
            ...action.data
          }
      }
    case 'REMOVE_PRESET_EXERCISE':
      return {...removeByKey(state, action.id)}
    default:
      return state
  }
}

export default presetExercises
