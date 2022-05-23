const mongoose = require("mongoose");
const dbAddress = "mongodb://localhost:27017/spa_mall"

const connect = () => {
    mongoose.connect(dbAddress, {ignoreUndefined: true}).catch((err) => {
        console.error(err);
    });
};
module.exports = connect;