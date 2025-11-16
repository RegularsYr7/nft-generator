import { useState, useEffect } from 'react';
import { web3Service } from '../utils/web3';

interface WalletConnectProps {
    onConnect: (address: string, chainId: bigint) => void;
}

export default function WalletConnect({ onConnect }: WalletConnectProps) {
    const [connecting, setConnecting] = useState(false);
    const [address, setAddress] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);

    const connectWallet = async () => {
        try {
            setConnecting(true);
            setError(null);

            const { address, chainId } = await web3Service.connectWallet();
            setAddress(address);
            onConnect(address, chainId);
        } catch (err) {
            setError(err instanceof Error ? err.message : '连接失败');
        } finally {
            setConnecting(false);
        }
    };

    useEffect(() => {
        // 检查是否已连接钱包
        const initWallet = async () => {
            if (window.ethereum) {
                try {
                    const accounts = await window.ethereum.request({ method: 'eth_accounts' });
                    if (accounts.length > 0) {
                        const chainIdHex = await window.ethereum.request({ method: 'eth_chainId' });
                        const chainId = BigInt(chainIdHex);
                        setAddress(accounts[0]);
                        onConnect(accounts[0], chainId);
                    }
                } catch (error) {
                    console.error('初始化钱包失败:', error);
                }

                // 监听账户变化
                window.ethereum.on('accountsChanged', async (accounts: string[]) => {
                    if (accounts.length > 0) {
                        try {
                            const chainIdHex = await window.ethereum.request({ method: 'eth_chainId' });
                            const chainId = BigInt(chainIdHex);
                            setAddress(accounts[0]);
                            onConnect(accounts[0], chainId);
                        } catch (error) {
                            console.error('获取链ID失败:', error);
                        }
                    } else {
                        setAddress(null);
                    }
                });

                // 监听网络变化
                window.ethereum.on('chainChanged', async () => {
                    const accounts = await window.ethereum.request({ method: 'eth_accounts' });
                    if (accounts.length > 0) {
                        const chainIdHex = await window.ethereum.request({ method: 'eth_chainId' });
                        const chainId = BigInt(chainIdHex);
                        onConnect(accounts[0], chainId);
                    }
                });
            }
        };

        initWallet();
    }, [onConnect]);

    const formatAddress = (addr: string) => {
        return `${addr.substring(0, 6)}...${addr.substring(addr.length - 4)}`;
    };

    if (address) {
        return (
            <div className="card">
                <div className="flex items-center justify-between">
                    <div>
                        <p className="text-sm text-gray-500 dark:text-gray-400">已连接钱包</p>
                        <p className="font-mono font-semibold text-gray-900 dark:text-white">{formatAddress(address)}</p>
                    </div>
                    <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                </div>
            </div>
        );
    }

    return (
        <div className="card">
            <h2 className="text-2xl font-bold mb-4">连接钱包</h2>
            <p className="text-gray-600 dark:text-gray-300 mb-6">
                请连接您的 MetaMask 钱包以开始铸造 NFT
            </p>

            {error && (
                <div className="bg-red-100 dark:bg-red-900/30 border border-red-400 text-red-700 dark:text-red-400 px-4 py-3 rounded mb-4">
                    {error}
                </div>
            )}

            <button
                onClick={connectWallet}
                disabled={connecting}
                className="btn-primary w-full"
            >
                {connecting ? '连接中...' : '连接 MetaMask'}
            </button>

            {!window.ethereum && (
                <p className="text-sm text-gray-500 mt-4 text-center">
                    未检测到 MetaMask，请先
                    <a
                        href="https://metamask.io/download/"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-primary hover:underline ml-1"
                    >
                        安装 MetaMask
                    </a>
                </p>
            )}
        </div>
    );
}
