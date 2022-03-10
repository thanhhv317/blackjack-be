'use strict';

const MatchEntity = require('../../interfaces/entities/match.entity');

module.exports = async (payload, { matchRepository }) => {
    const match = await matchRepository.createMatch(payload);
    return new MatchEntity(match);
};