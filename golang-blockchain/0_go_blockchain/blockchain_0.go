package main

import (
	"fmt"
	"log"
)

type Block struct {
	nonce init
	previousHash string
	timestamp int64
	transactions []string
}


func NewBlock(nonce int, previousHash string) *Block {
	b := new(Block)
	b.timestamp = time.Now.UnixNano()
	b.nonce = nonce
	b.previousHash = previousHash
	
	return b
	/*
	return &Block {
		timestamp: time.Now.UnixNano()
	}
	*/
}

func (b * Block) Print() {
	fmt.Printf("timestamp			%d\n", b.timestamp)
	fmt.Printf("nonce				%d\n", b.nonce)
	fmt.Printf("previous_hash		%s\n", b.previoushash)
	fmt.Printf("transactions		%s\n", b.transactions)
}


func init() {
	log.SetPrefix("Blockchain: ")
}

func main() {
	fmt.Println("test")
	log.Println("test-1")

	b := NewBlock(0, "init hash")
	b.Print()
}

