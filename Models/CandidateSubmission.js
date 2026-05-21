const mongoose = require("mongoose");

const candidateSubmissionSchema =
  new mongoose.Schema(
    {
      fullName: {
        type: String,
        required: true,
      },

      mobileNumber: {
        type: String,
        required: true,
      },

      email: {
        type: String,
        required: true,
      },

      positionApplied: {
        type: String,
      },

      emergencyContactName: {
        type: String,
        required: true,
      },

      emergencyContactNumber: {
        type: String,
        required: true,
      },

      relationshipWithEmergencyContact: {
        type: String,
        required: true,
      },

      documents: {

        sslcCertificate: {
          type: String,
          required: true,
        },

        degreeCertificate: {
          type: String,
          required: true,
        },

        aadhaarCard: {
          type: String,
          required: true,
        },

        passportPhoto: {
          type: String,
          required: true,
        },

        resume: {
          type: String,
          required: true,
        },

        panCard: {
          type: String,
        },
      },

      status: {
        type: String,
        enum: [
          "pending",
          "approved",
          "rejected",
        ],
        default: "pending",
      },

      remarks: {
        type: String,
      },

      uploadCampaign: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "UploadCampaign",
      },
    },
    {
      timestamps: true,
    }
  );

module.exports = mongoose.model(
  "CandidateSubmission",
  candidateSubmissionSchema
);