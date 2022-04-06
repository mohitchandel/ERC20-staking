
## Stacking Smart Contract

stacking smart contract will be created after the creation of ERC20 token (Flayer), because the Staking smart contract paremeters in its contructor to define the token.

`constructor(FlayerToken _tokenAddress) {}`

functions need to call before stacking

```
approve(address spender, uint256 amount)
``` 

this function is used to approve contract address to spend on on behalf of user.

The function takes the following arguments:

- `spender`: This is the address of the spender to whom the approval rights should be given or revoked from the approver.
- `amount`: This is amount of tokens can be spend.


### How to stake

In stacking smart contract function `stakeToken()` is used to stake the ERC20 token.

this function has following arguments:

- `uint256 _amount` : It is the token amount user want stake.


### How to Unstake NFT

The `unStakeToken()` function is used to complete the process of unstaking

This function calculated price and mint it to the reciepient address.
