const { habits } = require('../../models');
module.exports = {
  get: (req, res) => {
    const { id } = req.decoded;
    habits
      .findAll({ where: { userId: id }, raw: true })
      .then((habitsData) => {
        if (habitsData && habitsData.length > 0) {
          const filteredData = habitsData.filter((habit) => {
            if (!habit['deletedDate']) return true;
            return false;
          });
          res.status(200).json(filteredData);
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
