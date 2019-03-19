<template>
  <div id="index-container">
    <div class="section-title">
      <h3>Blocks</h3>
      <div id="blocks-standin" v-if="!blocks">
        <p>(Retrieving blocks...)</p>
      </div>
    </div>
    <div class="table-container table-responsive">
      <table id="blocks" v-if="!!blocks" class="table table-striped">
        <thead>
        <tr>
          <th>#</th>
          <th>Timestamp</th>
          <th>Hash</th>
        </tr>
        </thead>
        <tbody>
        <tr v-for="block in blocks" :key="block.id">
          <td>
            <router-link :to="`/block/${block.hash}`">{{ block.number }}</router-link>
          </td>
          <td>
            <router-link :to="`/block/${block.hash}`">{{ block.timestamp | datetime }}</router-link>
          </td>
          <td>
            <router-link :to="`/block/${block.hash}`">{{ block.hash }}</router-link>
          </td>
        </tr>
        </tbody>
      </table>
    </div>

    <div class="section-title">
      <h3>Transactions</h3>
      <div id="transactions-standin" v-if="!transactions">
        <p>(Retrieving transactions...)</p>
      </div>
    </div>
    <div class="table-container table-responsive">
      <table id="transactions" v-if="!!transactions" class="table table-striped">
        <thead>
        <tr>
          <th>From</th>
          <th>To</th>
          <th>Hash</th>
        </tr>
        </thead>
        <tbody>
        <tr v-for="transaction in transactions" :key="transaction.id">
          <td>
            <router-link :to="`/address/${transaction.from}`">{{ transaction.from }}</router-link>
          </td>
          <td>
            <router-link :to="`/address/${transaction.to}`">{{ transaction.to }}</router-link>
          </td>
          <td>
            <router-link :to="`/tx/${transaction.hash}`">{{ transaction.hash }}</router-link>
          </td>
        </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script>
  export default {
    name: 'Index',
    data() {
      return {
        blocks: [],
        transactions: [],
      };
    },
    beforeRouteEnter (to, from, next) {
      next(vm => {
        vm.getBlocks();
      })
    },
    methods: {
      getBlocks: async function getBlocks() {
        const blockNumber = await this.$parent.web3js.eth.getBlockNumber();
        for (let i = 0; i < 10; i++) {
          this.$parent.web3js.eth.getBlock(blockNumber - i, true).then(block => {
            this.blocks.push(block);
            this.transactions.push(...block.transactions);
          });
        }
      },
    }
  }
</script>
