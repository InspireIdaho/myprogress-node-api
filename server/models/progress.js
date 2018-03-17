var mongoose = require('mongoose');

var ProgressNode = mongoose.model('ProgressNode', {
  indexPath: {
    type: String,
    required: true,
    minLength: 1,
    trim: true
  },
  completedOn: {
    type: Number,    // unix date
    default: null
  },
  _creator: {
    required: true,
    type: mongoose.Schema.Types.ObjectId
  }
});

module.exports = {ProgressNode};
