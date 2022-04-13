const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("ERC20 token staking", function () {

  let admin;
  let flayer;
  let stake;

  beforeEach(async function () {
    // getting admin address
    [admin] = await ethers.getSigners();

    // Deploying flayer token 
    const FlayerToken = await ethers.getContractFactory("FlayerToken");
    flayer = await FlayerToken.deploy();
    await flayer.deployed();

    // deploying staking contract
    const StakeFlayer = await ethers.getContractFactory("StakeFlayer");
    stake = await StakeFlayer.deploy(flayer.address);
    await stake.deployed();

  });


  describe("flayer token", function () {
    it("Should mint some new tokens", async function () {
      // Minting new tokens
      const mintFlayer = await flayer.mint(admin.address, 10000000)
      await mintFlayer.wait()
      const adminBalance = await flayer.balanceOf(admin.address);
      expect(await flayer.totalSupply()).to.equal(adminBalance);
    })

    it("Should approve token spend", async function () {
      // Approving token spend
      const approveFlayer = await flayer.approve(stake.address, 10000000)
      await approveFlayer.wait()
      expect(await flayer.allowance(admin.address, stake.address)).to.equal(10000000);
    })
  })



  describe("FlayerToken Staking", function () {
    it("Should be able to stake", async function () {
      // Minting flayer
      const mintFlayer = await flayer.mint(admin.address, ethers.BigNumber.from("100000000000000000000"))
      await mintFlayer.wait()

      // Approving token spend
      const approveFlayer = await flayer.approve(stake.address, ethers.BigNumber.from("100000000000000000000"))
      await approveFlayer.wait()
      expect(await flayer.allowance(admin.address, stake.address)).to.equal(ethers.BigNumber.from("100000000000000000000"));

      // Stake token
      const stakeToken = await stake.stakeToken(100)
      await stakeToken.wait()
      expect(await stake.checkStaked(admin.address)).to.equal(ethers.BigNumber.from("100000000000000000000"));
    })

    it("Should be able to unstake tokens", async function () {
      // Minting flayer
      const mintFlayer = await flayer.mint(admin.address, ethers.BigNumber.from("100000000000000000000"))
      await mintFlayer.wait()

      // Approving token spend
      const approveFlayer = await flayer.approve(stake.address, ethers.BigNumber.from("100000000000000000000"))
      await approveFlayer.wait()
      expect(await flayer.allowance(admin.address, stake.address)).to.equal(ethers.BigNumber.from("100000000000000000000"));

      // Stake token
      const stakeToken = await stake.stakeToken(100)
      await stakeToken.wait()
      expect(await stake.checkStaked(admin.address)).to.equal(ethers.BigNumber.from("100000000000000000000"));

      // unstake token
      const stakeData = await stake.staked(admin.address);
      const daysCount = (stakeData.startTime - (Date.now() / 1000)) / 60 / 60 / 24;
      if(daysCount >= 30 ){
        const unstakeToken = await stake.unStakeToken(admin.address)
        await unstakeToken.wait()
        expect(await stake.checkStaked(admin.address)).to.equal(0);
      }else{
        console.log("Minimum staking time(30 days) not completed")
      }
    })
  })

})