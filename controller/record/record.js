const { record } = require('../../models');
const { habits } = require('../../models');
const moment = require('moment');

const get = (req, res) => {
  const { habitId } = req.body;
  const { id } = req.decoded;
  record
    .findAll({
      where: {
        habitId: habitId,
      },
      include: [
        {
          model: habits,
          where: { userId: id },
        },
      ],
    })
    .then((data) => {
      if (data && data.length > 0) {
        return res.status(200).json(data);
      } else {
        return res.status(403).send('there is no records');
      }
    })
    .catch((err) => {
      console.log(err);
      res.sendStatus(500);
    });
};

const post = (req, res) => {
  const { habitId, completed } = req.body;
  let today = moment().format('YYYY-MM-DD');
  record
    .update(
      { completed: completed },
      {
        where: {
          date: today,
          habitId: habitId,
        },
      }
    )
    .then(() => {
      res.status(200).send('succeed update habit info');
    });
};

const addRecord = (
  // add Habit했을 때 오늘 기록, 접속했을 때 날짜 계산해서 최근날짜부터 오늘까지 기록
  habitId,
  completed = false,
  date = moment().format('YYYY-MM-DD')
) => {
  return new Promise((resolve, reject) => {
    record
      .create({
        date: date,
        completed: completed,
        habitId: habitId,
      })
      .then(async (record) => {
        const data = await record.get({ plain: true });
        resolve(data);
      })
      .catch((err) => {
        reject(err);
      });
  });
};

const syncRecord = (userId) => {
  habits.findAll({ where: { userId: userId } }).then((data) => {
    if (data && data.length > 0) {
      const today = moment().format('YYYY-MM-DD');
      data.forEach((ele) => {
        record.max('date', { where: { habitId: ele.id } }).then(async (max) => {
          if (max !== today) {
            let diff = moment(today).diff(max, 'days');
            for (let i = 1; i <= diff; i++) {
              await addRecord(
                ele.id,
                false,
                moment(max).add(i, 'days').format('YYYY-MM-DD')
              );
            }
          }
        });
      });
    }
  });
};

module.exports = {
  get: get,
  post: post,
  addRecord: addRecord,
  syncRecord: syncRecord,
};
