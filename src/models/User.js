const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    name: String,
    email: String,
    password: String, // Optional, depending on how you use Auth0
});

module.exports = mongoose.model('User', UserSchema);
