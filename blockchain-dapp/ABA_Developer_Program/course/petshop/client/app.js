/* ADD ..
 <script src="web3.js"></script>
 */

// INITIATE WEB3.JS WITHIN APP, USING THE URL FOR THE ETHEREUM WALLET / PLATFORM
// IN CASE META-MASK ALREADY SET IT UP WITHIN BROWSER
var web3 = require('web3'), web3Provider = undefined;
// OR YOU CAN CREATE web3 VARIABLE MANUALLY, THIS WAY ..
if (typeof web3Provider != 'undefined') web3Provider = web3.currentProvider;
else web3Provider = new Web3.providers.HttpProvider("http://localhost:8545");
web3 = new Web3(web3Provider);
// 
console.log("using web3 version: " + web3.version);

// PLACE THE CONTRACT'S ADDRESS HERE, OR EVEN GET ITS ABI .json DATA
var contractAddress = "PUT SMART CONTRACT'S ADDRESS RIGHT HERE ...";
var contractABI = require("/path/to/SmartContractABI");
// NOW CREATE AN INSTANCE OF THE SMART CONTRACT
var contract = new web3.eth.Contract(contractABI, contractAddress);
console.log("CONTRACT -> " + JSON.stringify(contract));

// 
// WORKING WITH AFRICA BLOCKCHAIN (ALLIANCE) DEVELOPMENT PROGRAM'S ADOPTION D-APP
// 
var adoptionContractABI = require( "../build/contracts/Adoption.json");
var adoptionContract = TruffleContract(adoptionContractABI); 
adoptionContract.setProvider(web3Provider);
// FIRST, YOU CAN CALL A CONTRACT METHOD THAT DOESN'T REQUIRE AN EXPLICIT ADDRESS WITHIN ITS FUNCTIONALITY
adoptionContract.deployed().then((instance) => { // 1ST, GET THE DEPLOYED INSTANCE OF THE CONTRACT ..
    return instance.getAdopters.call() // A METHOD WITHIN Adoption CONTRACT ..
}).then((adopters) => { // GET THE THE RETURNED VALUE OF THE getAdopters() CONTRACT METHOD ..
    for(var adopter of adopters){ // THEN WORK WITH THE RETURNED DATA HOWEVER REQUIRED ..
        if(adopter !== '0x00000000000...'){ // YOU CAN UPDATE THE UI OR STH ..
            // DO STH HERE ..
        }
    }
}).catch((err) => {
    console.log("ERROR OCCURED -> "  + JSON.stringify(err));
})

// NOW, YOU CAN CALL A METHOD THAT REQUIRES A SENDER ACCOUNT IN ITS IMPLEMENTATION
// THEREFORE, YOU CAN SPECIFY WHICH ACCOUNT THAT'S CALLING THE METHOD (& NOT JUST THE DEFAULT ACCOUNT LIKE BEFORE)
web3.eth.getAccounts((err, accounts) => {
    if(err) console.log(err);
    if(accounts){
        var account = accounts[0];
        adoptionContract.deployed().then((instance) => {
            return instance.adopt(SOME_ID, {from: account});
        }).then((data) => {
            // WORK WITH data HOWEVER YOU SEE FIT (MAYBE YOU CAN UPDATE THE UI :)..
        }).catch(err => {
            console.log("ERROR -> " + JSON.stringify(err));
        })
    }
})

// 
// NOW, SOME EXTRA STUFF
// 
$('some-form').submit(() => {
    event.preventDefault();
    var fromAddress = $('from').val(),
        toAddress = $('to').val(),
        amount = $('amount').val();

    for (var addr of [fromAddress, toAddress]) {
        if (!web3.utils.isAddress(addr)) {
            alert("Address (" + addr + ") isn't valid!!");
            return;
        }
    }
    if (amount > 0) {
        web3.getBalance(contractAddress, function (error, result) {
            if (error) console.log("ERROR -> " + error);
            else {
                console.log("RESULT -> " + result);
                // result BALANCE COMES IN SMALLEST POSSIBLE VALUE (18 decimal points) OF ETHER
                var balance = web3.utils.fromWei(result);  // CONVERTS Wei (SMALLEST VERSION OF ETHER) TO Ether
                console.log("BALANCE -> " + balance);

                contract.methods.someMethod(/*PARAMS*/)
                // AN eg. WITH ApprovalContract.sol
                var ApprovalContract = new web3.eth.Contract(contractABI, contractAddress);

                // CALL ANY METHOD WITHIN THE CONTRACT & .send() TO SEND ETHER FOR IT TO OPERATE
                ApprovalContract.methods.deposit(toAddress).send({
                        from: fromAddress,
                        gas: 100000,
                        value: web3.util.toWei(amount, 'ether')
                    },
                    function (error, result) {
                        if (error) console.log("ERROR -> " + error);
                        else {
                            var bal = web3.utils.fromWei(result);
                            console.log("RESULT -> " + bal);
                        }
                    });
            }
        })
    } else {
        alert("No amount specified");
        return;
    }

})

