<template>
  <div id="app">

    <nav class="navbar navbar-inverse navbar-fixed-top">
      <div class="container-fluid">
        <div class="navbar-header">
          <router-link class="navbar-brand" to="/">
            <img class="logo" src="https://www.lition.io/wp-content/uploads/2018/03/lition-logo-secondary-white@3x.png">
          </router-link>
        </div>
        <form class="navbar-right" v-on:submit.prevent="search()">
          <input type="text" class="form-control" v-model="input" placeholder="block, transaction, address">
          &nbsp;
          <button type="submit" class="btn btn-default">go</button>
        </form>
      </div>

      <div class="alert alert-warning alert-dismissible" role="alert">
        <button type="button" class="close" data-dismiss="alert" aria-label="Close">
          <span aria-hidden="true">&times;</span>
        </button>
        <div class="message">warning</div>
      </div>

      <div class="alert alert-info alert-dismissible" role="alert">
        <button type="button" class="close" data-dismiss="alert" aria-label="Close">
          <span aria-hidden="true">&times;</span>
        </button>
        <div class="message">info</div>
      </div>

      <div class="alert alert-danger alert-dismissible" role="alert">
        <button type="button" class="close" data-dismiss="alert" aria-label="Close">
          <span aria-hidden="true">&times;</span>
        </button>
        <div class="message">danger</div>
      </div>
    </nav>

    <div class="container-fluid header">
      <div class="row no_overflow headerimage">
        <div class="col-md-12">
          <div class="container-fluid title-container">
            <h1><strong>Lition Block Explorer for Energy Case</strong></h1>
            <br>
            <div class="container-fluid text-left contact-container">
              <router-view></router-view>
            </div>
          </div>
        </div>
        <div class="circle_container">
          <div class="circle"></div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import config from './config.js'
  import Web3 from 'web3'
  import numberToBN from 'number-to-bn'

  export default {
    name: "app",
    data() {
      return {
        networkId: 0,
        networkName: '(to be determined)',
        web3js: false,
        config: {},
        input: '',
      };
    },
    mounted() {
      this.networkId = process.env.VUE_APP_NETWORK;
      this.config = config[this.networkId];
      this.networkName = this.config.name;
      this.web3js = new Web3(this.config.rpc);
      this.web3js.extend({
        property: 'eth',
        methods: [new this.web3js.extend.Method({
          name: 'getQuorumPayload',
          call: 'eth_getQuorumPayload',
          params: 1,
        })]
      });
      this.web3js.utils.hexToNumber = v => {
        if (!v) return v;
        try {
          return numberToBN(v).toNumber();
        } catch (e) {
          return numberToBN(v).toString();
        }
      };
    },
    methods: {
      search: function search() {
        switch (this.input.length) {
        case 66:
          this.web3js.eth.getBlock(this.input).then(block => {
            if (block) {
              this.$router.push(`/block/${this.input}`);
            } else {
              this.$router.push(`/tx/${this.input}`);
            }
          });
          break;
        case 42:
          this.$router.push(`/address/${this.input}`);
          break;
        default:
          this.web3js.eth.getBlock(this.input).then(block => {
            if (block) {
              this.$router.push(`/block/${block.hash}`);
            }
          });
          break;
        }
      }
    },
  };
</script>

<style>
  #app {
    font-family: "Avenir", Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    text-align: center;
    color: #2c3e50;
  }


  nav.navbar > .alert {
    display: none;
    margin-bottom: 0;
  }

  nav.navbar > .container-fluid {
    height: 100px;
  }

  nav.navbar form {
    height: 100%;
    display: flex;
    align-items: center;
  }

  nav.navbar {
    min-height: 100px;
    background-color: rgba(5, 26, 46, 0.9);
  }

  div.title-container {
    margin-top: 40px;
    color: white;
  }

  div.contact-container {
    margin-left: 25px;
  }

  div.title-container input {
    color: #2c3e50;
  }

  div.no_overflow {
    overflow: hidden;
  }

  div.header {
    background: linear-gradient(to right, rgb(9, 31, 52), rgb(40, 92, 133));
  }

  div.circle_container {
    height: 0;
  }

  div.circle_container div.circle {
    border-radius: 50%;
    width: 10000px;
    height: 10000px;
    background: black;

    margin-left: -4000px;
    margin-top: 200px;
  }

  img.logo2 {
    width: 200px;
    margin-right: 70px;
    margin-top: -10px;
  }

  img.logo {
    margin-top: 10px;
    margin-left: 20px;
  }

  div.headerimage {
    background-image: url('https://www.lition.io/wp-content/uploads/2018/03/180327-den-stage-illusration@3x.png');
    background-position: top right;
    background-repeat: no-repeat;
    background-size: 200px;
    margin-top: 130px;
  }

  .section-title {
    margin-top: 10px;
    margin-bottom: 20px;
  }

  div.table-container {
    margin-top: 20px;
  }

  thead th {
    text-align: center;
  }

  .section-title {
    margin-top: 30px;
    margin-bottom: 20px;
  }

  .word-break {
    word-break: break-all;
  }

  .margin-bottom-xs {
    margin-bottom: .25em;
  }

  .margin-bottom-sm {
    margin-bottom: .5em;
  }

  .margin-bottom-md {
    margin-bottom: 1em;
  }

  .margin-bottom-lg {
    margin-bottom: 1.5em;
  }

  .margin-bottom-xl {
    margin-bottom: 3em;
  }

  @media only screen and (max-width: 992px) {

    div.title-container {
      margin-top: 30px;
    }

    div.circle_container {
      height: 150px;
    }

    div.circle_container div.circle {
      margin-top: 0%;
    }
  }

  @media only screen and (max-width: 770px) {
    img.logo2 {
      visibility: hidden;
    }

    nav.navbar > .container-fluid {
      height: 150px;
    }
  }

</style>
