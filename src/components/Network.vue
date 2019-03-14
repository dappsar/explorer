<template>
  <div class="network">
    <h4>
      You are on the <em>{{ networkName }}</em> network.
    </h4>
  </div>
</template>

<script>
  import sharedState from '../state.js'
  import config from '../config.js'
  import Web3 from 'web3'

  export default {
    name: 'Network',
    data() {
      return sharedState
    },
    created() {
      this.networkId = process.env.VUE_APP_NETWORK;
      this.networkName = config[this.networkId].name;
      this.web3js = new Web3(config[this.networkId].rpc);
      this.web3js.extend({
        property: 'eth',
        methods: [new this.web3js.extend.Method({
          name: 'getQuorumPayload',
          call: 'eth_getQuorumPayload',
          params: 1,
        })]
      });
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
  em {
    font-weight: bold;
  }
</style>
