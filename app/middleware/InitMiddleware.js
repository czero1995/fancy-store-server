const init = function(req, res, next) {
  res.apiResponse = (data) => {
      res.json(data);
  };
  next();
}

module.exports = init
