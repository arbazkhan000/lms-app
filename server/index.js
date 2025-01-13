import dotenv from "dotenv";
import { app } from "./src/app.js";
import { Connection } from "./src/db/connection.js";

dotenv.config({
    path: "./.env",
});

const port = process.env.PORT || 3000;

app.listen(port, async () => {
    try {
        await console.log(`⚙️ Server running on port ${port}`);
        await Connection();
    } catch (error) {
        console.error("Error starting the server", error);
        process.exit(1);
    }
});
