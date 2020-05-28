const { record } = require('../../models');
const { habits } = require('../../models');
const sequelize = require('sequelize');
const Op = sequelize.Op;
const moment = require('moment');
const dayOfWeek = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

// 미사용중
const get = (req, res) => {
  const { habitId } = req.body;
  const { id } = req.decoded;
  let today = moment().format('YYYY-MM-DD');
  record
    .findOne({
      where: {
        date: today,
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
      if (data) {
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
  const { habitId, progress } = req.body;
  const today = moment().format('YYYY-MM-DD');
  let completed = false;
  habits
    .findOne({
      attributes: ['id', 'goal', 'unit'],
      where: { id: habitId },
      raw: true,
    })
    .then((data) => {
      if (!data) {
        res.status(204).send('There is no data for habit ID');
      } else {
        if (
          (data.unit !== 'minute' && progress >= data.goal) ||
          (data.unit === 'minute' && progress >= data.goal * 60)
        ) {
          completed = true;
        }

        record
          .update(
            { progress: progress, completed: completed },
            { where: { habitId: habitId, date: today } }
          )
          .then((result /*[1](changed rows) [0](nothing changed) */) => {
            if (result[0] !== 0) {
              res
                .status(201)
                .send({ progress: progress, completed: completed });
            } else {
              res.status(204).send('nothing changed');
            }
          })
          .catch((err) => {
            console.log(err);
            res.sendStatus(500);
          });
      }
    });
};

const getRecordToday = (req, res) => {
  const { id } = req.decoded;
  let today = moment().format('YYYY-MM-DD');
  record
    .findAll({
      where: {
        date: today,
      },
      include: [
        {
          model: habits,
          where: { userId: id, deletedDate: null },
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

const addRecord = (
  habitId,
  completed = false,
  date = moment().format('YYYY-MM-DD')
) => {
  return new Promise((resolve, reject) => {
    const day = moment(date).format('llll'); // Mon, Jan 14 2013 2:08 PM
    const index = dayOfWeek.indexOf(day.split(',')[0]);
    habits.findOne({ where: { id: habitId } }).then((data) => {
      if (data && data.frequency[index] === '1') {
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
      } else {
        resolve();
      }
    });
  });
};

const syncRecord = (userId) => {
  habits.findAll({ where: { userId: userId } }).then((data) => {
    if (data && data.length > 0) {
      const today = moment().format('YYYY-MM-DD');
      data.forEach((ele) => {
        record.max('date', { where: { habitId: ele.id } }).then(async (max) => {
          if (max === 0) {
            await addRecord(ele.id);
          } else if (max !== today) {
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

const getStreakInfo = (req, res) => {
  let habitId = req.url.replace('/', '');
  record
    .findAll({
      where: { habitId: habitId, completed: true },
      order: [['date', 'DESC']],
    })
    .then(async (data) => {
      if (data && data.length > 0) {
        let total = data.length;
        let longestStreak = getLongestStreak(data);
        let streak = getStreak(data);
        res
          .status(200)
          .send({ total: total, longestStreak: longestStreak, streak: streak });
      } else {
        res.status(403).send('there is no complete record of it');
      }
    });
};

function getLongestStreak(data) {
  let longest = 0;
  let standard = data[0];
  let standardDiff = 0;
  for (let i = 0; i < data.length; i++) {
    let diff = moment(standard.date).diff(data[i].date, 'days');
    if (diff === standardDiff) {
      standardDiff++;
    } else {
      longest = Math.max(longest, standardDiff);
      standard = data[i];
      standardDiff = 1;
    }
  }
  longest = Math.max(longest, standardDiff);
  return longest;
}

function getStreak(data) {
  const today = moment().format('YYYY-MM-DD');
  if (data[0].date !== today) return 0;
  let count = 1;
  for (let i = 0; i < data.length; i++) {
    if (data[i + 1]) {
      let diff = moment(data[i].date).diff(data[i + 1].date, 'days');
      if (diff !== 1) break;
      count++;
    }
  }
  return count;
}

const getDetail = (req, res) => {
  let responseArr = [];
  const habitId = req.query.habitId;
  const thisMonth = moment().format('YYYY-MM-DD').split('-')[1]; // ['2020', '05', '25']
  const year = req.query.year || moment().format('YYYY');
  const month = req.query.month || moment().format('MM');

  const startDate = moment([year, month - 1]);
  const endDate = moment(startDate).endOf('month');

  const diff =
    thisMonth === month
      ? moment().diff(startDate, 'days')
      : moment(endDate).diff(startDate, 'days');

  record
    .findAll({
      where: {
        [Op.and]: [
          sequelize.where(sequelize.fn('MONTH', sequelize.col('date')), month),
          sequelize.where(sequelize.fn('YEAR', sequelize.col('date')), year),
          { habitId: habitId },
        ],
      },
      order: [['date', 'ASC']],
      raw: true,
    })
    .then((monthlyData) => {
      if (monthlyData.length === 0) {
        res.status(204).send('data does not exist');
      } else {
        let obj = {};
        monthlyData.forEach((val) => {
          obj[`${val.date}`] = val.completed;
        });

        for (let i = 0; i <= diff; i++) {
          let compareDate = moment(startDate)
            .add(i, 'days')
            .format('YYYY-MM-DD');
          if (obj[compareDate]) {
            responseArr.push(true);
          } else {
            responseArr.push(false);
          }
        }
        res.status(200).send(responseArr);
      }
    })
    .catch((err) => {
      console.log(err);
      res.sendStatus(500);
    });
};

module.exports = {
  get: get,
  post: post,
  getRecordToday: getRecordToday,
  addRecord: addRecord,
  syncRecord: syncRecord,
  getStreakInfo: getStreakInfo,
  getDetail: getDetail,
};
