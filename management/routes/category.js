const express = require('express');
const router = express.Router();
const { create, findAll, findById, update, destroy } = require('../controllers/category');
const { loginAuth, isOwner } = require('../middlewares/auth');

/* GET users listing. */
router.post('/create', loginAuth, isOwner, create);
router.get('/find', loginAuth, findAll);
router.get('/findById', loginAuth, findById);
router.put('/update', loginAuth, isOwner, update);
router.delete('/delete', loginAuth, isOwner, destroy);

module.exports = router;
