const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    username: {type: String, required: true},
    email:{type: String, required: true},
    password:{type: String, required: true},
    rooms:[{type:mongoose.Schema.Types.ObjectId,ref:'Room'}],
});
module.exports= mongoose.model('User', userSchema);