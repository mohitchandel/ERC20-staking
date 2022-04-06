const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("FlayerToken", function () {

  it("Should mint some new tokens", async function () {

    // flayer token contract deployment
    const FlayerToken = await ethers.getContractFactory("FlayerToken")
    const flayer = await FlayerToken.deploy()
    await flayer.deployed()
    const [admin] = await ethers.getSigners();

    // Minting new tokens
    const mintFlayer = await flayer.mint(admin.address, 10000000)
    await mintFlayer.wait()
    const adminBalance = await flayer.balanceOf(admin.address);
    expect(await flayer.totalSupply()).to.equal(adminBalance);
  })

  it("Should approve token spend", async function () {
    const [admin] = await ethers.getSigners();

    // Deployment of FlayerToken
    const FlayerToken = await ethers.getContractFactory("FlayerToken")
    const flayer = await FlayerToken.deploy()
    await flayer.deployed()

    // Deployment of FlayerToken staking
    const StakeFlayer = await ethers.getContractFactory("StakeFlayer");
    const stake = await StakeFlayer.deploy(flayer.address);
    await stake.deployed();

    // Approving token spend
    const approveFlayer = await flayer.approve(stake.address, 10000000)
    await approveFlayer.wait()
    expect(await flayer.allowance(admin.address, stake.address)).to.equal(10000000);
  })

})


describe("FlayerToken Staking", function () {
  it("Should be able to stake", async function () {
    const [admin] = await ethers.getSigners();

    // Deployment of FlayerToken
    const FlayerToken = await ethers.getContractFactory("FlayerToken")
    const flayer = await FlayerToken.deploy()
    await flayer.deployed()

    // Deployment of FlayerToken staking
    const StakeFlayer = await ethers.getContractFactory("StakeFlayer");
    const stake = await StakeFlayer.deploy(flayer.address);
    await stake.deployed();

    // Minting flayer
    const mintFlayer = await flayer.mint(admin.address, 10000000)
    await mintFlayer.wait()

    // Approving token spend
    const approveFlayer = await flayer.approve(stake.address, 10000000)
    await approveFlayer.wait()
    expect(await flayer.allowance(admin.address, stake.address)).to.equal(10000000);

    // Stake token
    const stakeToken = await stake.stakeToken(10000000)
    await stakeToken.wait()
    expect(await stake.checkStaked(admin.address)).to.equal(10000000);
  })

  it("Should be able to unstake tokens", async function () {
    const [admin] = await ethers.getSigners();

    // Deployment of FlayerToken
    const FlayerToken = await ethers.getContractFactory("FlayerToken")
    const flayer = await FlayerToken.deploy()
    await flayer.deployed()

    // Deployment of FlayerToken staking
    const StakeFlayer = await ethers.getContractFactory("StakeFlayer");
    const stake = await StakeFlayer.deploy(flayer.address);
    await stake.deployed();

    // Minting flayer
    const mintFlayer = await flayer.mint(admin.address, 10000000)
    await mintFlayer.wait()

    // Approving token spend
    const approveFlayer = await flayer.approve(stake.address, 10000000)
    await approveFlayer.wait()
    expect(await flayer.allowance(admin.address, stake.address)).to.equal(10000000);

    // Stake token
    const stakeToken = await stake.stakeToken(10000000)
    await stakeToken.wait()
    expect(await stake.checkStaked(admin.address)).to.equal(10000000);

    // unstake token
    const unstakeToken = await stake.unStakeToken()
    await stakeToken.wait()
    expect(await stake.checkStaked(admin.address)).to.equal(0);
  })
})