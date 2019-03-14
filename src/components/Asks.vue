<template>
  <div id="asks">
    <div class="section-title">
      <b v-if="!!askError">There was an error retrieving the asks: {{ askError.toString() }}</b>
      <h3 v-if="asksCount>0">Asks (results of buy_energy): {{ asksCount }}</h3>
    </div>
    <div class=table-container>
      <div class="table-container table-responsive">
        <table id="asks" v-if="!this.askError" class="table table-striped">
          <thead>
          <tr v-if="asks.length>0">
            <th>index</th>
            <th v-for="(value, key) in asks[0]" :key="JSON.stringify(value)" v-if="key.length>1 && key !== 'id'">
              {{ key }}
            </th>
          </tr>
          </thead>
          <tbody>
          <tr v-for="(ask, index) in asks.slice().reverse()" :key="'ask'+JSON.stringify(ask)+index">
            <td>{{ asks.length - index }}</td>
            <td v-for="(value, key) in ask" :key="'ask'+JSON.stringify(value)" v-if="(key.length>1) && (key!=='id')">
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
  </div>
</template>

<script>
  import sharedState from '../state.js'

  export default {
    name: 'Asks',
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
