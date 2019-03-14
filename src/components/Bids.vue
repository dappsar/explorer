<template>
  <div id="bids">
    <div class="section-title">
      <b v-if="!!bidError">There was an error retrieving the bids: {{ bidError.toString() }}</b>
      <h3 v-if="bidsCount>0">Bids (results of offer_energy): {{ bidsCount }}</h3>
    </div>
    <div class="table-container table-responsive">
      <table id="bids" class="table table-striped">
        <thead>
        <tr v-if="bids.length>0">
          <th>index</th>
          <th v-for="(value, key) in bids[0]" :key="JSON.stringify(value)" v-if="key.length>1">
            {{ key }}
          </th>
        </tr>
        </thead>
        <tbody>
        <tr v-for="(bid, index) in bids.slice().reverse()" :key="'bid'+JSON.stringify(bid)+index">
          <td>{{ bids.length - index }}</td>
          <td v-for="(value, key) in bid" :key="'bid'+JSON.stringify(value)" v-if="key.length>1">
            {{ value }}
            <span class="value-date" v-if="key==='day'"><br>({{ (new Date(value*1.0e3)).toLocaleString() }})</span>
            <span class="value-numeric" v-if="key==='price'"><br>({{ (value*1.0e-3).toFixed(3) }} ct/kWh)</span>
            <span class="value-numeric" v-if="key==='energy'"><br>({{ (value*1.0e-6).toFixed(6) }} kWh)</span>
            <span class="value-date"
                  v-if="key==='timestamp'"><br>({{ (new Date(value*1.0e-3)).toLocaleString() }})</span>
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
    name: 'Bids',
    data() {
      return sharedState;
    }
  }


</script>

<style scoped>

  .value-date, .value-numeric {
    font-family: sans;
  }

  thead th {
    text-align: center;
  }

  .section-title {
    margin-top: 30px;
    margin-bottom: 20px;
  }

</style>
