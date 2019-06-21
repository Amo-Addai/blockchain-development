const express = require('express');
const bodyParser = require('body-parser');
const request = require('request');
const requestPromise = require('request-promise');
const uuid = require('uuid/v1');
//
const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
//
const nodeAddress = uuid().split('-').join(''),
    nodeUrl = "";
const port = 3000; // PORT FOR THIS PARTICULAR NODE-SERVER
// SO YOU CAN HAVE MULTIPLE NODES WITH DIFFERENT PORTS (BUT SAME IPADDRESS MAYBE)
const Blockchain = require('./blockchain');
const bchain = new Blockchain();


// FETCH THE ENTIRE BLOCKCHAIN
app.get('/blockchain', (req, res) => {
    res.send(bchain);
});


// CREATE TRANSACTION & BROADCAST IT THROUGHOUT THE BLOCKCHAIN NETWORK
app.post('/transaction-broadcast', (req, res) => {
    // Create a new transaction & broadcast it to all other nodes within the network
    let transactionObj = req.body;
    let transaction = bchain.createNewTransaction(transactionObj.amount, transactionObj.sender, transactionObj.recipient);
    if (transaction) {
        let registerNodesPromises = [],
            blockIndex = bchain.addTransactionToPendingTransactions(transaction);
        bchain.nodes.forEach(nodeAddress => {
            const requestOptions = {
                uri: nodeAddress + '/transaction',
                method: 'POST',
                body: transaction,
                json: true
            }; // NOW MAKE ALL THESE ASYNC REQUESTS AS PROMISES
            // & PUT ALL THE PROMISES  IN AN ARRAY
            registerNodesPromises.push(requestPromise(requestOptions));
        });
        Promise.all(registerNodesPromises).then(data => {
            // NOW EXEC ALL THE PROMISES (i.e. MAKING THE ASYNC REQUESTS
            // AND HANDLE ALL THEIR RESPONSES AS 1 RESPONSE data
            // THEREFORE THIS IS EXEC'D WHEN ALL THE ASYNC REQUESTS HAVE RETURNED RESPONSES
            //
            // NB: FIND A WAY TO DETECT & HANDLE ANY ERRORS WITH data THOUGH
            //
            // THIS NODE HAS ALREADY ADDED THE TRANSACTION TO ITS OWN pendingTransactions
            // THEREFORE YOU CAN JUST SEND A SUCCESS RESPONSE NOW ..
            res.json({
                "message": "Transaction created & broadcasted successfully",
                "transaction": transaction,
                "block": blockIndex
            });
        });
    } else res.json({"message": "Transaction could not be created successfully"});
});


// CREATE A NEW TRANSACTION
app.post('/transaction', (req, res) => {
    let transaction = req.body;
    // YOU CAN EITHER LET THE addTransactionToPendingTransactions() METHOD  ..
    // RETURN THE INDEX OF THE BLOCK INTO WHICH THIS TRANSACTION WILL BE INSERTED
    // COZ THIS TRANSACTION WILL BE PUT INTO THE pendingTransactions ARRAY ..
    // WAITING TO BE INSERTED INTO THE NEXT BLOCK TO BE CREATED & MINED
    //
    // OR YOU CAN JUST ALSO RETURN THE transaction OBJECT TOO
    if (transaction) {
        let blockIndex = bchain.addTransactionToPendingTransactions(transaction)
        res.json({
            "message": "Transaction created successfully",
            "block": blockIndex
        });
    } else res.json({"message": "Transaction could not be created successfully"});
});


