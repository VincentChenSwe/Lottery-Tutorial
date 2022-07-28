const { expect } = require("chai");
const { ethers } = require("hardhat");
const airnodeProtocol = require("@api3/airnode-protocol")
const airnodeAdmin = require("@api3/airnode-admin")

describe("Lottery", function () {
  let lotteryContract, accounts, nextWeek;

  describe("Deployment", function () {
    it("Deploys", async function () {
      let { chainId } = await ethers.provider.getNetwork();
      const rrpAddress = airnodeProtocol.AirnodeRrpAddresses[chainId];
      const Lottery = await ethers.getContractFactory("Lottery");
      accounts = await ethers.getSigners();
      nextWeek = Math.floor(Date.now() / 1000) + 1;
      lotteryContract = await Lottery.deploy(nextWeek, rrpAddress);
      expect(await lotteryContract.deployed()).to.be.ok;
    });

    it("Sets sponsor wallet", async function () {
      const sponsorWalletAddress = await airnodeAdmin.deriveSponsorWalletAddress(
        "xpub6DXSDTZBd4aPVXnv6Q3SmnGUweFv6j24SK77W4qrSFuhGgi666awUiXakjXruUSCDQhhctVG7AQt67gMdaRAsDnDXv23bBRKsMWvRzo6kbf",
        "0x9d3C147cA16DB954873A498e0af5852AB39139f2",
        lotteryContract.address
      );
      await lotteryContract.setSponsorWallet(sponsorWalletAddress);
      expect(await lotteryContract.sponsorWallet()).to.equal(sponsorWalletAddress);
    });

    it("Has the correct endTime", async function () {
      let endTime = await lotteryContract.endTime();
      expect(endTime).to.be.closeTo(Math.floor(Date.now() / 1000) + 1, 5);
    });
  });

  describe("Lottery is open", function () {
    it("User enters between 1-65535", async function () {
      for (let account of accounts) {
        let randomNumber = Math.floor(Math.random() * 65535);
        await lotteryContract
          .connect(account)
          .enter(randomNumber, { value: ethers.utils.parseEther("0.0001") });
        const entries = await lotteryContract.getEntriesForNumber(randomNumber, 1);
        expect(entries).to.include(account.address);
      }
    });

    it("Should fail if entry is invalid", async function () {
      await expect(
        lotteryContract
          .connect(accounts[0])
          .enter(4, { value: ethers.utils.parseEther("0.002") })
      ).to.be.reverted; // exact ticket price only
      await expect(
        lotteryContract
          .connect(accounts[0])
          .enter(65539, { value: ethers.utils.parseEther("0.001") })
      ).to.be.reverted; // number too high
    });

    it("Should fail to close lotteryContract if week is still open", async function () {
      await expect(lotteryContract.connect(accounts[0]).getWinningNumber()).to.be.reverted;
    });
  });

  describe("Random winning numbers are picked", function () {
    let requestId;
    it("Request winning number", async function () {
      // Make a request...
      const receipt = await lotteryContract.getWinningNumber({ value: ethers.utils.parseEther("0.01") });
      // and read the logs once it gets confirmed to get the request ID
      requestId = await new Promise((resolve) =>
        ethers.provider.once(receipt.hash, (tx) => {
          // We want the log from QrngExample, not AirnodeRrp
          const log = tx.logs.find((log) => log.address === lotteryContract.address);
          const parsedLog = lotteryContract.interface.parseLog(log);
          resolve(parsedLog.args.requestId);
        })
      );
      expect(requestId).to.not.be.empty;
    });

    it.skip("Winning number is returned!", async function () {

      // Wait for the fulfillment transaction to be confirmed and read the logs to get the random number
      const log = await new Promise((resolve) =>
        ethers.provider.once(lotteryContract.filters.ReceivedRandomNumber(requestId, null), resolve)
      );
      const winningNumber = await lotteryContract.winningNumber(1);
      console.log(`Fulfillment is confirmed, random number is ${winningNumber.toString()}`);
      expect(randomNumber).to.be.ok;
    });
  })


  describe.skip("First week ends with no winners", function () {
    it("Should fail to enter", async function () {
      // Move hre 1 week in the future
      let endTime = await lotteryContract.endTime();
      await ethers.provider.send("evm_mine", [Number(endTime)]);
      await expect(
        lotteryContract
          .enter(1, { value: ethers.utils.parseEther("0.0001") })
      ).to.be.reverted;
    });

    it("Close Lottery with no winners", async function () {
      await lotteryContract.getWinningNumber();
      expect(await lotteryContract.week()).to.equal(2);
      const entries = await lotteryContract.getEntriesForNumber(4, 1);
      expect(entries).to.be.empty;
    });

    it("Pot should roll over", async function () {
      const pot = await lotteryContract.pot();
      expect(pot).to.equal(ethers.utils.parseEther("0.2"));
    });

    it("End time should push back 1 week from original end time", async function () {
      let weekAfter = nextWeek + 604800;
      expect(await lotteryContract.endTime()).to.equal(weekAfter);
    });
  });

  describe.skip("Second week", function () {
    it("Users enter between 1-3", async function () {
      for (let account of accounts) {
        let randomNumber = Math.floor(Math.random() * 3);
        await lotteryContract
          .connect(account)
          .enter(randomNumber, { value: ethers.utils.parseEther("0.01") });
        const entries = await lotteryContract.getEntriesForNumber(randomNumber, 2);
        expect(entries).to.include(account.address);
      }
    });

    it("Choose winners", async function () {
      const winningNumber = 2;

      // Move hre 1 week in the future
      let endTime = await lotteryContract.endTime();
      await ethers.provider.send("evm_mine", [Number(endTime)]);

      const winners = await lotteryContract.getEntriesForNumber(winningNumber, 2);
      let balanceBefore = await ethers.provider.getBalance(winners[0]);
      await lotteryContract.closeWeek(winningNumber);

      const balanceAfter = await ethers.provider.getBalance(winners[0]);
      expect(balanceAfter.gt(balanceBefore)).to.be.true;
    });

    it("Should move to week 3", async function () {
      expect(await lotteryContract.week()).to.equal(3);
      expect(await lotteryContract.pot()).to.equal(0);
    });
  });
});
