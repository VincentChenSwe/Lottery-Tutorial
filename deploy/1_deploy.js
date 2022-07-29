const hre = require('hardhat');
const airnodeProtocol = require('@api3/airnode-protocol');

module.exports = async () => {
  // We are getting the AirnodeRrp address from @api3/airnode-protocol
  // Alternatively, you can get it from the docs
  // https://docs.api3.org/airnode/latest/reference/airnode-addresses.html
  const airnodeRrpAddress = airnodeProtocol.AirnodeRrpAddresses[await hre.getChainId()];
  const oneWeek = 64800;
  nextWeek = Math.floor(Date.now() / 1000) + 9000;

  const lotteryContract = await hre.deployments.deploy('Lottery', {
    args: [nextWeek, airnodeRrpAddress],
    from: (await getUnnamedAccounts())[0],
    log: true,
  });
  console.log(`Deployed Lottery Contract at ${lotteryContract.address}`);
};

module.exports.tags = ['deploy'];