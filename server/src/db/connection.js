import mongoose from "mongoose";

export const Connection = async () => {
    try {
        await mongoose.connect(process.env.DATABASE_URL);
        console.log(`\n MongoDB connected !! DB HOST`);
    } catch (error) {
        console.error(error);
        process.exit(1);
    }
};
