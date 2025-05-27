const mongoose = require('mongoose')
require('dotenv').config()

const mongoUrl = process.env.MONGODB


const initializeDatabase = async () => {

    await mongoose.connect(mongoUrl)
        .then(() => console.log('Connected to database'))
        .catch(error=>console.log("Can't connect to database."))


}

module.exports = { initializeDatabase }