const mongoose = require("mongoose");

const candidateSchema =
new mongoose.Schema({

  // LINKED CAMPAIGN
  campaign: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "UploadCampaign",
    required: true,
  },

  // BASIC DETAILS
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
    required: true,
  },

  // EMERGENCY CONTACT
  emergencyContactName: {
    type: String,
    required: true,
  },

  emergencyContactNumber: {
    type: String,
    required: true,
  },

  relationshipWithEmergency: {
    type: String,
    required: true,
  },

  // DOCUMENTS
  documents: {

    sslcCertificate: String,

    higherSecondaryCertificate:
      String,

    degreeCertificate:
      String,

    aadhaarCard:
      String,

    passportPhoto:
      String,

    resume:
      String,

    panCard:
      String,

  },

  // STATUS
  status: {
    type: String,
    enum: [
      "Pending",
      "Reviewing",
      "Approved",
      "Rejected",
    ],
    default: "Pending",
  },

  // HR REMARKS
  remarks: [
    {
      text: String,

      addedBy: String,

      createdAt: {
        type: Date,
        default: Date.now,
      },
    },
  ],

  // SECURITY
  folderId: String,

  submissionId: String,

  // FLAGS
  isSubmitted: {
    type: Boolean,
    default: false,
  },

  // TRACKING
  submittedAt: Date,

}, {
  timestamps: true,
});

module.exports =
mongoose.model(
  "Candidate",
  candidateSchema
);