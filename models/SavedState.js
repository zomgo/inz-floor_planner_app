const mongoose = require('mongoose');

const SavedStateSchema = mongoose.Schema({
  walls: {
    type: Array,
    required: true,
  },
});

module.exports = mongoose.model('savedState', SavedStateSchema);
