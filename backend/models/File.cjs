const mongoose = require('mongoose');

const File = mongoose.Schema({
    name: { type: String, required: true },
    type: { type: String, required: true },
    accessLink: { type: String },
    size: { type: Number, default: 0 },
    path: { type: String, default: '' },
    user: { type: mongoose.ObjectId, ref: 'User' },
});

module.exports = mongoose.model('File', File);
