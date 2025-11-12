const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const UserSchema = new Schema({
  name: String,
  email: { type: String, unique: true, required: true },
  passwordHash: { type: String, required: true },
  role: { type: String, enum: ['admin','editor','viewer'], default: 'editor' }
}, { timestamps: true });

module.exports = mongoose.model('User', UserSchema);
