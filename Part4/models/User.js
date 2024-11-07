const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

// Definir el esquema del usuario
const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
  },
  passwordHash: {
    type: String,
    required: true,
  },
  blog: { type: mongoose.Schema.Types.ObjectId, ref: 'Blog' },
});

// Middleware para encriptar la contraseña antes de guardarla
userSchema.pre('save', function (next) {
  if (this.isModified('passwordHash') || this.isNew) {
    const saltRounds = 10;
    bcrypt.hash(this.passwordHash, saltRounds, (error, hashedPassword) => {
      if (error) return next(error);
      this.passwordHash = hashedPassword;
      next();
    });
  } else {
    next();
  }
});

userSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString();
    delete returnedObject._id;
    delete returnedObject.__v;
    delete returnedObject.passwordHash;
  },
});

const User = mongoose.model('User', userSchema);

module.exports = User;
