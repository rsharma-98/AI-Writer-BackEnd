const express = require('express');
const router = express.Router();

const { login, signup } = require('../controller/auth.controller');


// Signup (minimal)
router.post('/signup', signup);

// Login
router.post('/login', login);

module.exports = router;
