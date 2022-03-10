const express = require('express');
const router = express.Router();
const verifyToken = require('../../infrastructure/utils/verifyToken')
const roomController = require('../controllers/room.controller');

router.post('/leave/:roomId', verifyToken, new roomController().leaverRoomWhenDisconnected);

module.exports = router;
