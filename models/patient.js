const mongoose = require('mongoose');
let patientSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    fullName: {
        type: String,
        required: true
    },
    doctor: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'doctor'
    },
    age: {
        type: Number,
        validate: {
            validator: function (ageValue) {
                return ageValue >= 0 && ageValue <= 120;
            },
            message: 'Age should be a number between 10 and 110'
        }
    },
    dateOfVisit: {
        type: Date,
        default: Date.now
    },
    caseDescription:{
        type: String,
        validate: {
            validator: function (d) {
                return d.length >= 10;
            },
            message: 'Age should be a number between 10 and 110'
        }
    }
});
module.exports = mongoose.model('patient', patientSchema);