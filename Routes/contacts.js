const express = require('express');
const router = express.Router();
const auth = require('../Middleware/auth');
const {
  body,
  ValidationResult,
  validationResult,
} = require('express-validator');
const User = require('../Models/User');
const Contact = require('../Models/Contact');

/***
 * @route   GET /api/contacts
 * @desc    Get all users contacts
 * @access  Private
 * ***/
router.get('/', auth, async (req, res) => {
  try {
    const contacts = await Contact.find({ user: req.user.id }).sort({
      date: -1,
    });
    res.json(contacts);
  } catch (err) {
    console.log(err.message);
    res.status(500).send('Server Error');
  }
});

/***
 * @route   POST  /api/contacts
 * @desc    Add new contact
 * @access  Private
 * ***/
router.post(
  '/',
  /*** Validate that name is provided ***/
  [auth, [body('name', 'Name is required').not().isEmpty()]],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(400).json({ errors: errors.array() });
    }

    const { name, email, phone, type } = req.body;

    try {
      /*** Add new contact to the DB ***/
      const newContacts = new Contact({
        name,
        email,
        phone,
        type,
        user: req.user.id,
      });

      /*** Save new contact to the DB ***/
      const contact = await newContacts.save();

      /*** Return saved contact to the client ***/
      res.json(contact);
    } catch (err) {
      console.log(err.message);
      res.status(500).send('Server Error');
    }
  }
);

/***
 * @route   PUT /api/contacts/:id
 * @desc    Update contact
 * @access  Private
 * ***/
router.put('/:id', auth, async (req, res) => {
  const { name, email, phone, type } = req.body;

  /*** Build a contact object ***/
  const contactFields = {};
  if (name) contactFields.name = name;
  if (email) contactFields.email = email;
  if (phone) contactFields.phone = phone;
  if (type) contactFields.type = type;

  try {
    let contact = await Contact.findById(req.params.id);

    if (!contact) {
      return res.status(404).json({ msg: 'Contact not found' });
    }

    /*** Make sure user owns contact ***/
    if (contact.user.toString() !== req.user.id) {
      return res.status(401).json({ msg: 'Not authorized' });
    }

    contact = await Contact.findByIdAndUpdate(
      req.params.id,
      {
        $set: contactFields,
      },
      {
        new: true,
      }
    );

    res.json(contact);
  } catch (err) {
    console.log(err.message);
    res.status(500).send('Server Error');
  }
});

/***
 * @route   DELETE /api/contact/:id
 * @desc    Delete contact
 * @access  Private
 * ***/
router.delete('/:id', auth, async (req, res) => {
  try {
    let contact = await Contact.findById(req.params.id);

    if (!contact) {
      res.status(404).json({ msg: 'Contact not found' });
    }

    if (contact.user.toString() !== req.user.id) {
      res.status(401).json({ msg: 'Not authorized' });
    }
    
    await Contact.findByIdAndRemove(req.params.id);

    res.json({ msg: 'Contact removed' });
  } catch (err) {
    console.error(err.message)
    res.status(500).send('Internal Server Error')
  }
});

module.exports = router;
