class UserEntity {
    constructor(payload) {
        this.id = payload._id || "";
        this.username = payload.username || "";
        this.coin = payload.coin || 0;
        this.create_time = payload.create_time || "";
        this.update_time = payload.update_time || "";
        this.password = payload.password || "";
    }
}

module.exports = UserEntity;