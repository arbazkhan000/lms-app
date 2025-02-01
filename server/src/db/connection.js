import mongoose from 'mongoose';

export const Connection = async () => {
    try {
        const isConnected = await mongoose.connect(process.env.DATABASE_URL);

        if (isConnected.STATES.connecting) {
            console.log(`Database is Connecting ${isConnected.connection.host}`);
        }

        if (isConnected.STATES.connected) {
            console.log(`Database is Connected !! DB HOST ${isConnected.connection.host} `);
        }

        if (isConnected.STATES.disconnected) {
            console.log(`Database is Disconnected ${isConnected.connection.host}`);
        }

        // console.log(`\n MongoDB connected `);
    } catch (error) {
        console.error(error);
        process.exit(1);
    }
};
