// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// You can also run a script with `npx hardhat run <script>`. If you do that, Hardhat
// will compile your contracts, add the Hardhat Runtime Environment's members to the
// global scope, and execute the script.
const hre = require("hardhat");

async function main() {
    const guess = 55;

    const Lottery = await hre.deployments.get('Lottery');
    const lotteryContract = new hre.ethers.Contract(Lottery.address, Lottery.abi, (await hre.ethers.getSigners())[0]);
    const ticketPrice = await lotteryContract.ticketPrice();
    const tx = await lotteryContract.enter(guess, { value: ticketPrice });
    await tx.wait();
    const entries = await lotteryContract.getEntriesForNumber(guess, 1);
    console.log(`Guesses for ${guess}: ${entries}`);


}
// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});
