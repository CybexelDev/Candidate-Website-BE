const express=require("express")

const router=express.Router()
const upload=require("../Middleware/multerMiddleware")
const {validateUploadLink,submitDocuments}=require("../Controllers/User/userController")

router.get(
  "/validate/:token",
  validateUploadLink
); 
router.post(

  "/submit-documents/:token",

  upload.fields([

    {
      name:
      "sslcCertificate",
      maxCount: 1,
    },

    {
      name:
      "higherSecondaryCertificate",
      maxCount: 1,
    },

    {
      name:
      "degreeCertificate",
      maxCount: 1,
    },

    {
      name:
      "aadhaarCard",
      maxCount: 1,
    },

    {
      name:
      "passportPhoto",
      maxCount: 1,
    },

    {
      name:
      "resume",
      maxCount: 1,
    },

    {
      name:
      "panCard",
      maxCount: 1,
    },

  ]),

  submitDocuments
);

module.exports=router