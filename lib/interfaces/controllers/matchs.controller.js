'use strict';

const serviceLocator = require("../../infrastructure/config/service-locator");

const GetRoom = require('../../application/use_cases/get-room.usecase');
const HoldCoint = require('../../application/use_cases/hold-coin.usecase');
const deskOfCards = require('../../infrastructure/config/desk-of-cards');
const CreateMatch = require('../../application/use_cases/create-match.usecase');
const GetMatchById = require('../../application/use_cases/get-match-by-id.usecase');
const UpdateMatchById = require('../../application/use_cases/update-match-by-id.usecase');
const updateRoomByIdUsecase = require("../../application/use_cases/update-room-by-id.usecase");
const UpdateUserByIdUsecase = require('../../application/use_cases/update-user.usecase');
const calculatePoint = require('../../infrastructure/utils/calculate-point');
const getUserByIdUsecase = require("../../application/use_cases/get-user-by-id.usecase");

module.exports = class {

    async startGame(roomId, coin) {
        const room = await GetRoom(roomId, serviceLocator);

        if (!!room && room.current_number_user <= 1 && room.status === "WAITING") {
            // loi so nguoi chua du de bat dau
            return {
                status: false,
                message: "Vui long doi them nguoi choi"
            }
        }

        const userPromises = [];

        // tru tien nguoi choi
        room.current_user.forEach((uid, index) => {
            if (index > 0) {
                // index == 0 la roomMaster, ko hold point cua chu phong
                userPromises.push(
                    HoldCoint(uid, coin, serviceLocator)
                )
            }
        });
        const [user1, user2, user3, user4] = await Promise.all(userPromises);

        // tao phong
        // phat bai, 1 nguoi 2 con
        const cards_used = [];
        const participant = room.current_user.map((uid, index) => {
            cards_used.push(deskOfCards[index].id);
            cards_used.push(deskOfCards[index + 2].id);
            return {
                user_id: uid,
                cards: [deskOfCards[index], deskOfCards[index + 2]],
                is_finish: false
            }
        })

        const createMatchDto = {
            room_id: roomId,
            participant: participant,
            cards_used,
            room_master: room.current_user[0]
        }

        const match = await CreateMatch(createMatchDto, serviceLocator);

        // kich hoat room status RUNNING
        const startRoom = await updateRoomByIdUsecase(roomId, { status: "RUNNING" }, serviceLocator);

        // nguoi rut bai dau tien.
        // user[0] la room_master
        // const firstUserId = room.current_user[1];
        const firstUserId = match.participant[1];


        return {
            status: true,
            match,
            user_draw: firstUserId
        }

    }

    async drawCards(matchId, userId) {
        // rut them bai

        // 1. get match
        const match = await GetMatchById(matchId, serviceLocator);
        if (!!match) {

            const usedCards = match.cards_used
            const cardsNotUse = deskOfCards.filter((card) => {
                return !usedCards.includes(card.id);
            })
            // return cardsNotUse.length

            const card = cardsNotUse[Math.floor(Math.random() * cardsNotUse.length)];
            const currentUser = match.participant.map(user => {
                if (user.user_id.toString() === userId.toString()) {
                    return {
                        user_id: user.user_id,
                        cards: [...user.cards, card],
                        is_finish: false
                    }
                } else {
                    return user;
                }
            })
            const cardsUsed = [...match.cards_used, card.id];

            //2. update vao match
            const updateMatchDto = {
                participant: currentUser,
                cards_used: cardsUsed
            }

            const updateMatch = await UpdateMatchById(matchId, updateMatchDto, serviceLocator);

            return updateMatch
        }

    }


    // nguoi rut bai tiep theo se la ai
    async getUserDrawCards(matchId, userId) {
        const match = await GetMatchById(matchId, serviceLocator);

        // user[0] la room_master
        let users = match.participant;

        let currentUserPosition = users.findIndex((user) => {
            return user.user_id.toString() === userId.toString();
        })

        // if (currentUserPosition + 1 == user.length ) den luot room_master
        // con ko thi la crrentUser + 1
        if (currentUserPosition + 1 === users.length) {
            return users[0] // room_master
        }
        return users[currentUserPosition + 1]
    }

    /**
     * 
     * @param {string} matchId Id của ván chơi
     * @param {string} participantId Id của người chơi bị xét bài
     * @param {string} roomMasterId Id của chủ phòng
     * @returns {any} 
     */

    async showCardOfUser(matchId, participantId, roomMasterId) {
        // tinh diem cua roomMaster va user;


        const match = await GetMatchById(matchId, serviceLocator);
        let participantPoint = 0;
        let roomMasterPoint = 0;
        if (!!match) {
            const room = await GetRoom(match.room_id, serviceLocator);
            let participant = match.participant.find(user => {
                return user.user_id.toString() === participantId.toString()
            })
            if (!!participant && participant.cards) {
                participantPoint = calculatePoint(participant.cards)
            }

            roomMasterPoint = calculatePoint(match.participant[0].cards)

            let participantInfo = await getUserByIdUsecase(participantId, serviceLocator);
            let roomMasterInfo = await getUserByIdUsecase(match.participant[0].user_id, serviceLocator);
            if (participantPoint > roomMasterPoint) {

                // tra tien x2 cho nguoi choi
                // tru x1 tien cua cai di
                await UpdateUserByIdUsecase(participantId, { coin: participantInfo.coin + (+room.price) * 2 }, serviceLocator);
                await UpdateUserByIdUsecase(roomMasterInfo.id, { coin: roomMasterInfo.coin - room.price }, serviceLocator);
            } else if (participantPoint == roomMasterPoint) {
                // tra tien von cho nguoi choi
                await UpdateUserByIdUsecase(participantId, { coin: participantInfo.coin + (+room.price) }, serviceLocator);
            } else {
                // cong x1 tien cho cai 
                await UpdateUserByIdUsecase(roomMasterInfo.id, { coin: roomMasterInfo.coin + room.price }, serviceLocator);
            }

            // update match la da ket thuc game voi nguoi choi nay`

            const updateMatchDto = match.participant.map(user => {
                if (user.user_id.toString() == participantId.toString()) {
                    return {
                        user_id: user.user_id,
                        cards: user.cards,
                        is_finish: true
                    }
                } else {
                    return user;
                }
            })
            const updateMatch = await UpdateMatchById(matchId, { participant: updateMatchDto }, serviceLocator);
        }

        return {
            status: true,
            points: [
                {
                    id: participantId,
                    point: participantPoint,
                },
                {
                    id: roomMasterId,
                    point: roomMasterPoint
                }
            ]
        }

    }

    async finishMatch(matchId, roomId) {
        // tinh diem tat ca nguoi choi, tru nguoi choi da thanh toan tien is_finish = true
        // release tien
        const match = await GetMatchById(matchId, serviceLocator);
        const usersInMatch = match.participant;
        const room = await GetRoom(roomId, serviceLocator);

        const roomMasterPoint = calculatePoint(usersInMatch[0].cards);
        const roomMasterInfo = await getUserByIdUsecase(usersInMatch[0].user_id, serviceLocator);

        let totalCoinRoomMaster = 0;
        let updateMatchParticipantDto = [];
        for (let i = 0; i < usersInMatch.length; ++i) {
            if (usersInMatch[i].user_id.toString != match.room_master.toString() && !usersInMatch[i].is_finish) {
                let userInfo = await getUserByIdUsecase(usersInMatch[i].user_id, serviceLocator)
                let userPoint = calculatePoint(usersInMatch[i].cards);
                if (userPoint > roomMasterPoint) {
                    // tra tien x2 cho nguoi choi
                    // tru x1 tien cua cai di

                    await UpdateUserByIdUsecase(usersInMatch[i].user_id, { coin: userInfo.coin + (+room.price) * 2 }, serviceLocator);
                    totalCoinRoomMaster -= room.price;
                } else if (userPoint == roomMasterPoint) {
                    // tra tien von cho nguoi choi
                    await UpdateUserByIdUsecase(usersInMatch[i].user_id, { coin: userInfo.coin + (+room.price) }, serviceLocator);
                } else {
                    // cong x1 tien cho cai 
                    totalCoinRoomMaster += room.price;
                }

                updateMatchParticipantDto.push({
                    user_id: usersInMatch[i].user_id,
                    cards: usersInMatch[i].cards,
                    is_finish: true
                })
            } else {
                updateMatchParticipantDto.push({
                    user_id: usersInMatch[i].user_id,
                    cards: usersInMatch[i].cards,
                    is_finish: true
                })
            }
        }
        // update is_finish cho nguoi choi trong match
        await UpdateMatchById(matchId, {participant: updateMatchParticipantDto}, serviceLocator);

        await UpdateUserByIdUsecase(usersInMatch[0].user_id, { coint: roomMasterInfo.coin + totalCoinRoomMaster }, serviceLocator);

        await updateRoomByIdUsecase(roomId, { status: "WAITING"}, serviceLocator);

        return true

        // reset room status WAITING

        //

    }



};