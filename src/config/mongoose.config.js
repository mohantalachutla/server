const mongoose = require('mongoose')

const options = {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    socketTimeoutMS: 30000,
    serverSelectionTimeoutMS: 5000,
    poolSize: 10
}

let session;
let mongoosee;
let db = async (MONGO_DB_URL) => {
    try {
        mongoosee = await mongoose.connect(MONGO_DB_URL, options).catch(err => console.error(err))
        if (mongoosee) {
            session = await mongoosee.startSession()
        }
    }
    catch (err) {
        console.error(err)
        await session.endSession()
    }
    return session
}

exports.session = session
exports.db = db
