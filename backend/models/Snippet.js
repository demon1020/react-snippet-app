const mongoose = require('mongoose');

const snippetSchema = new mongoose.Schema({
  code: { type: String, required: true },
  preview: { type: String, required: true },
});

const Snippet = mongoose.model('Snippet', snippetSchema);

module.exports = Snippet;
