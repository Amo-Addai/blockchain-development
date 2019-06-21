var SelfDestruct = artifacts.require('./SelfDestruct.sol');

module.exports = function(cb){
    var sd = null;
    return SelfDestruct.deployed().then((instance) => {
        sd = instance;
        sd.setValue("sth");
        return sd.someValue.call(); // CALL PUBLIC PROPERTY someValue
    }).then((result) => {
        console.log("RESULT -> " + result);
        return sd.killContract();
    }).then((result) => {
        console.log("SMART CONTRACT HAS BEEN DESTROYED");
        sd.setValue("SOME NEW VALUE"); // THIS CALL WILL THROW AN EXCEPTION, COZ THE SMART CONTRACT HAS BEEN DESTROYED NOW ..
    });
}