// MINE A NEW BLOCK
app.get('/mine', (req, res) => {
    let lastBlock = bchain.getLastBlock();
    // NOW, GET THE HASH VALUE OF THIS lastBlock
    let previousBlockHash = lastBlock['hash'];
    // NOW, GET THE nonce USING THE .proofOfWork() METHOD
    let currentBlockData = { // ONLY FILL IN THESE PROPS OF THE NEW BLOCK
        transactions: bchain.pendingTransactions,
        index: lastBlock['index'] + 1
    }; // THIS IS THE ONLY DATA REQUIRED TO CALC nonce WITH .proofOfWork()
    let nonce = bchain.proofOfWork(previousBlockHash, currentBlockData);
    // NOW, GET THE hash OF THIS NEW BLOCK
    let hash = bchain.hashBlock(previousBlockHash, currentBlockData, nonce);

    // IF THIS IS SUCCESSFUL UNTIL THIS POINT, THEN YOU CAN CREATE A MINING REWARD TRANSACTION
    // TO BE SENT TO THE MINER, JUST BEFORE ACTUALLY CREATING THIS NEW BLOCK
    // SO IT ALSO PICKS THE MINING REWARD TRANSACTION FROM THE PENDING TRANSACTIONS

    // FINALLYYYYYY, YOU CAN CREATE THE NEW BLOCK WITH THESE ARGUMENTS ..
    let newBlock = bchain.createNewBlock(nonce, previousBlockHash, hash);

    // FIRST, BROADCAST THIS NEW BLOCK TO ALL OTHER NODES, BEFORE RETURNING SUCCESS
    let registerNodesPromises = [];
    bchain.nodes.forEach(nodeAddress => {
        let requestOptions = {
            url: nodeAddress + "/receive-new-block",
            method: 'POST',
            data: newBlock,
            json: true
        }; // NOW MAKE ALL THESE ASYNC REQUESTS AS PROMISES
        // & PUT ALL THE PROMISES  IN AN ARRAY
        registerNodesPromises.push(requestPromise(requestOptions));
    });
    Promise.all(registerNodesPromises).then(data => {
        // NOW EXEC ALL THE PROMISES (i.e. MAKING THE ASYNC REQUESTS
        // AND HANDLE ALL THEIR RESPONSES AS 1 RESPONSE data
        // THEREFORE THIS IS EXEC'D WHEN ALL THE ASYNC REQUESTS HAVE RETURNED RESPONSES
        //
        // NB: FIND A WAY TO DETECT & HANDLE ANY ERRORS WITH data THOUGH
        //
        // THIS NODE HAS ALREADY ADDED THE BLOCK TO ITS OWN chain ARRAY
        // THEREFORE YOU CAN JUST SEND A SUCCESS RESPONSE NOW ..
        //
        // HOWEVER YOU CAN ALSO CREATE THE MINING REWARD TRANSACTION HERE FOR THE MINER
        // THEN BROADCAST THAT TRANSACTION TO ALL OTHER NODES TOO, BEFORE RETURNING SUCCESS RESPONSE ..
        //
        // BEST TO JUST CALL '/transaction-broadcast' ON ANOTHER FOR THE MINING REWARD TRANSACTION
        // ALSO BEST & GLOBAL STANDARD TO CREATE MINING REWARD TRANSACTION AFTER THE BLOCK HAS ALREADY BEEN MINED SUCCESSFULLY
        // THEREFORE, THE MINING REWARD TRANSACTION WILL BE PUT INSIDE THE PENDING TRANSACTIONS ARRAY
        const requestOptions = {
            uri: bchain.nodeAddress + '/transaction/broadcast',
            method: 'POST', body: {
                amount: 12.5, sender: "00", recipient: nodeAddress
            }, json: true
        };
        return requestPromise(requestOptions);
        //
    }).then(data => { // NOWWWW, YOU CAN FINALLY RETURN A SUCCESS RESPONSE
        res.json({message: "New block mined successfully", block: newBlock});
    });

    /*
     // IT'S BEST TO DO THIS JUST BEFORE THE bchain.createNewBlock() CALL SO IT'S ALSO MINED WITHIN THAT BLOCK
     // OR YOU CAN ALSO LEAVE IT HERE, SO THE REWARD TRANSACTION WILL BE LEFT IN pendingTransactions ARRAY TO BE MINED LATER
     /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
     // NOW, WHENEVER SOMEONE SUCCESSFULLY MINES A NEW BLOCK, THEY MUST BE REWARDED
     // SO REWARD THE MINER WITH SOME AMOUNT OF THE CRYPTO, USING A TRANSACTION
     let amount = 12.5, sender = "00";
     // 12.5 BTC IS REWARD AMOUNT FOR BITCOIN, & ADDRESS '00' IS MAINLY USED TO SEND MINING REWARDS
     let recipient = "ADDRESS OF MINER, WHICH SHOULD BE THIS CURRENT NETWORK NODE'S ADDRESS ON THE BLOCKCHAIN";
     // OR YOU CAN SEND THE REWARD TO THE PARTICULAR NODE THAT SENT THIS '/mine' ADDRESS (WHEN YOU CREATE MULTIPLE NODES
     // SO NOW, FINDING THE ADDRESS OF THIS CURRENT NETWORK NODE USING uuid LIBRARY
     // uuid IS USED TO CREATE A RANDOM UNIQUE STRING, WHICH WILL BE THE ID FOR THIS NETWORK NODE'S ADDRESS
     recipient = nodeAddress;
     let transaction = bchain.createNewTransaction(amount, sender, recipient);
     // DO WHATEVER YOU WANT WITH transaction

     // YOU MUST ALSO BROADCAST THIS MINING REWARD TRANSACTION TO ALL OTHER NODES TOO
     */

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
});


