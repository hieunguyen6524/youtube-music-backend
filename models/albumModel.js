const mongoose = require('mongoose');

const albumSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Please name this album'],
    },
    artist: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    coverImage: String,
    releaseDate: Date,
    songs: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Song' }],
  },
  { timestamps: true }
);

const Album = mongoose.model('Album', albumSchema);

module.exports = Album;
