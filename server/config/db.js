import mongoose from 'mongoose';

const connectDB = () => {
    mongoose.set('strictQuery', true);
    mongoose.connect(process.env.MONGO_URL, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    })
    .then(() => {
        console.log('MongoDB connected');
    })
    .catch((err) => {
        console.error('MongoDB connection error:', err.message);
        process.exit(1); // Exit process with failure
    });
};

export default connectDB;
