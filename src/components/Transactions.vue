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
                        <td>TX hash:</td><td>{{ tx.hash }}</td>
                    </tr>
                    <tr>
                        <td>From:</td>
                        <td>{{ tx.from }} (<span v-if="tx.fromIsRegisteredProducer===false"><b>not </b></span>
                            <span v-if="'undefined' !== typeof tx.fromIsRegisteredProducer">a registered producer</span>)
                        </td>
                    </tr>
                    <tr>
                        <td>To:</td><td>{{ tx.to }}</td>
                    </tr>
                    <tr>
                        <td>Function:</td><td>{{ tx.functionName }}</td>
                    </tr>
                    <tr v-for="(param, key) in tx.params" :key="key">
                        <td>{{ key }}</td><td>{{ param }}</td>
                    </tr>
                    <tr>
                      <td>Actions:</td><td><button v-on:click="deleteData(tx.hash)">Delete data</button></td>
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
        deleteData: function deleteData(hash) {
            fetch(`${config.explorers[this.networkId]}/getNodeList`)
                .then(r => r.json())
                .then(nodes => {
                    Promise.all(nodes.map(n => fetch(`http://${n.ip}:22004/rmpld/${hash}`))).finally(() => {
                        $('.alert-info > .message').text('Data is deleted');
                        $('.alert-info').show();
                    });
                });
        }
    }
}

function handleNewTxHash(newtxhash) {
    if (newtxhash === '' || newtxhash.length < 66) {
        return;
    }
    // often a copy-and-paste contains extra trailing characters, so
    // help the user
    const txhash = newtxhash.slice(0, 66);
    this.web3js.eth.getTransaction(txhash).then(async tx => {
        const explorer = config.explorers[this.networkId];
        const { input } = await (await fetch(`${explorer}/txnrcpt/${txhash}`)).json();
        tx.input = input;
        const abi = config.contractABIs[this.networkId]
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
                obj[key] = parameterFormat[key](decoded[key]);
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

const parameterFormat = {
    'aday': aday => `${new Date(aday*1.0e3).toLocaleString()}`,
    'aprice': aprice => (aprice / 1.0e3).toFixed(3)+' ct/kWh',
    'aenergy': aenergy => (aenergy / 1.0e6).toFixed(6) + ' kWh',

    'atimestamp-definition': atimestamp => {
        return (atimestamp / 1.0e9).toFixed(3) + ' s since 1970 ('+
            ((Date.now() / 1.0e3) - (atimestamp / 1.0e9)).toFixed(3) +' s ago or '
            + new Date(atimestamp / 1.0e6).toDateString()+') or did you mean '
            + new Date(atimestamp / 1.0e3).toDateString()+'?';
    },
    'atimestamp': atimestamp => {
        if (atimestamp === '0') atimestamp = Date.now() * 1.0e3;
        return `${new Date(atimestamp / 1.0e3).toLocaleString()} (${((Date.now() / 1.0e3) - (atimestamp / 1.0e6)).toFixed(0)} s ago)` ;
    },
    'auserID': auserID => 'User with ID ' + auserID,
    'aproducer': aproducer => aproducer,
    'aconsumer': aconsumer => aconsumer,
};
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
div.scrollable{
    overflow-x: scroll;
}


</style>