// RECEIVE ANY NEW BLOCK MINED BY ANOTHER NODE AND BROADCASTED TO THIS NODE
app.post('/receive-new-block', (req, res) => {
    let newBlock = req.body; // VALIDATE THIS req.body DATA FIRST
    if (bchain.addBlockToBlockchain(newBlock)) res.json({message: "success", block: newBlock});
    else res.json({message: "failure", block: newBlock});
});


// REGISTER A NODE & BROADCAST IT THROUGHOUT THE NETWORK
app.post('/register-and-broadcast-node', (req, res) => {
    const newNode = req.body; // VALIDATE THIS HOWEVER YOU WANT
    let newNodeUrl = newNode.url;
    if (bchain.addNode(newNodeUrl)) {
        const registerNodesPromises = [];
        bchain.nodes.forEach(nodeUrl => { // CALL '/register-node' ENDPOINT
            const requestOptions = {
                url: nodeUrl + '/register-node',
                method: 'POST',
                body: {url: newNodeUrl},
                json: true
            }; // NOW MAKE ALL THESE ASYNC REQUESTS AS PROMISES
            // & PUT ALL THE PROMISES  IN AN ARRAY
            registerNodesPromises.push(requestPromise(requestOptions));
        });
        Promise.all(registerNodesPromises).then(data => {
            // NOW EXEC ALL THE PROMISES (i.e. MAKING THE ASYNC REQUESTS
            // AND HANDLE ALL THEIR RESPONSES AS 1 RESPONSE data
            // THEREFORE THIS IS EXEC'D WHEN ALL THE ASYNC REQUESTS HAVE RETURNED RESPONSES
            //
            // NB: FIND A WAY TO DETECT & HANDLE ANY ERRORS WITH data THOUGH
            //
            // THE WAY U HANDLE THIS RESPONSE IS TO REGISTER ALL THE OTHER NETWORK NODES
            // PLUS THE URL OF THIS PARTICULAR "INTRODUCER" NODE
            // AND REGISTER THEM IN BULK WITHIN THE NEW NODE TO BE ADDED WITH ROUTE '/register-nodes-bulk'
            const bulkRegisterOptions = {
                url: newNodeUrl + '/register-nodes-bulk',
                method: 'POST',
                body: {urls: [...bchain.nodes, bchain.nodeAddress]},
                json: true
            };
            return requestPromise(bulkRegisterOptions);
        }).then(data => { // NOW RUN THIS WHEN EVERYTHING IS OFFICIALLY DONE ..
            // FIND A WAY TO CHECK FOR ANY KIND OF ERRORS WITH data
            res.json({message: "NEW NODE REGISTERED, BROADCASTED & INITIATED SUCCESSFULLY!!!", data: data})
        });
    } else res.send("NODE COULD NOT BE REGISTERED SORRY :(")
});

// REGISTER A NODE WITH THE NETWORK ONLY
app.post('/register-node', (req, res) => {
    /* When a node has been broadcasted, this route is hit so all the nodes
     that receive this request just register the new node without broadcasting
     NB: SO THERE'S NO INFINITE LOOP OF BROADCASTING OF THIS NEW NODE THROUGHOUT THE NETWORK
     */
    const newNode = req.body; // VALIDATE THIS HOWEVER YOU WANT
    let newNodeUrl = newNode.url;
    if (bchain.addNode(newNodeUrl)) res.json({message: "NEW NODE REGISTERED SUCCESSFULLY"})
    else res.json({message: "NEW NODE COULD NOT REGISTERED SUCCESSFULLY"})
});

// REGISTER MULTIPLE NODES AT ONCE
app.post('/register-nodes-bulk', (req, res) => {
    /* The 1st node that broadcasted '/register-node' to all other nodes,
     then calls this route to THAT new node to add all the other nodes in the network
     */
    // THE NEW NODE SHOULD'VE ALREADY REGISTERED THE ORIGINAL NODE THAT INTRO'ED IT TO THE NETWORK SEF
    const networkNodes = req.body; // VALIDATE THIS HOWEVER YOU WANT
    nodeUrls = networkNodes.urls;
    for (let url of nodeUrls) if (!bchain.addNode(url)) console.log("COULDN'T ADD NODE URL -> " + url);
    res.json({message: "ADDED ALL NODE URLS IN BULK SUCCESSFULLY"})
});


