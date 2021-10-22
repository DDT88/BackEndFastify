import mongoose from 'mongoose';

const Schema =mongoose.Schema;

const connectMongo = (mongoURI) => {
    console.log(mongoURI)
    mongoose.connect(mongoURI, { useNewUrlParser: true });
    mongoose.connection.on('error', (err) => {
        process.exit();
    });
};

var ConnectMongo = connectMongo;

export default ConnectMongo;

