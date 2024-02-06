This walkthrough is based on this Medium post by Manuel Araoz.

What is Proof of Existence?
Proof of Existence is a service that verifies the existence of a document or file at a specific time via timestamped transactions. PoE utilizes the one-way nature of cryptographic hash functions to reduce the amount of information that needs to be stored on the blockchain.

In this walkthrough, we are going to introduce some basic Ethereum smart contract development best practices by creating a simple proof of existence contract and interacting with it on the blockchain.

SET UP THE ENVIRONMENT
CONNECT TO A BLOCKCHAIN
To develop Ethereum applications, you will need a client to connect to an Ethereum blockchain. You can use Geth, Parity or a development blockchain such as Ganache.

In this walkthrough we will be using the Ganache command line interface, ganache-cli. You can find the documentation on ganache-cli here.

You can install ganache-cli with the following command:

$ sudo npm install -g ganache-cli
And start ganache-cli with

$ ganache-cli
When ganache-cli starts, you can see that it starts with 10 accounts. Each of those accounts comes prefunded with Ether so we do not need to mine or acquire funds from a faucet.

Ganache-cli starts a development blockchain that needs to be running while develop the application so leave it running while we continue working on the application.

TRUFFLE DEVELOPMENT FRAMEWORK
Solidity is the most popular programming language for writing smart contracts in Ethereum. We will be using Solidity throughout this course.

The Truffle development framework is one of the most popular development tools for writing Solidity smart contracts for Ethereum. Truffle will help us compile, deploy and test our smart contracts once they are written.

To install truffle

$ sudo npm install -g truffle
Create a project directory and set up truffle

$ mkdir proof-of-existence
$ cd proof-of-existence/
$ truffle init
Truffle sets up a contracts directory where we will write our contracts, a migrations directory where we will write scripts to deploy our contracts and a test directory where we will write tests to make sure that our contracts work as expected.

The project also comes with truffle-config.js and truffle.js configuration files. These files serve the same purpose, but the project initializes with both because of naming conflicts on Windows machines. We will use truffle-config.js, so you can delete truffle.js. In truffle-config.js we need to specify the network that we will be using.

In the module.exports object, add the following information:

module.exports = {
    networks: {
        development: {
            host: “localhost”,
            port: 8545,
            network_id: “*”
        }
    }
};
We use this information because ganache-cli is running our development blockchain on localhost:8545, and this is what we want to connect to. Specifying network_id as * means that any truffle will deploy to any network running at localhost:8545.

Truffle comes with a Migrations.sol contract that keeps track our migrations as well as a 1_initial_migrations.js script to deploy the Migrations.sol contract.

Run the following command in the terminal in your project directory:

$ truffle migrate
The terminal should print information about the deployment of the Migrations contract.

This means that you environment is set up correctly and we can move on to writing our smart contracts.

WRITING THE SMART CONTRACT
Run the following command in the terminal in your project directory:

$ truffle create contract ProofOfExistence1
This command will create a Solidity file in the contracts directory called “ProofOfExistence1.sol” and set up the boilerplate code for the contract, a contract definition and a contract constructor. Open ProofOfExistence.sol in your text editor.

Update your ProofOfExistence1.sol file so that it looks like this.

We are starting with something simple, but incorrect and we are going to work towards a better contract.

Our contract has a state and two functions. This contract actually has two different kinds of functions, a transactional function (notarize) and a read-only, or view, function (proofFor). Transactional functions can modify state whereas constant functions can only read the state and return values.

Let’s deploy this contract to our test network.

Create a new migrations file in the migrations directory called 2_deploy_contracts.js. In this file add the following:

var ProofOfExistence1 = artifacts.require("./ProofOfExistence1.sol");

module.exports = function(deployer) {
    deployer.deploy(ProofOfExistence1);
};
This script tells Truffle to get the contract information from ProofOfExitence.sol and deploy it to the specified network. Now we just need to tell Truffle to run the deployment.

Run the following command in the terminal in your project directory:

$ truffle migrate
In the terminal output you should see that Truffle compiled ProofOfExistence.sol and printed some warning regarding the contract. Then it runs the migrations using the network ‘development’ that we specified in truffle-config.js.

