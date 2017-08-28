const mongoose = require('mongoose');
const Schema   = mongoose.Schema;

let monster = new Schema({
  name:        {type: String, required: true},
  level:       {type: Number, required: true},
  description: {type: String, required: true}
});

module.exports = mongoose.model('Monster', monster);
