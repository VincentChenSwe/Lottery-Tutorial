// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// You can also run a script with `npx hardhat run <script>`. If you do that, Hardhat
// will compile your contracts, add the Hardhat Runtime Environment's members to the
// global scope, and execute the script.
const { ethers } = require("hardhat");
const airnodeProtocol = require("@api3/airnode-protocol")
const airnodeAdmin = require("@api3/airnode-admin")

async function main() {
  let { chainId } = await ethers.provider.getNetwork();
  const rrpAddress = airnodeProtocol.AirnodeRrpAddresses[chainId];
  const Lottery = await ethers.getContractFactory("Lottery");
  accounts = await ethers.getSigners();
  nextWeek = Math.floor(Date.now() / 1000) + 9000;
  lotteryContract = await Lottery.deploy(nextWeek, rrpAddress);
  await lotteryContract.deployed();
  console.log({lotteryContract})
  console.log(`Lottery contract deployed at ${lotteryContract.address}\nSetting sponsor wallet...`);

  const sponsorWalletAddress = await airnodeAdmin.deriveSponsorWalletAddress(
    "xpub6DXSDTZBd4aPVXnv6Q3SmnGUweFv6j24SK77W4qrSFuhGgi666awUiXakjXruUSCDQhhctVG7AQt67gMdaRAsDnDXv23bBRKsMWvRzo6kbf", // QRNG xpub
    "0x9d3C147cA16DB954873A498e0af5852AB39139f2", // QRNG Airnode address
    lotteryContract.address
  );
  const tx = await lotteryContract.setSponsorWallet(sponsorWalletAddress);
  await tx.wait();
  const sponsorWallet = await lotteryContract.sponsorWallet();
  console.log(`Sponsor wallet set to: ${sponsorWallet}`);
}
// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
