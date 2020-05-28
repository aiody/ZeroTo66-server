const { record } = require('../../models');
const { habits } = require('../../models');
const sequelize = require('sequelize');
const Op = sequelize.Op;
const moment = require('moment');

module.exports = {
  getMonthly: async (req, res) => {
    const { id } = req.decoded;
    const month = req.query.month || moment().format('MM');
    const year = req.query.year || moment().format('YYYY');

    let responseData = { done_all: [], done_partially: [] };

    record
      .findAll({
        where: {
          [Op.and]: [
            sequelize.where(
              sequelize.fn('MONTH', sequelize.col('date')),
              month
            ),
            sequelize.where(sequelize.fn('YEAR', sequelize.col('date')), year),
          ],
        },
        include: [
          {
            model: habits,
            where: { userId: id },
          },
        ],
        order: [['date', 'ASC']],
        raw: true,
      })
      .then((monthlyData) => {
        let obj = {};
        monthlyData.forEach((val) => {
          if (val.date in obj) {
            obj[`${val.date}`].push(val.completed);
          } else {
            obj[`${val.date}`] = [val.completed];
          }
        });

        for (let key in obj) {
          if (obj[key].every((val) => val)) {
            responseData.done_all.push(key);
          } else {
            responseData.done_partially.push(key);
          }
        }
        res.status(200).json(responseData);
      })
      .catch((err) => {
        console.log(err);
        res.sendStatus(500);
      });
  },
};
