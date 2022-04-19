// SPDX-License-Identifier: MIT
pragma solidity >=0.7.0 <0.9.0;

import "./FlayerToken.sol";

contract StakeFlayer {
    FlayerToken public token;

    struct Stake {
        address beneficiary;
        uint256 tokens;
        uint256 startTime;
    }
    mapping(address => Stake) public staked;

    constructor(FlayerToken _tokenAddress) {
        token = _tokenAddress;
    }

    // Staking Function
    function stakeToken(uint256 _amount) public payable {
        require(staked[msg.sender].beneficiary == address(0), "already staked");
        uint256 tokenAmount = _amount * 10 ** token.decimals();
        staked[msg.sender] = Stake(msg.sender, tokenAmount, block.timestamp);
        token.transferFrom(msg.sender, address(this), tokenAmount);
    }

    // Unstaked Function
    function unStakeToken(address _beneficiary) public payable {
        require(msg.sender == _beneficiary, "Only stake owner can unstake");
        require(
            staked[_beneficiary].tokens > 0,
            "You don't have any token staked"
        );
        uint256 totalDays = (block.timestamp - staked[_beneficiary].startTime) / 60 * 60 * 24;
        require(totalDays >= 30, "Minimum staking time(30 days) not completed");
        token.mint(address(this), earnedRewards(_beneficiary));
        token.transfer(
            _beneficiary,
            staked[_beneficiary].tokens + earnedRewards(_beneficiary)
        );
        delete staked[_beneficiary];
    }

    // Reward calculation function
    function earnedRewards(address _beneficiary) public view returns (uint256) {
        uint16 rewardPercentage = 2;
        uint256 time = staked[_beneficiary].startTime;
        uint256 totalDays = (block.timestamp - time) / 60 * 60 * 24;
        if ( totalDays  >= 30  && totalDays <= 6 * 30 ) rewardPercentage = 5;
        else if (totalDays  >= 6 * 30  && totalDays <= 12 * 30 ) rewardPercentage = 10; 
        else if ( totalDays  >= 12 * 30 ) rewardPercentage = 15;
        uint256 totalReward = (staked[_beneficiary].tokens * rewardPercentage) / 100;
        return totalReward;
    }

    function checkStaked(address _owner) public view returns(uint256){
        return(staked[_owner].tokens);
    }

}
