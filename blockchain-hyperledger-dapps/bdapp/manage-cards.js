'use strict';

const NetworkCardStoreManger = require('composer-common').NetworkCardStoreManger;

var walletType = { type: 'composer-wallet-filesystem' };
const cardStore = NetworkCardStoreManger.getCardStore(walletType);

return cardStore.getAll().then((cardMap) => {
    console.log(cardMap.keys());

    var firstCardKey = cardMap.keys().next().value;  // "name of 1st card"
    return cardStore.get(firstCardKey);
}).then((idCard) => {
    console.log("FIRST CARD -> ", idCard.getUserName(), " @ ", idCard.getBusinessNetworkName());
    console.log("CONNECTION PROFILE -> ", JSON.stringify(idCard.getConnectionProfile()));
}).catch((err) => {
    console.log("ERROR -> ", err);
});
