// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract NFTGenerator is ERC721URIStorage, Ownable {
    uint256 private _tokenIdCounter;
    
    uint256 public mintPrice = 0.001 ether; // 铸造价格
    uint256 public maxSupply = 10000; // 最大供应量
    
    event NFTMinted(address indexed minter, uint256 indexed tokenId, string tokenURI);
    
    constructor() ERC721("NFT Generator", "NFTGEN") Ownable(msg.sender) {
        _tokenIdCounter = 0;
    }
    
    /**
     * @dev 铸造 NFT
     * @param tokenURI NFT 元数据 URI (IPFS 链接)
     */
    function mintNFT(string memory tokenURI) public payable returns (uint256) {
        require(msg.value >= mintPrice, "Insufficient payment");
        require(_tokenIdCounter < maxSupply, "Max supply reached");
        
        _tokenIdCounter++;
        uint256 newTokenId = _tokenIdCounter;
        
        _safeMint(msg.sender, newTokenId);
        _setTokenURI(newTokenId, tokenURI);
        
        emit NFTMinted(msg.sender, newTokenId, tokenURI);
        
        return newTokenId;
    }
    
    /**
     * @dev 获取当前已铸造的 NFT 数量
     */
    function getTotalMinted() public view returns (uint256) {
        return _tokenIdCounter;
    }
    
    /**
     * @dev 设置铸造价格 (仅合约所有者)
     */
    function setMintPrice(uint256 _newPrice) public onlyOwner {
        mintPrice = _newPrice;
    }
    
    /**
     * @dev 提取合约余额 (仅合约所有者)
     */
    function withdraw() public onlyOwner {
        uint256 balance = address(this).balance;
        require(balance > 0, "No funds to withdraw");
        payable(owner()).transfer(balance);
    }
    
    /**
     * @dev 获取用户拥有的所有 NFT Token IDs
     */
    function getTokensByOwner(address _owner) public view returns (uint256[] memory) {
        uint256 tokenCount = balanceOf(_owner);
        uint256[] memory tokenIds = new uint256[](tokenCount);
        uint256 counter = 0;
        
        for (uint256 i = 1; i <= _tokenIdCounter; i++) {
            if (_ownerOf(i) == _owner) {
                tokenIds[counter] = i;
                counter++;
            }
        }
        
        return tokenIds;
    }
}
