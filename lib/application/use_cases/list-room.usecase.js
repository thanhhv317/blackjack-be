'use strict';

const RoomEntity = require("../../interfaces/entities/room.entity")

module.exports = async (condition, { roomRepository }) => {
  const rooms = await roomRepository.listRooms(condition);
  return rooms.map(room => new RoomEntity(room));
};