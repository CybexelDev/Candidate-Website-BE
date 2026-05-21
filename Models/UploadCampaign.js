const mongoose = require("mongoose");

const uploadCampaignSchema = new mongoose.Schema(
  {
    token: {
      type: String,
      required: true,
      unique: true,
    },

    expiresAt: {
      type: Date,
      required: true,
    },

    isActive: {
      type: Boolean,
      default: true,
    },
    uploadCount: {
  type: Number,
  default: 0,
},
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model(
  "UploadCampaign",
  uploadCampaignSchema
);