async function main() {
    const FlayerToken = await ethers.getContractFactory("FlayerToken");
    const flayer = await FlayerToken.deploy();
    await flayer.deployed();


    const StakeFlayer = await ethers.getContractFactory("StakeFlayer");
    const stake = await StakeFlayer.deploy(flayer.address);
    await stake.deployed();

    console.log("Token deployed to:", flayer.address);
    console.log("Staking contract deployed to:", stake.address);

}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });