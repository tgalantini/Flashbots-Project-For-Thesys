import express from 'express';
import signale from 'signale';

import MiddlewareManager from './middleware/MiddlewareManager.js';
import RouterManager from './router/routerManager.js';

export default class WebService {
    constructor(WebPort) {
        this.web_port = WebPort;
        this.app = express();
        this.app.use(express.json());
        this.initialize();
    }

    async initialize() {
        try {
            this.setupMiddleware();
            this.setupRoutes();
            this.start();
        } catch (error) {
            signale.error("Error during server setup: " + error);
            process.exit(1);
        }
    }

    setupMiddleware() {
        const middlewareManager = new MiddlewareManager(this.app);
            middlewareManager.setupMiddleware();
    }

    setupRoutes() {
        const routeManager = new RouterManager(this.app);
            routeManager.setupRoutes();
    }

    start() {
        this.app.listen(this.web_port, () => {});
    }
}