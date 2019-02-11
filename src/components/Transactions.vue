<template>
<div id="container" v-if="!!contract">
    <div class="container-fluid section-title">
        <h1>Transactions</h1>
        <br>
        <p>Transactions cannot be autopopulated. Copy and paste a TxHash here to view its details:
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
                    </tbody>
                </table>
            </div>
        </div>
    </div>
</div>
</template>

<script>
import sharedState from '../state.js';

export default {
    data() {
        return sharedState;
    },
    watch: {
        txhash: handleNewTxHash
    }
}

function handleNewTxHash(newtxhash) {
    if (newtxhash === '' || newtxhash.length < 66) {
        return;
    }
    // often a copy-and-paste contains extra trailing characters, so
    // help the user
    const txhash = newtxhash.slice(0, 66);
    this.web3js.eth.getTransaction(txhash).then(tx => {        
        const data = tx.input.toString();
        tx.functionHash = data.slice(0,10);
        tx.functionName = `(hash ${tx.functionHash}...)`;
        if (parameters[tx.functionHash]) {
            tx.functionName = parameters[tx.functionHash][0];
        }
        tx.data = '0x' + data.slice(10);
        tx.params = {};
        
        for(var i=10, p=1; i<data.length; i+=64, p++) {
            var pname = '' + p;
            if (parameters[tx.functionHash]) {
                pname = parameters[tx.functionHash][p];
                tx.params[pname] = parameterFormat[pname](
                    parseInt(data.slice(i,i+64), 16),
                    data.slice(i,i+64)
                );
            } else {
                tx.params[pname] = parseInt(data.slice(i,i+64), 16);
            }
        }

        this.contract.methods.producers(tx.from).call().then(result => {
            tx.fromIsRegisteredProducer = result;
        }).then(() => {        
            this.transactions.push(tx);
            this.txhash = '';
        });
    });
}

const parameters = {
    '0x3c530ace': {
        0: 'registerProducer',
        1: 'aproducer'
    },
    '0x520e7b0e': {
        0: 'offer_energy',
        1: 'aday',
        2: 'aprice',
        3: 'aenergy',
        4: 'atimestamp'
    },
    '0x6dd8d3bf': [
        'buy_energy',
        'aproducer',
        'aday',
        'aprice',
        'aenergy',
        'auserID',
        'atimestamp'
    ],
    '0x4bdb8509': [
        '(old) buy_energy',
        'aproducer',
        'aday',
        'aprice',
        'aenergy',
        'auserID',
        'atimestamp'        
    ]
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
        return `${new Date(atimestamp / 1.0e3).toLocaleString()} (${((Date.now() / 1.0e3) - (atimestamp / 1.0e6)).toFixed(0)} s ago)` ;
    },
    'auserID': auserID => 'User with ID ' + auserID,
    'aproducer': (i, aproducer) => '0x'+aproducer.slice(-40)
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
div.scrollable{
    overflow-x: scroll;
}


</style>
