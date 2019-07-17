const { ACCOUNT_SID, TOKEN, TWILLIO_PHONE_NUMBER, TARGET_PHONE_NUMBER } = require('./constants')
const client = require('twilio')(ACCOUNT_SID, TOKEN)

const sentMessageToTargetNumber = (msg) => new Promise((resolve, reject) => {
  client.messages
    .create({
      from: TWILLIO_PHONE_NUMBER,
      to: TARGET_PHONE_NUMBER,
      body: msg
    })
    .then(resolve)
    .catch(reject)
    .done()
})

module.exports = {
  sentMessageToTargetNumber
}
