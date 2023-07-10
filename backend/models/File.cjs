const mongoose = require('mongoose');

const File = mongoose.Schema({
    originalname: { type: String, required: true },
    mimetype: { type: String, required: true },
    buffer: { type: Buffer, required: true },
    encoding: { type: String },
    accessLink: { type: String },
    size: { type: Number, default: 0 },
    userId: { type: mongoose.ObjectId, ref: 'User' },
    public: { type: Boolean, default: false },
});

module.exports = mongoose.model('File', File);
