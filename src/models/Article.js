const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ArticleSchema = new Schema({
  title: { type: String, required: true },
  content: String,
  owner: { type: Schema.Types.ObjectId, ref: 'User' },
  tags: [String]
}, { timestamps: true });

ArticleSchema.index({ title: 'text', content: 'text', tags: 'text' });

module.exports = mongoose.model('Article', ArticleSchema);
