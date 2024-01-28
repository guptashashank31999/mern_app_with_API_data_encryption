const mongoose = require('mongoose');
const newCredentials = new mongoose.Schema({
    name : String,
    email : String,
});


module.exports = mongoose.model("newCredentials",newCredentials);