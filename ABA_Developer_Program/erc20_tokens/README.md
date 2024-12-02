

Take home exercise: (copy out the following exercise to work on and send to email address provided. 
Answer should be sent no later than 48 hours after your application) 

Create an ERC20 token using https://remix.ethereum.org/ as your development environment. 
The contract should be able to create and transfer the asset. 
Feel free to add any extra funtionality that would make your token standout from others. 

When you are done add a README.txt file to explain what you’ve built, zip the files and email to 
developer@afriblockchain.org.


                                READ ME

ERC20 is the standard for creating a token on the ETH blockchain. The token must be managed by a Smart Contract, a.k.a. a "Token Contract" that users can access through the use of a DApp (Decentralized Application).
Users should be able to buy tokens (with Ether), check token balance, transfer tokens to other users' accounts, and perform other actions with the token.
DApps can access all the available funcitonalities of the Token Contract if they have been authorized to do so, according to the specifications of the Token's Blockchain developer.
Token Contracts can only be deployed as ERC20 Tokens if they meet all the ERC20 Standards
Token can be deployed on to a testnet such as Ropsten, geth, etc. It can also be added to MetaMask or a wallet or an exchange.
Once the token has been successfully deployed on to a testnet or the ETH Blockchain, it can then be tested by making transactions with it.

Some specifications of an ERC20 Token Contract (ABI Definition) - name, 6 functions minimum with specific arguments and return values, and 2 events minimum
Some metadata of an ERC20 Token Contract - name (string eg. "Bitcoin"), symbol (string eg. "BTC"), decimals (uint8 eg. 0)

6 Main functions - totalSupply(), balanceOf(), transfer(), approve(), allowance(), transfrom()
2 Main events - Approval(), Transfer()
NB: Custom functions, events, and variables can be created within the Token Contract for the client DApp's own purposes, but ETH wallets and exchanges will ignore them
and will not show them to the end users of those wallets and exchanges. But users can still access those functionalities through the client DApps.
eg. removeTokens() function can be included, as well as a TokenRemoved() event to enable DApps remove any amount of tokens.
NB: Trading of tokens are managed by the wallets and exchanges (therefore, trading can be enabled or disabled on the wallets and exchanges).


                                6 MAIN FUNCTIONS

1. function totalSupply() public returns (uint256 totalSupply) - returns the total amount of tokens (in the "totalSupply" variable) supplied by the Token Contract.
Token Contract can support minting of new tokens or reducing of token supply, therefore the totalSupply variable's uint256 value can be increased or reduced.

2. function balanceOf(address _owner) public returns (uint256 balance) - returns the balance or amount of tokens held by the owner (passed in as the "_owner" argument).

3. function transfer(address _to, uint256 _value) public returns (bool success) - transfer ownership to another account ("_to" address).

4. function approve(address _spender, uint256 _value) public return (bool success) - approves another account ("_spender" address) to spend a maximum amount of tokens ("_value" uint256).
eg. account 'A' approving another account 'B' (_spender) to be allowed to spend "_value" amount of tokens.

5. function allowance(address _owner, address _spender) public returns (uint256 remaining) - at any point, an account can call this function to check the total amount of spendable tokens
that have been approved by another account (which called the "approve" function).
eg. account 'B' (_spender) checking the amount of tokens it is allowed to spend as approved by another account 'A' (_owner).

6. function transferFrom(address _from, address _to, uint256 _value) public returns (bool success) - an account can call this function to transfer the token allowance of another account to another 3rd party account.
eg. account 'A' can call this function to transfer the amount of token allowance of account 'B' to another 3rd party account 'C'.
(or account 'A' can call the transfer() function to transfer its ownership / allowance of its own tokens to the 3rd party account 'C').

                                2 MAIN EVENTS

1. event Approval(address indexed _owner, address indexed _spender, uint256 _value) - this event is triggered when an account 'A' approves another account 'B'.

2. event Transfer(address indexed _from, address indexed _to, uint256 _value) - this event is triggered when any transfer of tokens is made between multiple accounts.


                                TOKEN IMPLEMENTATION

2 Main Contracts - TokenV1.sol and TokenV2.sol as a contract-oriented programming structure.
TokenV1 is the parent contract, with TokenV2 inheriting from it.
The Token Contracts' solidity files can be found within the "erc20_tokens_contracts/" directory.

TokenV1 is not ERC20 Compliant because it does not have all the main 6 functions and 2 events within the ERC20 standards.
TokenV2 however is ERC20 compliant because it meets all the ERC20 standards by implementing all the main 6 functions and 2 events.

Each Token Contract has its corresponding test file within the "erc20_tokens_tests/" directory 
(with each corresponding filename eg. TokenV1.js is the test file for TokenV1.sol Token Contract)
The test files can be run with Truffle command-line interface tool - eg. "truffle test ./erc20_tokens_tests/TokenV1.js"
