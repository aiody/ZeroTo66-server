const express = require('express');
const router = express.Router();
const { habitsController } = require('../controller');
const utils = require('../modules/utils');

// * POST /habits
router.post('/', utils.checkToken, habitsController.addHabit.post);

module.exports = router;
