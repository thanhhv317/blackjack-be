'use strict';

const RoomEntity = require("../../interfaces/entities/room.entity")

module.exports = async (roomId, { roomRepository }) => {
  const room = await roomRepository.getRoomById(roomId);
  return new RoomEntity(room);
};