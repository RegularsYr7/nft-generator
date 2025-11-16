import { useState, useEffect } from 'react';
import { web3Service } from '../utils/web3';
import { ipfsService } from '../utils/ipfs';

interface NFTItem {
    tokenId: number;
    name: string;
    image: string;
    tokenURI: string;
}

interface NFTGalleryProps {
    walletAddress: string | null;
}

export default function NFTGallery({ walletAddress }: NFTGalleryProps) {
    const [nfts, setNfts] = useState<NFTItem[]>([]);
    const [loading, setLoading] = useState(false);
    const [totalMinted, setTotalMinted] = useState(0);
    const [maxSupply, setMaxSupply] = useState(0);

    useEffect(() => {
        loadStats();
    }, []);

    useEffect(() => {
        if (walletAddress) {
            loadUserNFTs();
        }
    }, [walletAddress]);

    const loadStats = async () => {
        try {
            const [total, max] = await Promise.all([
                web3Service.getTotalMinted(),
                web3Service.getMaxSupply(),
            ]);
            setTotalMinted(total);
            setMaxSupply(max);
        } catch (error) {
            console.error('加载统计数据失败:', error);
        }
    };

    const loadUserNFTs = async () => {
        if (!walletAddress) return;

        try {
            setLoading(true);
            const tokenIds = await web3Service.getUserNFTs(walletAddress);

            const nftData = await Promise.all(
                tokenIds.map(async (tokenId) => {
                    const tokenURI = await web3Service.getTokenURI(tokenId);
                    const httpUrl = ipfsService.ipfsToHttp(tokenURI);

                    try {
                        const response = await fetch(httpUrl);
                        const metadata = await response.json();

                        return {
                            tokenId,
                            name: metadata.name || `NFT #${tokenId}`,
                            image: ipfsService.ipfsToHttp(metadata.image),
                            tokenURI,
                        };
                    } catch {
                        return {
                            tokenId,
                            name: `NFT #${tokenId}`,
                            image: '',
                            tokenURI,
                        };
                    }
                })
            );

            setNfts(nftData);
        } catch (error) {
            console.error('加载 NFT 失败:', error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="space-y-6">
            {/* 统计信息 */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="card text-center">
                    <p className="text-gray-600 dark:text-gray-400 text-sm">总铸造量</p>
                    <p className="text-3xl font-bold text-primary">{totalMinted}</p>
                </div>
                <div className="card text-center">
                    <p className="text-gray-600 dark:text-gray-400 text-sm">最大供应量</p>
                    <p className="text-3xl font-bold text-gray-900 dark:text-white">{maxSupply}</p>
                </div>
                <div className="card text-center">
                    <p className="text-gray-600 dark:text-gray-400 text-sm">剩余可铸造</p>
                    <p className="text-3xl font-bold text-secondary">{maxSupply - totalMinted}</p>
                </div>
            </div>

            {/* 我的 NFT */}
            {walletAddress && (
                <div className="card">
                    <h3 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">我的 NFT 收藏</h3>

                    {loading ? (
                        <div className="text-center py-12">
                            <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-gray-300 border-t-primary"></div>
                            <p className="mt-4 text-gray-600 dark:text-gray-400">加载中...</p>
                        </div>
                    ) : nfts.length === 0 ? (
                        <div className="text-center py-12">
                            <p className="text-gray-700 dark:text-gray-300 text-base">
                                您还没有铸造任何 NFT
                            </p>
                            <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
                                立即铸造您的第一个 NFT 吧！
                            </p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                            {nfts.map((nft) => (
                                <div
                                    key={nft.tokenId}
                                    className="bg-gray-50 dark:bg-gray-700 rounded-lg overflow-hidden hover:shadow-xl transition-shadow"
                                >
                                    {nft.image ? (
                                        <img
                                            src={nft.image}
                                            alt={nft.name}
                                            className="w-full h-64 object-cover"
                                        />
                                    ) : (
                                        <div className="w-full h-64 bg-gray-200 dark:bg-gray-600 flex items-center justify-center">
                                            <p className="text-gray-500 dark:text-gray-400">无图片</p>
                                        </div>
                                    )}
                                    <div className="p-4">
                                        <h4 className="font-semibold text-lg mb-1 text-gray-900 dark:text-white">{nft.name}</h4>
                                        <p className="text-sm text-gray-600 dark:text-gray-400">
                                            Token ID: #{nft.tokenId}
                                        </p>
                                        <a
                                            href={ipfsService.ipfsToHttp(nft.tokenURI)}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="text-sm text-primary hover:underline mt-2 inline-block"
                                        >
                                            查看元数据 →
                                        </a>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}
