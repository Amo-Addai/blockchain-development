const errorString = "VM exception while processing transaction: ";

async function tryCatch(promise, reason) {    
    try {
        await promise;
        throw null;
    }
    catch (error) {
        assert(error, "Expected a VM exception but did not get one");
        assert(error.message.search(errorString + reason) >= 0, 
"Expected an error starting with '" + errorString + reason + "' but got '" + error.message + "' instead");
    }
};

module.exports = {
    catchRevert: async function(promise) {
        await tryCatch(promise, "revert");
    },
    catchOutOfGas: async function(promise) {
        await tryCatch(promise, "out of gas");
    },
    catchInvalidJump: async function(promise) {
        await tryCatch(promise, "invalid JUMP");
    },
    catchInvalidOpcode: async function(promise) {
        await tryCatch(promise, "invalid opcode");
    },
    catchStackOverflow : async function(promise) {
        await tryCatch(promise, "stack overflow");
    },
    catchStackUnderflow: async function(promise) {
        await tryCatch(promise, "stack underflow");
    },
    catchStaticStateChange: async function(promise) {
        await tryCatch(promise, "static state change");
    },
};

/*
// THEREFORE, YOU CAN IMPORT THIS FILE IN ANY OTHER TEST FILE 
// TO TEST SPECIFIC try-catch SITUATIONS. HERE'S AN EXAMPLE ..
var EventTickets = artifacts.require('EventTickets')
let catchRevert = require("./exceptionsHelpers.js").catchRevert

contract('EventTicket', function(accounts) {

  // ...

    it("tickets should only be able to be purchased when the msg.value is greater than or equal to the ticket cost", async() => {
        const instance = await EventTickets.new(description, url, ticketNumber)
        await catchRevert(instance.buyTickets(1, {from: secondAccount, value: web3.utils.toWei("0.5", "ether")}))
    })


  // ...

});
*/