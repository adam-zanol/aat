const initialState = {
  units: 'Imperial',
  entryIntroSeen: false,
  createIntroSeen: false,
  hideSocialTab: false,
  uid: null,
}

const settings = (state = initialState, action) => {
  let copy = Object.assign({}, state)
  switch (action.type) {
    case 'TOGGLE_SOCIAL_TAB_VISIBILITY':
      return {
        ...state,
          hideSocialTab: action.isVisible
      }
    case 'SET_UNITS':
      return {
        ...state,
          units: action.unitType
      }
    default:
      return state
  }
}

export default settings
