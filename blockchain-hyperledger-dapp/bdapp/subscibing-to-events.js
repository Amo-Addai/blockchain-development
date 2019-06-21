const bnUtil = require("business-network-connection");

bnUtil.cardName = 'admin@airlinev8';
bnUtil.connect(err => {

    bnUtil.connection.on('event', evt => {
        var ns = evt.$namespace, evtType = evt.$type;
        var fqn = ns + "." + evtType; // FULLY QUALIFIED NAME OF EVENT
        switch(fqn){
            case 'org.acme.airline.flight.FlightCreated':
                console.log("FlightCreated EVENT -> " + JSON.stringify(evt));
                break;
            default:
                console.log("IGNORED EVENT -> " + fqn);
        }
    })
});
