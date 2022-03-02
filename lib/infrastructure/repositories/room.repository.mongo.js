'use strict';

const Room = require('../orm/mongoose/schemas/rooms');

module.exports = class {

    async listRooms(condition) {
        const room = await Room.find(condition).lean();
        return room;
    }

    async countDocument(condition) {
        const countRoom = await Room.find(condition).count();
        return countRoom;
    }

    async createRoom(payload) {
        const room = new Room(payload);
        return await room.save();
    }

    async getRoomById(roomId) {
        const room = await Room.findById(roomId);
        return room;
    }

    async updateRoomById(roomId, payload) {
        const room = await Room.findByIdAndUpdate(roomId, payload, { new: true });
        return room;
    }

};