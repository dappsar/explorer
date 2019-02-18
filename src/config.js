import liveContract from './live20180513.js'
import ropstenContract from './ropsten20180504.js'
import quorumContract from './quorum20190211.js'

export default {
    contractAddresses: {
        // live
        '1': '0x3f3c80ceA2d44419fBDA23Be3575fd403c5b4481',

        // ropsten
        '3': '0xa705D64d383349F5c198afed7C3292d24EaBa48d',

        // quorum
        '87828': '0xf336725f57e7e8d9352accca07bf390c03e906a1',
    },
    contractABIs: {
        '1': liveContract.abi,
        '3': ropstenContract.abi,
        '87828': quorumContract.abi
    },
    explorers: {
        '87828': 'http://139.59.211.111:22004'
    }
}
