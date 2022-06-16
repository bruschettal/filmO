const jwt = require("jsonwebtoken");

function verify(req, res, next) {
  const authHeader = req.headers.authorization;

  if (authHeader) {
    const token = authHeader.split(" ")[1];

    jwt.verify(token, process.env.SECRET_KEY, (err, user) => {
      if (err)
        return res.status(403).json({
          message: "Token is not valid or expired, please log in again.",
        });

      req.user = user;
      next();
    });
  } else {
    return res.status(401).json({ message: "You are not authorized." });
  }
}

module.exports = verify;
