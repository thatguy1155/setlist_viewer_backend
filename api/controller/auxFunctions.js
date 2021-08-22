export const searchString = (entry) => {
  const songArr = entry.split(' ')
  const queryString = songArr.join('|')
  return queryString
}