'use strict';

const UserEntity = require("../../interfaces/entities/user.entity")

module.exports = async (payload, { userRepository }) => {
  const user = await userRepository.createUser(payload);
  return new UserEntity(user);
};