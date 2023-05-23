// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// You can also run a script with `npx hardhat run <script>`. If you do that, Hardhat
// will compile your contracts, add the Hardhat Runtime Environment's members to the
// global scope, and execute the script.
const hre = require("hardhat");

async function main() {
  const SBTArgs = ["DVoting SBT", "Bubaleh", "...@gmail.com", 21];
  const SBToken = await hre.ethers.getContractFactory("SBToken");
  const SBTContract = await SBToken.deploy(
    SBTArgs[0],
    SBTArgs[1],
    SBTArgs[2],
    SBTArgs[3]
  );
  await SBTContract.deployed();
  console.log(`SBT deployed to ${SBTContract.address}`);

  const VotingFactoryArgs = SBTContract.address;
  const VotingFactory = await hre.ethers.getContractFactory("VotingFactory");
  const VotingFactoryContract = await VotingFactory.deploy(VotingFactoryArgs);
  await VotingFactoryContract.deployed();
  console.log(`Voting Factory deployed to ${VotingFactoryContract.address}`);

}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
