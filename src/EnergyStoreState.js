
var pollingTimeoutId = 0;
function handleNewAddress() {
    clearTimeout(pollingTimeoutId);

    this.bidsCount = 0;
    this.bids = [];
    this.bidError = null;
    
    this.asksCount = 0;
    this.asks = [];
    this.askError = null;
}

function handleNextBid(self, index, max) {
    if (index >= max) {
        return;
    }
    self.contract.methods.bids(index).call().then(result => {
        self.bids.push(result);
        index += 1;
        if (index < max) {
            handleNextBid(self, index, max);
        }
    }).catch(error => self.bidError = error.toString());
}

function handleNextAsk(self, index, max) {
    if (index >= max) {
        return;
    }
    self.contract.methods.asks(index).call().then(result => {
        self.asks.push(result);
        index += 1;
        if (index < max) {
            handleNextAsk(self, index, max);
        }
    }).catch(error => self.askError = error.toString());
}

function handleNewContract(contract) {
    // bids
    const bidsPromise = contract.methods.getBidsCount().call().then(result => {
        this.bidsCount = result;
        this.bids = [];
        handleNextBid(this, 0, result);
    }).catch(error => this.bidError = error.toString());

    // asks
    const asksPromise = contract.methods.getAsksCount().call().then(result => {
        this.asksCount = result;
        this.asks = [];
        handleNextAsk(this, 0, result);
    }).catch(error => this.askError = error.toString());

    const self = this;
    Promise.all([bidsPromise, asksPromise]).then(() => handlePolling(self));
}

function handlePolling(self) {
    const handler = () => {
        self.contract.methods.getBidsCount().call().then(result => {
            if (result > self.bids.length) {
                // handle exactly one more bid (leaving any further
                // ones for the next polling run)
                handleNextBid(self, self.bids.length, 0);
            }
        });
        self.contract.methods.getAsksCount().call().then(result => {
            if (result > self.asks.length) {
                // handle exactly one more ask (leaving any further
                // ones for the next polling run)
                handleNextBid(self, self.asks.length, 0);
            }
        });
        pollingTimeoutId = setTimeout(handler, 60 * 1000);
    }
    handler();
}

export default{
    handleNewAddress:handleNewAddress,
    handleNextBid:handleNextBid,
    handleNextAsk:handleNextAsk,
    handleNewContract:handleNewContract,
    handlePolling:handlePolling
}