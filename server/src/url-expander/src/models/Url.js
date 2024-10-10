// src/models/Url.js
import mongoose from 'mongoose';

const UrlSchema = new mongoose.Schema({
    urlCode: String,
    longUrl: String,
    shortUrl: String,
    clicks: {
        type: Number,
        default: 0
    },
    date: {
        type: String,
        default: Date.now
    }
});

export default mongoose.model('Url', UrlSchema);