const mongoose = require('mongoose');

const User = new mongoose.Schema({
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    diskSpace: { type: Number, default: 1024 * 1024 * 1000 },
    usedSpace: { type: Number, default: 0 },
    avatar: { type: String },
    files: [{ type: mongoose.ObjectId, ref: 'File' }],
});

module.exports = mongoose.model('User', User);
