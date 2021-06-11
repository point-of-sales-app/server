const express = require('express');
const router = express.Router();
const { summary, remove } = require('../controllers/sales');
const { loginAuth, isOwner, isSales } = require('../middlewares/auth');

/* GET users listing. */
router.get('/summary', loginAuth, isSales, summary);
router.put('/remove', loginAuth, isOwner, remove);

module.exports = router;
