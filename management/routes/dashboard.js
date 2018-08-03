const express = require('express');
const router = express.Router();
const { profit, totalTransaction, graph } = require('../controllers/dashboard');
const { loginAuth, isOwner } = require('../middlewares/auth');

/* GET users listing. */
router.get('/profit', loginAuth, isOwner, profit);
router.get('/totalTransaction', loginAuth, isOwner, totalTransaction);
router.get('/graph', loginAuth, isOwner, graph);

module.exports = router;
