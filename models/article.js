var mongoose = require('mongoose');

mongoose.connect("mongodb://localhost/nodeblog");

var articleSchema = new mongoose.Schema({
    id: {
        type: Number,
        unique: true
    },
    title: {
        type: String,
        required: true
    },
    slug: {
        type: String,
        required: true
    },
    isPublish: {
        type: Boolean,
        required: true
    },
    content: {
        type: String,
        required: true
    }
})

var Article = mongoose.model('Article', articleSchema);

module.exports = Article;