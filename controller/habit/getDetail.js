const { record } = require('../../models');
const moment = require('moment');

module.exports = {
  get: async (req, res) => {
    let responseArr = [];
    const habitId = req.query.habitId;

    const today = moment().format('YYYY-MM-DD');
    const dateArr = today.split('-'); // ['2020', '05', '25']
    const startDate = moment([dateArr[0], dateArr[1] - 1]);
    const diff = moment(today).diff(startDate, 'days');
    try {
      for (let i = 0; i <= diff; i++) {
        let compareDate = moment(startDate).add(i, 'days').format('YYYY-MM-DD');
        let result = await getHabitMonthly(habitId, compareDate);
        responseArr.push(result);
      }
      res.status(200).send(responseArr);
    } catch (err) {
      res.sendStatus(500);
    }
  },
};

function getHabitMonthly(habitId, date) {
  return new Promise((resolve, reject) => {
    record
      .findOne({
        where: { habitId: habitId, date: date },
        raw: true,
      })
      .then((data) => {
        if (data) {
          if (data.completed) {
            return resolve(true);
          }
        }
        return resolve(false);
      })
      .catch((err) => {
        console.log(err);
        return reject(err);
      });
  });
}
