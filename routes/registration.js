const express = require('express');
const router = express.Router();
const { register, getUser, registerCashier, getStaff, deleteStaff, updateUser } = require('../controllers/registration')
const { loginAuth, isOwner } = require('../middlewares/auth');

/* GET users listing. */
router.post('/', register);
router.get('/', getUser);
router.post('/cashier', loginAuth, isOwner, registerCashier);
router.get('/staff', loginAuth, isOwner, getStaff);
router.delete('/staff', loginAuth, isOwner, deleteStaff);
router.put('/update', updateUser);

module.exports = router;
