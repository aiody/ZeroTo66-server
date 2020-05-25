const { user } = require('../../models');
let jwt = require('jsonwebtoken');
const config = require('../../config/config.js');
const { record } = require('../record');
const crypto = require('crypto');

module.exports = {
  post: (req, res) => {
    const { username, password } = req.body;
    var shasum = crypto.createHash('sha1');
    shasum.update(password);
    let encryptedPassword = shasum.digest('hex');
    user
      .findOne({
        where: {
          username: username,
        },
      })
      .then(async (data) => {
        if (!data) {
          return res.status(404).send('unvalid user');
        } else if (encryptedPassword !== data.password) {
          return res.status(403).send('wrong password');
        }
        let token = jwt.sign(
          { id: data.id, username: username },
          config.secret,
          {
            expiresIn: '24h', // expires in 24 hours
          }
        );
        await record.syncRecord(data.id);
        res.cookie('token', token).status(200).json({
          id: data.id,
        });
      })
      .catch((err) => {
        res.status(404).send(err);
      });
  },
};
