const mongoose = require('mongoose');

const schema = mongoose.Schema;

const sellSchema = new mongoose.Schema ({
    car_name:{
        type: String,
        required: true,
    },
    model:{
        type: String,
        required: true,
    },
    price:{
        type: Number,
        required: true,
    },
    photos:{
        type: String,
        required: true,
    },
    description:{
        type: String,
        required: true,
    },
    createdAt:{
        type: Date,
        default: Date.now
    
    },
});

module.exports = mongoose.model('Sell' , sellSchema)


