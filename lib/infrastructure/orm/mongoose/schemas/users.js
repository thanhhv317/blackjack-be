const mongoose = require('../mongoose');
const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    coin: {
      type: Number,
      default: 20000,
    },
    status: {
      type: String,
      default: "ACTIVE",
      enum: ["ACTIVE", "INACTIVE", "DELETE"],
    },
    level: {
      type: Number,
      default: 1,
    },
  },
  {
    timestamps: { createdAt: 'create_time', updatedAt: 'update_time' },
    skipVersioning: true,
  }
);

module.exports = mongoose.model("Users", userSchema);
