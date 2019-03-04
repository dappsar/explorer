<template>
  <div class="metamask"></div>
</template>

<script>
  import sharedState from '../state.js'
  import Web3 from 'web3'

  export default {
    name: 'Metamask',
    data() {
      return sharedState;
    },
    created() {
      this.web3js = new Web3(process.env.VUE_APP_PROVIDER);
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