// GET THE LONGEST BLOCKCHAIN USING THE CONSENSUS "LONGEST CHAIN WINS" ALGORITHM
app.get('/consensus', (req, res) => {
    // MAKE REQUESTS TO ALL OTHER NODES TO GET THEIR COPIES OF THE BLOCKCHAIN
    // & COMPARE THEM ALL TO THIS NODE'S BLOCKCHAIN AND REPLACE IT WITH THE LONGES CHAIN
    let registerNodesPromises = [];
    bchain.nodes.forEach(nodeAddress => {
        const requestOptions = {
            uri: nodeAddress + '/blockchain',
            method: 'GET',
            json: true
        }; // NOW MAKE ALL THESE ASYNC REQUESTS AS PROMISES
        // & PUT ALL THE PROMISES  IN AN ARRAY
        registerNodesPromises.push(requestPromise(requestOptions));
    });
    Promise.all(registerNodesPromises).then(data => {
        // NOW EXEC ALL THE PROMISES (i.e. MAKING THE ASYNC REQUESTS
        // AND HANDLE ALL THEIR RESPONSES AS 1 RESPONSE data
        // THEREFORE THIS IS EXEC'D WHEN ALL THE ASYNC REQUESTS HAVE RETURNED RESPONSES
        //
        // NB: FIND A WAY TO DETECT & HANDLE ANY ERRORS WITH data THOUGH
        // NOW, CHECK ALL THE CHAINS (WITH THIS NODE'S OWN TOO) FOR THE LONGEST CHAIN
        let blockchains = data; // PICKS UP ALL THE BLOCKCHAINS OF ALL THE OTHER NODES
        // NOT TOO SURE HOW ALL THE request-promise ASYNC HTTP REQUEST MAGIC HAPPENS THOUGH
        let newLongestChain = bchain.chain, newPendingTransactions = null;
        for (var blockchain of blockchains) {
            if ((bchain.chainIsValid(blockchain.chain)) && (blockchain.chain.length > newLongestChain.length)) {
                newLongestChain = blockchain.chain;
                newPendingTransactions = blockchain.pendingTransactions;
            }
        }
        if (newLongestChain && newPendingTransactions) {
            bchain.chain = newLongestChain;
            bchain.pendingTransactions = newPendingTransactions;
            console.log("LONGEST CHAIN (" + bchain.chain.length + ") BLOCKS -> " + JSON.stringify(bchain.chain));
            // NOW, YOU CAN SEND SOME RESPONSE
            res.json({message: "Consensus Algorithm retrieved the longest blockchain", blockchain: bchain.chain})
        } else res.json({message: "Consensus Algorithm cannot find a longer blockchain", blockchain: bchain.chain})

    });

});


/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
/////                           BLOCK EXPLORER ENDPOINTS
// eg. QUERYING FOR ADDRESSES, BLOCKHASHES, TRANSACTION IDs, etc

app.get('/block/:blockHash', (req, res) => {
    let hash = req.params.blockHash;
    let block = bchain.getBlock(hash);
    if (block) res.json({"message": "Block found!", "block": block});
    else res.json({"message": "Block not found."});
});


app.get('/transaction/:transactionId', (req, res) => {
    let tid = req.params.transactionId;
    let data = bchain.getTransaction(tid);
    if (data.transaction && data.block)
        res.json({"message": "Transaction found!",
            "transaction": data.transaction, "block": data.block});
    else res.json({"message": "Transaction not found."});
});


app.get('/address/:address', (req, res) => {
    // RETURN ALL TRANSACTIONS INVOLVED WITH THIS ADDRESS ..
    // & DETERMINE THE CURRENT BALANCE OF THIS ADDRESS (USING ITS UTXOs)
    let address = req.params.address;
    let addressData = bchain.getAddressData(address);
    if (addressData) {
        let balance = bchain.getWalletBalance(addressData);
        res.json({"message": "Address Data found!", "balance": balance, "data": addressData});
    } else res.json({"message": "Address Data not found."});
});


app.get('/block-explorer', (req, res) => {
    res.sendFile('/path/to/block-explorer/html/file', {root: __dirname});
});


/*  MAIN TIPS
1.  DO A LOT MORE OF ERROR HANDLING WITHIN THIS BLOCKCHAIN'S CODE
2.  DO MORE VERIFICATION OF ADDRESSES WHEN MAKING TRANSACTIONS OF CRYPTO
3.  STORE MORE DATA (& TYPES) AND NOT JUST TRANSACTIONS DATA (LIKE ETHEREUM)
 */

app.listen(port, () => { // YOU CAN TEST ALL API ENDPOINTS USING POSTMAN TOOL
    console.log("Server listening on port " + port + "...");
}); // RESTARTING THE SERVER ALWAYS RESETS THE BLOCKCHAIN DATA STRUCTURE TO BE EMPTY!!
