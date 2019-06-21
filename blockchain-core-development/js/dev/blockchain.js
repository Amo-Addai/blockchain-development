const sha256 = require('sha256'), uuid = require('uuid/v1');

export default class BlockChain {

    constructor() {
        this.chain = [];
        this.pendingTransactions = [];
        // CREATING THE GENESIS BLOCK BEFORE ANY OTHER ..
        // so this genesis block won't have a proper nonce, previousBlockHash, & hash
        this.genesisBlock = this.createNewBlock(100, '0', '0'); // SO YOU PASS THESE 'DUMMY' ARGUMENTS
        // BUT YOU CAN'T DO THIS WITH ALL OTHER BLOCKS COZ THEY'LL HAVE TO BE VALIDATED FOR PROOF OF WORK
    }

    constructor(address) {  // DUNNO IF YOU CAN HAVE DUPLICATE CONSTRUCTORES
        this.nodeAddress = address; // ADDRESS OF THIS PARTICULAR NODES
        this.nodes = []; // ARRAY OF OTHER NODES, WHICH WILL BE ADDED WITH .addNode()
        return this.constructor();
    }

    createNewBlock(nonce, previousBlockHash, hash) {
        const newBlock = {
            index: this.chain.length + 1,
            timestamp: Date.now(),
            transactions: this.pendingTransactions, // MINE THE NEW TRANSACTIONS UNTO THE NEW BLOCK
            nonce: nonce, hash: hash,
            previousBlockHash: previousBlockHash
        };
        this.pendingTransactions = [];
        this.chain.push(newBlock);
        return newBlock;
    }

    addBlockToBlockchain(block) { // A LOT OF VALIDATIONS SHOULD BE DONE ON block BEFORE ANYTHING THOUGH :(
        // VALIDATE THE PROOF-OF-WORK 1ST - CHECK IF THIS block's .previousHash == previous block's .hash ...
        let lastBlock = this.getLastBlock();
        if (block['previousBlockHash'] !== lastBlock['hash']) return false;
        // ALSO CHECK IF THIS NEW block HAS THE CORRECT INDEX (1 INDEX ABOVE LAST BLOCK'S)
        if ((block['index'] - lastBlock['index']) !== 1) return false;

        // THEN VALIDATE WHETHER THE PENDING TRANSACTIONS IN THIS NODE ARE ALREADY WITHIN THE BLOCK TOO
        bchain.pendingTransactions.forEach((transaction, index) => {
            if (block.transactions.includes(transaction)) {
                console.log("REMOVING PENDING TRANSACTION -> " + JSON.stringify(transaction))
                bchain.pendingTransactions.splice(index, 1);
            } // DON'T EMPTY ENTIRE .pendingTransactions ARRAY
            // RATHER REMOVE ITEMS BASED ON THOSE ALREADY WITHIN THE block.transactions ARRAY
        });
        this.chain.push(block);
        return true;
    }

    getLastBlock() {
        return this.chain[this.chain.length - 1];
    }

    // MAKES SURE THAT ANY NEW BLOCK TO BE ADDED TO THE CHAIN IS VALID
    // i.e. IT HAS CORRECT HASH, TRANSACTIONS, & OTHER DATA (SO NO FAKE DATA / HACKING CAN HAPPEN)
    proofOfWork(previousBlockHash, currentBlockData) {
        let nonce = 0;
        let hash = this.hashBlock(previousBlockHash, currentBlockData, nonce);
        while (hash.substring(0, 4) !== '0000') { // CHECK FOR THE 4 LEADING '0000's
            nonce++;
            hash = this.hashBlock(previousBlockHash, currentBlockData, nonce);
        } // RETURN ONLY THE nonce COZ THAT'S THE ONLY PROP OF THE BLOCK THAT'S BEING EDITED ..
        return nonce;
    }

    hashBlock(previousBlockHash, currentBlockData, nonce) {
        const dataAsString = previousBlockHash + nonce.toString() + JSON.stringify(currentBlockData);
        const hash = sha256(dataAsString);
        return hash;
    }

    createNewTransaction(amount, sender, recipient) {
        const newTransaction = {
            amount: amount, sender: sender, recipient: recipient,
            transactionId: uuid().split('-').join('')
            // JUST USE uuid().replace('-', '') // IF THIS METHOD EXISTS
        };
        return newTransaction;
    }

