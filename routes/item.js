const express = require('express');
const router = express.Router();
const { seed, create, findAll, destroy, update, findById, findUnit } = require('../controllers/item')
const { loginAuth, isOwner } = require('../middlewares/auth');

/* GET users listing. */
router.post('/create',loginAuth, isOwner, create);
router.get('/find',loginAuth, isOwner, findAll);
router.get('/findUnit',loginAuth, isOwner, findUnit);
router.get('/findById',loginAuth, isOwner, findById);
router.put('/update', loginAuth, isOwner, update);
router.delete('/delete', loginAuth, isOwner, destroy);

module.exports = router;
