
import { executeWithProtectRpc, simulateBundleExecution } from "./transactionHelperFunctions.js";
import signale from "signale";

class transactionHandler{
    constructor(){
        if (transactionHandler.instance){
            return transactionHandler.instance
        }
        transactionHandler.instance = this;
    }
    
    async executePrivateTransaction(req, res){
        try {
            var { from, to, value, data, privateKey } = req.body;

            if (!from || !to || !value || !data  || !privateKey) {
                signale.error("Body that generated error :", req.body);
                throw new Error("One of the required value are missin")
            }

            if (from === "test"){ // TESTING ZONE
                res.status(200).send({
                privateTransactionHash: "0x7b3537c6a4e58293dcf6570739c6c230fb69297436ecb93e1c0034715497d6c0",
                status: "OK",
                elapsedTimePrivate: 100,
                elapsedTimeBundle: 110
                })
            } else {
                const {txHashPrivate, elapsedTimePrivate} = await executeWithProtectRpc(from, to, data, value, privateKey)
                // esegue l'invio della transazione tramite RPC flashbots
    
                const elapsedTimeBundle = await simulateBundleExecution(from, to, data.toString(), value.toString(), privateKey);
                //esegue la simulazione di invio tramite bundle e ritorna un elapsed time da comparare
    
                res.status(200).send({
                    privateTransactionHash: txHashPrivate,
                    status: "OK",
                    elapsedTimePrivate: elapsedTimePrivate,
                    elapsedTimeBundle: elapsedTimeBundle
                  });
            }

        } catch (error) {
            signale.error(error)
            res.status(500).send({
                status: "failed",
                error: error.message
            })
        }
    }


   


}

export default new transactionHandler()