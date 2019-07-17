
let timerId = null

module.exports = {
  retry (func, timeout) {
    if (timerId) {
      clearTimeout(timerId)
    }

    timerId = setTimeout(func, timeout)
  },
  clearRetry () {
    if (timerId) {
      clearTimeout(timerId)
    }
  }
}
