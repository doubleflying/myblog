var mongoose = require('mongoose');

mongoose.connect("mongodb://localhost/nodeblog");

var userSchema = new mongoose.Schema({
    name: {
        type: String,
        unique: true
    },
    pwd: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    isAdmin: {
        type: Boolean,
        required: true
    }
})

var User = mongoose.model("User", userSchema);

module.exports = User;