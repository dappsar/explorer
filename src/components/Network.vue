<template>
<div class="network">
  <h4>
    You are on the <em>{{ networkName }}</em> network.
    <span v-if="!noMetaMaskWarning">
      You can change that in the MetaMask extension.
    </span>
  </h4>
</div>
</template>

<script>
import sharedState from '../state.js'
import network from '../network.js'

export default {
    name: 'Network',
    data() {
        return sharedState
    },
    created() {
        handleWeb3(this, this.web3js);
    },
    watch: {
        web3js: web3 => handleWeb3(this, web3)
    }
}

function handleWeb3(self, web3js)  {
    if (!web3js) {
        return;
    }
    // poll for network change, as recommended(!) in web3 FAQ
    const updateUI = () => {
        web3js.eth.net.getId().then(id => {
            self.networkId = id;
            const name = network.name(id);
            self.networkName = name;
            setTimeout(updateUI, 100);
        });
    };
    updateUI();
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
  em {
  font-weight: bold;
  }
</style>
