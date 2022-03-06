const RoomController = require("../controllers/room.controller");
const MatchController = require("../controllers/matchs.controller");

const roomController = new RoomController();
const matchController = new MatchController();

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
    },

    leaveRoom: async (roomId, userId) => {
        const room = await roomController.leaveRoom(roomId, userId);
        return room;
    },

    getRoom: async (roomId) => {
        const room = await roomController.getRoom(roomId);
        return room;
    },

    getRoomFromUserId: async (userId) => {
        const room = await roomController.getRoomFromUserId(userId);
        return room;
    },

    // matchs


    startGame: async (roomId, coin) => {
        const match = await matchController.startGame(roomId, coin);
        return match;
    },

    drawCards: async (matchId, userId) => {
        const match = await matchController.drawCards(matchId, userId);
        return match;
    },

    getUserDrawCards: async (matchId, userId) => {
        const match = await matchController.getUserDrawCards(matchId, userId);
        return match;
    },

    showCardOfUser: async (matchId, participantId, roomMasterId) => {
        const match = await matchController.showCardOfUser(matchId, participantId, roomMasterId);
        return match;
    },

    finishMatch: async (matchId, roomId) => {
        const match = await matchController.finishMatch(matchId, roomId);
        return match;
    }

    
}