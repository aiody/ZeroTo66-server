const { user } = require('../../models');
module.exports = {
  get: (req, res) => {
    const { username } = req.decoded;
    user
      .findOne({
        where: {
          username: username,
        },
      })
      .then((data) => {
        if (data) {
          return res.status(200).json(data);
        }
        res.sendStatus(204);
      })
      .catch((err) => {
        console.log(err);
        res.sendStatus(500);
      });
  },
};
