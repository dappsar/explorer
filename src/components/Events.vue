<template>
<div id="events-container">
  <div class="section-title">
        <h3>Events</h3>
        <p>To fetch new events, reload the page.</p>
        <div id="events-standin" v-if="!events">
            <p>(Waiting for MetaMask to retrieve past events...)</p>
        </div>
  </div>
  <div class="table-container table-responsive">
    <table id="events" v-if="!!events" class="table table-striped">
        <thead>
            <tr>
                <th>Name</th><th colspan="100">Arguments</th>
            </tr>
        </thead>
        <tbody>
        <tr v-for="event in events" :key="JSON.stringify(event)">
        <td>
            <b>
            {{ event.event }}
            </b>
        </td>
        <td v-for="(value, key) in event.returnValues" :key="key" v-if="key.length>1">
        <strong>{{ key }}</strong>:<br/>
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
    name: 'Events',
    data() {
        return sharedState
    },
    watch: {
        contract: handleNewContract
    }
}

function handleNewContract(contract) {
    // stop display old events
    this.events = null;
    
    // past events
    contract.getPastEvents(
        'allEvents', {
            fromBlock: 0,
            toBlock: 'latest'
        }
    ).then(events => {
        this.events = events.reverse();
    }).catch(error => {
        console.log('Error from contract.getPastEvents:', error);
    });
}
</script>

<style scoped>

.value-date, .value-numeric {
    font-family: sans;
}

thead th{
    text-align:center;
}

.section-title{
    margin-top:30px;
    margin-bottom: 20px;
}
</style>
