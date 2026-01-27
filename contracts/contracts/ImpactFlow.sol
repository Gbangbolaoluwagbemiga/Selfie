// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";

contract ImpactFlow is ReentrancyGuard {
    struct Campaign {
        address owner;
        string title;
        string description;
        uint256 target;
        uint256 deadline;
        uint256 amountCollected;
        string image;
        address[] donators;
        uint256[] donations;
        bool claimed;
    }

    mapping(uint256 => Campaign) public campaigns;
    uint256 public numberOfCampaigns = 0;

    event CampaignCreated(uint256 indexed id, address owner, string title, uint256 target, uint256 deadline);
    event DonationReceived(uint256 indexed id, address donor, uint256 amount);
    event FundsWithdrawn(uint256 indexed id, address owner, uint256 amount);

    function createCampaign(address _owner, string memory _title, string memory _description, uint256 _target, uint256 _deadline, string memory _image) public returns (uint256) {
        require(_deadline > block.timestamp, "The deadline should be a date in the future.");

        Campaign storage campaign = campaigns[numberOfCampaigns];

        campaign.owner = _owner;
        campaign.title = _title;
        campaign.description = _description;
        campaign.target = _target;
        campaign.deadline = _deadline;
        campaign.amountCollected = 0;
        campaign.image = _image;
        campaign.claimed = false;

        emit CampaignCreated(numberOfCampaigns, _owner, _title, _target, _deadline);

        numberOfCampaigns++;

        return numberOfCampaigns - 1;
    }

    function donateToCampaign(uint256 _id) public payable nonReentrant {
        uint256 amount = msg.value;
        Campaign storage campaign = campaigns[_id];

        require(block.timestamp < campaign.deadline, "The campaign is over.");

        campaign.donators.push(msg.sender);
        campaign.donations.push(amount);
        campaign.amountCollected += amount;

        emit DonationReceived(_id, msg.sender, amount);
    }

    function withdraw(uint256 _id) public nonReentrant {
        Campaign storage campaign = campaigns[_id];
        require(msg.sender == campaign.owner, "Only owner can withdraw");
        require(campaign.amountCollected >= campaign.target, "Target not reached");
        require(!campaign.claimed, "Already claimed");

        campaign.claimed = true;
        (bool sent,) = payable(campaign.owner).call{value: campaign.amountCollected}("");
        require(sent, "Failed to send Ether");
        
        emit FundsWithdrawn(_id, campaign.owner, campaign.amountCollected);
    }

    function getDonators(uint256 _id) public view returns (address[] memory, uint256[] memory) {
        return (campaigns[_id].donators, campaigns[_id].donations);
    }

    function getCampaigns() public view returns (Campaign[] memory) {
        Campaign[] memory allCampaigns = new Campaign[](numberOfCampaigns);

        for(uint i = 0; i < numberOfCampaigns; i++) {
            Campaign storage item = campaigns[i];
            allCampaigns[i] = item;
        }

        return allCampaigns;
    }
}
