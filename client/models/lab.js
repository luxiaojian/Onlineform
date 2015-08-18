var mongoose = require('mongoose');
var LabSchema = require('../schemas/lab');
var Lab = mongoose.model('Lab',LabSchema);
module.exports = Lab;