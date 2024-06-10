const mongoose = require("mongoose");

exports.ErrorHandler = (err, req, res, next) => {
  console.log(err);

  if (err instanceof mongoose.Error.ValidationError) {
    return res.status(422).json(err.errors);
  }

  if (err instanceof mongoose.Error.CastError) {
    return res.status(404).json({ message: "Resource not found" });
  }

  return res.status(500).json(err);
};