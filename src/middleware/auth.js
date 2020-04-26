module.exports.isAuthUser = (req, res, next) => {
  if (req.session.user && !req.session.user.isTempUser) {
    return next();
  }
  return res.sendStatus(401);
};

module.exports.isTempUser = (req, res, next) => {
  if (req.session.user && req.session.user.isTempUser) {
    return next();
  }
  return res.sendStatus(401);
};
