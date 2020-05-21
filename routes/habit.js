const express = require('express');
const router = express.Router();
const { habitsController } = require('../controller');
const utils = require('../modules/utils');

// * POST /habits
router.post('/', utils.checkToken, habitsController.addHabit.post);

// * GET /habits
router.get('/', utils.checkToken, habitsController.getHabits.get);

module.exports = router;
