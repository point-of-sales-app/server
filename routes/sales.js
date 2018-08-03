const express = require('express');
const router = express.Router();
const { summary } = require('../controllers/sales');
const { loginAuth, isOwner } = require('../middlewares/auth');

/* GET users listing. */
router.get('/summary', loginAuth, isOwner, summary);

module.exports = router;
