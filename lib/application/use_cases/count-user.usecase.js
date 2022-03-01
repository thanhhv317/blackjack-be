'use strict';
/**
 * 
 * @param {*} condition 
 * @param {*} userRepository 
 * @returns Number
 */
module.exports = (condition, { userRepository }) => {
  return userRepository.countDocument(condition);
};