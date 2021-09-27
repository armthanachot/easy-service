const genCode = () => {
  return `${Math.round(Math.random() * 1e9)}`
}
const findOne = async (object) => {
  return (await object[0]) || {}
}
const removeUselessKey = async (obj: object, keys: string[]) => {
  return await keys.forEach((key) => delete obj[key])
}

export { genCode, findOne, removeUselessKey }
