const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  email: { type: String, unique: true, required: true },
  password: { type: String, required: true },
});

userSchema.pre('save', function (next) {
  const user = this;
  if (!user.isModified('password')) {
    return next();
  }
  bcrypt.hash(user.password, 10, (err, hashedPassword) => {
    if (err) {
      return next(err);
    }
    user.password = hashedPassword;
    next();
  });
});

const User = mongoose.model('User', userSchema);

module.exports = User;
