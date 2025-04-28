const moment = require("moment")

const validDate = (date) => {
  if (!moment(date, "DD-MM-YYYY", true).isValid())
    throw new Error("Invalid date")
  return true
}

const validTime = (time) => {
  let isValid = /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/.test(time)
  if (!isValid) throw new Error("Invalid time")

  return true
}

module.exports = { validDate, validTime }
