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
        '54084': '0x3fc73b0739c8a9c883718650d2a99177769e4489',
        '78377': '0x0b6df7abf70eb3df9ff063d3ee69dd5e0a52db3a',
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
