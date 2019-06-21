var utHarness = require('./ut-harness');

var modelFolder = "PATH/TO/MODEL/FOLDER";

utHarness.debug = true;
utHarness.initialize(modelFolder, (adminConn, bnConn, definition) => {
    console.log("BNA -> ", definition.getName(), "@", definition.getVersion());
    return bnConn.getAllAssetRegistries(false).then(registries => {
        registries.forEach(reg => {
            console.log(JSON.stringify(reg));
        });
    });
});