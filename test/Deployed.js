const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("Deployed Lottery Contract", function () {
    let lotteryContract, accounts;

    describe("Deployed", function () {
        it("Deployed on-chain", async function () {
            const Lottery = await hre.deployments.get('Lottery');
            lotteryContract = new hre.ethers.Contract(Lottery.address, Lottery.abi, (await hre.ethers.getSigners())[0]);
            accounts = await ethers.getSigners();
            expect(await lotteryContract.deployed()).to.be.ok;
        });

        it("Winning number picked", async function () {
            const winningNumber = Number(await lotteryContract.winningNumber(1))
            console.log(`Winning number for week 1: ${winningNumber.toString()}`)
            expect(winningNumber).to.be.a('number');
            expect(winningNumber).to.be.above(0);
        })



    });
})

