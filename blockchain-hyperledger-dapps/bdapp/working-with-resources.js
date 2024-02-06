const bnUtil = require("business-network-connection");

const ns = "org.acme.airline.flight";

bnUtil.connect(err => {
   if (err) process.exit(1);
   return bnUtil.connection.getAssetRegistry(ns).then(reg => {
       console.log("REGISTRY -> " + reg.id);
       addAircrafts(reg);
   }).catch(err => console.log(err));
});

function addAircrafts(reg){
    let aircrafts = [],
        bnDef = bnUtil.connection.getBusinessNetwork(),
        factory = bnUtil.getFactory();
    let resource = factory.newResource(ns, 'Flight', 'ID STRING');
    //
    resource.flightNumber = "SOME VALUE"; // OR U CAN CALL THIS METHOD INSTEAD
    resource.setPropertyValue("flightNumber", "SOME VALUE");
    //
    aircrafts.push(resource);
    //
    return reg.addAll(aircrafts).then(() => {
        console.log("ADDED ALL RESOURCES SUCCESSFULLY")
        bnUtil.disconnect();
    }).catch(err => {
        console.log(err);
        bnUtil.disconnect();
    });
}
