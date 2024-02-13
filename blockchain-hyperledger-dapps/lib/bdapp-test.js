var utHarness = require('./ut-harness');

var modelFolder = "PATH/TO/MODEL/FOLDER", ns = "org.acme.airline", resourceName = "SampleAsset",
    adminConnection = {}, businessNetworkConnection = {}, bnaDefinition = {};


before((done) => {
    utHarness.debug = true;
    utHarness.initialize(modelFolder, (adminConn, bnConn, definition) => {
        adminConnection = adminConn;
        businessNetworkConnection = bnConn;
        bnaDefinition = definition;
        done();
    });
});

describe('Sample Tests Domain', () => {
    it('Sample Test Case', () => { // EXEC STH
        let registry = {};
        return businessNetworkConnection.getAssetRegistry(ns + "." + resourceName).then(reg => {
            regsitry = reg;
            const factory = bnaDefinition.getFactory();
            let sampleAsset = factory.newRource(ns, resourceName, 'SA-1');
            sampleAsset.value = '10';
            return registry.add(sampleAsset);
        }).then(asset => {
            return registry.get('SA-1');
        }).then(asset => {
            asset.equal(asset.value, "10", "VALUE NOT EQUAL / UNDEFINED");
        }).catch(err => console.log(err));
    });
});

describe('Testing "CreateFlight" Transation', () => {
    var transactionName = 'CreateFlight', assetName = 'SOME ASSET NAME';
    it('should create & retrieve 1 Flight instance', () => {
        const factory = bnaDefinition.getFactory();
        let transaction = factory.newTransaction(ns, transactionName);
        transaction.flightNumber = 'AE101'; // SET MORE PROPS TOO
        //
        return businessNetworkConnection.submitTransaction(transaction).then(
            _ => businessNetworkConnection.getAssetRegistry(ns+'.'+assetName))
            .then(reg => registry.getAll())
            .then(assets => assert.lengthOf(assets, 1, "should have count of 1!!"))
            .catch(err => console.log(err));
    });
});

after(() => {
    // RUN AFTER ALL TEST CASES
});