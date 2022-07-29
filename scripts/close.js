// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// You can also run a script with `npx hardhat run <script>`. If you do that, Hardhat
// will compile your contracts, add the Hardhat Runtime Environment's members to the
// global scope, and execute the script.
const hre = require("hardhat");

async function main() {
    const Lottery = await hre.deployments.get('Lottery');
    const lotteryContract = new hre.ethers.Contract(Lottery.address, Lottery.abi, (await hre.ethers.getSigners())[0]);
    const receipt = await lotteryContract.getWinningNumber({ value: ethers.utils.parseEther("0.01") });
    // and read the logs once it gets confirmed to get the request ID
    const requestId = await new Promise((resolve) =>
        ethers.provider.once(receipt.hash, (tx) => {
            // We want the log from QrngExample, not AirnodeRrp
            const log = tx.logs.find((log) => log.address === lotteryContract.address);
            const parsedLog = lotteryContract.interface.parseLog(log);
            resolve(parsedLog.args.requestId);
        })
    );
}
// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});
