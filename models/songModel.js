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
      min: [1, 'Duration must be at least 1 second'],
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
  { timestamps: true, toJSON: { virtuals: true }, toObject: { virtuals: true } }
);

const Song = mongoose.model('Song', songSchema);
module.exports = Song;

songSchema.virtual('formattedDuration').get(function () {
  if (!this.duration) return '00:00';

  const hours = Math.floor(this.duration / 3600);
  const minutes = Math.floor((this.duration % 3600) / 60);
  const seconds = Math.floor(this.duration % 60);

  if (hours > 0) {
    return [
      hours.toString().padStart(2, '0'),
      minutes.toString().padStart(2, '0'),
      seconds.toString().padStart(2, '0'),
    ].join(':');
  }

  return [
    minutes.toString().padStart(2, '0'),
    seconds.toString().padStart(2, '0'),
  ].join(':');
});
