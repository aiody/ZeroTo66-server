const express = require('express');
const router = express.Router();
const { recordController } = require('../controller');
const utils = require('../modules/utils');

// * POST /record/
//router.post('/', recordController.record.post);

// * GET /record/
router.get('/', utils.checkToken, recordController.record.get);

module.exports = router;