    addTransactionToPendingTransactions(transaction) {
        this.pendingTransactions.push(transaction);
        return this.getLastBlock()['index'] + 1;
        // return this.getLastBlock()['index'] + 1; // OR return THIS INSTEAD
        // RETURN INDEX OF THE NEXT BLOCK (AFTER THE LAST BLOCK) TO BE ADDED TO THE CHAIN
    }

    addNode(address) { // CHECK IF address OF THE NEW NODE IS NOT ALREADY PRESENT IN .nodes ARRAY
        // AND ALSO CHECK IF address OF THE NEW NODE IS NOT THAT OF THIS CURRENT NODE EITHER
        if ((!this.nodes.includes(address)) && (this.nodeAddress !== address))
            this.nodes.push(address);
        else console.log("NODE ALREADY EXISTS WITHIN THE NETWORK");
        return true;
    }

    chainIsValid(blockchain) { // USE THIS TO VALIDATE BLOCKCHAINS FROM OTHER NODES
        // WHEN COMPARING THEM WITH THIS NODE'S OWN BLOCKCHAIN
        let previousBlock = null, currentBlock = null, hash = null;
        // LOOP THROUGH ALL BLOCKS OF CHAIN, TO MAKE SURE IT'S VALID
        for(var i = 1; i < blockchain.length; i++){
            /* 2 CHECKS
             1. PREVIOUS HASH PROPERTY OF ANY BLOCK IS == TO HASH OF PREVIOUS BLOCK
             2. CHECK THAT THE PROOF OF WORK OF EACH BLOCK IS VALID
            */
            // CURRENT BLOCK INDEX = 1 & PREVIOUS BLOCK INDEX = 0
            currentBlock = blockchain[i];
            previousBlock = blockchain[i-1];
            // 1. PREVIOUS HASH IS == TO HASH OF PREVIOUS BLOCK
            if(currentBlock['previousBlockHash'] !== previousBlock['hash']) return false;
            // 2. CHECK THAT THE PROOF OF WORK OF EACH BLOCK IS VALID
            // USE currenBlock SO YOU WON'T TEST THE VERY 1ST previousBlock - GENESIS BLOCK
            hash = this.hashBlock(currentBlock['previousBlockHash'], {index: currentBlock['index'], transactions: currentBlock['transactions']}, previousBlock['nonce'])
            if(!hash.startsWith('0000')) return false;
        } // NOW, YOU CAN MANUALLY TEST THE GENESIS BLOCK, TO MAKE SURE THAT IT STILL HAS THE PROPERTIES THAT YOU INSTANTIATED IT WITH
        // NO NEED TO TEST HASH OF THE GENESIS BLOCK COZ IT'S A SPECIAL CASE, WHERE YOU ASSIGNED ITS DATA MANAUALLY
        let genesisBlock = blockchain[0]; // MAKE SURE THAT THESE VALUES ARE THE ONES YOU USED TO CREATE THE GENESIS BLOCK
        return ( (genesisBlock['nonce'] === 100) && (genesisBlock['previousBlockHash'] === 0) &&
            (genesisBlock['hash'] === 0) && (genesisBlock['transactions'].length === 0) )
        // THIS WILL ONLY return true IF THE GENESIS BLOCK IS VALID TOO ..
    }


    // NOW, THE PUBLIC METHODS TO BE ACCESSED BY PUBLIC INTERNET

    getBlock(blockHash) { // FIND BLOCK WITHIN THE BLOCKCHAIN WITH THIS blockHash
        this.chain.forEach(block => {
            if(block['hash'] === blockHash) return block;
        });
        return null;
    }

    getTransaction(transactionId) { // FIND THE TRANSACTION WITHIN EACH BLOCK IN THE BLOCKCHAIN WITH THIS transactionId
        this.chain.forEach(block => {
            block.transactions.forEach(transaction => {
                if(transaction['transactionId'] === transaction)
                    return {transaction: transaction, block: block};
            });
        });
        return null;
    }

    getAddressData(address) { // FIND ALL TRANSACTIONS ASSOC'D WITH THIS address & PUT 'EM IN AN ARRAY
        let data = [];
        this.chain.forEach(block => {
            block.transactions.forEach(transaction => {
                if((transaction['sender'] === address) || (transaction['recipent'] === address))
                    data.push(transaction)
            });
        });
        return data;
    }

    getWalletBalance(transactions){
        let balance = 0;
        for(let t of transactions){
            if(t.recipient === address) balance += t.amount;
            else if (t.sender === address) balance -= t.amount;
        }
        return balance;
    }

};

