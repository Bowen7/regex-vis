export const removeFields = (target: any, fields: string[]) => {
  if (Array.isArray(target)) {
    target.forEach((item) => removeFields(item, fields))
  } else if ({}.toString.call(target) === "[object Object]") {
    Object.keys(target).forEach((key) => {
      if (fields.includes(key)) {
        delete target[key]
      } else {
        removeFields(target[key], fields)
      }
    })
  }
  return target
}
