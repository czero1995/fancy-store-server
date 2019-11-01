const InitMiddleware = (req, res, next) => {
  res.apiResponse = data => {
    if (req.query.callback) {
      res.jsonp(data);
    } else {
      res.json(data);
    }
  };

  res.apiNotFound = (err, msg) => {
    res.apiError("data not found", err, msg || "not found", 404);
  };

  res.apiNotAllowed = (err, msg) => {
    res.apiError("access not allowed", err, msg || "not allowed", 403);
  };
  next();
};

export default InitMiddleware;
