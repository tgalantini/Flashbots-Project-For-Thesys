import { ethers } from "ethers";
import { FlashbotsBundleProvider } from "@flashbots/ethers-provider-bundle";
import signale from "signale";

export async function simulateBundleExecution(to, data, value, privateKey){
    try {
        const provider = new ethers.JsonRpcProvider('https://sepolia.gateway.tenderly.co');
        const signer = new ethers.Wallet(privateKey, provider);
        const flashBotsProvider = FlashbotsBundleProvider.create(provider, signer);

        var tx = new ethers.Transaction();
        tx.to = to;
        tx.data = '0x' + data.toString();
        tx.value = '0x' + value.toString();
        tx.chainId = "0xaa36a7";

        //const populatedTransaction = await provider.estimateGas(transaction);

        const startTime = performance.now();
        provider.on('block', async (blockNumber) => {

        const block = await provider.getBlock(blockNumber)
        const bribeToMiners = ethers.parseUnits('50', 'gwei')
        const targetBlockNumber = block.number + 1

        const maxBaseFeeInFutureBlock = FlashbotsBundleProvider.getMaxBaseFeeInFutureBlock(block.baseFeePerGas, 2);

        const eip1559Transaction = {
            from: tx.from,
            to: tx.to,
            type: 2,
            maxFeePerGas: maxBaseFeeInFutureBlock + (bribeToMiners),
            maxPriorityFeePerGas: bribeToMiners,
            data: tx.data,
        }

        const signedTransactions = await flashBotsProvider.signBundle([
            {
            signer: signer,
            transaction: eip1559Transaction
            }
        ])

        const simulation = await flashBotsProvider.simulate(signedTransactions, targetBlockNumber);
        const endtime = performance.now();

        const elapsedTime = endtime-startTime;
        // Using TypeScript discrimination
        if ('error' in simulation) {
            console.warn(`Simulation Error`)
            return 0;
        } else {
            console.log(`Simulation Success`)
            return elapsedTime;
        }

    })
} catch (error) {
       signale.error(error);
       return 0;     
}
}

export async function executeWithProtectRpc(to, data, value, privateKey){
    try {
        const sepoliaFlashbotsRPC = 'https://rpc-sepolia.flashbots.net/';
        const sepoliaFlashbotsProvider = new ethers.JsonRpcProvider(sepoliaFlashbotsRPC);

        const signer = new ethers.Wallet(privateKey, sepoliaFlashbotsProvider);
        
        var tx = new ethers.Transaction();
        tx.to = to;
        tx.data = '0x' + data.toString();
        tx.value = '0x' + value.toString();
        tx.chainId = "0xaa36a7";

        var startTime = performance.now()
        var transactionResponse = await signer.sendTransaction(tx);
        transactionResponse = await transactionResponse.wait()
        var endtime = performance.now()
        var txHash = transactionResponse.hash;
        var elapsedTime = endtime - startTime;

        return {txHash, elapsedTime}
    } catch (error) {
        signale.error(error);
         txHash = "";
         elapsedTime = 0;
        return {txHash, elapsedTime}
    }
}