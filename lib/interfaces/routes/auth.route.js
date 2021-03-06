const express = require('express');
const router = express.Router();
const authController = require('../controllers/auth.controller')
const verifyToken = require('../../infrastructure/utils/verifyToken')

router.post('/login', authController.login)
router.post('/register', authController.register)
router.get('/me', verifyToken, authController.getMe)
router.get('/leave', verifyToken, authController.leaveMatchAndRoom);
router.get('/:id', verifyToken, authController.getUser)

module.exports = router;
