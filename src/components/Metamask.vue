<template>
<div class="metamask">
  <h1 v-if="noMetaMaskWarning"><a href="https://metamask.io/">Metamask extension</a> not found! Please install it and reload this page.</h1>
</div>
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
        // Checking if Web3 has been injected by the browser (Mist/MetaMask)
        if (typeof web3 !== 'undefined') {
            // Use Mist/MetaMask's provider            
            // eslint-disable-next-line
            this.web3js = new Web3(web3.currentProvider);
        } else {
            this.noMetaMaskWarning = true;
            return;
        }
    }
}
</script>

<style scoped>
h1 {
    color: red;
}
</style>
