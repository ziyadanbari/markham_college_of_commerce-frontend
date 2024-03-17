const { Schema, default: mongoose } = require("mongoose");

const eventSchema = new Schema(
  {
    eventName: {
      type: String,
      required: true,
      trim: true,
      unique: true,
    },
    eventDate: {
      type: Date,
      required: true,
    },
    eventPhoto: [
      {
        photoUrl: {
          type: String,
          required: true,
        },
      },
    ],
  },
  { timestamps: true }
);

const Event = mongoose.model("events", eventSchema);

module.exports = Event;
