const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const config = require('config');
const auth = require('../Middleware/auth');
const { body, validationResult } = require('express-validator');

const User = require('../Models/User');

/***
 * @route   GET /api/auth
 * @desc    Get logged in user
 * @access  Private
 *  ***/
router.get('/', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    res.json(user);
  } catch (err) {
    console.log(err.message);
    res.status(500).send('Internal Server Error');
  }
});

/***
 *@route    POST / api/auth
 * @desc    Auth user & get token
 * @access  Public
 * ***/
router.post(
  '/',
  /*** Validate User Input using (express-validator) ***/
  [
    body('email', 'Please include a valide email').isEmail(),
    body('password', 'Password is required').exists(),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(400).json({ errors: errors.array() });
    }

    /*** Distructure the email and password from request body ***/
    const { email, password } = req.body;

    try {
      /*** Find user in the DB by email ***/
      let user = await User.findOne({ email });

      /*** Check to see if user does not exist in the DB before proceeding to the next action ***/
      if (!user) {
        return res
          .status(400)
          .json({ msg: 'Invalide credentials, user does not exit' });
      }

      /***Check user password by comparing user password using bcrypt.compare() to compare user password with what in the DB ***/
      const isMatch = await bcrypt.compare(password, user.password);

      /*** Check to see if user password matches what in the DB ***/
      if (!isMatch) {
        return res
          .status(400)
          .json({ msg: 'Invalide credentials, password is incorrect' });
      }

      const payload = {
        user: {
          id: user.id,
        },
      };

      jwt.sign(
        payload,
        config.get('jwtSecret'),
        {
          expiresIn: 360000,
        },
        (err, token) => {
          if (err) throw err;
          res.json({ token });
        }
      );
    } catch (err) {
      console.log(err.message);
      res.status(500).send('Internal server error');
    }
  }
);

module.exports = router;
