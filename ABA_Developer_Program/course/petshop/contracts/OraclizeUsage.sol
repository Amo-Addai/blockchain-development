pragma solidity ^0.4.0;
import "github.com/oraclize/ethereum-api/oraclizeAPI.sol";

/* CHECK THIS SITE FOR SAMPLES ON REMIX IDE
http://dapps.oraclize.it/browser-solidity/#gist=9817193e5b05206847ed1fcd1d16bd1d&amp;version=soljson-v0.4.20+commit.3155dd80.js&version=soljson-v0.4.21+commit.dfe3193c.js
*/
contract DieselPrice is usingOraclize {
    /* Diesel Price Peg
    This contract keeps in storage a reference to the Diesel Price in USD
    */

    uint public DieselPriceUSD;

    event newOraclizeQuery(string description);
    event newDieselPrice(string price);

    constructor() public {
        update(); // first check at contract creation
    }

    function __callback(bytes32 myid, string result) public {
        if (msg.sender != oraclize_cbAddress()) revert("SOME ERROR HAS OCCURED");
        emit newDieselPrice(result);
        DieselPriceUSD = parseInt(result, 2); // let's save it as $ cents
        // do something with the USD Diesel price
    }
    
    function update() public payable {
        emit newOraclizeQuery("Oraclize query was sent, standing by for the answer..");
        oraclize_query("URL", "xml(https://www.fueleconomy.gov/ws/rest/fuelprices).fuelPrices.diesel");
    }
    
}


contract KrakenPriceTicker is usingOraclize {    
    /* Kraken-based ETH/XBT price ticker
    This contract keeps in storage an updated ETH/XBT price, which is updated every ~60 seconds.
    */
    string public ETHXBT;
    
    event newOraclizeQuery(string description);
    event newKrakenPriceTicker(string price);
    

    constructor () public {
        oraclize_setProof(proofType_TLSNotary | proofStorage_IPFS);
        update();
    }

    function __callback(bytes32 myid, string result, bytes proof) public {
        if (msg.sender != oraclize_cbAddress()) revert("SOME ERROR HAS OCCURED");
        ETHXBT = result;
        emit newKrakenPriceTicker(ETHXBT);
        update();
    }
    
    function update() public payable {
        if (oraclize.getPrice("URL") > this.balance) {
            emit newOraclizeQuery("Oraclize query was NOT sent, please add some ETH to cover for the query fee");
        } else {
            emit newOraclizeQuery("Oraclize query was sent, standing by for the answer..");
            oraclize_query(60, "URL", "json(https://api.kraken.com/0/public/Ticker?pair=ETHXBT).result.XETHXXBT.c.0");
        }
    }
    
} 


contract WolframAlpha is usingOraclize {    
    /* WolframAlpha example
    This contract sends a temperature measure request to WolframAlpha
    */
    string public temperature;
    
    event newOraclizeQuery(string description);
    event newTemperatureMeasure(string temperature);

    constructor () public {
        update();
    }
    
    function __callback(bytes32 myid, string result) public {
        if (msg.sender != oraclize_cbAddress()) revert("SOME ERROR HAS OCCURED");
        temperature = result;
        emit newTemperatureMeasure(temperature);
        // do something with the temperature measure..
    }
    
    function update() public payable {
        emit newOraclizeQuery("Oraclize query was sent, standing by for the answer..");
        oraclize_query("WolframAlpha", "temperature in London");
    }
    
} 
                                           

contract YoutubeViews is usingOraclize {
    /* Youtube video views
        This contract keeps in storage a views counter for a given Youtube video.
    */
    string public viewsCount;
    
    event newOraclizeQuery(string description);
    event newYoutubeViewsCount(string views);

    constructor () public {
        update();
    }
    
    function __callback(bytes32 myid, string result) public {
        if (msg.sender != oraclize_cbAddress()) revert("SOME ERROR HAS OCCURED");
        viewsCount = result;
        emit newYoutubeViewsCount(viewsCount);
        // do something with viewsCount. like tipping the author if viewsCount > X?
    }
    
    function update() public payable {
        emit newOraclizeQuery("Oraclize query was sent, standing by for the answer..");
        oraclize_query("URL", "html(https://www.youtube.com/watch?v=9bZkp7q19f0).xpath(//*[contains(@class, \"watch-view-count\")]/text())");
    }
    
} 
                                           



