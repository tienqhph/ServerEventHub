const jwt = require("jsonwebtoken");
const asynchandle = require("express-async-handler");

const verifiTocken = (req, res, next) => {
  const accesstoken = req.headers.authorization;
  const token = accesstoken.split(" ")[1];
  console.log(token);
  if (!accesstoken) {
    res.status(401).send({
      message: "errr",
    });
  } else {
    const verify = jwt.verify(token, process.env.SECRET_KEY);
    console.log(verify);
  }
  next();
};

module.exports = verifiTocken;
