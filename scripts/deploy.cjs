const { ethers } = require("hardhat");

async function main() {
  console.log("🚀 开始部署 NFT Generator 合约...");

  const NFTGenerator = await ethers.getContractFactory("NFTGenerator");
  const nftGenerator = await NFTGenerator.deploy();

  await nftGenerator.waitForDeployment();

  const contractAddress = await nftGenerator.getAddress();
  
  console.log("✅ NFT Generator 合约已部署到:", contractAddress);
  console.log("📝 请将此地址添加到 .env 文件的 VITE_CONTRACT_ADDRESS 中");
  console.log("\n合约信息:");
  console.log("- 名称: NFT Generator");
  console.log("- 符号: NFTGEN");
  console.log("- 铸造价格: 0.001 ETH");
  console.log("- 最大供应量: 10000");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
