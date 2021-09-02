const mongoose = require('mongoose');
let doctorSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    name: {
        firstName: {
            type: String,
            required: true
        },
        lastName: String
    },
    dateOfBirth: Date,
    address: {
        state:{
            type: String,
            validate: {
                validator: function (s) {
                    return s.length >= 2 && s.length <= 3;
                },
                message: 'min 2, max 3 characters'
            }
        },
        suburb: String,
        street: String,
        unit: String
    },
    numPatients:{
        type: Number,
        validate: {
            validator: function (n) {
                return n >= 0;
            },
            message: 'Number of patient should be positive'
        }
    },

});
module.exports = mongoose.model('doctor', doctorSchema);