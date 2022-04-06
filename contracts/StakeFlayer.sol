// SPDX-License-Identifier: MIT
pragma solidity >=0.7.0 <0.9.0;

import "./FlayerToken.sol";

contract StakeFlayer {
    FlayerToken public token;

    struct Stake {
        uint256 tokens;
        uint256 startTime;
    }
    mapping(address => Stake) staked;

    constructor(FlayerToken _tokenAddress) {
        token = _tokenAddress;
    }

    // Staking Function
    function stakeToken(uint256 _amount) public payable {
        staked[msg.sender] = Stake(_amount, block.timestamp);
        token.transferFrom(msg.sender, address(this), _amount);
    }

    // Unstaked Function
    function unStakeToken() public payable {
        require(
            staked[msg.sender].tokens > 0,
            "You don't have any token stacked"
        );
        token.mint(address(this), earnedRewards(msg.sender));
        token.transfer(
            msg.sender,
            staked[msg.sender].tokens + earnedRewards(msg.sender)
        );
        delete staked[msg.sender];
    }

    // Reward calculation function
    function earnedRewards(address _reciever) internal view returns (uint256) {
        uint16 rewardPercentage = 2;
        uint256 time = staked[_reciever].startTime;
        if (
            time + 30 days >= block.timestamp &&
            time + (6 * 30 days) <= block.timestamp &&
            time + (12 * 30 days) <= block.timestamp
        ) {
            rewardPercentage = 5;
        } else if (
            time + (6 * 30 days) >= block.timestamp &&
            time + (12 * 30 days) <= block.timestamp
        ) {
            rewardPercentage = 5;
        } else if (time + (12 * 30 days) >= block.timestamp) {
            rewardPercentage = 15;
        }
        uint256 totalReward = (10**token.decimals() *
            staked[_reciever].tokens *
            rewardPercentage) / 100;
        return totalReward;
    }
}
