var mongoose = require('mongoose');
var FormSchema = require('../schemas/form');
var Form = mongoose.model('Form',FormSchema);
module.exports = Form;