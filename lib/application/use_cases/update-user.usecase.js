'use strict';

const UserEntity = require("../../interfaces/entities/user.entity")

module.exports = async (userId, payload, { userRepository }) => {
    const user = await userRepository.updateUserById(userId, payload);
    return !!user ? new UserEntity(user) : {};
};