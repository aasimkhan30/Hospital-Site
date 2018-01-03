//DB connection
var mongo = require('mongodb');
var monk = require('monk');
var db = monk('mongodb://aasim:aasim@ds041496.mlab.com:41496/hospitalnode');
exports.db = db;