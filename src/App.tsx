import { useState } from 'react';
import WalletConnect from './components/WalletConnect';
import NFTMinter from './components/NFTMinter';
import NFTGallery from './components/NFTGallery';
import './App.css';

function App() {
  const [walletAddress, setWalletAddress] = useState<string | null>(null);
  const [chainId, setChainId] = useState<bigint | null>(null);

  const handleWalletConnect = (address: string, chain: bigint) => {
    setWalletAddress(address);
    setChainId(chain);
  };

  // 支持 Sepolia (11155111) 和 Localhost (31337)
  const isCorrectNetwork = chainId === BigInt(11155111) || chainId === BigInt(31337);

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <header className="text-center mb-12">
          <h1 className="text-5xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent mb-4">
            NFT Generator
          </h1>
          <p className="text-gray-600 dark:text-gray-300 text-lg">
            在以太坊测试网上铸造您的专属 NFT
          </p>
        </header>

        {/* 钱包连接 */}
        {!walletAddress ? (
          <div className="max-w-md mx-auto">
            <WalletConnect onConnect={handleWalletConnect} />
          </div>
        ) : (
          <div className="space-y-8">
            {/* 网络提示 */}
            {!isCorrectNetwork && (
              <div className="card bg-yellow-50 dark:bg-yellow-900/20 border-2 border-yellow-400">
                <p className="text-yellow-800 dark:text-yellow-200">
                  ⚠️ 请切换到 Sepolia 测试网络或本地网络 (Localhost 8545)
                </p>
              </div>
            )}

            {/* 钱包状态 */}
            <WalletConnect onConnect={handleWalletConnect} />

            {/* NFT 铸造器和画廊 */}
            <div className="grid lg:grid-cols-2 gap-8">
              <NFTMinter />
              <NFTGallery walletAddress={walletAddress} />
            </div>
          </div>
        )}

        {/* Footer */}
        <footer className="text-center mt-16 text-gray-500 dark:text-gray-400 text-sm">
          <p>基于以太坊测试网 · Powered by React + ethers.js + Hardhat</p>
        </footer>
      </div>
    </div>
  );
}

export default App;
