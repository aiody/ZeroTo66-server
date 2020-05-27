const { habits } = require('../../models');
const { record } = require('../record');

module.exports = {
  post: (req, res) => {
    const { habitName, frequency, unit, goal } = req.body;
    const { id } = req.decoded;
    if (habitName !== undefined) {
      habits
        .create({
          userId: id,
          habitName: habitName,
          frequency: frequency,
          unit: unit,
          goal: unit === 1 ? 1 : goal,
        })
        .then(async (created) => {
          if (!created) {
            res.status(409).send("doesn't created");
          } else {
            const data = await created.get({ plain: true });
            await record.addRecord(data.id);
            res.status(201).json(data);
          }
        })
        .catch((err) => {
          console.log(err);
          res.sendStatus(500);
        });
    } else {
      res.status(204).send('please insert habit');
    }
  },
};
