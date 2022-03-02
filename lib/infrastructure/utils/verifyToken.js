const jwt = require("jsonwebtoken");

module.exports = (req, res, next) => {

  const token = req.headers["x-access-token"];
  if (!token) {
    return res.status(401).json({
      message: "No token provided",
    });
  }
  jwt.verify(token, process.env.SECRECT, (err, data) => {
    if (err) {
      return res.status(401).json({
        message: "Failed to authenticate token",
      });
    }

    // if everything good, save to request for use in other routes
    req.userId = data.id;
    req.userLevel = data.level;
    next();
  });
};
