pragma solidity ^0.4.18;

/*
Libraries and The Ethereum Package Manager

Solidity Development has some drawbacks
First of all, just by the nature of the Ethereum system, every node has to execute and verify every transaction. This can be expensive and users of the system pay for this with gas.

Also, there are few standard libraries for Solidity, managing and manipulating arrays and strings can be painful.

Blockchains are isolated environments

It is relatively difficult to get verified data into the blockchain, there are not APIs like we are used to in traditional web development. You have to use services called oracles to get external data into the blockchain.

Also, the immutability of deployed contracts makes upgrading contracts more difficult than upgrades in other systems. We can design systems in such a way to enable upgradability, we just have to pay extra attention to this.

How can we address some of these drawbacks? Libraries can help.

What are libraries?

Libraries are contracts that do not have storage, they cannot hold ether and they cannot inherit or be inherited by other contracts. Libraries can be seen as implicit base contracts of the contracts that use them.

They exist for the purpose of code reuse. Contracts can call library functions without having to implement or deploy the functions for itself - allowing the library functions to modify the state of the calling contract. This is made possible by the DELEGATECALL opcode of the EVM. This enables developers to use code that has already been audited and battle-tested in the wild.

To create a library contract we simply use the library keyword in place of the contract keyword. You will notice in this example that no storage variables are defined. Remember that libraries do not have a state, although it is possible for libraries to modify the calling contracts’ state. We will get to that in a moment.

Once you have defined a library, you can import it with an import statement at the top of the solidity file. Now you can call the functions defined in the library as methods on the library name. You can also use the 'using for' syntax shown, which allows you to call the library function as a method on the first parameter defined in the library’s function.

Libraries use the DELEGATECALL opcode of the EVM which preserves the context of the contract from which the library method is being called. This allows libraries to modify the state of calling contracts. The library can define the struct data type, but it will not be saved in storage until it is actually implemented in a contract. This implemented struct can be passed to the library and modified, and the modifications will persist in the contracts’ storage. This is a seldom-used feature of libraries in solidity, but it is good to be aware of.

Libraries offer some other benefits in terms of contract system design.

In the contract factory design pattern, a contract can have functionality to deploy additional contracts. If the contracts deployed from the factory contract are declaring the same functions, moving the functions to a library can reduce the size of the contract created by the factory. Reducing the size of the factory output contracts can save a lot of gas in deployment costs over the lifetime of the contract.

A caveat - calling a library function from a contract is a bit more expensive than calling internal functions, so there is a trade-off to consider. If the contract functions calling the library are frequently called, it may be better to pay the higher deployment cost to get cheaper function calls. You will have to run tests to determine which is best for your use case.

Connecting to a Library

To connect to a library, you need the library contract as well as the address of the deployed instance.

Oftentimes you will deploy the library yourself, so the address management will be handled by truffle automatically.

Otherwise, the address of the deployed library has to be added to the bytecode by a linker. You can do this manually in your truffle project by adding the library contract to your contracts directory and compiling to get the artifact. You can modify the truffle artifact to specify the correct network and address where the library is deployed. See the Truffle docs on linking to libraries.

EthPM and Truffle

Library and contract package management can be simplified by using EthPM. EthPM is essentially npm for Ethereum contracts. Truffle has support for EthPM so you can install a package with truffle install and the package name.

$ truffle install <package name>
You can go to ethpm.com to browse the available packages. You should add an ethpm.json file to your project to track which packages and versions you are using.

Importing an ethpm package into a solidity file simply requires the file path reference at the top of your solidity file.

Truffle comes with an option for migrating contracts that enables you to only deploy contracts if there isn’t already a deployed instance. For example, MyContract requires an instance of the Ethereum Name Service contract. The following deployment script will only deploy an instance of the ENS (Ethereum Name Service) contract if there is not one on the detected network.

var ENS = artifacts.require("ens/ENS");
var MyContract = artifacts.require("MyContract");

module.exports = function(deployer) {
  // Only deploy ENS if there's not already an address already.
  // i.e., don't deploy if we're using the canonical ENS address,
  // but do deploy it if we're on a test network and ENS doesn't exist.
  deployer.deploy(ENS, {overwrite: false}).then(function() {
    return deployer.deploy(MyContract, ENS.address);
  });
};

Like NPM, configuration options for EthPM go in a separate JSON file called ethpm.json. This file sits alongside your Truffle configuration and gives Truffle all the information it needs to publish your package.
*/



library LibraryContract {
    // THIS TYPE OF SMART CONTRACT HAS NO STATE OR STORAGE, JUST CODE TO BE REUSED BY OTHER CONTRACTS ..
    // SO YOU CAN JUST IMPORT THIS LIBRARY IN ANOTHER .sol FILE USING import "./path/to/this/library/file";
}




