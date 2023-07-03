const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const planSchema = new Schema({
    Place: {
        type: String,
        required: true
    },
    Day: {
        type: Number,
        required: true
    },
    body: {
        type: String,
        required: true
    }
}, { timestamps: true });

const Plan = mongoose.model('plan', planSchema);
module.exports = Plan;