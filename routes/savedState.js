const express = require('express');
const router = express.Router();

// @route POST api/savedState
// @desc Save state
router.post('/', (req, res) => {
  res.send('Saved state');
});

// @route GET api/savedState
// @desc load state
router.get('/:id', (req, res) => {
  res.send('Load state');
});

// @route PUT api/savedState
// @desc load state
router.put('/:id', (req, res) => {
  res.send('Updated state');
});

// @route DELETE api/savedState
// @desc delete state
router.delete('/:id', (req, res) => {
  res.send('deleted state');
});

module.exports = router;
