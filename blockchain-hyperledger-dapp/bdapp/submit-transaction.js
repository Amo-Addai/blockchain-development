const bnUtil = require("business-network-connection");
const ns = "org.acme.airline.flight";

bnUtil.connect((err) => {
    if(err){
        console.log(err);
        process.exit();
    }
    console.log("SUCCESSFULLY CONNECTED");
    let bnDef = bnUtil.connection.getBusinessNetwork();
    console.log("RECEIVED DEFINITION FROM RUNTIME -> " + bnDef.getName(), " : ", bnDef.getVersion());
    let factory = bnDef.getFactory();
    let options = {
        generate: false, includeOpitonalFields: false
    }, transactionType = "CreateFlight", flightId = "SOME ID STRING";
    var transaction = factory.newTransaction(ns, transactionType, flightId, options);
    transaction.setPropertyValue('flightNumber', 'AE101');
    transaction.setPropertyValue('origin', 'EWR');
    transaction.setPropertyValue('destination', 'ATL');
    transaction.setPropertyValue('schedule', new Date('SOME DATE STRING'));

    return bnUtil.connection.submitTransaction(transaction).then(res => {
        console.log("TRANSACTION SUBMITTED SUCCESSFULLY")
        bnUtil.disconnect();
    }).catch(err => {
        console.log(err);
        bnUtil.disconnect();
    })
});