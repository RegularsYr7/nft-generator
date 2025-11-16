import { useState, useRef } from 'react';
import { web3Service } from '../utils/web3';
import { ipfsService } from '../utils/ipfs';
import type { NFTMetadata, MintStatus } from '../types/index.js';

export default function NFTMinter() {
    const [nftName, setNftName] = useState('');
    const [nftDescription, setNftDescription] = useState('');
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);
    const [mintStatus, setMintStatus] = useState<MintStatus>({
        loading: false,
        success: false,
        error: null,
    });

    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setSelectedFile(file);
            const reader = new FileReader();
            reader.onloadend = () => {
                setPreviewUrl(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleMint = async () => {
        if (!selectedFile || !nftName) {
            setMintStatus({
                loading: false,
                success: false,
                error: '请填写所有必填字段',
            });
            return;
        }

        try {
            setMintStatus({ loading: true, success: false, error: null });

            // 1. 上传图片到 IPFS
            console.log('正在上传图片到 IPFS...');
            const imageUri = await ipfsService.uploadImage(selectedFile);

            // 2. 创建并上传元数据
            const metadata: NFTMetadata = {
                name: nftName,
                description: nftDescription,
                image: imageUri,
            };

            console.log('正在上传元数据到 IPFS...');
            const metadataUri = await ipfsService.uploadMetadata(metadata);

            // 3. 铸造 NFT
            console.log('正在铸造 NFT...');
            const { txHash, tokenId } = await web3Service.mintNFT(metadataUri);

            setMintStatus({
                loading: false,
                success: true,
                error: null,
                txHash,
                tokenId,
            });

            // 重置表单
            setNftName('');
            setNftDescription('');
            setSelectedFile(null);
            setPreviewUrl(null);
            if (fileInputRef.current) {
                fileInputRef.current.value = '';
            }
        } catch (error) {
            console.error('铸造失败:', error);
            setMintStatus({
                loading: false,
                success: false,
                error: error instanceof Error ? error.message : '铸造失败',
            });
        }
    };

    return (
        <div className="card h-full flex flex-col">
            <h2 className="text-3xl font-bold mb-6 text-gray-900 dark:text-white">铸造 NFT</h2>

            <div className="space-y-6 flex-1 flex flex-col">
                {/* 图片上传 */}
                <div className="flex-1 flex flex-col min-h-[300px]">
                    <label className="block text-sm font-medium mb-3 text-gray-900 dark:text-white">
                        NFT 图片 <span className="text-red-500">*</span>
                    </label>
                    <div
                        onClick={() => fileInputRef.current?.click()}
                        className="flex-1 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-8 text-center cursor-pointer hover:border-primary hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-all duration-200 flex items-center justify-center"
                    >
                        {previewUrl ? (
                            <div className="w-full h-full flex items-center justify-center">
                                <img
                                    src={previewUrl}
                                    alt="预览"
                                    className="max-h-full max-w-full object-contain rounded-lg shadow-lg"
                                />
                            </div>
                        ) : (
                            <div className="flex flex-col items-center justify-center py-12">
                                <svg
                                    className="mx-auto h-16 w-16 text-gray-400 mb-4"
                                    stroke="currentColor"
                                    fill="none"
                                    viewBox="0 0 48 48"
                                >
                                    <path
                                        d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                                        strokeWidth={2}
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                    />
                                </svg>
                                <p className="text-base font-medium text-gray-600 dark:text-gray-300 mb-1">
                                    点击上传图片
                                </p>
                                <p className="text-sm text-gray-500 dark:text-gray-400">
                                    支持 JPG, PNG, GIF 格式
                                </p>
                            </div>
                        )}
                    </div>
                    <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/*"
                        onChange={handleFileSelect}
                        className="hidden"
                    />
                </div>

                {/* NFT 名称 */}
                <div>
                    <label className="block text-sm font-medium mb-2 text-gray-900 dark:text-white">
                        NFT 名称 <span className="text-red-500">*</span>
                    </label>
                    <input
                        type="text"
                        value={nftName}
                        onChange={(e) => setNftName(e.target.value)}
                        placeholder="例如：My Awesome NFT #1"
                        className="input-field"
                    />
                </div>

                {/* NFT 描述 */}
                <div>
                    <label className="block text-sm font-medium mb-2 text-gray-900 dark:text-white">NFT 描述</label>
                    <textarea
                        value={nftDescription}
                        onChange={(e) => setNftDescription(e.target.value)}
                        placeholder="描述您的 NFT..."
                        rows={4}
                        className="input-field resize-none"
                    />
                </div>

                {/* 状态提示 */}
                {mintStatus.error && (
                    <div className="bg-red-100 dark:bg-red-900/30 border border-red-400 text-red-700 dark:text-red-400 px-4 py-3 rounded">
                        {mintStatus.error}
                    </div>
                )}

                {mintStatus.success && (
                    <div className="bg-green-100 dark:bg-green-900/30 border border-green-400 text-green-700 dark:text-green-400 px-4 py-3 rounded">
                        <p className="font-semibold">🎉 NFT 铸造成功！</p>
                        {mintStatus.tokenId && <p>Token ID: #{mintStatus.tokenId}</p>}
                        {mintStatus.txHash && (
                            <a
                                href={`https://sepolia.etherscan.io/tx/${mintStatus.txHash}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-sm underline"
                            >
                                查看交易详情 →
                            </a>
                        )}
                    </div>
                )}

                {/* 铸造按钮 */}
                <button
                    onClick={handleMint}
                    disabled={mintStatus.loading || !selectedFile || !nftName}
                    className="btn-primary w-full text-lg py-3"
                >
                    {mintStatus.loading ? (
                        <span className="flex items-center justify-center">
                            <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                            铸造中...
                        </span>
                    ) : (
                        '铸造 NFT'
                    )}
                </button>

                <p className="text-sm text-gray-500 text-center">
                    铸造费用: 0.001 ETH + Gas 费
                </p>
            </div>
        </div>
    );
}
