const {Schema, model} = require('mongoose');

const userSchema = new Schema({
    name: {type: String, required: true},
    phoneNo: {type: String, required: true, unique: true},
    email: {type: String, required: true, unique: true},
    password: {type: String, required: true},
    createdAt: {type: Date, default: Date.now},
    verifyOtp:{type: String, default: ''},
    verifyOtpExpireAt:{type: Number,default: 0},
    isAccountVerified:{type: Boolean, default: false},
    resetOtp:{type: String,default: ''},
    resetOtpExpiredAt:{type: Number,default: 0},
});

const UserModel = model('User', userSchema);
module.exports = UserModel;