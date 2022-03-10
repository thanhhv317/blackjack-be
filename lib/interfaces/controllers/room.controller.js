'use strict';

const serviceLocator = require("../../infrastructure/config/service-locator");
const ListRooms = require('../../application/use_cases/list-room.usecase');
const GetRoom = require('../../application/use_cases/get-room.usecase');
const GetUser = require('../../application/use_cases/get-user-by-id.usecase');
const UpdateRoom = require('../../application/use_cases/update-room-by-id.usecase');
const GetRoomFromUser = require('../../application/use_cases/get-room-from-user.usecase');

module.exports = class {

    async listRooms(req) {
        const rooms = await ListRooms({}, serviceLocator);
        return rooms;
    }

    async joinToRoom(roomId, userId) {
        // get room
        let room = await GetRoom(roomId, serviceLocator);

        // check room
        // 1. check room.current_number_user < room.max_user
        if (+room.current_number_user >= +room.max_user) {
            return {
                status: false,
                message: 'Phong da day nguoi'
            }
        }
        //2. check room.price < user.coin
        const user = await GetUser(userId, serviceLocator);
        if (!!user && user.coin < room.price) {
            return {
                status: false,
                message: "khong du tien cuoc"
            }
        }
        //3. check user not in room
        let uids = room.current_user.map(currentUser => currentUser.toString());
        if (uids.includes(userId)) {
            return {
                status: false,
                message: "User da o phong nay, vui long f5!"
            }
        }

        // join to room;
        const payload = {
            current_number_user: room.current_number_user + 1,
            current_user: [...room.current_user, user.id]
        };

        room = await UpdateRoom(roomId, payload, serviceLocator)

        return {
            status: true,
            room
        }
    }

    async leaveRoom(roomId, userId) {
        // get room
        let room = await GetRoom(roomId, serviceLocator);

        let uids = room.current_user.map(currentUser => currentUser.toString());
        if (uids.includes(userId)) {
            const payload = {
                current_number_user: (room.current_number_user == 0) ? 0 : room.current_number_user - 1,
                current_user: [...room.current_user.filter(currentUser => currentUser.toString() !== userId)]
            }
            room = await UpdateRoom(roomId, payload, serviceLocator)
            return {
                status: true,
                room
            }
        }

        return {
            status: false,
            message: "nothing"
        }

    }

    async getRoom(roomId) {
        const room = await GetRoom(roomId, serviceLocator);
        return room;
    }

    async getRoomFromUserId(userId) {
        const room = await GetRoomFromUser(userId, serviceLocator);
        return room;
    }


    async leaverRoomWhenDisconnected(req, res) {
        const {roomId} = req.params;
        const {userId} = req
        // get room
        let room = await GetRoom(roomId, serviceLocator);

        let uids = room.current_user.map(currentUser => currentUser.toString());
        if (uids.includes(userId)) {
            const payload = {
                current_number_user: (room.current_number_user == 0) ? 0 : room.current_number_user - 1,
                current_user: [...room.current_user.filter(currentUser => currentUser.toString() !== userId)]
            }
            room = await UpdateRoom(roomId, payload, serviceLocator)
            return res.json({
                status: true,
                room
            })
        }

        return res.json({
            status: false,
            message: "nothing"
        })
    }

};