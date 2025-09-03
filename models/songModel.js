const mongoose = require('mongoose');

const songSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Please provide a title for this song!!'],
    },
    artist: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Song must belong to a Artist'],
    },
    album: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Album',
    },
    duration: {
      type: Number,
      required: [true, 'A song must have a duration'],
    },
    image: {
      type: String,
      default: 'song.jpg',
    },
    audioUrl: {
      type: String,
      required: [true, 'A song must have its own url'],
    },
    plays: {
      type: Number,
      default: 0,
      min: [0, 'Play must be above 0'],
    },
    likes: {
      type: Number,
      default: 0,
      min: [0, 'Likes must be above 0'],
    },
  },
  { timestamps: true }
);

const Song = mongoose.model('Song', songSchema);
module.exports = Song;
