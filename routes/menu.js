const express = require('express');
const router = express.Router();
const { findAll, findById, create, update, destroy } = require('../controllers/menu')
const { loginAuth, isOwner } = require('../middlewares/auth');

/* GET users listing. */
router.post('/create',loginAuth, isOwner, create);
router.get('/find',loginAuth, findAll);
router.get('/findById',loginAuth, isOwner, findById);
router.put('/update', loginAuth, isOwner, update);
router.delete('/delete', loginAuth, isOwner, destroy);

module.exports = router;
