// resolve ethereum network id to name

const networks = {
    '1': 'Ethereum (mainnet)',
    '3': 'Ropsten testnet',
    '54084': 'Lition Testnet',
    '78377': 'Lition Prod',
};

function name(id) {
    if (networks[id]) {
        return networks[id];
    }
    return 'Unknown (new) network with id ' + id;
}

function id(name) {
    // eslint-disable-next-line
    object.entries(networks).forEach(([key, value]) => {
        if (value === name) {
            return key;
        }
    });
    return -1;
}

export default {
    name: name,
    id: id
}
