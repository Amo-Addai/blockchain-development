const bnUtil = require("business-network-connection");

bnUtil.cardName = 'admin@airlinev8';
bnUtil.connect(err => {
    //  CALLING A NAMED QUERY 'AllFlights'
   return bnUtil.query('AllFlights').then(res => {
       console.log(res.length + " FLIGHTS -> " + JSON.stringify(res));
       //  NOW, EXECUTING A DYNAMIC QUERY
       var queryStmnt = 'SELECT org.acme.airline.aircraft.Aircraft WHERE (aircraftId == _$id)';
       return bnUtil.buildQuery(queryStmnt);
   }).then(query => {
       return bnUtil.connection.query(query, {id: 'CRAFT101 OR SOME OTHER ID STR'});
   }).then(res => {
       console.log(res.length + " AIRCRAFTS -> " + JSON.stringify(res));
       bnUtil.connection.disconnect();
   }).catch(err => bnUtil.disconnect());
});