Truffle remembers which contracts it has migrated to the network, so if we want to run the migration again on the same network, we need to use the --reset option like so:

$ truffle migrate --reset
You can find more information about truffle migrations here.

INTERACTING WITH YOUR SMART CONTRACT
Our contract is now on the development blockchain, so we can interact with it. We can read the contract state from the blockchain and update the state by calling the notarize function. We can do this using the Truffle console.

Bring up the truffle console with the command:

$truffle console
You should see

truffle(development)>
On the first line enter:

var poe = await ProofOfExistence1.at(ProofOfExistence1.address)
This line says that the variable “poe” is an instance of ProofOfExistence1.sol found at the address that we just deployed.

You can see the address by entering

truffle(development)> poe.address
'0xc490df1850010ea8146c1dd3e961fedbf6b85bef'
To call the notarize function, we call it like any other javascript function.

truffle(development)> poe.notarize(‘Hello World!’)
{ tx: '0x60ae...2643cbea65',
  receipt: …
}
This function causes a state change, so it is a transactional function. Transactional functions return a Promise that resolves to a transaction object.

We can get the proof for the string with

truffle(development)> poe.proofFor(‘Hello World!’)
‘0x7f83b...126d9069’
And check that the contract’s state was correctly changed

truffle(development)> poe.proof()
‘0x7f83b...126d9069’
The hashes match!

ITERATING THE CODE
Our contract works! But it can only store one proof at a time. Let’s change that.

Exit the Truffle console and create a new file called ProofOfExistence2.sol:

truffle(development)> .exit
$ truffle create contract ProofOfExistence2
Update the ProofOfExistence2 contract to match this contract.

The main changes between the first version and this version are that we changed the “proof” variable to a bytes32 array called “proofs” and made it private. We also added a function called “hasProof” to check if a proof has already been stored in the array.

Update the migration script 2_deploy_contracts.js to deploy the new contract and deploy it to the development blockchain.

$ truffle migrate --reset
Launch the console to interact with the new contract.

$ truffle console
Save the deployed contract

truffle(development)> var poe = await ProofOfExistence2.at(ProofOfExistence2.address)
We can check for a proof.

truffle(development)> poe.checkDocument(“Hello World!”)
false
It returns false because we haven’t added anything yet. Let’s do that now.

