'use strict';
module.exports = (sequelize, DataTypes) => {
  const habits = sequelize.define(
    'habits',
    {
      habitName: DataTypes.STRING,
      startData: DataTypes.DATE,
      deletedDate: DataTypes.DATE,
      userId: DataTypes.INTEGER,
    },
    {
      timestamps: false,
    }
  );
  // for foreignkey
  habits.associate = function (models) {
    habits.belongsTo(models.user, {
      foreignKey: 'userId',
    });
  };
  return habits;
};
