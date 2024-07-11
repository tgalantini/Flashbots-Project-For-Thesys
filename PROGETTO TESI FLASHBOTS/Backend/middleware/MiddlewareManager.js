import express from 'express';
import helmet from "helmet";

export default class MiddlewareManager {
    constructor(app) {
        this.app = app;
    }


    setupMiddleware() {
        this.app.use(express.urlencoded({ extended: true }))
        this.app.use(express.text({ limit: "10mb" }));

        this.setupSecurity();
    }

    setupSecurity() {
        this.app.use(helmet());
        this.app.disable("x-powered-by");
        
        this.app.use((req, res, next) => {
            res.header("Access-Control-Allow-Origin", "*");
            res.header("Access-Control-Allow-Methods", "DELETE, POST, GET, OPTIONS");
            res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
            if (req.method === "OPTIONS") res.header('Access-Control-Allow-Origin', req.headers.origin);
            else res.header('Access-Control-Allow-Origin', '*');
            next();
        });
    }


}