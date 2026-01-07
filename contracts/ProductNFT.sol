// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

contract ProductNFT is ERC721, Ownable {
    using Counters for Counters.Counter;
    Counters.Counter private _tokenIdCounter;

    struct Product {
        string name;
        string description;
        string serialNumber;
        string batchId;
        string manufacturingDate;
        string ipfsCid;
        bytes32 metadataHash;
        uint256 createdAt;
    }

    mapping(uint256 => Product) public products;

    event ProductMinted(uint256 indexed tokenId, address indexed to, string ipfsCid, bytes32 metadataHash);

    constructor() ERC721("VeriTrace Product NFT", "VPNFT") {}

    function mintProduct(
        address to,
        string memory name,
        string memory description,
        string memory serialNumber,
        string memory batchId,
        string memory manufacturingDate,
        string memory ipfsCid,
        bytes32 metadataHash
    ) public onlyOwner returns (uint256) {
        uint256 tokenId = _tokenIdCounter.current();
        _tokenIdCounter.increment();

        _safeMint(to, tokenId);

        products[tokenId] = Product({
            name: name,
            description: description,
            serialNumber: serialNumber,
            batchId: batchId,
            manufacturingDate: manufacturingDate,
            ipfsCid: ipfsCid,
            metadataHash: metadataHash,
            createdAt: block.timestamp
        });

        emit ProductMinted(tokenId, to, ipfsCid, metadataHash);

        return tokenId;
    }

    function getProduct(uint256 tokenId) public view returns (Product memory) {
        require(_exists(tokenId), "Product does not exist");
        return products[tokenId];
    }

    function verifyProduct(uint256 tokenId, bytes32 metadataHash) public view returns (bool) {
        require(_exists(tokenId), "Product does not exist");
        return products[tokenId].metadataHash == metadataHash;
    }
}