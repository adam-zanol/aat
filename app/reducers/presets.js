import _ from 'lodash'


const initialState = {
  tags: [
    {
      name:'barbell',
      count: 1
    },
    {
      name:'back',
      count: 1
    },
    {
      name:'dumbbell',
      count: 1
    },
    {
      name:'chest',
      count: 1
    },
    {
      name:'shoulders',
      count: 1
    },
  ]
}

const presets = (state = initialState, action) => {
  switch (action.type) {
    case 'ADD TAG':
      return {
        ...state,
          ['tags'] : {
            ...state['tags'],
            [action.tag]: action.tag
          }
      }
    default:
      return state
  }
}


export default presets
