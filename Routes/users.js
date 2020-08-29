const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const config = require('config');
const { body, validationResult } = require('express-validator');
const router = express.Router();

const User = require('../Models/User');

/***
 * @route   POST /api/users
 * @desc    Register a user
 * @access  Public
 * ***/
router.post(
  '/',
  /*** Validate User Input using (express-validator) ***/
  [
    body('name', 'Please add name').not().isEmpty(),
    body('email', 'Please enter a valide email').isEmail(),
    body(
      'password',
      'Please enter a password with 6 or more characters'
    ).isLength({ min: 6 }),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    /*** Distructure user details from request body ***/
    const { name, email, password } = req.body;

    try {
      /*** Check to see if a user already exits in the database ***/
      let user = await User.findOne({ email });
      if (user) {
        return res.status(400).json({ msg: 'User already exits' });
      }

      /*** Create user with the following details if none exist with the details provided ***/
      user = new User({
        name,
        email,
        password,
      });

      /*** Hash user password before saving user details to the database ***/
      const salt = await bcrypt.genSalt(10);
      user.password = await bcrypt.hash(password, salt);

      /*** Saves user to the database ***/
      await user.save();

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
      console.error(err.message);
      res.status(500).send('Internal Server Error');
    }
  }
);

module.exports = router;
