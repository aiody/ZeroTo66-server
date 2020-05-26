const { record } = require('../../models');
const { habits } = require('../../models');
const moment = require('moment');

module.exports = {
  getMonthly: async (req, res) => {
    const { id } = req.decoded;
    const thisMonth = req.query.month || moment().format('MM');
    const thisYear = req.query.year || moment().format('YYYY');

    let responseData = { done_all: [], done_partially: [] };
    let lastDate = moment(getDateRange(thisYear, thisMonth).end).format('DD');
    let startDate = getDateRange(thisYear, thisMonth).start;
    try {
      for (let i = 0; i < parseInt(lastDate); i++) {
        let compareDate = moment(startDate).add(i, 'days').format('YYYY-MM-DD');
        let arr = await getDaily(compareDate, id);

        let completeArr = arr.filter((val) => {
          if (val.completed) return true;
        });
        if (arr.length > 0 && arr.length === completeArr.length) {
          responseData.done_all.push(compareDate);
        } else if (
          arr.length > 0 &&
          arr.length > completeArr.length &&
          completeArr.length > 0
        ) {
          responseData.done_partially.push(compareDate);
        }
      }
      res.status(200).json(responseData);
    } catch (err) {
      console.log(err);
      res.sendStatus(500);
    }
  },
};

function getDateRange(year, month) {
  let startDate = moment([year, month - 1]);
  let endDate = moment(startDate).endOf('month');
  return {
    start: startDate.format('YYYY-MM-DD'),
    end: endDate,
  };
}

function getDaily(date, id) {
  return new Promise((resolve, reject) => {
    record
      .findAll({
        where: {
          date: date,
        },
        include: [
          {
            model: habits,
            where: { userId: id, completeDate: null },
          },
        ],
        raw: true,
      })
      .then((data) => {
        resolve(data);
      })
      .catch((err) => {
        console.log(err);
        reject(err);
      });
  });
}
