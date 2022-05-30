const mongoose = require("mongoose");
const dbAddress = ""
//"mongodb://localhost:27017/spa_mall"

const connect = () => {
    mongoose.connect(dbAddress, {
        ignoreUndefined: true,
        useNewUrlParser: true,
        useUnifiedTopology: true
    }).catch((err) => {
        console.error(err);
    });
};
module.exports = connect;