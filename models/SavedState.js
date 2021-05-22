const mongoose = require('mongoose');

const SavedStateSchema = mongoose.Schema({
  state: {
    type: Array,
    required: true,
  },
});

module.exports = mongoose.model('savedState', SavedStateSchema);
