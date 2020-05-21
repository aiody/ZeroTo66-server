const { habits } = require('../../models');
module.exports = {
  get: (req, res) => {
    const { id } = req.decoded;
    habits
      .findAll({ where: { userId: id } })
      .then((habitsData) => {
        if (habitsData && habitsData.length > 0) {
          res.status(200).json(habitsData);
        } else {
          res.status(204).send('no habit');
        }
      })
      .catch((err) => {
        console.log(err);
        res.sendStatus(500);
      });
  },
};
