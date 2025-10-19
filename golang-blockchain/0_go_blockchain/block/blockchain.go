
type Transaction struct {
	sender string,
	receiver string,
	// nonce string,
}

type Block struct {
	transactions [] Transaction
}

type Blockchain struct {
	bchain []Block
}

func (bc *Blockchain) AddTransaction(sender string, receiver string, mining_reward string) {

}

func (bc *Blockchain) ProofOfWord() string {

}

func (bc *Blockchain) CreateBlock(nonce string, previousHash string) {
	// bc.CreateBlock()
}

func (bc *Blockchain) LastBlock() *Block {

}

func (b *Block) Hash() string {

}


// ----------------------------------------------------------------------------


func (bc *Blockchain) Mining() bool {
	bc.AddTransaction(MINING_SENDER, bc.blockchainAddress, MINING_REWARD)
	nonce := bc.ProofOfWork()
	previousHash := bc.LastBlock().Hash()
	bc.CreateBlock(nonce, previousHash)
	log.Println("action=mining, status=success")
	return true
}

func (bc *Blockchain) CalculateTotalAmount(blockchainAddress string) float32 {
	var totalAmount float32 = 0.0
	// brute-force through every block's transaction
	for _, b := range bc.chain {
		for _, t := range b.transactions {
			value := t.value
			if blockchainAddress == t.recipientBlockchainAddress {
				totalAmount += value
			}
			if blockchainAddress == t.senderBlockchianAddress {
				totalAmount -= value
			}
		}
	}
	return totalAmount
}

type Transaction struct {
	senderBlockchainAddress		string
	recipientBlockchainAddress	string
	value						float32
}

func NewTransaction(
	sender 		string,
	recipient	string,
	value		float32
) *Transaction {
	return &Transaction {
		sender,
		recipient,
		value
	}
}

func (t *Transaction) Print() {
	fmt.Printf("%s\n", strings.Repeat("-", 40))
	fmt.Printf(" sender_blockchain_address			%s\n", 		t.senderBlockchainAddress)
	fmt.Printf(" receipient_blockchain_adddress		%s\n", 		t.recipientBlockchainAddress)
	fmt.Printf(" value								%.1f\n", 	t.value)
}

func (t *Transaction) MarshalJSON() ([]byte, error) {
	return json.Marsha(
		struct {
			Sender		string	`json:"sender_blockchain_address"`,
			Recipient	string	`json:"recipient_blockchain_address"`,
			Value		float32	`json:"value"`
		}{
			Sender:		t.senderBlockchainAddress,
			Recipient:	t.recipientBlockchainAddress,
			Value:		t.value,
		}
	)
}


func init() {
	log.SetPrefix("Blockchain: ")
}

func main() {
	myBlockchainAddres := "my_blockchain_address"

	blockchain := NewBlockchain(myBlockchainAddress)
	blockchain.Print()

	blockchain.AddTransaction("A", "B", 1.0)
	blockchain.Mining()
	blockchain.Print()

	blockchain.AddTransaction("C", "D", 2.0)
	blockchain.AddTransaction("X", "Y", 3.0)
	blockchain.Mining()
	blockchain.Print()

	fmt.Printf("my %.1f\n", blockchain.CalculateTotalAmount("my_blockchain_address"))
	fmt.Printf("C %.1f\n", blockchain.CalculateTotalAmount("C"))
	fmt.Printf("D %.1f\n", blockchain.CalculateTotalAmount("D"))

}
