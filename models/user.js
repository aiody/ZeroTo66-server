'use strict';
module.exports = (sequelize, DataTypes) => {
  const user = sequelize.define(
    'user',
    {
      username: DataTypes.STRING,
      password: DataTypes.STRING,
    },
    {
      timestamps: false,
    }
  );

  // to make connection with habits table
  user.associate = function (models) {
    user.hasMany(models.habits);
  };
  return user;
};
