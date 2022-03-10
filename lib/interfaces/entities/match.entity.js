class MatchEntity {
    constructor(payload) {
        this.id = payload._id || "";
        this.room_id = payload.room_id || "";
        this.participant = payload.participant || [];
        this.cards_used = payload.cards_used || [];
        this.room_master = payload.room_master || "";
        this.create_time = payload.create_time || "";
        this.update_time = payload.update_time || "";
    }
}

module.exports = MatchEntity;