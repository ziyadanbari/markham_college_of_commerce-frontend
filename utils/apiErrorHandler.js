function apiErrorHandler(err, req, res, next) {
  const [status, message] =
    err instanceof Array ? err : [500, "Something went wrong"];
  res.status(status).json({ message, success: false });
  return next(err);
}
module.exports = apiErrorHandler;
