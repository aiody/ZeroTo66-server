const { habits } = require('../../models');
const { record } = require('../record');

module.exports = {
  post: (req, res) => {
    const { habitName } = req.body;
    const { id } = req.decoded;
    habits
      .findOrCreate({
        where: {
          userId: id,
          habitName: habitName,
        },
      })
      .then(async ([habit, created]) => {
        if (!created) {
          res.status(409).send('already exist habit');
        } else {
          const data = await habit.get({ plain: true });
          await record.addRecord(data.id);
          res.status(201).json(data);
        }
      });
  },
};
