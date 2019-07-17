require('dotenv').config()
process.env.TZ = 'America/New_York'
const express = require('express')
const MessagingResponse = require('twilio').twiml.MessagingResponse
const bodyParser = require('body-parser')
const { PORT, VALID_NUMBERS } = require('./src/constants.js')
const cron = require('./src/cron')
const messenger = require('./src/messenger')
const app = express()
const numRegEx = new RegExp(VALID_NUMBERS.split(',').join('|'))

// Start cron tasks (sending messages at 10/10)
cron.startCron()

app.use(bodyParser.urlencoded({ extended: false }))

const validateFromNumber = (num) => {
  const numAsStr = num.toString()
  return numRegEx.test(numAsStr)
}

app.post('/', (req, res) => {
  const twiml = new MessagingResponse()
  const msg = req.body.Body
  const fromNumber = req.body.From
  const isValid = validateFromNumber(fromNumber)

  console.log(req.body)
  if (!msg || !isValid) {
    return res.status(400).send()
  }

  const response = messenger.responseDispatcher(msg)
  console.log(response)

  twiml.message(response)
  res.status(200).type('text/xml').send(twiml.toString())
})

app.listen(PORT, () => {
  console.log(`Express server listening on port ${PORT}`)
})
