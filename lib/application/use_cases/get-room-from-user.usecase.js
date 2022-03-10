
'use strict';

const RoomEntity = require("../../interfaces/entities/room.entity")

module.exports = async (userId, { roomRepository }) => {
  const room = await roomRepository.getRoomByUserId(userId);
  return !!room ? new RoomEntity(room) : {};
};