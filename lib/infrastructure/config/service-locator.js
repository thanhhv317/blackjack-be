'use strict';

const constants = require('./constants');
const environment = require('./environment');

function buildBeans() {

  const beans = {
  };

  if (environment.database.dialect === constants.SUPPORTED_DATABASE.IN_MEMORY) {
    const UserRepositoryInMemory = require('../repositories/user.repository.memory');
    beans.userRepository = new UserRepositoryInMemory();
  } else if (environment.database.dialect === constants.SUPPORTED_DATABASE.MONGO) {
    const UserRepositoryMongo = require('../repositories/user.repository.mongo');
    beans.userRepository = new UserRepositoryMongo();
    const RoomRepositoryMongo = require('../repositories/room.repository.mongo');
    beans.roomRepository = new RoomRepositoryMongo();
  } else if (environment.database.dialect === constants.SUPPORTED_DATABASE.POSTGRES) {
    throw new Error('Add PostgreSQL support');
  } else {
    throw new Error('Add SQLite support');
  }

  return beans;
}

module.exports = buildBeans();