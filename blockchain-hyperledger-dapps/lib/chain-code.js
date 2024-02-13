
/*
* Create Flight Transaction
* @param {org.acme.airline.fight.CreateFlight} flightData
* @transaction
*/
function createFlight(flightData) {  // flightData HAS PROPS OF transaction CreateFlight
    // FIRST, SOME ACCESS-CONTROL CHECKS
    var participant = getCurrentParticipant();
    if(getFullyQualifiedType(participant) == "ACMEPersonnel"){} // OR THIS ..
    if(getFullyQualifiedIdentifier(participant) == "ACMEPersonnel#wills"){}
    //
    var now = new Date().getTime(),
    scheduleTime = new Date(flightData.schedule).getTime();
    if(scheduleTime < now) throw new Error("Scheduled time cannot be in the past!!");
    //
    return getAssetRegistry('org.acme.airline.flight.Flight')
        .then((flightRegistry) => {
            var factory = getFactory(), ns = 'org.acme.airline.flight';
            var flightId = 'AE102-05-12-18';
            var flight = factory.newResource(ns, 'Flight', flightId);
            flight.flightNumber = flightData.flightNumber;
            flight.aliasFlightNumber = [];
            // 
            var route = factory.newConcept(ns, "Route");
            for(var k of ['origin', 'destination', 'schedule']){
                route[key] = flightData[key];
            }
            flight.route = route;
            // NOW, EMIT THE EVENT THAT FLIGHT HAS BEEN CREATED
            var event = factory.newEvent(ns, 'FlightCreated');
            event.flightId = flightId; 
            emit(event);
            // 
            return flightRegistry.addAll([flight]);
        })
}
