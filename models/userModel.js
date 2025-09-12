const mongoose = require('mongoose');
const validator = require('validator');
const crypto = require('crypto');

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Please tell us your name!'],
    },
    email: {
      type: String,
      required: [true, 'Please provide your email'],
      unique: true,
      lowercase: true,
      validate: [validator.isEmail, 'Please provide a valid email'],
    },
    avatar: {
      type: String,
      default: 'default.jpg',
    },
    password: {
      type: String,
      required: [true, 'Please provide a password'],
      select: false,
    },
    passwordConfirm: {
      type: String,
      required: [true, 'Please confirm your password'],
      validate: {
        validator: function (el) {
          return el === this.password;
        },
        message: 'Password are not the same',
      },
    },
    isVerified: { type: Boolean, default: false },
    verificationToken: String,
    verificationExpires: Date,

    passwordChangeAt: Date,
    resetToken: String,
    passwordResetExpires: Date,
    role: {
      type: String,
      default: 'user',
      enum: ['user', 'artist', 'admin'],
    },
    banner: {
      type: String,
      default: 'banner.jbg',
    },
    clerkId: {
      type: String,
      unique: true,
      sparse: true,
    },
    artistInfo: {
      bio: String,
      followers: { type: Number, default: 0 },
      verified: { type: Boolean, default: false },
    },
    likedSongs: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Song',
      },
    ],
    followedArtists: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
      },
    ],
    playlists: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Playlist',
      },
    ],
  },
  { timestamps: true }
);

userSchema.methods.createToken = function (typeToken) {
  const token = crypto.randomBytes(32).toString('hex');
  const hash = crypto.createHash('sha256').update(token).digest('hex');

  if (typeToken !== 'verificationToken' && typeToken !== 'resetToken') {
    throw new Error('Invalid token type');
  }

  if (typeToken === 'verificationToken') {
    this.verificationToken = hash;
    this.verificationExpires = Date.now() + 24 * 60 * 60 * 1000;
  } else {
    this.resetToken = hash;
    this.passwordResetExpires = Date.now() + 10 * 60 * 1000;
  }

  return token;
};

const User = mongoose.model('User', userSchema);

module.exports = User;
