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
        '38611': '0xf99aead997b16002af642476f104117b0711f279',
    },
    contractABIs: {
        '1': liveContract.abi,
        '3': ropstenContract.abi,
        '38611': quorumContract.abi
    }
}
