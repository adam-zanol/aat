const initialState = {
  uid: false
}

const user = (state = initialState, action) => {
  switch (action.type) {
    case 'SET_USER_ID':
      return {
        ...state,
          uid:action.uid
      }
    case 'SET_EMAIL':
      return {
        ...state,
          email:action.email
      }
    case 'SET_ACTIVITY_COUNT':
      return {
        ...state,
          activityCount: action.count
      }
    case 'SET_WORKOUT_COUNT':
      return {
        ...state,
          workoutCount: action.count
      }
    case 'SET_FOLLOWING_COUNT':
      return {
        ...state,
          followingCount: action.count
      }
    case 'UPDATE_FOLLOWING_COUNT':
      return {
        ...state,
          followingCount: state.followingCount + action.count
      }
    case 'SET_FOLLOWERS_COUNT':
      return {
        ...state,
          followersCount: action.count
      }
    case 'CLEAR_USER_INFO': {
      return {
        email: state.email
      }
    }
    default:
      return state
  }
}

export default user
