const mongoose = require('../mongoose');
const roomSchema = new mongoose.Schema(
  {
    max_user: {
      type: Number,
      default: 4
    },
    current_number_user: {
      type: Number,
      default: 0
    },
    current_user: {
      type: Array,
    },
    price: {
      type: Number,
      default: 1000
    },
    status: {
      type: String,
      enum: ['RUNNING', 'WAITTING'],
      default: 'WAITTING'
    }
  },
  {
    timestamps: { createdAt: 'create_time', updatedAt: 'update_time' },
    skipVersioning: true,
  }
);

module.exports = mongoose.model("Rooms", roomSchema);
