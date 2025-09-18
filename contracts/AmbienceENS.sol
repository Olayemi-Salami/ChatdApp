// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

contract AmbienceENS {
    struct ENSRecord {
        address owner;
        string displayName;
        string profileImageHash;
        uint256 registrationTime;
        bool isActive;
    }
    
    mapping(string => ENSRecord) public ensRecords;
    mapping(address => string) public addressToENS;
    mapping(string => bool) public ensExists;
    
    string[] public allENSNames;
    
    event ENSRegistered(
        string indexed ensName,
        address indexed owner,
        string displayName,
        string profileImageHash,
        uint256 timestamp
    );
    
    event ENSUpdated(
        string indexed ensName,
        address indexed owner,
        string displayName,
        string profileImageHash
    );
    
    modifier onlyENSOwner(string memory ensName) {
        require(ensRecords[ensName].owner == msg.sender, "Not the owner of this ENS");
        require(ensRecords[ensName].isActive, "ENS is not active");
        _;
    }
    
    modifier ensNotExists(string memory ensName) {
        require(!ensExists[ensName], "ENS name already exists");
        _;
    }
    
    function registerENS(
        string memory ensName,
        string memory displayName,
        string memory profileImageHash
    ) external ensNotExists(ensName) {
        require(bytes(ensName).length > 0, "ENS name cannot be empty");
        require(bytes(displayName).length > 0, "Display name cannot be empty");
        require(bytes(addressToENS[msg.sender]).length == 0, "Address already has an ENS");
        
        ensRecords[ensName] = ENSRecord({
            owner: msg.sender,
            displayName: displayName,
            profileImageHash: profileImageHash,
            registrationTime: block.timestamp,
            isActive: true
        });
        
        ensExists[ensName] = true;
        addressToENS[msg.sender] = ensName;
        allENSNames.push(ensName);
        
        emit ENSRegistered(ensName, msg.sender, displayName, profileImageHash, block.timestamp);
    }
    
    function updateENS(
        string memory ensName,
        string memory displayName,
        string memory profileImageHash
    ) external onlyENSOwner(ensName) {
        ensRecords[ensName].displayName = displayName;
        ensRecords[ensName].profileImageHash = profileImageHash;
        
        emit ENSUpdated(ensName, msg.sender, displayName, profileImageHash);
    }
    
    function getENSRecord(string memory ensName) external view returns (
        address owner,
        string memory displayName,
        string memory profileImageHash,
        uint256 registrationTime,
        bool isActive
    ) {
        ENSRecord memory record = ensRecords[ensName];
        return (
            record.owner,
            record.displayName,
            record.profileImageHash,
            record.registrationTime,
            record.isActive
        );
    }
    
    function getAllENSNames() external view returns (string[] memory) {
        return allENSNames;
    }
    
    function getENSByAddress(address userAddress) external view returns (string memory) {
        return addressToENS[userAddress];
    }
    
    function getTotalENSCount() external view returns (uint256) {
        return allENSNames.length;
    }
    
    function isENSAvailable(string memory ensName) external view returns (bool) {
        return !ensExists[ensName];
    }
}
