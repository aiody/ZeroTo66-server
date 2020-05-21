const { record } = require('../../models');
const { habits } = require('../../models');
module.exports = {
  get: (req, res) => {
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
  },
  //post: (req, res) => {},
};
