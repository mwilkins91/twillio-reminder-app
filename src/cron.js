const cron = require('node-cron')
const cronParser = require('cron-parser').parseExpression
const messenger = require('./messenger')
const CRON_TIME_SETTING = '0 10,22 * * *' // <-- Every day at 10am and 10pm

module.exports = {
  logNextCronTask: () => {
    const interval = cronParser(CRON_TIME_SETTING)
    console.log('Next reminder to be sent: ' + interval.next().toString())
  },
  startCron () {
    this.logNextCronTask()
    cron.schedule(CRON_TIME_SETTING, () => {
      messenger.sendReminder()
      console.log('Reminder Sent!')
      this.logNextCronTask()
    }, true)
  }
}
