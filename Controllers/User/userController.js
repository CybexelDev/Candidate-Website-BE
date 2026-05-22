const UploadCampaign = require("../../Models/UploadCampaign");
const Candidate=require("../../Models/Candidate")
const crypto=require("crypto")

const validateUploadLink = async (req, res) => {
  try {

    const { token } = req.params;

    const campaign =
      await UploadCampaign.findOne({
        token,
      });

    if (!campaign) {
      return res.status(404).json({
        success: false,
        message: "Invalid upload link",
      });
    }

    if (!campaign.isActive) {
      return res.status(400).json({
        success: false,
        message: "Upload link is inactive",
      });
    }

    if (new Date() > campaign.expiresAt) {
      return res.status(400).json({
        success: false,
        message: "Upload link expired",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Valid upload link",
    });

  } catch (error) {

    console.log(error);

    return res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

const submitDocuments =
async (req, res) => {

  try {

    const { token } =
      req.params;

    const campaign =
      await UploadCampaign.findOne({
        token,
      });

    // INVALID LINK
    if (!campaign) {

      return res.status(404).json({

        success: false,
        message:
          "Invalid upload link",

      });
    }

    // EXPIRED
    if (
      new Date(
        campaign.expiresAt
      ) < new Date()
    ) {

      return res.status(400).json({

        success: false,
        message:
          "Upload link expired",

      });
    }

    const {

      fullName,
      mobileNumber,
      email,
      positionApplied,

      emergencyContactName,

      emergencyContactNumber,

      relationshipWithEmergency,

    } = req.body;

    // CHECK DUPLICATE
    const existingCandidate =
      await Candidate.findOne({

        campaign:
          campaign._id,

        $or: [
          { email },
          { mobileNumber },
        ],

      });

    if (existingCandidate) {

      return res.status(400).json({

        success: false,

        message:
          "Documents already submitted",

      });
    }

    // FILES
    const files = req.files;

    const candidate =
      await Candidate.create({

        campaign:
          campaign._id,

        fullName,

        mobileNumber,

        email,

        positionApplied,

        emergencyContactName,

        emergencyContactNumber,

        relationshipWithEmergency,

    documents: {

  sslcCertificate:
    files?.sslcCertificate?.[0]
      ?.path || null,

  higherSecondaryCertificate:
    files?.higherSecondaryCertificate?.[0]
      ?.path || null,

  degreeCertificate:
    files?.degreeCertificate?.[0]
      ?.path || null,

  aadhaarCard:
    files?.aadhaarCard?.[0]
      ?.path || null,

  passportPhoto:
    files?.passportPhoto?.[0]
      ?.path || null,

  resume:
    files?.resume?.[0]
      ?.path || null,

  panCard:
    files?.panCard?.[0]
      ?.path || null,
},

        folderId:
crypto.randomBytes(6)
.toString("hex"),

        submissionId:
crypto.randomBytes(8)
.toString("hex"),

        isSubmitted: true,

        submittedAt:
new Date(),

      });

    // INCREMENT COUNT
    campaign.uploadCount += 1;

    await campaign.save();

    return res.status(201).json({

      success: true,

      message:
        "Documents submitted successfully",

      candidate,

    });

  } catch (error) {

    console.log(error);

    return res.status(500).json({

      success: false,
      message: "Server error",

    });

  }
};


module.exports = {
  validateUploadLink,submitDocuments
};