import { config } from "./config/config.js"
import { connectDB } from "./config/db.js";
import { logger } from "./utils/logger.js";
import app from "./app.js";

async function main() {
    await connectDB(config.MONGO_URL,config.DB_NAME)

    const PORT = config.PORT;

    app.listen(PORT, () => {
        logger.info({
            msg: 'Server is running',
            port: PORT
        })
    })
}

main();