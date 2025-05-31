const mongoose = require("mongoose");

const UserlocationsSchema = new mongoose.Schema(
  {
    useridlocation: {
        type: String,
        required: true,
      },
      location: {
        type: {
          type: String,
          enum: ["Point"],
          required: true,
        },
        coordinates: {
          type: [Number], // [longitude, latitude]
          required: true,
        },
      },
    },
  { timestamps: true }
);

module.exports = mongoose.model("Userlocations", UserlocationsSchema);
