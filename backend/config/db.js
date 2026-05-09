import mongoose from "mongoose"

const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URL);
        console.log("Foodify Database is Connected");
    } catch (error) {
        console.log(" db.js Database Error");
        process.exit(1);
    }
}

export default connectDB