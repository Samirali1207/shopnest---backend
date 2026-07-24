const mongoose = require("mongoose");

const mongoUrl = process.env.MONGO_URI
console.log(mongoUrl)
const connectDb = async () => {
    try {
        await mongoose.connect(`${mongoUrl}/shopnest-mern`);
        console.log("mongoDb connected successfully ")
    } catch (error) {
        console.log("not connected " + error.message)
    }
}

module.exports = connectDb