const bnUtil = {
    cardStore : require('composer-common').FileSystemCardStore,
    BusinessNetworkConnection : require('composer-client').BusinessNetworkConnection,
    cardName : "admin@airlinev7",

    connection : {},
    connect : (cb) => {
        const cardStore = new this.cardStore();
        this.connection = new this.BusinessNetworkConnection({ cardStore : cardStore });
        //
        return this.connection.connect(this.cardName).then(cb()).catch(err => cb(err));
    },

    disconnect : (cb) => this.connection.disconnect(),
    ping : (cb) => {
        return this.connection.ping().then(response => {
            cb(response);
        }).catch(err => cb({}, err));
    }
};

bnUtil.connect(main);

function main(err){
    if(err){
        console.log(err);
        process.exit();
    }
    console.log("SUCCESSFULLY CONNECTED");
    bnUtil.ping((res, err) => {
        if(err) console.log(err)
        else console.log("RESPONSE -> " + JSON.string(res));
        bnUtil.disconnect();
    })
}

module.exports = bnUtil;