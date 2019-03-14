<template>
  <div class="contract">
    Contract address:<br>
    <input id="contract-address" v-model="address" size="50">
    <br><br>
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
    mounted: function () {
      const address = config[this.networkId].address;
      this.defaultAddress = address;
      this.address = address;
      this.updateContract();
    },
    methods: {
      updateContract: function updateContract() {
        const abi = config[this.networkId].abi;
        if (!!this.web3js && abi) {
          if (!this.web3js.utils.isAddress(this.address)) {
            this.contract = null;
            this.addressError = 'Invalid Address';
            return;
          }
          try {
            this.contract = new this.web3js.eth.Contract(abi, this.address);
            this.addressError = '';
          } catch (e) {
            this.contract = null;
            this.addressError = 'Invalid Address: ' + e.toString();
          }
        } else {
          this.contract = null;
        }
      }
    }
  }
</script>

<style scoped>
  span#contract-address-error {
    color: red;
  }
</style>
