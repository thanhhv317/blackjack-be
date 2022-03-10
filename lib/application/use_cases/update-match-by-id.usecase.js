'use strict';

const MatchEntity = require("../../interfaces/entities/match.entity")

module.exports = async (matchId, payload, { matchRepository }) => {
  const match = await matchRepository.updateMatchById(matchId, payload);
  return !!match ? new MatchEntity(match) : {};
};