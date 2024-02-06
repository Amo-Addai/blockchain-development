var assert = require('chai').assert;
var expect = require('chai').expect;
var should = require('chai').should;

before(() => {
    // RUN BEFORE ALL TEST CASES
});
beforeEach(() => {
    // RUN BEFORE EACH TEST CASE
});


describe('Suite-1', () => {
    it('Test Case', () => { // EXEC STH
        assert.equal(true, false, "SOME STRING");
        assert.operator(10, ">", 5, "otherwise problem");

        expect(true).to.equal(false);
        expect('object').to.exist;
        expect('object').to.have.string('some str');
    });
});


after(() => {
    // RUN AFTER ALL TEST CASES
});
afterEach(() => {
// RUN AFTER EACH TEST CASES
});


// EXAMPLE
before(done => {
    console.log("EXECUTING BEFORE TEST CASES");
    done();
});

