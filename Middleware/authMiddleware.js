const jwt = require("jsonwebtoken");

const adminAuth = async (req, res, next) => {
  try {

    const authHeader = req.headers.authorization;

    if (!authHeader) {
      return res.status(401).json({
        success: false,
        message: "No token provided",
      });
    }

    const token = authHeader.split(" ")[1];

    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET
    );

    req.adminId = decoded.adminId;

    next();

  } catch (error) {

    return res.status(401).json({
      success: false,
      message: "Invalid token",
    });
  }
};

module.exports = adminAuth;