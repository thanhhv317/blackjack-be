'use strict';

const RoomEntity = require("../../interfaces/entities/room.entity")

module.exports = async (condition, payload, { roomRepository }) => {
  const rooms = await roomRepository.updateRooms(condition, payload);
  return rooms
};