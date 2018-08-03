const express = require('express');
const router = express.Router();
const { create, update, findAll, destroy, findDate } = require('../controllers/expense')
const { loginAuth, isOwner } = require('../middlewares/auth');

/* GET users listing. */
router.post('/create',loginAuth, isOwner, create);
router.get('/find',loginAuth, isOwner, findAll);
router.get('/findDate',loginAuth, isOwner, findDate);
router.put('/update', update);
router.delete('/delete', loginAuth, isOwner, destroy);

module.exports = router;
