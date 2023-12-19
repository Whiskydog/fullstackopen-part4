const errorHandler = (err, _req, res, next) => {
  switch (err.name) {
    case 'ValidationError':
      res.status(400).json({ error: err.message });
      break;
    default:
      next(err);
      break;
  }
};

module.exports = errorHandler;
