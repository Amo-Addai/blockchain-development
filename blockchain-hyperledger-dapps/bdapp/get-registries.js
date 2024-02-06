const bnUtil = require("business-network-connection");

const ns = "org.acme.airline.flight";

bnUtil.connection.getAllAssetRegistries(false).then(registries => {
    printRegistries(registries);
    return bnUtil.connection.getAllParticipantRegistries(false);
}).then(registries => {
    printRegistries(registries);
    return bnUtil.connection.getAllTransactionRegistries();
}).then(registries => {
    printRegistries(registries);
    return bnUtil.connection.getHistorian(false);
}).then(registry => {
    console.log("Historian Registry -> ", registry.registryType, "\t", registry.id);
    return bnUtil.connection.getIdentityRegistry(false);
}).then(registry => {
    console.log("Identity Registry -> ", registry.registryType, "\t", registry.id);
    return bnUtil.connection.disconnect();
}).catch(err => {
    console.log(err);
    bnUtil.connection.disconnect()
});



function printRegistries(registryArray) {
    console.log("REGISTRIES ...");
    registryArray.forEach(reg => {
        console.log(reg.registryType, "\t", reg.id);
    });
}