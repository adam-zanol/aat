export const addSet = (data,setID,exerciseID) => {
  return {
    type: 'ADD_SET',
    exerciseID,
    setID,
    data
  }
}

export const duplicateSet = (data,setID,exerciseID) => {
  return {
    type: 'DUPLICATE_SET',
    exerciseID,
    setID,
    data
  }
}

export const removeSet = (exerciseID,setID) => {
  return {
    type: 'REMOVE_SET',
    exerciseID,
    setID
  }
}

export const updateSet = (exerciseID,setID,data) => {
  return {
    type: 'UPDATE_SET',
    exerciseID,
    setID,
    data,
  }
}

export const updateSetValue = (exerciseID,setID,targetType,value) => {
  return {
    type: 'UPDATE_VALUE',
    exerciseID,
    setID,
    targetType,
    value,
  }
}

export const removeSets = (exerciseID) => {
  return {
    type: 'REMOVE_SETS',
    exerciseID,
  }
}

export const purgeSets = () => {
  return {
    type: 'PURGE_SETS',
  }
}
