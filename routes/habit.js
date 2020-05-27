const express = require('express');
const router = express.Router();
const { habitsController } = require('../controller');
const utils = require('../modules/utils');

// * POST /habit
router.post('/', utils.checkToken, habitsController.addHabit.post);

// * GET /habit
router.get('/', utils.checkToken, habitsController.getHabits.get);

// * PATCH /habit
router.patch('/', utils.checkToken, habitsController.edit.delete);

// * PUT /habit
router.put('/', utils.checkToken, habitsController.edit.edit);

module.exports = router;
