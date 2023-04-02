const { getAMeetUp } = require("../database/meetup-query");
exports.checkMeetupExistence = async (req, res, next) => {
  const { id } = req.params;
  let currentMeetup;
  try {
    currentMeetup = await getAMeetUp(id);
  } catch (error) {
    return next(serverError(error.message, 500));
  }

  if (!currentMeetup) {
    return next(serverError("This meetup is not existed", 403));
  }
  req.currentMeetup = currentMeetup;
  next();
};
