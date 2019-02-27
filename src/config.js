import liveContract from './live20180513.js'
import ropstenContract from './ropsten20180504.js'
import litionContract from './lition20190211.js'

export default {
    contractAddresses: {
        // live
        '1': '0x3f3c80ceA2d44419fBDA23Be3575fd403c5b4481',

        // ropsten
        '3': '0xa705D64d383349F5c198afed7C3292d24EaBa48d',

        // lition
        '54084': '0x81c7ace3829bd2bd4ce74bbd3c341bd2285f2c30',
    },
    contractABIs: {
        '1': liveContract.abi,
        '3': ropstenContract.abi,
        '54084': litionContract.abi
    },
    explorers: {
        '54084': 'http://40.113.129.13:22004'
    }
}
