const express = require('express');
const router = express.Router();
const { create, findAll, findById, update, destroy } = require('../controllers/restaurant');
const { loginAuth, isOwner } = require('../middlewares/auth');

/* GET users listing. */
router.post('/', loginAuth, isOwner, create);
router.get('/', loginAuth, findAll);
router.get('/find', loginAuth, findById);
router.put('/update', loginAuth, isOwner, update);
router.delete('/delete', loginAuth, isOwner, destroy);

module.exports = router;
