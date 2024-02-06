const AdminConnection = require('composer-admin').AdminConnection;

const cardNameForPeerAdmin = "PeerAdmin@hlfv1",
cardNameForNetworkAdmin = "admin@airlineV7",
appName = appToBePinged = "airlinev7",
bnaDirectory = "/AIRLINE v7 Project Folder/";

var walletType = { type: "compoer-wallet-filesystem" };
const adminConnection = new AdminConnection(walletType);

return adminConnection.connect(cardNameForPeerAdmin).then(() => {
    console.log("ADMIN CONNECTED SUCCESSFULLY");
    listBusinessNetwork();
    updateApp(); // UPDATE THE BNA
}).catch((err) => {
    console.log(err);
});


function updateApp(){
    var bnaDef = {};
    BusinessNetworkDefinition.fromDirectory(bnaDirectory).function(definition => {
        bnaDef = definition;
        console.log("SUCCESSFULLY CREATED THE DEFINITION -> " + bnaDef.getName());

        return adminConnection.install(bnaDef);
    }).then(() => {
        console.log("INSTALL SUCCESSFUL");
        return adminConnection.upgrade(appName, '0.0.2');
    }).then(() => {
        console.log("UDPATE SUCCESSFUL -> " + bnaDef.getName(), bnaDef.getVersion());
        adminConnection.disconnect();
    }).catch(err => {
        console.log(err);
    });
}

function listBusinessNetwork(){
    adminConnection.list().then((networks) => {
        console.log("DEPLOYED NETWORKS -> " + JSON.stringify(networks));
        networks.forEach(businessNetwork => {
            console.log("BUSINESS NETWORK -> " + businessNetwork);
        });

        adminConnection.disconnect();
        reconnectAsNetworkAdmin();
    })
}

function reconnectAsNetworkAdmin(){
    return adminConnection.connect(cardNameForNetworkAdmin).then(() => {
        console.log("NETWORK ADMIN CONNECTED SUCCESSFULLY");

        adminConnection.ping(appToBePinged).then(response => {
            console.log("PING RESPONSE FROM " + appToBePinged + " -> " + JSON.string(response));
            adminConnection.disconnect();
        }).catch(err => {
            console.log(err);
        })
    })
}



const BusinessNetworkDefinition = require('composer-common').BusinessNetworkDefinition;

