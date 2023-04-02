const jwt = require("jsonwebtoken");
const serverError = require("../utils/ServerError");
const { getAUserById } = require("../database/user-query");
exports.checkAuth = async (req, res, next) => {
  const headerValue = req.get("Authorization");
  let token;
  if (headerValue) {
    token = headerValue.split(" ")[1];
  } else {
    return next(serverError("Authentication failed", 403));
  }

  const jwtData = jwt.verify(token, "thisismysecret");
  if (jwtData.userId) {
    let user;
    try {
      user = await getAUserById(jwtData.userId);
    } catch (error) {
      return next(serverError("Authentication failed", 403));
    }
    if (!user) {
      return next(serverError("Authentication failed", 403));
    }
    req.currentUser = user;
  } else {
    return next(serverError("Authentication failed", 403));
  }
  next();
};
