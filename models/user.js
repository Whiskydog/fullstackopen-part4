const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: 'Missing username',
    unique: 'Username must be unique',
    minLength: [3, 'Username must be at least 3 characters long'],
  },
  passwordHash: { type: String },
  name: { type: String },
  blogs: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Blog' }],
});

userSchema.plugin(uniqueValidator);

userSchema.set('toJSON', {
  transform: (doc, ret) => {
    ret.id = doc._id.toString();
    delete ret.passwordHash;
    delete ret._id;
    delete ret.__v;
  },
});

const User = mongoose.model('User', userSchema);

module.exports = User;
