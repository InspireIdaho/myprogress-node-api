var mongoose = require('mongoose');

var Progress = mongoose.model('Progress', {
  indexPath: {
    type: Object,
    required: true,
  },
  completedOn: {
    type: Number,    // unix date
    required: true,
    default: null
  },
  _creator: {
    required: true,
    type: mongoose.Schema.Types.ObjectId
  }
});

module.exports = {Progress};
