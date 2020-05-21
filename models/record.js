'use strict';
module.exports = (sequelize, DataTypes) => {
  const record = sequelize.define(
    'record',
    {
      date: DataTypes.DATEONLY,
      completed: DataTypes.BOOLEAN,
    },
    {
      timestamps: false,
    }
  );
  record.associate = function (models) {
    record.belongsTo(models.habits, {
      foreignKey: 'habitId',
    });
  };
  return record;
};
