const mongoose = require('mongoose')

const modelSchema = new mongoose.Schema({
    url:{
        type:String,
        required:true
    }
},{timestamps:true

})

const Url = mongoose.model('Url',modelSchema)
module.exports = Url