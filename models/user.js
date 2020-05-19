'use strict';
module.exports = (sequelize, DataTypes) => {
  const user = sequelize.define(
    'user',
    {
      username: DataTypes.STRING,
      password: DataTypes.STRING,
    },
    {}
  );
  return user;
};
