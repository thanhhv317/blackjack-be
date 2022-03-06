'use strict';

const MatchEntity = require("../../interfaces/entities/match.entity")

module.exports = async (matchId, { matchRepository }) => {
    const match = await matchRepository.getMatchById(matchId);
    return !!match ? new MatchEntity(match) : {};
};