const express = require('express');
const router = express.Router();
const SavedState = require('../models/SavedState');

// @route POST api/savedState
// @desc Save state
router.post('/', async (req, res) => {
  const { objects } = req.body;

  try {
    let savedState = new SavedState({
      objects,
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

    res.json(state);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

module.exports = router;
