class RoomEntity {
    constructor(payload) {
        this.id = payload._id || "";
        this.max_user = payload.max_user || 4;
        this.current_number_user = payload.current_number_user || 0;
        this.current_user = payload.current_user || [];
        this.price = payload.price || 1000;
        this.create_time = payload.create_time || "";
        this.update_time = payload.update_time || "";
    }
}

module.exports = RoomEntity;