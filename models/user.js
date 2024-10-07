const mongoose= require("mongoose");
const Schema = mongoose.Schema;
const passportLocalMongoose = require('passport-local-mongoose');

let userSchema= new Schema({
    email:{
        type : String,
        required : true,
    },
});

userSchema.plugin(passportLocalMongoose);

let User = mongoose.model("User",userSchema);


module.exports= User;

