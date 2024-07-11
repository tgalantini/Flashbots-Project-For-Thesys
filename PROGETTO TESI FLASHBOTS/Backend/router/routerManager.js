
import apiRoutes from "./routes/apiRoutes.js";
export default class RouterManager {
    constructor(app) {
        this.app = app;
        this.setupRoutes();
    }

    setupRoutes() {
        this.app.options("*", (_, res) => res.status(200).end());
        this.app.use("/api", apiRoutes)

        this.app.use((_, res) => { return res.send("FLASHBOTS SERVER IS RUNNING").end(); });
    }
}