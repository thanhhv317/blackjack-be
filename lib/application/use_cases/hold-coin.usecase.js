'use strict';

const UserEntity = require("../../interfaces/entities/user.entity")

module.exports = async (userId, cointHold, { userRepository }) => {
    let user = await userRepository.getUserById(userId);
    user = new UserEntity(user);
    if (user.coin > +cointHold) {
        const payload = {
            coin: user.coin - (+cointHold)
        }
        const userUpdate = await userRepository.updateUserById(userId, payload);
        return new UserEntity(userUpdate);
    } else {
        return false;
    }

};