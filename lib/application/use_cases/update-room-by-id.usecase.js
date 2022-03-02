'use strict';

const RoomEntity = require("../../interfaces/entities/room.entity")

module.exports = async (roomId, payload, { roomRepository }) => {
  const room = await roomRepository.updateRoomById(roomId, payload);
  return new RoomEntity(room);
};