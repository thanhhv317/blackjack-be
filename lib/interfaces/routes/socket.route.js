const RoomController = require("../controllers/room.controller");

const roomController = new RoomController();

module.exports = {
    hello: (args) => {
        console.log(args);
    },

    listRooms: async (args) => {
        return await roomController.listRooms(args)
    },

    joinToRoom: async (roomId, userId) => {
        const room =  await roomController.joinToRoom(roomId, userId);
        return room;
    }

    
}