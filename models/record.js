'use strict';
module.exports = (sequelize, DataTypes) => {
  const record = sequelize.define(
    'record',
    {
      date: DataTypes.DATEONLY,
      completed: DataTypes.BOOLEAN,
      progress: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
        allowNull: false,
      },
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
