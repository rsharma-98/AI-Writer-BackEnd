const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const AILogSchema = new Schema({
  user: { type: Schema.Types.ObjectId, ref: 'User' },
  prompt: String,
  response: String,
  meta: Schema.Types.Mixed
}, { timestamps: true });

module.exports = mongoose.model('AILog', AILogSchema);
