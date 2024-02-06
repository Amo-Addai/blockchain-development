import datetime, hashlib, json, requests
from uuid import uuid4
from urllib.parse import urlparse
from flask import Flask, jsonify, request

""" datetime, hashlib libraries for blocks' timestamps & hashing """


# PART 1 - BUILD THE BLOCKCHAIN

class Blockchain:
    def __init__(self):
        self.chain = []  # 0 PREVIOUS HASH - GENESIS BLOCK
        self.pendingTransactions = []  # MUST BE BEFORE THE CREATION OF THE GENESIS BLOCK
        self.nodes = set()  # THEY DON'T HAVE TO BE ORDERED IN A LIST (SO MAYBE JUST A set() OR STH :)
        self.genesis_block = self.create_block(proof=1, previous_hash='0')

    def __init__(self, address):  # DUNNO IF DUPLICATE CONSTRUCTOR FUNCTIONS ARE ALLOWED THOUGH :(
        self.node_address = address
        return self.__init__()

    def create_block(self, proof, previous_hash):
        block = {
            'index': len(self.chain) + 1, 'timestamp': str(datetime.datetime.now()),
            'proof': proof, 'previous_hash': previous_hash, 'data': {"""YOU CAN PUT ANYTHING HERE :)"""},
            'transactions': self.pendingTransactions
        }
        self.pendingTransactions = []
        self.chain.append(block)
        return block

    def get_previous_block(self):
        return self.chain[-1]  # RETURNS THE LAST BLOCK IN THE CHAIN

    def proof_of_work(self, previous_proof):  # MINERS WILL NEED THIS (NUMBER/NONCE/sth) TO SOLVE THE CRYPTO-PUZZLES
        # POW MUST BE VERY DIFFICULT TO FIND SO MINERS CANNOT FIND IT SO EASILY :/
        # BUT, IT MUST BE VERY EASY TO VERIFY SO OTHERS MINERS CAN EASILY VALIDATE THAT THE 1ST MINER TRULY SOLVED THE PROBLEM
        new_proof = 1  # TO BE USED AS AN ITERATOR, UNTIL THE RIGHT new_proof IS DETERMINED
        check_proof = False
        while not check_proof:
            # LET'S FIND A SAMPLE 64-BIT SHA256 HASH (WITH 4 LEADING ZEROES FOR NOW :)
            hash_operation = hashlib.sha256(str((new_proof ** 2) - (previous_proof ** 2)).encode()).hexdigest()
            # SIMPLE WAY OF OBTAINING HASH WITHOUT MAKING PROOF SYMMETRICAL (WHICH IS BAD) & .encode PUTS STRING IN RIGHT FORMAT FOR sha256()
            #
            # NOW, CHECK FOR THE 1ST 4 LEADING ZEROS, IN CASE THEY'RE NOT THERE :)
            if hash_operation[:4] == '0000':
                check_proof = True
            else:  # INCREMENT new_proof AND TRY AGAIN IN THE NEXT ITERATION
                new_proof += 1
        return new_proof

    def hash_function(self, block):
        encoded_block = json.dumps(block, sort_keys=True).encode()
        return hashlib.sha256(encoded_block).hexdigest()

    def add_transaction(self, sender, recipient, amount):
        transaction = {'sender': sender, 'recipient': recipient, 'amount': amount}
        self.pendingTransactions.append(transaction)
        # return transaction  # RETURN THIS TRANSACTION
        return len(self.chain)  # OR SEND THE INDEX OF THE NEXT BLOCK TO BE ADDED TO THE BLOCKCHAIN
        # return self.get_previous_block()['index'] + 1  # OR GET LAST BLOCK'S INDEX + 1

    def add_node(self, address):
        # 1ST PARSE THE address OF THIS NODE
        address = urlparse(address).netloc  # .netloc IS THE 'ipaddress:port' STRING
        # address IS NOW IN FORMAT 'http://ipaddress:port'
        if (address not in self.nodes) and (address != self.node_address):
            self.nodes.add(
                address)  # ALL NODES CAN HAVE THE SAME IP ADDRESS, BUT WILL HAVE TO HAVE DIFFERENT PORTS THOUGH
        else:
            print("NODE ADDRESS ALREADY EXISITS WITHIN THE BLOCKCHAIN")

    def is_chain_valid(self, chain):  # LOOP THROUGH ALL BLOCKS OF CHAIN, TO MAKE SURE IT'S VALID
        previous_block = chain[0]  # MAKE IT THE 1ST BLOCK OF THE CHAIN
        block_index = 1  # LET IT START AT INDEX 1 (WITH PREVIOUS BLOCK AT INDEX 0)
        while block_index < len(chain):
            """ 2 CHECKS 
            1. PREVIOUS HASH PROPERTY OF ANY BLOCK IS == TO HASH OF PREVIOUS BLOCK
            2. CHECK THAT THE PROOF OF WORK OF EACH BLOCK IS VALID
            """
            block = chain[block_index]
            # 1. PREVIOUS HASH IS == TO HASH OF PREVIOUS BLOCK
            if block['previous_hash'] != self.hash_function(previous_block):
                return False
            # 2. CHECK THAT THE PROOF OF WORK OF EACH BLOCK IS VALID
            # ie. solving a problem given a crypto-hash of this operation, it starts with 4 leading '0000's
            previous_proof, proof = previous_block['proof'], block['proof']
            # MAKE SURE THE HASH OPERATION STARTS WITH 4 LEADING '0000's
            hash_operation = hashlib.sha256(str((proof ** 2) - (previous_proof ** 2)).encode()).hexdigest()
            if hash_operation[:4] != '0000':
                return False
            # NOW, PREPARE FOR THE NEXT ITERATION
            previous_block = block
            block_index += 1
        # IF NO return False, return True
        return True

    # THIS FUNCTION WILL ENFORCE THE CONSENSUS WITHIN THE BLOCKCHAIN
    def replace_chain(self):
        """ WHENEVER A NEW BLOCK IS ADDED TO A CHAIN, THIS METHOD WILL CHECK IN EVER NODE
        FOR THE LONGEST CHAIN AND USE THAT CHAIN TO REPLACE THE CHAIN IN EVERY OTHER NODE"""
        network = self.nodes
        longest_chain = None
        max_length = len(
            self.chain)  # LENGTH OF CHAIN WITHIN THIS NODE FOR NOW, UNTIL ALL NODES' CHAINS ARE CHECKED, TO FIND THE LONGEST
        for node in network:  # MAKE HTTP REQUESTS TO ALL NODES SERVERS TO GET EACH NODE'S BLOCKCHAIN & FIND MAX LENGTH
            # THEREFORE, CALLING .get('/get_chain') REQUEST ON EACH NODE
            response = requests.get('http://' + node + '/get_chain')
            print("RESPONSE -> {}".format(response))
            if response.status_code == 200:
                response = response.json()
                if ('chain' in response) and ('length' in response):
                    # response WILL HAVE THE BLOCKCHAIN JSON OBJECT & ITS LENGTH
                    chain, length = response['chain'], response['length']
                    if (length > max_length) and (self.is_chain_valid(chain)):
                        longest_chain, max_length = chain, length
        # DON'T END THE FUNCTION IN CASE OF ANY ERROR, COZ YOU'VE TO CHECK THROUGH ALL NODES!!!
        if longest_chain is not None:
            msg = "LONGEST CHAIN ({} BLOCKS) -> {}".format(max_length, longest_chain)
            print(msg)
            # NOW, ACTUALLY REPLACING THE CHAIN FOR THIS NODE SERVER
            self.chain = longest_chain
            return True, msg
        msg = "NO REPLACEMENT REQUIRED, COZ THIS NODE'S CHAIN IS ALREADY THE LONGEST"
        print(msg)
        return False, msg


