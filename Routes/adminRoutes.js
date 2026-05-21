const express=require("express")
const router=express.Router()
const {adminLogin,createUploadLink,deleteUploadCampaign,getUploadCampaigns,getCandidateDetails,getCandidates,updateCandidateStatus,addRemark,getDashboardData,adminLogout}=require("../Controllers/Admin/adminController");
const adminAuth = require("../Middleware/authMiddleware");

router.post("/login",adminLogin)
router.post(
  "/logout",
  adminLogout
);
router.post( "/create-upload-link",adminAuth,createUploadLink);
router.delete("/upload-campaign/:id", adminAuth,deleteUploadCampaign);
router.get("/upload-campaigns",adminAuth, getUploadCampaigns);
router.get(
  "/candidates",
  adminAuth,
  getCandidates
);

router.get(
  "/candidate/:id",
  adminAuth,
  getCandidateDetails
);

router.patch(
  "/candidate-status/:id",
  adminAuth,
  updateCandidateStatus
);

router.post(
  "/add-remark/:id",
  adminAuth,
  addRemark
);

router.get(
  "/dashboard",
  adminAuth,
  getDashboardData
);
module.exports=router