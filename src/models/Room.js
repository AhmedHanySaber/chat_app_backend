const mongoose = require('mongoose');

const roomSchema = new mongoose.Schema({
    name:      { type: String, required: true, unique: true },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    members:   [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    messages:  [{ type: mongoose.Schema.Types.ObjectId, ref: 'Message' }]
});

module.exports = mongoose.model('Room', roomSchema);