const express = require('express');
const router = express.Router();
const { login } = require('../controllers/login')

/* GET users listing. */
router.post('/', login);
module.exports = router;
