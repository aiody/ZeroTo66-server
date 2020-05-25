const express = require('express');
const router = express.Router();
const { habitsController } = require('../controller');
const utils = require('../modules/utils');

// * POST /habits
router.post('/', utils.checkToken, habitsController.addHabit.post);

// * GET /habits
router.get('/', utils.checkToken, habitsController.getHabits.get);

// * POST /habits/delHabit
router.post('/delHabit', utils.checkToken, habitsController.delHabit.post);

module.exports = router;
