const jwt = require('jsonwebtoken');
const config = require('config');

module.exports = function (req, res, next) {
  /*** GET token from request header ***/
  const token = req.header('x-auth-token');

  /*** Check to see if token exist  ***/
  if (!token) {
    return res.status(401).json({ msg: 'No token, authorization denied' });
  }

  try {
    /*** If there is a token, pull out the payload ***/
    const decoded = jwt.verify(token, config.get('jwtSecret'));
    req.user = decoded.user;
    next();
  } catch (error) {
    res.status(401).json({ msg: 'Token is not valid' });
  }
};
