const { user } = require('../../models');
module.exports = {
  post: (req, res) => {
    const { username, password } = req.body;
    user
      .findOrCreate({
        where: {
          username: username,
        },
        defaults: {
          password: password,
        },
      })
      .then(async ([user, created]) => {
        if (!created) {
          return res.status(409).send('email exists');
        }
        const data = await user.get({ plain: true });
        res.status(201).json(data);
      });
  },
};
