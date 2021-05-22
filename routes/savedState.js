const express = require('express');
const router = express.Router();

const SavedState = require('../models/SavedState');

// @route POST api/savedState
// @desc Save state
router.post('/', async (req, res) => {
  const { state } = req.body;

  try {
    let savedState = new SavedState({
      state,
    });
    let id = savedState._id;

    await savedState.save();
    res.send(id);
  } catch (error) {
    console.error(error.message);
    res.status(500).send('Server Error');
  }
});

// @route GET api/savedState
// @desc load state
router.get('/:id', async (req, res) => {
  try {
    const state = await SavedState.findById(req.params.id);

    if (!state) {
      return res.status(404).json({ msg: 'Save not found' });
    }

    res.json(state.state);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
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
