const twilio = require('./twilio')
const retrier = require('./retrier')

const REMINDER_INTERVAL = 1 // minutes;

const getSeconds = (numberOfSeconds) => numberOfSeconds * 1000

const getMinutes = (numberOfMinutes) => numberOfMinutes * getSeconds(60)

const sendReminder = async () => {
  try {
    const msgResult = await twilio.sentMessageToTargetNumber(`Hi! It's Mark-bot sending you a reminder! Its time to take your pills! Have you taken them yet?`)
    retrier.retry(sendReminder, getMinutes(REMINDER_INTERVAL))
    return msgResult
  } catch (err) {
    console.log('Failed to send reminder!', err)
    return err
  }
}

const handleYes = () => {
  retrier.clearRetry()
  return `Okay great! I won't bug you about it for a while.`
}

const handleNo = () => {
  retrier.retry(sendReminder, getMinutes(REMINDER_INTERVAL))
  return `Thats not good! I will remind you again in a few minutes.`
}

const handleUnknown = () => {
  return `Sorry, I only understand "yes" and "no". Please try again.`
}

/**
 *
 * @param {string} responseMsg
 */
const responseDispatcher = (responseMsg) => {
  const normalizedMsg = responseMsg.toLowerCase().trim()
  console.log(normalizedMsg)
  switch (normalizedMsg) {
    case 'yes':
      return handleYes()
    case 'no':
      return handleNo()
    default:
      return handleUnknown()
  }
}

module.exports = {
  sendReminder,
  responseDispatcher
}
