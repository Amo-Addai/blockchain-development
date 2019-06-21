const Blockchain = require('./blockchain');
const bchain = new Blockchain();

let nonce = 12564, previousBlockHash = '', hash = '';
bchain.createNewBlock(nonce, previousBlockHash, hash);
let amount = '', sender = '', recipient = '';
bchain.createNewTransaction(amount, sender, recipient);
// THIS NEW TRANSACTION CREATED IS STILL PENDING ..
// SO ADD A NEW BLOCK TO INSERT ALL PENDING TRANSACTIONS IN THE CHAIN
nonce = 12564; previousBlockHash = ''; hash = '';
bchain.createNewBlock(nonce, previousBlockHash, hash);
// NOW, TESTING THE hashBlock METHOD
previousBlockHash = ''; nonce = 56556;
let currentBlockData = [ // LET THIS BE JUST AN ARRAY OF TRANSACTIONS FOR NOW ..
    { amount: 200, sender: 'address', recipient: 'address' },
    { amount: 200, sender: 'address', recipient: 'address' }
];
let hash = bchain.hashBlock(previousBlockHash, currentBlockData, nonce);
// NOW, TESTING THE PROOF OF WORK FUNCTION
let nonce = bchain.proofOfWork(previousBlockHash, currentBlockData);
console.log("PROOF OF WORK NONCE - " + nonce);
// NOW, YOU CAN EVEN USE nonce IN bchainObj.hashBlock(previousBlockHash, currentBlockData, nonce)
// YOU ONLY NEED THESE 3 (previousBlockHash, currentBlockData, nonce) TO MINE A BLOCK BY GEN'ING ITS HASH
// PERFECT nonce IS DIFFICULT TO GET COZ hash GEN'D MUST HAVE 4 LEADING '0000's (can take 27470 tries)
// BUT ONCE YOU'VE THE CORRECT nonce VALUE, IT'S VERY EASY TO VERIFY THAT THE BLOCK TO BE MINED IS VALID
// JUST VERIFY BY CHECKING IF THERE ARE 4 LEADING '0000's IN THE hash GEN'D FROM .hashBlock()

//
console.log(bchain);
