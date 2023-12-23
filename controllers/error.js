const errorHandler = (err, _req, res, next) => {
  switch (err.name) {
    case 'CastError':
      res.status(400).json({ error: 'Malformatted id' });
      break;
    case 'ValidationError':
      res.status(400).json({ error: err.message });
      break;
    case 'TypeError':
      res.status(400).json({ error: err.toString() });
      break;
    case 'UnauthorizedError':
      res.status(err.status).json({ error: err.inner.message });
      break;
    default:
      next(err);
      break;
  }
};

module.exports = errorHandler;
