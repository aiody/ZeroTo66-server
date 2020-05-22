const express = require('express');
const router = express.Router();
const { recordController } = require('../controller');
const utils = require('../modules/utils');

// * POST /record/
router.post('/', recordController.record.post);

// * GET /record/
router.get('/', utils.checkToken, recordController.record.get);
router.get('/today', utils.checkToken, recordController.record.getRecordToday);

module.exports = router;