# PART 2 - MINE THE BLOCKCHAIN - USING A FLASK-BASED WEB SERVER

app = Flask(__name__)

# CREATE AN ADDRESS FOR THIS NODE ON PORT 5000 SO IT CAN BE ADDED WITH .add_node() OF THE BLOCKCHAIN CLASS
# OR, SO IT CAN BE USED TO REWARD MINERS WITH CRYPTO
node_address = str(uuid4()).replace('-', '')  # GEN'S RANDOM UNIQUE ADDRESS FOR THIS NODE

# CREATE A BLOCKCHAIN
blockchain = Blockchain()


# GETTING THE FULL BLOCKCHAIN ROUTE
@app.route('/get_chain', methods=['GET'])
def get_chain():
    # GET THE ENTIRE BLOCKCHAIN, WITH ALL ITS BLOCKS
    chain = blockchain.chain  # BUT CHECK IF IT'S VALID 1ST ..
    if blockchain.is_chain_valid(chain):
        response = {'chain': chain, 'length': len(chain)}
    else:
        response = {'message': 'Blockchain is not valid.'}
    return jsonify(response), 200


# CREATE A NEW TRANSACTION
@app.route('/add_transaction', methods=['POST'])
def add_transaction():
    transactionObj = request.get_json()  # YOU CAN DO SOME VALIDATIONS ON THIS OBJECT
    transactionKeys = ['sender', 'recipient', 'amount']
    missingKeys = [key not in transactionObj for key in transactionKeys]
    if len(missingKeys) > 0:
        # CHECK OUT THIS NEW PYTHON SYNTAX RIGHT HERE (NEXT LINE COMMENT) CAN REPLACE THE PREVIOUS 2 LINES OF CODE !!!
        # if not all [key in transactionObj for key in transactionKeys]:
        return "All the necessary keys are not in the transaction object", 400
    nextBlockIndex = blockchain.add_transaction(transactionObj['sender'], transactionObj['recipient'],
                                                transactionObj['amount'])
    response = {
        'message': 'Transaction will be added to the next block of index {}'.format(nextBlockIndex)
    }
    return jsonify(response), 200


