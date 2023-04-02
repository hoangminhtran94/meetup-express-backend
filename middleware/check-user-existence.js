const { getAUser } = require("../database/user-query");
const serverError = require("../utils/ServerError");
exports.checkUserExistence = async (req, res, next) => {
  const data = req.body;
  let user;
  try {
    user = await getAUser(data.email);
  } catch (error) {
    return next(error);
  }

  if (!user) {
    return next(serverError("Authentication failed", 401));
  }
  req.user = user;

  next();
};
