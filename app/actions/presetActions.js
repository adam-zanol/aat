export const addTag = (tag) => {
  // Add new or update existing
  return {
    type: 'ADD_TAG',
    tag
  }
}

export const removeTag = (tag) => {
  // Remove new or update existing
  return {
    type: 'REMOVE_TAG',
    tag
  }
}
