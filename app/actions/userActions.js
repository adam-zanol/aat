export const setUserID = (uid) => {
  return {
    type: 'SET_USER_ID',
    uid
  }
}

export const setEmail = (email) => {
  return {
    type: 'SET_EMAIL',
    email
  }
}

export const setActivityCount = (count) => {
  return {
    type: 'SET_ACTIVITY_COUNT',
    count
  }
}

export const setWorkoutCount = (count) => {
  return {
    type: 'SET_WORKOUT_COUNT',
    count
  }
}

export const setFollowingCount = (count) => {
  return {
    type: 'SET_FOLLOWING_COUNT',
    count
  }
}

// Subtracts or adds 1 to following count
export const updateFollowingCount = (count) => {
  return {
    type: 'UPDATE_FOLLOWING_COUNT',
    count
  }
}

export const setFollowersCount = (count) => {
  return {
    type: 'SET_FOLLOWERS_COUNT',
    count
  }
}

export const clearUserInfo = () => {
  return {
    type: 'CLEAR_USER_INFO'
  }
}
