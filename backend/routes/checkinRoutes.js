const express = require('express');
const router = express.Router();
const { createCheckin, getCheckins } = require('../controllers/checkinController');

router.post('/', createCheckin);
router.get('/', getCheckins);

module.exports = router;
