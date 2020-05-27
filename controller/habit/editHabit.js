const { habits } = require('../../models');
const moment = require('moment');
module.exports = {
  delete: (req, res) => {
    const userId = req.decoded.id;
    const { habitId } = req.body;

    const today = moment().format('YYYY-MM-DD');
    habits
      .update(
        { deletedDate: today },
        { where: { id: habitId, userId: userId } }
      )
      .then((result) => {
        if (result[0] !== 0) {
          res.status(201).send(`habit ID ${habitId} is deleted`);
        } else {
          res.status(204).send(`nothing changed`);
        }
      })
      .catch((err) => {
        console.log(err);
        res.sendStatus(500);
      });
  },
  edit: (req, res) => {
    const userId = req.decoded.id;
    const { habitId, habitName, frequency, unit, goal } = req.body;
    habits
      .update(
        { habitName: habitName, frequency: frequency, unit: unit, goal: goal },
        { where: { id: habitId, userId: userId } }
      )
      .then((result) => {
        if (result[0] !== 0) {
          res.status(201).send(`new habit name is ${habitName}`);
        } else {
          res.status(204).send(`nothing changed`);
        }
      })
      .catch((err) => {
        console.log(err);
        res.sendStatus(500);
      });
  },
};