truffle(development)> poe.notarize(“Hello World!”)
{ tx: '0xd6f72...10a6e',
  receipt: 
   { transactionHash: ...
  logs: [] }

truffle(development)> poe.checkDocument(“Hello World!”)
true
We can check to make sure that our contract will store multiple proofs.

truffle(development)> poe.notarize(“Hello Consensys!”)
{ tx: '0x8b566...091ace',
  receipt: 
   { transactionHash: ...
  logs: [] }

truffle(development)> poe.checkDocument(“Hello Consensys!”)
True
Looping over arrays in smart contracts can get expensive as arrays get longer. Using a mapping is a better solution.

Let’s create a final version in ProofOfExistence3.sol using mappings. You can use this code for the contract.

Modify the deployment script to deploy the new contract and test it in the console to make sure that it behaves just like ProofOfExistence2.sol.

DEPLOYING TO THE TESTNET - MetaMask Password - "blockchain"
From here, we are going to deviate from the Zeppelin Solutions walkthrough. If you want to learn how to deploy contracts using the geth console (which requires syncing with the testnet), you can consult the Zeppelin Solutions walkthrough.

The first step in our alternate deployment method is to get an Ethereum account on Metamask. On the landing page, click “Get Chrome Extension.”

Once the extension is installed, accept the terms of use and enter a password for your account.

You will be shown 12 words that can be used to restore your wallet. A word of caution, do NOT publish these words anywhere public. Anyone that has these 12 words has access to your wallet. Save these 12 words in a file called '.secret' in your project directory.

With Truffle version 5, the truffle-config.js file come populated with a lot of configuration settings that are commented out.

// truffle-config.js

25 const HDWallet = require('truffle-hdwallet-provider');
26 const infuraKey = "fj4jll3k.....";
27 
28 const fs = require('fs');
29 const mnemonic = fs.readFileSync(".secret").toString().trim();
Uncomment lines 25 - 29. Line 25 will import the tool to derive a private key and address from a mnemonic. Entering your Infura API key in line 26 will allow you to easily deploy contracts to Ethereum (we will cover how to get an API key shortly). Lines 28 and 29 will import your seed phrase (from the .secret file) into the file. Truffle will use these words to access your wallet and deploy the contract.

Deploying the contract requires us to make a transaction on the testnet, so we need some ether to pay for the transaction. You can get free Rinkeby ether by going to this website and following the instructions. Make sure you enter the Ethereum address for your 1st Metamask account.

Now that we have a testnet account with Ether, we need to configure Truffle to be able to deploy the contract.

To deploy contracts to the testnet using Truffle without having to sync a local node, you can use Infura. Infura allows you to access a fully synced Ethereum node via their API. We will use their API to deploy our contracts to the Rinkeby testnet.

Go to the Infura website and sign up for a free account. Save the Rinkeby test network URL that Infrua provides in a variable called infura in truffle-config.js. Your key is the Project ID provided by Infura.

// truffle-config.js
26 const infuraKey = "fj4jll3k....."; <-- project id here
For Truffle to derive our ethereum address from the mnemonic, we need to install the Truffle HD wallet provider. In the terminal located in the proof-of-existence project root run:

$ npm install truffle-hdwallet-provider
And import the HD wallet provider into your truffle-config.js file.

var HDWallet = require("truffle-hdwallet-provider")
Now we just need to add the rinkeby network configuration to the networks object in truffle-config.js module.exports.

Change the module.exports object to resemble this:

  networks: {
      development: {
          host: "localhost",
          port: 8545,
          network_id: "*"
      },

      rinkeby: {
        provider: () => new HDWallet(mnemonic, `https://rinkeby.infura.io/${infuraKey}`),
        network_id: 4,          // Rinkeby's id
        gas: 5500000,        
      },
  }
Where the “mnemonic” variable is the 12 word seed phrase that you saved from metamask and the “infuraKey” variable is your Infura Project ID.

You just have to run “truffle migrate” for the correct network and your contract will be deployed!

$ truffle migrate --network rinkeby

Starting migrations...
======================
> Network name:    'rinkeby'
> Network id:      4
> Block gas limit: 7602728


1_initial_migration.js
======================

   Deploying 'Migrations'
   ----------------------
   > transaction hash:    0x6c5cc0090db1147dfadfd4a84280715e8e8bb3bb820401e32ea40b4f6e521178
   > Blocks: 0            Seconds: 12
   > contract address:    0x8e8786683C33147dA500c3F54A9690A4f81a3D48
   > account:             0x196150D99a325f624F7c420Cf80ca6ab9a1BeDBA
   > balance:             0.987611032134329654
   > gas used:            284908
   > gas price:           20 gwei
   > value sent:          0 ETH
   > total cost:          0.00569816 ETH


   > Saving migration to chain.
   > Saving artifacts
   -------------------------------------
   > Total cost:          0.00569816 ETH


2_deploy_contracts.js
=====================

   Deploying 'ProofOfExistence2'
   -----------------------------
   > transaction hash:    0x4692cc0311571c70f7d425f9a89702a355abe8345961c871980a279c8b16e20a
   > Blocks: 1            Seconds: 12
   > contract address:    0x096c0636F39372Fa83EF498bCC5Bce86C8fd1Fb5
   > account:             0x196150D99a325f624F7c420Cf80ca6ab9a1BeDBA
   > balance:             0.978713032134329654
   > gas used:            402866
   > gas price:           20 gwei
   > value sent:          0 ETH
   > total cost:          0.00805732 ETH


   > Saving migration to chain.
   > Saving artifacts
   -------------------------------------
   > Total cost:          0.00805732 ETH


Summary
=======
> Total deployments:   2
> Final cost:          0.01375548 ETH

The terminal prints the addresses of the deployed contracts as well as the transaction hashes of the deployment transactions. This information can also be referenced in the contract artifacts, which are stored in proof-of-existence/build/contracts/. Deployment information is found at the bottom of each JSON file.

You can now interact with the deployed contract on the Rinkeby test network!