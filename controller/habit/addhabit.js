const { habits } = require('../../models');
module.exports = {
  post: (req, res) => {
    const { habitName } = req.body;
    const { id } = req.decoded;
    if (habitName !== undefined) {
      habits
        .create({
          userId: id,
          habitName: habitName,
        })
        .then(async (created) => {
          if (!created) {
            res.status(409).send("doesn't created");
          } else {
            const data = await created.get({ plain: true });
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
