const { user } = require('../../models');
let jwt = require('jsonwebtoken');
const config = require('../../config/config.js');

module.exports = {
  post: (req, res) => {
    const { username, password } = req.body;
    user
      .findOne({
        where: {
          username: username,
        },
      })
      .then((data) => {
        if (!data) {
          return res.status(404).send('unvalid user');
        } else if (password !== data.password) {
          return res.status(403).send('wrong password');
        }
        let token = jwt.sign(
          { id: data.id, username: username },
          config.secret,
          {
            expiresIn: '24h', // expires in 24 hours
          }
        );

        res.cookie('token', token).status(200).json({
          id: data.id,
        });
      })
      .catch((err) => {
        res.status(404).send(err);
      });
  },
};
