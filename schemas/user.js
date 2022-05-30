const mongoose = require("mongoose");
const AutoIncrement = require('mongoose-sequence')(mongoose);

const UserSchema = new mongoose.Schema({
    userIdx: {type: Number, unique: true},
    email: String,
    nickname: String,
    password: String,
});
UserSchema.virtual("userId").get(function () {
    return this._id.toHexString();
});
UserSchema.set("toJSON", {
    virtuals: true,
});
UserSchema.plugin(AutoIncrement, {id: 'user_seq', inc_field: 'userIdx' });

module.exports = mongoose.model("User", UserSchema);