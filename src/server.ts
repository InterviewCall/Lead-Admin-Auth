import { app } from "./app.js";
import { PORT } from "./configs/server.config.js";
import { logger } from "./configs/logger.config.js";

async function startServer() {
    app.listen(PORT, () => {
        logger.info(`Server is running on PORT: ${PORT}`);
    });
}

startServer();