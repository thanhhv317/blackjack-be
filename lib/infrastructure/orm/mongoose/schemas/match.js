const mongoose = require('../mongoose');
const matchSchema = new mongoose.Schema(
    {
        room_id: {
            type: mongoose.Types.ObjectId,
        },
        participant: {
            type: Array,
            default: []
        },
        cards_used: {
            type: Array,
            default: [],
        },
        room_master: {
            type: String,
        }
    },
    {
        timestamps: { createdAt: 'create_time', updatedAt: 'update_time' },
        skipVersioning: true,
    }
);

module.exports = mongoose.model("Matchs", matchSchema);
