'use strict';
const crypto = require('crypto');
module.exports = (sequelize, DataTypes) => {
  const user = sequelize.define(
    'user',
    {
      username: DataTypes.STRING,
      password: DataTypes.STRING,
    },
    {
      timestamps: false,
      hooks: {
        afterValidate: (data) => {
          var shasum = crypto.createHash('sha1');
          shasum.update(data.password);
          data.password = shasum.digest('hex');
        },
      },
    }
  );

  // to make connection with habits table
  user.associate = function (models) {
    user.hasMany(models.habits);
  };
  return user;
};