function usingWeb3JS() {
    // web3 PROPS: api, ethereum, network, node, whisper, getEthereum, getNetwork, getNode, getWhisper
    // isSynching() / getSynching(), mining() / getMining(),

    web3.version.getNode((err, res) => {
        if (!err && res) {
            var versionNode = res.toLowerCase();
            if (versionNode.includes('metamask')) nodeType = 'metamask';
            else if (versionNode.includes('testrpc')) nodeType = 'testrpc';
            else nodeType = 'geth';
        }
    });

    // web3.net to check if node is listening for peer connection or not
    web3.net.getListening((err, res) => {
        if (!err && res) {
            web3.net.getPeerCount((err, res) => {
                if (!err) console.log("PEER COUNT -> " + res);
            });
        }
    });

    web3.eth.getAccounts((err, res) => {
        if (!err) {
            var accounts = res;
            if (accounts) {
                for (var acc of accounts) print("ACCOUNT -> " + acc);
                var coinbase = web3.eth.coinbase;
                // TRIM IT SO AS TO FIT IT WITHIN THE WINDOW / UI
                if (coinbase) coinbase = coinbase.substr(0, 25) + "...";
                var defaultAccount = web3.eth.defaultAccount;
                if (!defaultAccount) { // IF NO DEFAULT A/C, THEN SET NEW DEFAULT A/C
                    web3.eth.defaultAccount = accounts[0];
                    defaultAccount = '[Undef]' + accounts[0];
                } // TRIM defaultAccount TOO & WORK WITH IT HOWEVER YOU WANT ..
                defaultAccount = defaultAccount.substr(0, 25) + "...";
            }
        }
    });

    // GET ETHEREUM BALANCE (IN Wei)
    var balance = web3.eth.getBalance(/*SOME ACCOUNT'S ADDRESS*/ accounts[0]);
    balance = web3.fromWei(balance, 'ether').toFixed(2); // NOW, WORK WITH balance

    // LOCKING & UNLOCKING ACCOUNTS - web3.account.unlockAccount(account, password, cb)
    // doUnlockAccount(), lockAccount(), doLockAccount()
    web3.personal.unlockAccount(accounts[0], "password", (err, res) => {
        if (!err && res) console.log("RESULT -> " + res);
    })

    // SEND TRASACTIONS FROM AN A/C TO ANOTHER A/C - web3.eth.sendTransaction(transObj, cb), doSendTransaction()
    // INVOLVES SENDING ETHER / INVOKING SMARTCONTRACT FUNCTIONS
    var data = {/*SOME DATA*/}, nonce = 100, valueEther = 1000; // ANY VALUE IN ETHER
    var valueWei = web3.toWei(valueEther, 'ether'),  gas = 100, gasPrice = 100;
    var transObject = {
        from: "address", to: "address", value: valueWei, gas: gas, gasPrice: gasPrice,
        data: web3.toHex(data), nonce: nonce // nonce IS OPITONAL THOUGH :)
    };

    web3.eth.sendTransaction(transObject, (err, res) => {
        if (!err && res) console.log("RESULT -> " + res);
    });

    // COMPILE SOLIDITY CODE OR STH ..
    web3.eth.compile.solidity("source_string", (err, res) => {});

    // DEPLOYING CONTRACTS - MAKE SURE YOU PROVIDE ENOUGH GAS TO DEPLOY THE CONTRACT
    var gas = 100, data = {}, params = {from: web3.eth.coinbase, data: data, gas: gas};
    var contract = web3.eth.contract("abi definition");
    contract.new(params, (err, res) => {
        if(!err && res){
            console.log("RESULT -> " + res);
            if(res.address) console.log("ADDRESS ->", res.address);
            if(res.transactionHash) console.log("TRANSACTION HASH ->", res.transactionHash);
        }
    });


    // DEPLOYING CONTRACT INSTANCES USING web3.eth.sendTransactions()
    contract.new.getData({data: data}, (err, res) => {})


    // INVOKING A CONTRACT FUNCTION
    var contractInstance = contract.at("address"); // RETRIEVE AN INSTANCE OF THE CONTRACT

    // EXEC'D LOCALLY; Value=funct's return value; 
    // No state changes in contract; 
    var returnValue = contractInstance.someMethod.call(/*PARAMS*/);
    // WORK WITH returnValue HOWEVER CONVENIENT

    // EXEC'D ON MINER NODES (Coz transaction sent gets mined); Value=Transaction hash; 
    // State changes in contracts;  
    contractInstance.someMethod.sendTransaction(/*PARAMS*/params, (err, res) => {
        if (!err && res) console.log("RESULT -> " + res);
    });

    // DON'T FORGET THE ACTUAL web3.eth.call() & .sendTransaction()
    var conData = contractInstance.someMethod.getData(/*PARAMS*/);
    var result = web3.eth.call(transObject, cb);
    result = web3.eth.sendTransaction(transObject, cb);


    // MONITORING EVENTS (& LOGS OF NODES WITHIN THE NETWORK) FROM CONTRACT INSTANCE
    // MONITOR SampleContract.sol 's 'NumberSetEvent' EVENT
    // 1. Receive data for transaction 2. Asynchronous trigger 3. Cheap data storage
    returnValue = contractInstance.setNum.call(50); // CALL THIS SO THE CONTRACT RAISES THE EVENT

    // DATA STORAGE IS NOT FREE, BUT IS CHEAPER IN THE LOGS THAN IT IS IN THE CONTRACT ITSELF
    // LOGS STORAGE - 8Gas/byte & CONTRACT STORAGE - 20,000Gas/32-byte
    // LOGS ARE NOT ACCESSIBLE FROM CONTRACTS (Contract STATE DATA must be stored WITHIN THE CONTRACT ITSELF, to be accessible)
    // THEREFORE, STORE "CLIENT STUFF" THAT AREN'T REQUIRED BY THE CONTRACT WITHIN THE LOGS IF YOU WANT (MUCH CHEAPER)

    // filter API: watch(cb) (LISTEN FOR EVENTS - returns event data) & get(cb) (GET LOG DATA - returns array of events)
    /*CRITERIA FOR EVENT SELECTION -  string / object*/
    var options = {
        fromBlock: "569000", toBlock: "latest",
        address: ["address"], topics: ["address"]
    };
    var filter = web3.eth.filter(options);
    filter.get((err, res) => {
        if(!err && res) console.log("LOGS -> " + JSON.stringify(res));
    });
    //
    filter.watch((err, res) => {
        if(!err && res) console.log("LOGS -> " + JSON.stringify(res));
    })
    if(filter) filter.stopWatching();

    var contractEvents = contractInstance.allEvents(options),
    // OR YOU CAN RETRIEVE A PARTICULAR EVENT FROM WITHIN THE MAIN SampleContract.sol
    contractEvent = contractInstance.NumberSetEvent({caller: "", oldNum: "", newNum: ""}, options);
    // contractEvent = contractInstance.NameOfTheEvent({/*PARAMS*/}, options);

    // EVENT OBJECTS ALSO HAVE .get(), .watch(), & .stopWatching() METHODS TOO (LIKE filter OBJECT)
    // EVENT OBJECTS' get/watch MONITOR EVENTS SPECIFIC TO A SPECIFIC contractInstance; for DApp only; indexed/topic data is a JSON obj
    // FILTER OBJECTS' get/watch MONITOR EVENTS FROM ANY SOURCE; can be used for other tools (Not just DApps); indexed data in options / topics array
    
}
