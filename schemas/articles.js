const mongoose = require("mongoose");
const AutoIncrement = require('mongoose-sequence')(mongoose);

const articlesSchema = new mongoose.Schema({
    articleId: {
        type: Number,
        unique: true
    },
    title: {
        type: String,
        required: true
    },
    content: {
        type: String,
        required: true
    },
    createDate: {
        type: String,
        format: Date,
        required: true
    },
    writer: {
        type: String,
        required: true
    },
    pwd: {
        type: String,
        required: true
    }
});
articlesSchema.plugin(AutoIncrement, {id: 'article_seq', inc_field: 'articleId' });

module.exports = mongoose.model("Articles", articlesSchema);