<template>
  <div id="addrss-container">
    <div class="section-title">
      <h3>Address {{ $route.params.id }}</h3>
    </div>
    <div>Transactions: {{ transactionCount }}</div>

    <div v-if="!abi && isContract">
      <div class="section-title">
        <h3>Upload ABI (soon)</h3>
      </div>
      <div></div>
    </div>

    <div v-if="abi">
      <div class="section-title">
        <h3>Read Contract</h3>
      </div>
      <div class="form-inline">
        <div class="margin-bottom-lg" v-for="(item, i) in abi.filter(item => item.constant)" :key="i">
          <div>{{ i + 1 }}. {{ item.name }}</div>
          <div class="margin-bottom-sm" v-for="(input, k) in item.inputs" :key="k">
            <input class="form-control" v-model="input.value" :placeholder="input.name"/>
            {{ input.type }}
          </div>
          <div class="margin-bottom-sm">
            <button class="btn btn-default" v-on:click="call(item)">query</button>
          </div>
          <div>
            <table id="decoded-result" class="table table-striped">
              <tbody>
              <tr v-for="(value, key) in item.result" :key="key">
                <td>
                  {{ key }}
                </td>
                <td class="word-break">
                  <span v-if="key==='timestamp'">{{ value | datetime}}</span>
                  <span v-else>{{ value }}</span>
                </td>
              </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>

    <div v-if="abi">
      <div class="section-title">
        <h3>Write Contract (soon)</h3>
      </div>
      <div></div>
    </div>

    <div v-if="abi">
      <div class="section-title">
        <h3>Decoded Events</h3>
        <div id="decoded-events-standin" v-if="!decodedEvents">
          <p>(Not available...)</p>
        </div>
      </div>
      <div>
        <div v-for="(decodedEvent, i) in decodedEvents" :key="i" class="table-container table-responsive">
          <table id="decoded-event" class="table table-striped">
            <tbody>
            <tr v-for="(value, key) in decodedEvent" :key="key">
              <td>
                {{ key }}
              </td>
              <td class="word-break">
                <span v-if="key==='blockHash'">
                  <router-link :to="`/block/${value}`">{{ value }}</router-link>
                </span>
                <span v-else-if="key==='transactionHash'">
                  <router-link :to="`/tx/${value}`">{{ value }}</router-link>
                </span>
                <span v-else-if="key==='returnValues'">
                  {{ value | cleanDecodedObject }}
                </span>
                <span v-else>{{ value }}</span>
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
  import loadAbi from '../mixins/loadAbi'

  export default {
    name: 'Address',
    mixins: [loadAbi],
    data() {
      return {
        transactionCount: 0,
        isContract: false,
        contract: null,
        decodedEvents: null,
        abi: null,
      }
    },
    beforeRouteEnter(to, from, next) {
      next(vm => {
        vm.getTransactionCount();
        vm.getCode()
      })
    },
    watch: {
      isContract: function () {
        this.getAbi();
      },
      abi: function () {
        this.getEvents();
      },
    },
    methods: {
      getTransactionCount: function getTransactionCount() {
        this.$parent.web3js.eth.getTransactionCount(this.$route.params.id).then(transactionCount => {
          this.transactionCount = transactionCount;
        });
      },
      getCode: function getCode() {
        this.$parent.web3js.eth.getCode(this.$route.params.id).then(code => {
          this.isContract = code !== '0x';
        });
      },
      getAbi: function getAbi() {
        this.loadAbi(this.$route.params.id);
      },
      getEvents: function getEvents() {
        this.contract = new this.$parent.web3js.eth.Contract(this.abi, this.$route.params.id);
        this.contract.getPastEvents('allEvents', { fromBlock: 0 })
          .then(events => this.decodedEvents = events);
      },
      call: function (item) {
        const values = item.inputs.map(input => input.value);
        this.contract.methods[item.name](...values).call()
          .then(result => {
            result = this.$options.filters.cleanDecodedObject(result);
            item.result = result;
          });
      }
    }
  }
</script>
