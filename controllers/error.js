const errorHandler = (err, _req, res, next) => {
  switch (err.name) {
    case 'ValidationError':
      res.status(400).json({ error: err.message });
      break;
    case 'TypeError':
      res.status(400).json({ error: err.toString() });
      break;
    case 'UnauthorizedError':
      res.status(401).json({ error: err.message });
    default:
      next(err);
      break;
  }
};

module.exports = errorHandler;
