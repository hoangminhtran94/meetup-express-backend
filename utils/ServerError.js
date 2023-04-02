const serverError = (message, status) => {
  const error = new Error(message);
  error.status = status;
  error.statusText = message;
  return error;
};

module.exports = serverError;
