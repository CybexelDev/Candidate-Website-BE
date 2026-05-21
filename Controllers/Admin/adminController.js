const Admin = require("../../Models/Admin")
const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken")
const crypto=require("crypto")
const UploadCampaign=require("../../Models/UploadCampaign")
const Candidate=require("../../Models/Candidate")
const adminLogin = async(req, res) => {
    try {
        const { email, password } = req.body
        const admin = await Admin.findOne({ email })

        if (!admin) {
            return res.status(404).json({
                success: false,
                message: "Admin not found"
            })
        }
        const isMatch = await bcrypt.compare(password, admin.password)
        if (!isMatch) {
            return res.status(401).json({
                success: false,
                message: "Invalid password"
            })
        }
        const token = jwt.sign(
            { adminId: admin._id },
            process.env.JWT_SECRET,
            {
                expiresIn: "7d",
            }
        )
        return res.status(200).json({
            success:true,
            message:"Login successfull",
            token
        });

    } catch (error) {
         console.log("Admin Login Error:", error);

    return res.status(500).json({
      success: false,
      message: "Server error",
    });
  
    }
}
const adminLogout =
async (req, res) => {

  try {

    return res.status(200).json({

      success: true,

      message:
        "Logged out successfully",

    });

  } catch (error) {

    console.log(error);

    return res.status(500).json({

      success: false,

      message:
        "Server error",

    });
  }
};
const getCandidateDetails =
async (req, res) => {

  try {

    const { id } =
      req.params;

    const candidate =
      await Candidate.findById(id)
      .populate("campaign");

    if (!candidate) {

      return res.status(404).json({

        success: false,
        message:
          "Candidate not found",

      });
    }

    return res.status(200).json({

      success: true,
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

const updateCandidateStatus =
async (req, res) => {

  try {

    const { id } =
      req.params;

    const { status } =
      req.body;

    const candidate =
      await Candidate.findByIdAndUpdate(

        id,

        { status },

        { new: true }

      );

    return res.status(200).json({

      success: true,

      message:
        "Status updated",

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

const addRemark =
async (req, res) => {

  try {

    const { id } =
      req.params;

    const { text } =
      req.body;

    const candidate =
      await Candidate.findById(id);

    candidate.remarks.push({

      text,

      addedBy: "Admin",

    });

    await candidate.save();

    return res.status(200).json({

      success: true,

      message:
        "Remark added",

      remarks:
        candidate.remarks,

    });

  } catch (error) {

    console.log(error);

    return res.status(500).json({

      success: false,
      message: "Server error",

    });

  }
};


const createUploadLink = async (
  req,
  res
) => {

  try {

    const {
      expiresAt,
      notes,
    } = req.body;

    if (!expiresAt) {

      return res.status(400).json({
        success: false,
        message:
          "Expiry date is required",
      });
    }

    const token = crypto
      .randomBytes(32)
      .toString("hex");

    const campaign =
      await UploadCampaign.create({

        token,

        expiresAt,

        notes,

        isActive: true,

        uploadCount: 0,

      });

    return res.status(201).json({

      success: true,

      message:
        "Upload link generated",

      uploadLink:
`http://localhost:5173/upload/${token}`,

      campaign,

    });

  } catch (error) {

    console.log(error);

    return res.status(500).json({

      success: false,
      message: "Server error",

    });

  }
};

const getUploadCampaigns = async (
  req,
  res
) => {

  try {

    const campaigns =
      await UploadCampaign.find()
      .sort({ createdAt: -1 });

    // TOTAL CAMPAIGNS
    const totalCampaigns =
      campaigns.length;

    // ACTIVE LINKS
    const activeLinks =
      campaigns.filter(
        (camp) =>
          camp.isActive &&
          new Date(camp.expiresAt) >
          new Date()
      ).length;

    // EXPIRED LINKS
    const expiredLinks =
      campaigns.filter(
        (camp) =>
          new Date(camp.expiresAt) <
          new Date()
      ).length;

    // TOTAL UPLOADS
    const totalUploads =
      campaigns.reduce(
        (acc, curr) =>
          acc + curr.uploadCount,
        0
      );

    return res.status(200).json({

      success: true,

      stats: {
        totalCampaigns,
        activeLinks,
        expiredLinks,
        totalUploads,
      },

      campaigns,

    });

  } catch (error) {

    console.log(error);

    return res.status(500).json({

      success: false,
      message: "Server error",

    });

  }
};

const deleteUploadCampaign =
async (req, res) => {

  try {

    const { id } = req.params;

    await UploadCampaign.findByIdAndDelete(
      id
    );

    return res.status(200).json({
      success: true,
      message:
        "Campaign deleted",
    });

  } catch (error) {

    console.log(error);

    return res.status(500).json({
      success: false,
      message: "Server error",
    });

  }
};

const getDashboardData =
async (req, res) => {

  try {

    // CANDIDATES
    const totalCandidates =
      await Candidate.countDocuments();

    const approved =
      await Candidate.countDocuments({
        status: "Approved",
      });

    const rejected =
      await Candidate.countDocuments({
        status: "Rejected",
      });

    const pending =
      await Candidate.countDocuments({
        status: "Pending",
      });

    // RECENT UPLOADS
    const recentUploads =
      await Candidate.find()

      .sort({ createdAt: -1 })

      .limit(5)

      .select(
        "fullName positionApplied status createdAt"
      );

    // CAMPAIGNS
    const activeLinks =
      await UploadCampaign.countDocuments({
         expiresAt: {
          $gt: new Date(),
        },
      });

    const expiredLinks =
      await UploadCampaign.countDocuments({

        expiresAt: {
          $lt: new Date(),
        },

      });

    // TOTAL UPLOADS
    const campaigns =
      await UploadCampaign.find();

    const totalUploadSessions =
      campaigns.reduce(

        (acc, curr) =>
          acc + curr.uploadCount,

        0
      );

    return res.status(200).json({

      success: true,

      stats: {

        totalCandidates,

        pending,

        approved,

        rejected,

        activeLinks,

        expiredLinks,

        totalUploadSessions,

      },

      recentUploads,

    });

  } catch (error) {

    console.log(error);

    return res.status(500).json({

      success: false,

      message:
        "Server error",

    });

  }
};

const getCandidates =
async (req, res) => {

  try {

    const candidates =
      await Candidate.find()
      .sort({ createdAt: -1 });

    // STATS
    const totalCandidates =
      candidates.length;

    const pendingReview =
      candidates.filter(
        (cand) =>
          cand.status ===
          "Pending"
      ).length;

    const approved =
      candidates.filter(
        (cand) =>
          cand.status ===
          "Approved"
      ).length;

    const rejected =
      candidates.filter(
        (cand) =>
          cand.status ===
          "Rejected"
      ).length;

    return res.status(200).json({

      success: true,

      stats: {
        totalCandidates,
        pendingReview,
        approved,
        rejected,
      },

      candidates,

    });

  } catch (error) {

    console.log(error);

    return res.status(500).json({

      success: false,
      message: "Server error",

    });

  }
};

module.exports={adminLogout,adminLogin,createUploadLink,getUploadCampaigns,deleteUploadCampaign,getCandidateDetails,getCandidates,updateCandidateStatus,addRemark,getDashboardData}