# CREATE A NEW BLOCK ROUTE
@app.route('/mine_block', methods=['GET'])
def mine_block():
    # SOLVE PROOF OF WORK PROBLEM FOR THE BLOCK TO BE MINED
    previous_block = blockchain.get_previous_block()
    previous_proof = previous_block['proof']
    proof = blockchain.proof_of_work(previous_proof)
    previous_hash = blockchain.hash_function(previous_block)
    block = blockchain.create_block(proof, previous_hash)
    response = {
        'message': "Congratulations, you just mined a new block!!",
        'block': block  # YOU CAN ATTACK block TO THE RESPONSE DATA
    }
    return jsonify(response), 200

    # YOU CAN MODIFY THIS FUNCTION TO TURN THE BLOCKCHAIN INTO A CRYPTOCURRENCY
    # ADD SOME TRANSACTIO(S) IF YOU PREFER
    sender, recipient, amount = node_address, "address of recipient", 12.5
    indexOfNextBlock = blockchain.add_transaction(sender, recipient, amount)
    # THIS TRANSACTION WILL SEND CRYPTO TO THE MINER OF THIS BLOCK (CAN COME BEFORE THE BLOCK WAS ADDED TO THE BLOCKCHAIN THOUGH


# PART 3 - DECENTRALIZING THE BLOCKCHAIN (DECENTRALIZED NETWORK OF MULTIPLE NODES)
# CONSENSUS - MAKING SURE THAT ALL NODES WITHIN THE NETWORK HAVE THE SAME COPY OF THE BLOCKCHAIN

# CONNECT NEW NODE TO THE DECENTRALIZED Blockchain NETWORK
@app.route('/connect_nodes', methods=['POST'])
def connect_nodes():
    nodeObj = request.get_json()  # YOU CAN VALIDATE OBJECT 1ST
    nodeAddresses = nodeObj['nodes']  # ARRAY OF URLS OF ALL NODES WITHIN THE BLOCKCHAIN NETWORK
    if (nodeAddresses is not None) and (len(nodeAddresses) > 0):
        for nodeAddress in nodeAddresses:  # YOU CAN VALIDATE nodeAddress 1ST ..
            blockchain.add_node(nodeAddress)
        response = {
            'message': 'All nodes are now connected',
            'nodes': list(blockchain.nodes)
        }
        return jsonify(response), 200
    return "No node available", 400


# REPLACE (UPDATE) CHAIN IN NODE WITH LONGEST BLOCKCHAIN
@app.route('/replace_chain', methods=['GET'])
def replace_chain():  # THIS METHOD ALREADY RETURNS A BOOLEAN & A MESSAGE
    success, msg = blockchain.replace_chain()
    response = {'message': msg, 'chain': blockchain.chain}
    """ msg IS EITHER OF THESE STRINGS
        "LONGEST CHAIN ({} BLOCKS) -> {}".format(max_length, longest_chain)
        OR
        "NO REPLACEMENT REQUIRED, COZ THIS NODE'S CHAIN IS ALREADY THE LONGEST"
    """
    return jsonify(response), 200


""" 
    '/connect_nodes' POST REQUEST TO ADD ALL NEW NODES BY THE IP-ADDRESSES
    NB: connect node 2&3 to 1, 1&3 to 2, 1&2 to 3, & so on - BEST TO AUTOMATE ALL THIS CONNECTING
    ALL OTHER ROUTES (add_transaction, mine_block, get_chain, etc) ON EACH NODE-SERVER TO UPDATE THEIR RESPECTIVE CHAINS
    NB: if node1 sends get request to node2 to mine a new block, node2 rewards node1 with crypto
    '/replace_chain' GET REQUEST ON ALL NODES TO UPDATE EACH NODE WITH LONGEST CHAIN
"""

""" NB: CREATE .json FILE WITH URLS (http://ipaddress:port) OF ALL NODES (at least 3 nodes)
CREATE NEW FILES FOR EACH OF NODE-URLS (EACH FILE HAS ALL THIS BLOCKCHAIN CODE)
RUN ALL 3 NODE-SERVERS (ON THEIR RESPECTIVE PORTS - eg. 5001, 5002, 5003, ...) AND INTERACT WITH THEIR BLOCKCHAINS (TRANSACTIONS & SHIT)
THEN REPLACE THE BLOCKCHAIN OF EACH NODE-SERVER WITH THE LONGEST BLOCKCHAIN OF WHICHEVER NODE
"""
# THIS NODE SERVER'S PORT WILL BE DIFFERENT FROM THAT OF OTHERS (BUT ALL NODE SERVERS CAN HAVE THE SAME IP ADDRESS)
# Running the app on http://0.0.0.0:5000
app.run(host='0.0.0.0', port=5000)
