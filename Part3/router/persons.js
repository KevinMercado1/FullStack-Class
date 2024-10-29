const express = require('express');
const Person = require('../models/persons');
const router = express.Router();

// Get all persons
router.get('/', (req, res) => {
  Person.find({})
    .then((persons) => {
      res.json(persons);
    })
    .catch((error) => {
      res.status(500).send({ error: 'Failed to fetch persons from database' });
    });
});

// Get info about persons
router.get('/info', (req, res) => {
  Person.countDocuments({})
    .then((count) => {
      const currentTime = new Date();
      res.send(
        `<p>PhoneBook has info for ${count} persons</p> 
        <p>${currentTime}</p>`
      );
    })
    .catch(() => {
      res.status(500).send({ error: 'Failed to retrieve persons count' });
    });
});

// Get a person by ID
router.get('/:id', (req, res) => {
  Person.findById(req.params.id)
    .then((person) => {
      if (person) {
        res.json(person);
      } else {
        res.status(404).send({ error: 'Person not found' });
      }
    })
    .catch((error) => {
      // Check if the error is due to a malformed ID
      if (error.kind === 'ObjectId') {
        res.status(400).send({ error: 'Malformed id' });
      } else {
        res
          .status(500)
          .send({ error: 'An error occurred while fetching the person' });
      }
    });
});

// Delete a person by ID
router.delete('/:id', (req, res) => {
  Person.findByIdAndDelete(req.params.id)
    .then((result) => {
      if (result) {
        res.status(204).end(); // Successfully deleted
      } else {
        res.status(404).send({ error: 'Person not found' });
      }
    })
    .catch((error) => {
      // Check if the error is due to a malformed ID
      if (error.kind === 'ObjectId') {
        res.status(400).send({ error: 'Malformed id' });
      } else {
        res.status(500).send({ error: 'Error deleting  person' });
      }
    });
});

// Add a new person
router.post('/', (req, res) => {
  const { name, number } = req.body;

  if (!name || !number) {
    return res.status(400).json({ error: 'Name or number is missing' });
  }

  const person = new Person({ name, number });

  person
    .save()
    .then((savedPerson) => {
      res.json(savedPerson);
    })
    .catch((error) => {
      if (error.name === 'ValidationError') {
        return res.status(400).json({ error: error.message });
      }
      res.status(500).send({ error: 'Failed to save person' });
    });
});

module.exports = router;
