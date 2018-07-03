const express = require('express');
const router = express.Router();
const { register, getUser, registerCashier } = require('../controllers/registration')
const { loginAuth, isOwner } = require('../middlewares/auth');

/* GET users listing. */
router.post('/', register);
router.get('/', getUser);
router.post('/cashier', loginAuth, isOwner, registerCashier);

module.exports = router;
