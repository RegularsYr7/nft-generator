import { BrowserProvider, Contract, parseEther } from "ethers";

// NFT 合约 ABI (简化版)
export const NFT_ABI = [
  "function mintNFT(string memory tokenURI) public payable returns (uint256)",
  "function getTotalMinted() public view returns (uint256)",
  "function mintPrice() public view returns (uint256)",
  "function maxSupply() public view returns (uint256)",
  "function getTokensByOwner(address _owner) public view returns (uint256[])",
  "function tokenURI(uint256 tokenId) public view returns (string)",
  "function ownerOf(uint256 tokenId) public view returns (address)",
  "event NFTMinted(address indexed minter, uint256 indexed tokenId, string tokenURI)",
];

export const CONTRACT_ADDRESS = import.meta.env.VITE_CONTRACT_ADDRESS || "";

// 调试输出
console.log("🔍 合约地址配置:", CONTRACT_ADDRESS);
console.log("🔍 环境变量:", import.meta.env.VITE_CONTRACT_ADDRESS);

export class Web3Service {
  private provider: BrowserProvider | null = null;
  private contract: Contract | null = null;

  /**
   * 确保 provider 和 contract 已初始化
   */
  private async ensureInitialized() {
    if (!window.ethereum) {
      throw new Error("请安装 MetaMask 钱包");
    }

    if (!CONTRACT_ADDRESS) {
      throw new Error(
        "合约地址未配置，请检查 .env 文件中的 VITE_CONTRACT_ADDRESS"
      );
    }

    console.log("🔍 正在初始化合约，地址:", CONTRACT_ADDRESS);

    if (!this.provider) {
      this.provider = new BrowserProvider(window.ethereum);
    }

    if (!this.contract) {
      const signer = await this.provider.getSigner();
      this.contract = new Contract(CONTRACT_ADDRESS, NFT_ABI, signer);
      console.log("✅ 合约已初始化");

      // 验证合约是否存在
      try {
        const code = await this.provider.getCode(CONTRACT_ADDRESS);
        console.log("🔍 合约代码长度:", code.length);
        if (code === "0x") {
          throw new Error(
            `合约地址 ${CONTRACT_ADDRESS} 上没有部署合约。请确保 Hardhat 节点正在运行并重新部署合约。`
          );
        }
      } catch (error) {
        console.error("❌ 验证合约失败:", error);
        throw error;
      }
    }
  }

  async connectWallet() {
    if (!window.ethereum) {
      throw new Error("请安装 MetaMask 钱包");
    }

    this.provider = new BrowserProvider(window.ethereum);
    const accounts = await this.provider.send("eth_requestAccounts", []);
    const signer = await this.provider.getSigner();

    if (CONTRACT_ADDRESS) {
      this.contract = new Contract(CONTRACT_ADDRESS, NFT_ABI, signer);
    }

    return {
      address: accounts[0],
      chainId: (await this.provider.getNetwork()).chainId,
    };
  }

  async mintNFT(tokenURI: string) {
    await this.ensureInitialized();

    if (!this.contract) {
      throw new Error("合约未初始化");
    }

    const mintPrice = await this.contract.mintPrice();
    const tx = await this.contract.mintNFT(tokenURI, {
      value: mintPrice,
    });

    const receipt = await tx.wait();

    // 从事件中获取 Token ID
    const event = receipt.logs.find((log: any) => {
      try {
        return this.contract?.interface.parseLog(log)?.name === "NFTMinted";
      } catch {
        return false;
      }
    });

    let tokenId;
    if (event) {
      const parsed = this.contract.interface.parseLog(event);
      tokenId = parsed?.args[1];
    }

    return {
      txHash: receipt.hash,
      tokenId: tokenId ? Number(tokenId) : undefined,
    };
  }

  async getTotalMinted(): Promise<number> {
    await this.ensureInitialized();
    if (!this.contract) return 0;
    const total = await this.contract.getTotalMinted();
    return Number(total);
  }

  async getMaxSupply(): Promise<number> {
    await this.ensureInitialized();
    if (!this.contract) return 0;
    const max = await this.contract.maxSupply();
    return Number(max);
  }

  async getMintPrice(): Promise<string> {
    await this.ensureInitialized();
    if (!this.contract) return "0";
    const price = await this.contract.mintPrice();
    return price.toString();
  }

  async getUserNFTs(address: string): Promise<number[]> {
    await this.ensureInitialized();
    if (!this.contract) return [];
    const tokenIds = await this.contract.getTokensByOwner(address);
    return tokenIds.map((id: bigint) => Number(id));
  }

  async getTokenURI(tokenId: number): Promise<string> {
    await this.ensureInitialized();
    if (!this.contract) return "";
    return await this.contract.tokenURI(tokenId);
  }

  getProvider() {
    return this.provider;
  }

  getContract() {
    return this.contract;
  }
}

export const web3Service = new Web3Service();

// 声明 window.ethereum 类型
declare global {
  interface Window {
    ethereum?: any;
  }
}
