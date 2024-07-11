import express from 'express';
import transactionHandler from '../../handlers/transactionHandler.js';



class ApiRouter {
    constructor() {
        this.router = express.Router();
        this.initializeRoutes();
    }

    initializeRoutes() {
        this.router.post('/executePrivateTransaction', transactionHandler.executePrivateTransaction)
    }

}

export default new ApiRouter().router;