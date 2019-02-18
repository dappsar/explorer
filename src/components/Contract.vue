<template>
<div class="contract">
  Contract address:<br>
  <input id="contract-address" v-model="address" size="50">
  <br><br>
  <a v-if="!addressError" :href="linkToExplorer(address)" class="btn btn-success btn-lg" role="button" target="_blank">
      View in Explorer
  </a>
  <span id="contract-address-error" v-if="!!addressError">
    {{ addressError }}
    <a href="#" v-if="!!defaultAddress" v-on:click="address=defaultAddress">Reset</a>
  </span>
</div>
</template>

<script>
import sharedState from '../state.js'
import config from '../config.js'

export default {
    name: 'Contract',
    data() {
        return sharedState;
    },
    watch: {
        networkId: function(networkId) {
            const address = config.contractAddresses[networkId];
            this.defaultAddress = address;
            this.address = address;
        },
        address: function(newAddress) {
            updateContract.bind(this)(this.web3js, newAddress);
        },
        web3: function(web3js, oldweb3js) {
            if (!oldweb3js) {
                updateContract.bind(this)(web3js, this.address);
            }
        }
    },
    methods: {
        linkToExplorer: function linkToExplorer(address) {
            switch (this.networkId) {
            case 1:
                return `https://etherscan.io/address/${address}`;
            case 3:
                return `https://ropsten.etherscan.io/address/${address}`;
            default:
                return `${config.explorers[this.networkId]}`;
            }
        }
    }
}
function updateContract(web3js, newAddress) {
    const abi = config.contractABIs[this.networkId];
    if (!!web3js && abi) {
        if (!web3js.utils.isAddress(newAddress)) {
            this.contract = null;
            this.addressError = 'Invalid Address';
            return;
        }
        try {
            this.contract = new web3js.eth.Contract(abi, newAddress);
            this.addressError = '';
        } catch (e) {
            this.contract = null;
            this.addressError = 'Invalid Address: ' + e.toString();
        }
    } else {
        this.contract = null;
    }    
}
</script>

<style scoped>
span#contract-address-error {
    color: red;
}
</style>
