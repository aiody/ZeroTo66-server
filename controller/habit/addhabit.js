const { habits } = require('../../models');
module.exports = {
  post: (req, res) => {
    const { habitName } = req.body;
    habits
      .findOrCreate({
        where: {
          habitName: habitName,
        },
      })
      .then(async ([habit, created]) => {
        if (!created) {
          res.status(409).send('already exist habit');
        } else {
          const data = await habit.get({ plain: true });
          res.status(201).json(data);
        }
      });
  },
};
