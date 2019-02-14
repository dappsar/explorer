// resolve ethereum network id to name

const networks = {
    '1': 'Ethereum (mainnet)',
    '2': 'Morden testnet (deprecated)',
    '3': 'Ropsten testnet',
    '4': 'Rinkeby testnet',
    '42': 'Kovan testnet',
    '38611': 'Lition'
}

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
