'use strict';

const UserEntity = require("../../interfaces/entities/user.entity")

module.exports = async (condition, { userRepository }) => {
  const user = await userRepository.getUser(condition);
  return new UserEntity(user);
};