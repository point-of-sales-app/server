const express = require('express');
const router = express.Router();
const { findAll, create, findPaymentMethod, destroy, getLastId, update } = require('../controllers/transaction');
const { loginAuth, isCashier } = require('../middlewares/auth');

/* GET users listing. */
router.post('/create', loginAuth, isCashier, create);
router.get('/find', loginAuth, findAll);
router.get('/paymentMethod', loginAuth, findPaymentMethod);
router.delete('/delete', destroy);
router.get('/lastId', loginAuth, isCashier, getLastId);
router.put('/update', update);

module.exports = router;
