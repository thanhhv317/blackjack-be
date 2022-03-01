'use strict';

const UserEntity = require("../../interfaces/entities/user.entity")

module.exports = async (userId, { userRepository }) => {
  const user = await userRepository.getUserById(userId);
  return new UserEntity(user);
};