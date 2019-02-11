<template>
<div id="app">

    <nav class="navbar navbar-inverse navbar-fixed-top">
        <div class="container-fluid">
            <div class="navbar-header">
                <a class="navbar-brand" href="https://lition.de">
                    <img class="logo" src="https://www.lition.de/wp-content/uploads/2018/03/lition-logo-secondary-white@3x.png">
                </a>
            </div>
            <div class="navbar-header navbar-right">
                <a class="navbar-brand" href="https://quantum-factory.de">
                    <img class="logo2" src="https://quantum-factory.de/img/qf.svg">
                </a>
            </div>
        </div>
    </nav>

    <div class="container-fluid header">
        <div class="row no_overflow">
            <div class="col-md-6 col-md-push-6">
                <img class="headerimage" src="https://www.lition.de/wp-content/uploads/2018/03/180327-den-stage-illusration@3x.png">
            </div>
            <div class="col-md-6 col-md-pull-6">
                <div class="container-fluid title-container">
                    <h1> <strong>Lition Smart Contract Viewer and Debugger </strong></h1>
                    <br>
                    <Metamask/>
                    <Network/>
                    <div class="container-fluid text-left contact-container">
                        <Contract/>
                    </div>
                </div>
            </div>
            <div class="circle_container"><div class="circle"></div></div>
        </div>
    </div>
    
    <Transactions/>

    <div class="btn-pref btn-group btn-group-justified btn-group-lg" role="group" aria-label="...">
        <div class="btn-group" role="group">
            <button type="button" id="stars" class="btn btn-primary" href="#events" data-toggle="tab">
                <h4>Events</h4>
            </button>
        </div>
        <div class="btn-group" role="group">
            <button type="button" id="favorites" class="btn btn-default" href="#bids" data-toggle="tab">
                <h4>Bids</h4>
            </button>
        </div>
        <div class="btn-group" role="group">
            <button type="button" id="following" class="btn btn-default" href="#asks" data-toggle="tab">
                <h4>Asks</h4>
            </button>
        </div>
    </div>

    <div class="tab-content">
        <div id="events" class="tab-pane fade in active">
            <Events/>
        </div>
        <div id="bids" class="tab-pane fade">
            <Bids/>
        </div>
        <div id="asks" class="tab-pane fade">
            <Asks/>
        </div>
    </div>
    
    
    
</div>
</template>

<script>
import Metamask from "./components/Metamask.vue";
import Network from "./components/Network.vue";
import Contract from "./components/Contract.vue";
import Transactions from "./components/Transactions.vue";
import Events from "./components/Events.vue";
import Bids from "./components/Bids.vue";
import Asks from "./components/Asks.vue";
import sharedState from './state.js'
import energyStoreState from './EnergyStoreState.js'

export default {
    name: "app",
    components: {
        Metamask,
        Network,
        Contract,
        Transactions,
        Events,
        Bids,
        Asks
    },
    data() {
        return sharedState;
    },
    watch: {
        address: energyStoreState.handleNewAddress,
        contract: energyStoreState.handleNewContract
    }
};

$(document).ready(function() {
$(".btn-pref .btn").click(function () {
    $(".btn-pref .btn").removeClass("btn-primary").addClass("btn-default");
    // $(".tab").addClass("active"); // instead of this do the below 
    $(this).removeClass("btn-default").addClass("btn-primary");   
});
});
</script>

<style>
#app {
  font-family: "Avenir", Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}



nav.navbar {
    height: 100px;
    background-color: rgba(5, 26, 46, 0.9);
}

div.title-container{
    margin-top: 30%;
    color: white;
}

div.contact-container{
    margin-left: 25px;
}

div.title-container input {
    color: #2c3e50;
}

div.no_overflow{
    overflow: hidden;
}

div.header{
    background: linear-gradient(to right, rgb(9, 31, 52) , rgb(40, 92, 133));
}

div.circle_container {
    height: 0;
}
div.circle_container div.circle{
    border-radius: 50%;
    width: 10000px;
    height: 10000px;
    background: white;
    
    margin-left: -4000px;
    margin-top: 35%;
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

img.headerimage{
    width: 100%;
    margin-top: 20%;
}

.section-title{
    margin-top:10px;
    margin-bottom: 20px;
}

div.table-container {
    margin-top:20px;
}


@media only screen and (max-width: 992px) {

    div.title-container{
        margin-top: 30px;
    }

    div.circle_container {
        height: 150px;
    }

    div.circle_container div.circle{
        margin-top: 0%;
    }
}

@media only screen and (max-width: 770px){
    img.logo2 {
        visibility: hidden;
    }
}

</style>
