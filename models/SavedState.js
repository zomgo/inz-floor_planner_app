const mongoose = require('mongoose');

const SavedStateSchema = mongoose.Schema({
  objects: {
    type: Array,
    required: true,
  },
});

module.exports = mongoose.model('savedState', SavedStateSchema);
