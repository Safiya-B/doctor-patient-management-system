const generateTimesArray = (n) => {
  var times = []
  for (var hours = 0; hours < 24; hours++) {
    for (var minutes = 0; minutes < 60; minutes = minutes + n) {
      var h = ""
      var m = ""
      if (hours < 10) {
        h = "0" + hours
      } else {
        h = hours
      }
      if (minutes < 10) {
        m = "0" + minutes
      } else {
        m = minutes
      }
      times.push(h + ":" + m)
    }
  }
  return times
}

export default generateTimesArray
