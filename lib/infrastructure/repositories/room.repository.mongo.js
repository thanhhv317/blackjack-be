'use strict';

const Room = require('../orm/mongoose/schemas/rooms');
const mongoose = require('../orm/mongoose/mongoose');

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

    async getRoomByUserId(userId) {
        const condition = {current_user: {$in: [mongoose.Types.ObjectId(userId)] }}
        const room = await Room.findOne(condition).lean();
        return room;
    }

};