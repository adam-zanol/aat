import {combineReducers} from 'redux'

import entries from './entries'
import presetWorkouts from './presetWorkouts'
import presetExercises from './presetExercises'
import exercises from './exercises'
import user from './user'
import sets from './sets'
import settings from './settings'
import presets from './presets'

const rootReducer = combineReducers({
  entries,
  presetWorkouts,
  presetExercises,
  exercises,
  sets,
  user,
  settings,
  presets,
})

export default rootReducer
