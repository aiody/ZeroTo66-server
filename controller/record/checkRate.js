const { record } = require('../../models');
const { habits } = require('../../models');
const moment = require('moment');

module.exports = {
  getMonthly: async (req, res) => {
    const { id } = req.decoded;
    const thisM = req.body.thisMonth || moment().format('MM');
    const thisY = req.body.thisYear || moment().format('YYYY');
    let responseData = { done_all: [], done_partially: [] };
    let lastDate = parseInt(
      moment(getDateRange(thisY, thisM).end).format('DD')
    );

    try {
      for (let i = 0; i < lastDate; i++) {
        let compareDate = moment(
          getDateRange(thisY, thisM).start.format('YYYY-MM-DD')
        )
          .add(i, 'days')
          .format('YYYY-MM-DD');

        let arr = await getDaily(compareDate, id);
        let completeArr = arr.filter((val) => {
          if (val.completed) return true;
        });
        if (arr.length > 0 && arr.length === completeArr.length) {
          responseData.done_all.push(compareDate);
        } else if (arr.length > 0) {
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
    start: startDate,
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
            where: { userId: id },
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
