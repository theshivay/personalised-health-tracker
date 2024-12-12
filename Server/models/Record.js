const mongoose = require('mongoose');

const RecordSchema = new mongoose.Schema({
    name: { type: String, required: true },
    age: { type: Number, required: true },
    description: { type: String, required: true },
    reportData: { type: Object, default: {} },
});

module.exports = mongoose.model('Record', RecordSchema);
