const express = require('express');
const router = express.Router();
const { register, getUser } = require('../controllers/registration')

/* GET users listing. */
router.post('/', register);
router.get('/', getUser)
module.exports = router;
