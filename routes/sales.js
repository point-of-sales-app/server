const express = require('express');
const router = express.Router();
const { data, remove, itemSold, totalByRange, summary, byCategory } = require('../controllers/sales');
const { loginAuth, isOwner, isSales } = require('../middlewares/auth');

/* GET users listing. */
router.get('/data', loginAuth, isSales, data);
router.put('/remove', loginAuth, isOwner, remove);
router.get('/item-sold', loginAuth, isSales, itemSold);
router.get('/by-range', loginAuth, isSales, totalByRange);
router.get('/summary', loginAuth, isSales, summary);
router.get('/by-category', loginAuth, isSales, byCategory);



module.exports = router;
