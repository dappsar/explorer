<template>
  <div id="container" v-if="!!contract">
    <div class="container-fluid section-title">
      <h1>Transactions</h1>
      <br>
      <p>Copy and paste a TxHash here to view its details:
        <input id="txhash" v-model="txhash" size="70"></p>
    </div>
    <div class="container-fluid scrollable">
      <div class="box-container" v-if="transactions.length>0">
        <div class="box" v-for="tx in transactions" :key="tx.input">
          <table class="table">
            <tbody>
            <tr>
              <td>TX hash:</td>
              <td>{{ tx.hash }}</td>
            </tr>
            <tr>
              <td>From:</td>
              <td>{{ tx.from }} (<span v-if="tx.fromIsRegisteredProducer===false"><b>not </b></span>
                <span v-if="'undefined' !== typeof tx.fromIsRegisteredProducer">a registered producer</span>)
              </td>
            </tr>
            <tr>
              <td>To:</td>
              <td>{{ tx.to }}</td>
            </tr>
            <tr>
              <td>Function:</td>
              <td>{{ tx.functionName }}</td>
            </tr>
            <tr v-for="(param, key) in tx.params" :key="key">
              <td>{{ key }}</td>
              <td>{{ format(key, param) }}</td>
            </tr>
            <tr>
              <td>Actions:</td>
              <td>
                <a :href="linkToExplorer(tx.hash)" class="btn btn-success btn-lg" role="button" target="_blank">
                  View raw transaction
                </a>
                &nbsp;
                <button v-on:click="deleteData(tx.hash)" class="btn btn-success btn-lg">Delete data</button>
              </td>
            </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import sharedState from '../state.js';
  import config from '../config.js';

  export default {
    data() {
      return sharedState;
    },
    watch: {
      txhash: handleNewTxHash
    },
    methods: {
      linkToExplorer: function linkToExplorer(hash) {
        return `${config[this.networkId].explorer}/txnrcpt/${hash}`;
      },
      deleteData: function deleteData(hash) {
        if (confirm('Are you sure?')) {
          // todo: remove from other nodes
          fetch(`${config[this.networkId].explorer}/rmpld/${hash}`).finally(() => {
            $('.alert-info > .message').text('Data is deleted');
            $('.alert-info').show();
          });
        }
      },
      aday: function aday(aday) {
        return new Date(aday * 1.0e3).toLocaleString();
      },
      aprice: function aprice(aprice) {
        return `${(aprice / 1.0e3).toFixed(3)} ct/kWh`;
      },
      aenergy: function aenergy(aenergy) {
        return `${(aenergy / 1.0e6).toFixed(6)} kWh`;
      },
      'atimestamp-definition': function atimestamp(atimestamp) {
        return `
                ${(atimestamp / 1.0e9).toFixed(3)} s since 1970
                (${((Date.now() / 1.0e3) - (atimestamp / 1.0e9)).toFixed(3)} s ago
                or ${new Date(atimestamp / 1.0e6).toDateString()})
                or did you mean ${new Date(atimestamp / 1.0e3).toDateString()}?
            `;
      },
      atimestamp: function atimestamp(atimestamp) {
        if (atimestamp === '0') atimestamp = Date.now() * 1.0e3;
        return `
                ${new Date(atimestamp / 1.0e3).toLocaleString()}
                (${((Date.now() / 1.0e3) - (atimestamp / 1.0e6)).toFixed(0)} s ago)
            `;
      },
      auserID: function auserID(auserID) {
        return `User with ID ${auserID}`;
      },
      format: function format(key, param) {
        return this[key] ? this[key](param) : param;
      },
    }
  }

  function handleNewTxHash(newtxhash) {
    if (newtxhash === '' || newtxhash.length < 66) return;
    const txhash = newtxhash.slice(0, 66);
    this.web3js.eth.getTransaction(txhash).then(async tx => {
      tx.input = await this.web3js.eth.getQuorumPayload(tx.input);
      const abi = config[this.networkId].abi
        .filter(o => o.type === 'function')
        .map(o => {
          o.signature = this.web3js.eth.abi.encodeFunctionSignature(o);
          return o;
        })
        .filter(o => tx.input.startsWith(o.signature))[0];
      if (!abi) {
        $('.alert-warning > .message').text('Transaction found, but data is deleted');
        $('.alert-warning').show();
        return;
      }

      tx.functionName = abi.name || tx.input.slice(0, 10);
      tx.data = '0x' + tx.input.slice(10);
      const decoded = this.web3js.eth.abi.decodeParameters(abi.inputs, tx.data);
      delete decoded.__length__;
      tx.params = Object.keys(decoded)
        .filter(key => !/^\d+$/.test(key))
        .reduce((obj, key) => {
          obj[key] = decoded[key];
          return obj;
        }, {});

      this.contract.methods.producers(tx.from).call().then(result => {
        tx.fromIsRegisteredProducer = result;
      }).then(() => {
        this.transactions.push(tx);
        this.txhash = '';
      });
    }).catch(e => {
      console.log(e);
      $('.alert-danger > .message').text('Transaction not found');
      $('.alert-danger').show();
    });
  }
</script>

<style scoped>
  div.box-container {
    display: flex;
  }

  div.box {
    flex-grow: 1;
    text-align: left;
    margin: 5em;
    padding: 1em;

  }

  div.scrollable {
    overflow-x: scroll;
  }


</style>
