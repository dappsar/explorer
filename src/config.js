import liveContract from './live20180513.js'
import ropstenContract from './ropsten20180504.js'
import litionContract from './lition20190211.js'
import litionProdContract from './lition20190304.js'

export default {
    contractAddresses: {
        // live
        '1': '0x3f3c80ceA2d44419fBDA23Be3575fd403c5b4481',

        // ropsten
        '3': '0xa705D64d383349F5c198afed7C3292d24EaBa48d',

        // lition
        '54084': '0x81c7ace3829bd2bd4ce74bbd3c341bd2285f2c30',
        '78377': '0x914b3b49c095d53f9e4a26ad9a9ac93f55882a83',
    },
    contractABIs: {
        '1': liveContract.abi,
        '3': ropstenContract.abi,
        '54084': litionContract.abi,
        '78377': litionProdContract.abi,
    },
    explorers: {
        '54084': 'http://40.113.129.13:22004',
        '78377': 'http://40.113.129.13:32004',
    }
}
