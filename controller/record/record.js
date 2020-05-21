const { record } = require('../../models');
const { user } = require('../../models');
module.exports = {
  get: (req, res) => {
    const { habitId } = req.body;
    const { username } = req.decoded;
    record
      .findAll({
        where: {
          habitId: habitId,
        },
        include: [
          {
            model: user,
            attributes: ['username'],
            where: { username: username },
          },
        ],
      })
      .then((data) => {
        if (data) {
          return res.status(200).json(data);
        }
      })
      .catch((err) => {
        console.log(err);
        res.sendStatus(500);
      });
  },
  //post: (req, res) => {},
};
