const { habits } = require('../../models');
module.exports = {
  get: (req, res) => {
    const { id } = req.decoded;
    habits
      .findAll({ where: { userId: id } })
      .then((habitsData) => {
        if (habitsData) {
          return res.status(200).json(habitsData);
        }
      })
      .catch((err) => {
        console.log(err);
        res.sendStatus(500);
      });
  },
};
