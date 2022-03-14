'use strict';

const Match = require('../orm/mongoose/schemas/match');

module.exports = class {

    async listMatchs(condition) {
        const match = await Match.find(condition).lean();
        return match;
    }

    async countDocument(condition) {
        const countMatch = await Match.find(condition).count();
        return countMatch;
    }

    async createMatch(payload) {
        const match = new Match(payload);
        return await match.save();
    }

    async getMatchById(matchId) {
        const match = await Match.findById(matchId);
        return match;
    }

    async updateMatchById(matchId, payload) {
        const match = await Match.findByIdAndUpdate(matchId, payload, { new: true });
        return match;
    }

    async updateMatchs(condition, payload) {
        const matchs = await Match.updateMany(condition, payload, { new: true });
        return matchs;
    }

};