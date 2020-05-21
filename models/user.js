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
  user.associate = function (models) {
    user.hasMany(models.record, {
      foreignKey: 'habitId',
    });
  };
  return user;
};
