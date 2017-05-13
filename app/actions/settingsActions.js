export const toggleSocialTabVisibility = (isVisible) => {
  return {
    type: 'TOGGLE_SOCIAL_TAB_VISIBILITY',
    isVisible
  }
}

export const setUnits = (unitType) => {
  return {
    type: 'SET_UNITS',
    unitType
  }
}
