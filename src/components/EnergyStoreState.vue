<template>
<div id="energy-store-state">
  <h3>State of the Lition EnergyStore contract</h3>
  <b v-if="!!bidError">There was an error retrieving the bids: {{ bidError.toString() }}</b>
  <h3 v-if="bidsCount>0">Bids (results of offer_energy): {{ bidsCount }}</h3>
  <div class=table-container>
    <table id="bids">
      <thead>
        <tr v-if="bids.length>0">
          <th>index</th>
          <th v-for="(value, key) in bids[0]" :key="JSON.stringify(value)" v-if="key.length>1">
            {{ key }}
          </th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(bid, index) in bids" :key="'bid'+JSON.stringify(bid)+index">
          <td>{{ index }}</td>
          <td v-for="(value, key) in bid" :key="'bid'+JSON.stringify(value)" v-if="key.length>1">
            {{ value }}
            <span class="value-date" v-if="key==='day'">({{ (new Date(value*1.0e3)).toLocaleString() }})</span>
            <span class="value-numeric" v-if="key==='price'">({{ (value*1.0e-3).toFixed(3) }} ct/kWh)</span>
            <span class="value-numeric" v-if="key==='energy'">({{ (value*1.0e-6).toFixed(6) }} kWh)</span>
            <span class="value-date" v-if="key==='timestamp'">({{ (new Date(value*1.0e-3)).toLocaleString() }})</span>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
  <b v-if="!!askError">There was an error retrieving the asks: {{ askError.toString() }}</b>
  <h3 v-if="asksCount>0">Asks (results of buy_energy): {{ asksCount }}</h3>
  <div class=table-container>
    <table id="asks" v-if="!this.askError">
      <thead>
        <tr v-if="asks.length>0">
          <th>index</th>
          <th v-for="(value, key) in asks[0]" :key="JSON.stringify(value)" v-if="key.length>1 && key !== 'id'">
            {{ key }}
          </th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(ask, index) in asks" :key="'ask'+JSON.stringify(ask)+index">
          <td>{{ index }}</td>
          <td v-for="(value, key) in ask" :key="'ask'+JSON.stringify(value)" v-if="(key.length>1) && (key!=='id')">
            {{ value }}
            <span class="value-date" v-if="key==='day'">({{ (new Date(value*1.0e3)).toLocaleString() }})</span>
            <span class="value-numeric" v-if="key==='price'">({{ (value*1.0e-3).toFixed(3) }} ct/kWh)</span>
            <span class="value-numeric" v-if="key==='energy'">({{ (value*1.0e-6).toFixed(6) }} kWh)</span>
            <span class="value-date" v-if="key==='timestamp'">({{ (new Date(value*1.0e-3)).toLocaleString() }})</span>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</div>
</template>

<script>
import sharedState from '../state.js'

export default {
    name: 'EnergyStoreState',
    data() {
        return sharedState;
    },
    watch: {
        address: handleNewAddress,
        contract: handleNewContract
    }
}

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
</script>

<style scoped>
.table-container {
    font-family: monospace;
    height: 20em;
    overflow-y: scroll;
}
.value-date, .value-numeric {
    font-family: sans;
}
table tbody {
    transform: scaley(-1);
}
table tbody > * {
    transform: scaley(-1);
}
</style>
