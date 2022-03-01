'use strict';

const User = require('../orm/mongoose/schemas/users');

module.exports = class {

  async getUser(condition) {
    const user = await User.findOne(condition).lean();
    return user;
  }

  async countDocument(condition) {
    const countUser = await User.find(condition).count();
    return countUser;
  }

  async createUser(payload) {
    const user = new User(payload);
    return await user.save();
  }

  async getUserById(userId) {
    const user = await User.findById(userId);
    return user;
  }

};