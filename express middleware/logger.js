const logger = function (req, res, next) {
  console.log(`[${new Date().ISOString()}] ${req.method} to ${req.url}`);

  next();
};

module.exports = logger;
