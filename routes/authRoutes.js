const express = require('express');
const authCtl = require('../controllers/authCtl');
const router = express.Router();

router.post('/',authCtl.signUp);

router.post('/login',authCtl.login);

module.exports = router;